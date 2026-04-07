import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store'
import { useToast } from '@/hooks'
import { Button, Input } from '@/components/ui'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const { closeAuthModal, openAuthModal } = useAuthStore()
  const { success, error: toastError } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) {
      toastError(error.message)
    } else {
      success('Welcome back!')
      closeAuthModal()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        Sign in
      </Button>
      <p className="text-center text-sm text-white/40">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => openAuthModal('signup')}
          className="text-volt-400 hover:text-volt-300 transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
