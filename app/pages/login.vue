<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { safeAuthRedirectPath } from '~/utils/safeAuthRedirectPath'

const supabase = useSupabaseClient()
const route = useRoute()
const { t } = useI18n()
const { public: { siteUrl } } = useRuntimeConfig()
const toast = useToast()
const redirectCookie = useCookie('supabase-redirect-path', {
  maxAge: 60 * 10, // 10 minutos es suficiente
  path: '/',
  sameSite: 'lax',
  secure: true // Asegúrate de estar en HTTPS o localhost
})

function authCallbackUrl(): string {
  const raw = route.query.redirectTo as string
  const q = Array.isArray(raw) ? raw[0] : raw
  const path = safeAuthRedirectPath(q)
  if (!path) return `${siteUrl}/confirm`
  redirectCookie.value = path
  const uri = `${siteUrl}/confirm?redirectTo=${encodeURIComponent(path)}`
  console.log(uri)
  return uri
}

// const fields: AuthFormField[] = [
//   {
//     name: 'email',
//     type: 'email',
//     label: t('auth.email'),
//     placeholder: t('auth.enterEmail'),
//     required: true
//   }
// ]

const providers = [
  {
    label: t('auth.google'),
    icon: 'i-simple-icons-google',
    onClick: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: authCallbackUrl()
        }
      })
    }
  },
  {
    label: t('auth.discord'),
    icon: 'i-simple-icons-discord',
    onClick: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: authCallbackUrl()
        }
      })
    }
  }
]

const schema = z.object({
  email: z.email(t('auth.invalidEmail'))
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signInWithOtp({
    ...payload.data,
    options: {
      emailRedirectTo: authCallbackUrl()
    }
  })
  if (error) {
    toast.add({
      title: t('auth.errorSigningIn'),
      description: error.message,
      color: 'error'
    })
    return
  }
  toast.add({
    title: t('auth.emailSent'),
    description: t('auth.magicLinkSent')
  })
}
</script>

<template>
  <div class="mt-8 flex items-center justify-center md:mt-0 md:h-screen">
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          :title="t('auth.login')"
          :description="t('auth.loginDescription')"
          icon="i-lucide-user"
          :providers="providers"
          @submit="onSubmit"
        />
      </UPageCard>
    </div>
  </div>
</template>
