import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-volt-400 text-sm mb-4">404</p>
      <h1 className="font-display text-5xl font-black mb-4">Page not found</h1>
      <p className="text-white/40 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button size="lg">← Back to home</Button>
      </Link>
    </div>
  )
}
