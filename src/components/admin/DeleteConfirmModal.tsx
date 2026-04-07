import { Modal, Button } from '@/components/ui'
import type { Product } from '@/types'

interface DeleteConfirmModalProps {
  product: Product | null
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmModal({ product, onConfirm, onCancel, isLoading }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={!!product} onClose={onCancel} title="Delete product">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-white/60">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">{product?.name}</span>?
          This action cannot be undone.
        </p>
        {product && (
          <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-zinc-950 p-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-800">
              {product.images[0] && (
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="font-mono text-xs text-white/30">{product.sku}</p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading} className="flex-1">
            Delete product
          </Button>
        </div>
      </div>
    </Modal>
  )
}
