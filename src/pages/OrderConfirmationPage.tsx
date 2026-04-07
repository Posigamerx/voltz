import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function OrderConfirmationPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-volt-400/15 flex items-center justify-center mb-6">
        <span className="text-2xl">⚡</span>
      </div>
      <h1 className="font-display text-4xl font-black mb-3">Order confirmed!</h1>
      <p className="text-white/40 mb-8">You'll receive a confirmation email shortly.</p>
      <Link to="/products"><Button size="lg">Continue shopping</Button></Link>
    </div>
  )
}
