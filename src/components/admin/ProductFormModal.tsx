import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, Button, Input } from '@/components/ui'
import { slugify } from '@/lib/utils'
import type { Product } from '@/types'

const CATEGORIES = ['phones','laptops','audio','cameras','wearables','accessories','gaming'] as const

const schema = z.object({
  name:             z.string().min(2, 'Required'),
  slug:             z.string().min(2, 'Required'),
  description:      z.string().min(10, 'Add a description'),
  price:            z.coerce.number().positive('Must be > 0'),
  compare_at_price: z.coerce.number().optional(),
  category:         z.enum(CATEGORIES, { errorMap: () => ({ message: 'Select a category' }) }),
  brand:            z.string().min(1, 'Required'),
  sku:              z.string().min(1, 'Required'),
  stock:            z.coerce.number().int().min(0, 'Must be ≥ 0'),
  rating:           z.coerce.number().min(0).max(5),
  review_count:     z.coerce.number().int().min(0),
  images:           z.string().min(1, 'Add at least one image URL'),
  tags:             z.string(),
  specs:            z.string(),
  featured:         z.boolean(),
})

type FormData = z.infer<typeof schema>

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Product, 'id' | 'created_at'>) => void
  product?: Product | null
  isLoading?: boolean
}

export function ProductFormModal({ isOpen, onClose, onSubmit, product, isLoading }: ProductFormModalProps) {
  const isEditing = !!product

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      review_count: 0,
      stock: 0,
      featured: false,
      specs: '{}',
      tags: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (product) {
      reset({
        name:             product.name,
        slug:             product.slug,
        description:      product.description ?? '',
        price:            product.price,
        compare_at_price: product.compare_at_price ?? undefined,
        category:         product.category,
        brand:            product.brand,
        sku:              product.sku,
        stock:            product.stock,
        rating:           product.rating,
        review_count:     product.review_count,
        images:           product.images.join('\n'),
        tags:             product.tags.join(', '),
        specs:            JSON.stringify(product.specs, null, 2),
        featured:         product.featured,
      })
    } else {
      reset({
        rating: 0, review_count: 0, stock: 0,
        featured: false, specs: '{}', tags: '',
      })
    }
  }, [product, reset])

  // Auto-slug from name when creating
  const nameValue = watch('name')
  useEffect(() => {
    if (!isEditing && nameValue) {
      setValue('slug', slugify(nameValue))
    }
  }, [nameValue, isEditing, setValue])

  const processSubmit = (data: FormData) => {
    let specs: Record<string, string> = {}
    try { specs = JSON.parse(data.specs) } catch { specs = {} }

    onSubmit({
      name:             data.name,
      slug:             data.slug,
      description:      data.description,
      price:            data.price,
      compare_at_price: data.compare_at_price || undefined,
      category:         data.category,
      brand:            data.brand,
      sku:              data.sku,
      stock:            data.stock,
      rating:           data.rating,
      review_count:     data.review_count,
      images:           data.images.split('\n').map(s => s.trim()).filter(Boolean),
      tags:             data.tags.split(',').map(s => s.trim()).filter(Boolean),
      specs,
      featured:         data.featured,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit — ${product?.name}` : 'Add new product'}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit(processSubmit)} className="flex flex-col gap-5">

        {/* Basic info */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Basic info</legend>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Product name" error={errors.name?.message} {...register('name')} />
            </div>
            <Input label="Slug (auto-filled)" error={errors.slug?.message} {...register('slug')} />
            <Input label="SKU" placeholder="PM-X15U-256" error={errors.sku?.message} {...register('sku')} />
            <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/50">
                Category
              </label>
              <select
                className="h-11 w-full rounded-md border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-volt-400/50 focus:outline-none"
                {...register('category')}
              >
                <option value="" className="bg-zinc-900">Select…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-zinc-900 capitalize">{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/50">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-volt-400/50 focus:outline-none"
              {...register('description')}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>
        </fieldset>

        {/* Pricing & inventory */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Pricing & inventory</legend>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
            <Input label="Compare-at ($)" type="number" step="0.01" placeholder="Optional" {...register('compare_at_price')} />
            <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
          </div>
        </fieldset>

        {/* Media */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Images & tags</legend>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-white/50">
              Image URLs (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs text-white placeholder:text-white/25 focus:border-volt-400/50 focus:outline-none"
              {...register('images')}
            />
            {errors.images && <p className="mt-1 text-xs text-red-400">{errors.images.message}</p>}
          </div>
          <Input
            label="Tags (comma separated)"
            placeholder="flagship, 5g, oled"
            {...register('tags')}
          />
        </fieldset>

        {/* Specs */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Specs (JSON)</legend>
          <textarea
            rows={5}
            className="w-full rounded-md border border-white/10 bg-zinc-950 px-4 py-3 font-mono text-xs text-white/70 placeholder:text-white/20 focus:border-volt-400/50 focus:outline-none"
            placeholder={'{\n  "Display": "6.9\\" OLED",\n  "Battery": "5500mAh"\n}'}
            {...register('specs')}
          />
          {errors.specs && <p className="mt-1 text-xs text-red-400">Invalid JSON</p>}
        </fieldset>

        {/* Meta */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Ratings & visibility</legend>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Rating (0–5)" type="number" step="0.1" min="0" max="5" {...register('rating')} />
            <Input label="Review count" type="number" min="0" {...register('review_count')} />
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Featured</span>
              <div className="flex h-11 items-center">
                <input type="checkbox" {...register('featured')} className="h-4 w-4 accent-yellow-400" />
                <span className="ml-2 text-sm text-white/60">Show on homepage</span>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex gap-3 border-t border-white/8 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            {isEditing ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
