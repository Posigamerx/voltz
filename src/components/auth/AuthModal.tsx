import { useAuthStore } from '@/store'
import { Modal } from '@/components/ui'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

export function AuthModal() {
  const { isAuthModalOpen, authModalView, closeAuthModal } = useAuthStore()

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={authModalView === 'login' ? 'Sign in' : 'Create account'}
    >
      <div className="p-6">
        {authModalView === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </Modal>
  )
}
