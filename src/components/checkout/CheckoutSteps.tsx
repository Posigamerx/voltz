interface Step { id: number; label: string }
const STEPS: Step[] = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirm' },
]

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold transition-colors ${
                step.id < current
                  ? 'bg-volt-400 text-zinc-950'
                  : step.id === current
                  ? 'border-2 border-volt-400 text-volt-400'
                  : 'border border-white/15 text-white/30'
              }`}
            >
              {step.id < current ? '✓' : step.id}
            </div>
            <span className={`mt-1.5 font-mono text-[9px] uppercase tracking-widest ${
              step.id === current ? 'text-volt-400' : 'text-white/30'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-4 mb-5 h-px w-16 ${step.id < current ? 'bg-volt-400' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
