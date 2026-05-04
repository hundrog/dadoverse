<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const supabase = useSupabaseClient()

const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }
]

const _providers = [
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: 'Google', description: 'Login with Google' })
    }
  },
  {
    label: 'Facebook',
    icon: 'i-simple-icons-facebook',
    onClick: () => {
      toast.add({ title: 'Facebook', description: 'Login with Facebook' })
    }
  }
]

const schema = z.object({
  email: z.email('Invalid email')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { error } = await supabase.auth.signInWithOtp(payload.data)
  if (error) {
    toast.add({
      title: 'Error signing in',
      description: error.message,
      color: 'error'
    })
    return
  }
  toast.add({
    title: 'Email sent',
    description: 'Check your inbox for the magic link.'
  })
}
</script>

<template>
  <div class="mt-8 flex items-center justify-center md:mt-0 md:h-screen">
    <div class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          title="Login"
          description="Enter your credentials to access your account."
          icon="i-lucide-user"
          :fields="fields"
          @submit="onSubmit"
        />
      </UPageCard>
    </div>
  </div>
</template>
