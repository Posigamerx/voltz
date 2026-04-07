import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'volt' | 'success' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded-md',
        {
          'bg-white/8 text-white/60': variant === 'default',
          'bg-volt-400/15 text-volt-400': variant === 'volt',
          'bg-emerald-400/15 text-emerald-400': variant === 'success',
          'bg-amber-400/15 text-amber-400': variant === 'warning',
          'bg-red-400/15 text-red-400': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
