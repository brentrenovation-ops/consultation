import ConsultationForm from '@/components/ConsultationForm'

export const metadata = {
  title: 'Free Consultation',
  description: 'Get your free consultation within 24 hours',
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-white">
      <ConsultationForm />
    </div>
  );
}
