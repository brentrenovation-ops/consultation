# AI Coding Assistant Instructions

## Project Architecture

This is a **Next.js 14 consultation form** for a renovation company with a specific single-purpose design: collecting customer consultation requests with file attachments.

### Key Components & Data Flow

1. **Form Submission Flow**: `ConsultationForm.tsx` → `/api/consultation/route.ts` → Supabase DB + Storage → Email notifications
2. **File Handling**: `FileUpload.tsx` handles drag/drop + validation → Supabase Storage with organized paths (`consultationId/timestamp.ext`)
3. **Data Persistence**: Dual-table structure (`consultations` + `consultation_attachments`) with foreign key relationships
4. **Email System**: Dual emails via Resend - admin notification + customer confirmation

### Critical Patterns

**Fixed Service Selection**: The form has a **hidden field** `serviceRequired` hardcoded to "Complete Property Refurbishment". This is intentional - other services exist in `SERVICE_OPTIONS` but are not user-selectable.

**Form State Management**: Uses `react-hook-form` with Zod validation. File state is separate from form state (`useState<File[]>`) and combined during submission via `FormData`.

**Error Handling Strategy**: Three-layer approach:
- Client validation (Zod schema + file validation)
- API route validation with specific error messages
- UI feedback with success/error states and scroll-to-top

## Development Workflows

**Environment Setup**: Requires 4 environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase)
- `RESEND_API_KEY` & `EMAIL_FROM` (email)
- `ADMIN_EMAILS` (comma-separated list for notifications)

**File Upload Constraints**: 
- Max 5 files, 10MB each
- Allowed: `image/*` + `application/pdf`
- Storage path: `consultation-attachments/consultationId/timestamp.ext`

**Database Schema Dependencies**:
- `consultations` table with specific column names (snake_case)
- `consultation_attachments` table with foreign key to `consultations.id`
- Supabase storage bucket: `consultation-attachments`

## Project-Specific Conventions

**Path Aliases**: Uses `@/` for root-relative imports (`@/components`, `@/lib`, `@/types`)

**Form Validation**: UK-specific patterns (postcode regex, phone validation). All validation schemas in `lib/validations.ts`

**Component Architecture**: 
- `ConsultationForm.tsx` is the main orchestrator (form logic + submission)
- `FileUpload.tsx` is a controlled component (receives files/onChange props)
- No component library - pure Tailwind + Lucide icons

**Error Boundaries**: File upload errors are component-level, form submission errors surface at form level with scroll-to-top UX

## Integration Points

**Supabase Integration**: 
- Uses public/anon key (no auth required)
- File uploads use `upsert: false` to prevent overwrites
- Public URLs generated for email attachments

**Email Templates**: Inline HTML in `lib/email.ts` with embedded CSS - no external templating system

**Type Safety**: Strict separation between client types (`ConsultationFormData`) and database types (`ConsultationRecord`, `AttachmentRecord`)

When modifying this codebase, maintain the single-purpose focus, preserve the hidden service field pattern, and ensure file upload error handling covers both validation and storage failure scenarios.