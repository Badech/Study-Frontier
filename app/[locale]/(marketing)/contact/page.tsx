import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/marketing/contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Ready to start your journey to studying in the USA? Get in touch with us today.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        {/* Contact Information */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">Contact@studyfrontier.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+57 16904684</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">Washington DC, USA</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-muted/30 p-6">
            <h3 className="mb-2 font-semibold">Office Hours</h3>
            <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
            <p className="text-sm text-muted-foreground">Sunday: Closed</p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
