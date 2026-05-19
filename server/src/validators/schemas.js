import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  firstName: z.string().min(1, 'Nama depan wajib diisi'),
  lastName: z.string().min(1, 'Nama belakang wajib diisi'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  size: z.number().int().min(30).max(50),
  color: z.string().min(1),
  qty: z.number().int().min(1).max(10).default(1),
});

export const updateCartSchema = z.object({
  qty: z.number().int().min(1).max(10),
});

export const orderSchema = z.object({
  address: z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    phone: z.string().min(1, 'No HP wajib diisi'),
    address: z.string().min(1, 'Alamat wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    zipCode: z.string().min(1, 'Kode pos wajib diisi'),
    province: z.string().optional(),
  }),
  courier: z.enum(['jne', 'jnt', 'sicepat', 'same-day']),
  paymentMethod: z.enum(['transfer', 'ewallet', 'cod', 'card']),
  promoCode: z.string().optional(),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, 'Komentar minimal 3 karakter'),
});
