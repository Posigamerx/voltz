import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

interface OrderConfirmationProps {
  orderId?: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-volt-400/10 border border-volt-400/30">
        <span className="text-4xl">⚡</span>
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">Order confirmed!</h2>
        {orderId && (
          <p className="mt-2 font-mono text-sm text-white/40">Order #{orderId}</p>
        )}
        <p className="mt-3 text-white/50">
          You'll receive a confirmation email shortly.
        </p>
      </div>
      <div className="flex gap-3">
        <Link to="/account">
          <Button variant="secondary">View orders</Button>
        </Link>
        <Link to="/products">
          <Button>Keep shopping</Button>
        </Link>
      </div>
    </div>
  )
}
