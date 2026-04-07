import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'

const schema = z.object({
  fullName:   z.string().min(2, 'Required'),
  line1:      z.string().min(5, 'Enter your street address'),
  line2:      z.string().optional(),
  city:       z.string().min(2, 'Required'),
  state:      z.string().min(2, 'Required'),
  postalCode: z.string().min(5, 'Enter a valid postal code'),
  country:    z.string().min(2, 'Required'),
})
export type ShippingData = z.infer<typeof schema>

interface ShippingFormProps {
  onNext: (data: ShippingData) => void
}

export function ShippingForm({ onNext }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
      <Input label="Address line 1" error={errors.line1?.message} {...register('line1')} />
      <Input label="Apartment, suite, etc. (optional)" {...register('line2')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" error={errors.city?.message} {...register('city')} />
        <Input label="State / Province" error={errors.state?.message} {...register('state')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Postal code" error={errors.postalCode?.message} {...register('postalCode')} />
        <Input label="Country" error={errors.country?.message} {...register('country')} />
      </div>
      <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-2">
        Continue to payment →
      </Button>
    </form>
  )
}
