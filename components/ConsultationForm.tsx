// components/ConsultationForm.tsx - WITH FILE UPLOAD VISIBLE

'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationSchema } from '@/lib/validations';
import { SERVICE_OPTIONS } from '@/types';
import FileUpload from './FileUpload';
import { Loader2 } from 'lucide-react';
import type { ConsultationFormData } from '@/types';

export default function ConsultationForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<Omit<ConsultationFormData, 'attachments'>>({
    resolver: zodResolver(consultationSchema),
    mode: 'onBlur',
  });

  const projectDetails = watch('projectDetails', '');
  const characterCount = projectDetails?.length || 0;

  const onSubmit = async (data: Omit<ConsultationFormData, 'attachments'>) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/consultation', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your consultation request has been submitted successfully. We will contact you within 24 hours.',
      });

      reset();
      setFiles([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get Your Free Consultation
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your project and we'll provide a detailed consultation within 24 hours
          </p>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
            role="alert"
          >
            <p className="font-medium">
              {submitStatus.type === 'success' ? '✓ Success!' : '✗ Error'}
            </p>
            <p className="text-sm mt-1">{submitStatus.message}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('fullName')}
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number & Postcode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phoneNumber')}
                  type="tel"
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('postcode')}
                  type="text"
                  id="postcode"
                  placeholder="e.g. SW1A 1AA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.postcode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
                )}
              </div>
            </div>

            {/* Hidden service field */}
            <input
              {...register('serviceRequired')}
              type="hidden"
              value="Complete Property Refurbishment"
            />

            {/* Project Details */}
            <div>
              <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Project Details
              </label>
              <textarea
                {...register('projectDetails')}
                id="projectDetails"
                rows={5}
                placeholder="Tell us about your window requirements, number of windows, property type, preferred materials..."
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end items-center mt-1">
                <p className="text-sm text-gray-500">
                  {characterCount}/500 characters
                </p>
              </div>
              {errors.projectDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.projectDetails.message}</p>
              )}
            </div>

            {/* FILE UPLOAD - NOW VISIBLE */}
            <Controller
              name="projectDetails"
              control={control}
              render={() => (
                <FileUpload
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={5}
                  maxSizeMB={10}
                />
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Submitting...
                </>
              ) : (
                'Get My Free Consultation'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}