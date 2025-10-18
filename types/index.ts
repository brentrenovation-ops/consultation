// types/index.ts
export interface ConsultationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  postcode: string;
  serviceRequired: string;
  projectDetails: string;
  attachments?: File[];
}

export interface ConsultationRecord {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  postcode: string;
  service_required: string;
  project_details: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface AttachmentRecord {
  id: string;
  consultation_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export const SERVICE_OPTIONS = [
  'Complete Property Refurbishment',
  'Victorian & Edwardian Restoration',
  'Kitchen Renovation',
  'Bathroom Renovation',
  'House Extensions',
  'Interior Refurbishment',
  'Building & Construction',
  'Design Consultation',
  'Other'
] as const;