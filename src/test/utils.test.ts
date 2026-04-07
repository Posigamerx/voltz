import { describe, it, expect } from 'vitest'
import { formatPrice, discountPercent, slugify, truncate } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(1299)).toBe('$1,299.00')
    expect(formatPrice(9.99)).toBe('$9.99')
  })
})

describe('discountPercent', () => {
  it('calculates percentage discount', () => {
    expect(discountPercent(100, 80)).toBe(20)
    expect(discountPercent(1499, 1299)).toBe(13)
  })
})

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('ProMax X15 Ultra')).toBe('promax-x15-ultra')
    expect(slugify('AirPod Pro Max!')).toBe('airpod-pro-max')
  })
})

describe('truncate', () => {
  it('truncates long text', () => {
    expect(truncate('Hello world', 5)).toBe('Hello…')
    expect(truncate('Hi', 10)).toBe('Hi')
  })
})
