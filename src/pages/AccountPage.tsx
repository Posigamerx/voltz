import { useAuthStore } from '@/store'
import { Button } from '@/components/ui'

export function AccountPage() {
  const { user, signOut } = useAuthStore()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Account</h1>
      <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6 space-y-4">
        <div>
          <p className="text-xs text-white/30 font-mono mb-1">Email</p>
          <p className="text-sm">{user?.email}</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => signOut()}>Sign out</Button>
      </div>
    </div>
  )
}
