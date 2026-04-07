import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store'
import { useToast } from '@/hooks'
import { Button, Input } from '@/components/ui'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const { closeAuthModal, openAuthModal } = useAuthStore()
  const { success, error: toastError } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.full_name } },
    })
    if (error) {
      toastError(error.message)
    } else {
      success('Account created! Check your email to verify.')
      closeAuthModal()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full name"
        placeholder="Ada Lovelace"
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Create account
      </Button>
      <p className="text-center text-sm text-white/40">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="text-volt-400 hover:text-volt-300 transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
