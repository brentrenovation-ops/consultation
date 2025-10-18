// lib/email.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConsultationEmailParams {
  to: string[];
  consultation: {
    fullName: string;
    email: string;
    phoneNumber: string;
    postcode: string;
    serviceRequired: string;
    projectDetails?: string;
    attachments?: Array<{
      filename: string;
      url: string;
    }>;
  };
}

export async function sendConsultationEmail({ to, consultation }: SendConsultationEmailParams) {
  const attachmentsList = consultation.attachments?.length
    ? `
    <h3>Attachments:</h3>
    <ul>
      ${consultation.attachments.map(att => `<li><a href="${att.url}">${att.filename}</a></li>`).join('')}
    </ul>
    `
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4b5563; }
          .value { color: #1f2937; }
          .footer { margin-top: 20px; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Consultation Request</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Full Name:</span>
              <div class="value">${consultation.fullName}</div>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <div class="value">${consultation.email}</div>
            </div>
            <div class="field">
              <span class="label">Phone Number:</span>
              <div class="value">${consultation.phoneNumber}</div>
            </div>
            <div class="field">
              <span class="label">Postcode:</span>
              <div class="value">${consultation.postcode}</div>
            </div>
            <div class="field">
              <span class="label">Service Required:</span>
              <div class="value">${consultation.serviceRequired}</div>
            </div>
            ${consultation.projectDetails ? `
            <div class="field">
              <span class="label">Project Details:</span>
              <div class="value">${consultation.projectDetails}</div>
            </div>
            ` : ''}
            ${attachmentsList}
          </div>
          <div class="footer">
            <p>This is an automated notification from your consultation form.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Consultation Form <noreply@yourdomain.com>',
      to,
      subject: `New Consultation: ${consultation.serviceRequired} - ${consultation.fullName}`,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(email: string, fullName: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Consultation Request</h1>
          </div>
          <div class="content">
            <p>Dear ${fullName},</p>
            <p>Thank you for submitting your consultation request. We have received your information and will provide a detailed consultation within 24 hours.</p>
            <p>Our team will review your project details and contact you at the email or phone number you provided.</p>
            <p>Best regards,<br>The Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Consultation Form <noreply@yourdomain.com>',
      to: [email],
      subject: 'We received your consultation request',
      html: htmlContent,
    });
  } catch (error) {
    console.error('Confirmation email error:', error);
  }
}