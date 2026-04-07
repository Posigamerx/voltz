import { useState } from 'react'
import { AdminGuard, ProductFormModal, ProductTable, DeleteConfirmModal } from '@/components/admin'
import { Button, Skeleton } from '@/components/ui'
import { useToast } from '@/hooks'
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useAdminProducts'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function AdminPage() {
  const toast = useToast()
  const { data: products, isLoading, error } = useAdminProducts()

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Mutations
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  // Stats derived from products
  const totalProducts   = products?.length ?? 0
  const totalStock      = products?.reduce((s, p) => s + p.stock, 0) ?? 0
  const featuredCount   = products?.filter(p => p.featured).length ?? 0
  const outOfStock      = products?.filter(p => p.stock === 0).length ?? 0
  const avgPrice        = products?.length
    ? products.reduce((s, p) => s + p.price, 0) / products.length
    : 0

  const handleCreate = async (data: Omit<Product, 'id' | 'created_at'>) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Product created!')
      setShowForm(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create product')
    }
  }

  const handleUpdate = async (data: Omit<Product, 'id' | 'created_at'>) => {
    if (!editingProduct) return
    try {
      await updateMutation.mutateAsync({ id: editingProduct.id, ...data })
      toast.success('Product updated!')
      setEditingProduct(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update product')
    }
  }

  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      await deleteMutation.mutateAsync(deletingProduct.id)
      toast.success(`${deletingProduct.name} deleted`)
      setDeletingProduct(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete product')
    }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-black">Products</h1>
            <p className="mt-1 text-sm text-white/40">Manage your product catalogue</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            + Add product
          </Button>
        </div>

        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          ) : (
            [
              { label: 'Total products', value: totalProducts, color: 'text-white' },
              { label: 'Total stock',    value: totalStock,    color: 'text-emerald-400' },
              { label: 'Featured',       value: featuredCount, color: 'text-volt-400' },
              { label: 'Out of stock',   value: outOfStock,    color: outOfStock > 0 ? 'text-red-400' : 'text-white' },
              { label: 'Avg. price',     value: formatPrice(avgPrice), color: 'text-white' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/8 bg-zinc-900/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{stat.label}</p>
                <p className={`mt-1.5 font-display text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Table */}
        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-400">{error.message}</p>
            <p className="mt-1 text-xs text-white/30">Check your Supabase connection and RLS policies</p>
          </div>
        ) : isLoading ? (
          <Skeleton className="h-96 rounded-xl" />
        ) : (
          <ProductTable
            products={products ?? []}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={(p) => setDeletingProduct(p)}
          />
        )}
      </div>

      {/* Add product modal */}
      <ProductFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit product modal */}
      <ProductFormModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdate}
        product={editingProduct}
        isLoading={updateMutation.isPending}
      />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        product={deletingProduct}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        isLoading={deleteMutation.isPending}
      />
    </AdminGuard>
  )
}
