import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-display font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-volt-400 text-zinc-950 hover:bg-volt-300 active:scale-[0.98]':
              variant === 'primary',
            'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.98]':
              variant === 'secondary',
            'text-white/70 hover:text-white hover:bg-white/5':
              variant === 'ghost',
            'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30':
              variant === 'danger',
            // Sizes
            'h-8 px-3 text-xs rounded-md': size === 'sm',
            'h-10 px-5 text-sm rounded-lg': size === 'md',
            'h-12 px-7 text-base rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
