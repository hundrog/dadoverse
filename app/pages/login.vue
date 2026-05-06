<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const supabase = useSupabaseClient()
const { t } = useI18n()
const { public: { siteUrl } } = useRuntimeConfig()
const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('auth.enterEmail'),
    required: true
  }
]

const _providers = [
  {
    label: t('auth.google'),
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: t('auth.google'), description: t('auth.loginWithGoogle') })
    }
  },
  {
    label: t('auth.facebook'),
    icon: 'i-simple-icons-facebook',
    onClick: () => {
      toast.add({ title: t('auth.facebook'), description: t('auth.loginWithFacebook') })
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
      emailRedirectTo: `${siteUrl}/confirm`
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
          :fields="fields"
          @submit="onSubmit"
        />
      </UPageCard>
    </div>
  </div>
</template>
