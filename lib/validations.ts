// lib/validations.ts
import { z } from 'zod';

export const consultationSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name must not exceed 255 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  
  phoneNumber: z.string()
    .regex(/^[\d\s()+-]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 characters')
    .max(50, 'Phone number must not exceed 50 characters'),
  
  postcode: z.string()
    .regex(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, 'Please enter a valid UK postcode')
    .max(20, 'Postcode must not exceed 20 characters'),
  
  serviceRequired: z.enum([
    'Complete Property Refurbishment',
    'Victorian & Edwardian Restoration',
    'Kitchen Renovation',
    'Bathroom Renovation',
    'House Extensions',
    'Interior Refurbishment',
    'Building & Construction',
    'Design Consultation',
    'Other'
  ], { required_error: 'Please select a service' }),
  
  projectDetails: z.string()
    .max(500, 'Project details must not exceed 500 characters')
    .optional()
});

export const fileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must not exceed 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'].includes(file.type),
      'Only images (JPEG, PNG, WebP, GIF) and PDF files are allowed'
    )
});