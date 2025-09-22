import { z } from 'zod'

// Product categories that make sense for a financial app
export const ProductCategoryEnum = z.enum([
  'electronics',
  'clothing', 
  'food',
  'services',
  'books',
  'home',
  'transportation',
  'health',
  'entertainment',
  'other'
])

export type ProductCategory = z.infer<typeof ProductCategoryEnum>

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre debe tener máximo 50 caracteres'),
  description: z.string().max(200, 'La descripción debe tener máximo 200 caracteres').optional(),
  price: z.number().positive('El precio debe ser un número positivo'),
  category: ProductCategoryEnum,
  imageUrl: z.string().url('Debe ser una URL válida').optional(),
  inStock: z.boolean().default(true),
  createdAt: z.string().datetime('Debe ser una fecha válida'),
  updatedAt: z.string().datetime('Debe ser una fecha válida'),
})

export type Product = z.infer<typeof ProductSchema>

export const CreateProductSchema = ProductSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})
export type CreateProduct = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = ProductSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.string().datetime('Debe ser una fecha válida'),
})
export type UpdateProduct = z.infer<typeof UpdateProductSchema>

// API Response types
export interface ProductResponse {
  success: boolean
  data?: Product | Product[]
  message?: string
  error?: string
}