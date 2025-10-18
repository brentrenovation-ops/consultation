// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

export async function uploadFile(file: File, consultationId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${consultationId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('consultation-attachments')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('consultation-attachments')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function createConsultation(data: {
  full_name: string;
  email: string;
  phone_number: string;
  postcode: string;
  service_required: string;
  project_details?: string;
}) {
  const { data: consultation, error } = await supabase
    .from('consultations')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return consultation;
}

export async function createAttachment(data: {
  consultation_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
}) {
  const { error } = await supabase
    .from('consultation_attachments')
    .insert([data]);

  if (error) {
    throw new Error(`Attachment insert failed: ${error.message}`);
  }
}