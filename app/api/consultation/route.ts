// app/api/consultation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { consultationSchema } from '@/lib/validations';
import { createConsultation, createAttachment, uploadFile } from '@/lib/supabase';
import { sendConsultationEmail, sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      postcode: formData.get('postcode') as string,
      serviceRequired: formData.get('serviceRequired') as string,
      projectDetails: formData.get('projectDetails') as string || undefined,
    };

    const validatedData = consultationSchema.parse(rawData);

    const consultation = await createConsultation({
      full_name: validatedData.fullName,
      email: validatedData.email,
      phone_number: validatedData.phoneNumber,
      postcode: validatedData.postcode,
      service_required: validatedData.serviceRequired,
      project_details: validatedData.projectDetails,
    });

    const files = formData.getAll('attachments') as File[];
    const attachments: Array<{ filename: string; url: string }> = [];

    for (const file of files) {
      if (file && file.size > 0) {
        try {
          const fileUrl = await uploadFile(file, consultation.id);
          
          await createAttachment({
            consultation_id: consultation.id,
            file_name: file.name,
            file_url: fileUrl,
            file_size: file.size,
            mime_type: file.type,
          });

          attachments.push({
            filename: file.name,
            url: fileUrl,
          });
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
        }
      }
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    
    if (adminEmails.length > 0) {
      await sendConsultationEmail({
        to: adminEmails,
        consultation: {
          ...validatedData,
          attachments,
        },
      });
    }

    await sendConfirmationEmail(validatedData.email, validatedData.fullName);

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation request submitted successfully',
        consultationId: consultation.id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Consultation submission error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to submit consultation requests' },
    { status: 405 }
  );
}