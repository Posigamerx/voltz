import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-md bg-white/5', className)} />
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/6 bg-zinc-900/40 p-4 animate-fade-in">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-white/6 mt-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/8 bg-zinc-900/40 p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Skeleton className="mb-8 h-4 w-16" />
      <div className="grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-9 w-3/4" />
          </div>
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
