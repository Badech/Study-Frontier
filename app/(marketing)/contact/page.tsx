import { HeroSection } from "@/components/marketing/hero-section";
import { ContactForm } from "@/components/marketing/contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection
        variant="centered"
        subtitle="Get in Touch"
        title="Let's Start Your Journey"
        description="Have questions? Ready to begin? We're here to help. Reach out and we'll respond within 24 hours."
      />

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Email</h3>
                    <a href="mailto:info@studyfrontier.com" className="text-muted-foreground hover:text-primary">
                      info@studyfrontier.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Phone</h3>
                    <a href="tel:+212600000000" className="text-muted-foreground hover:text-primary">
                      +212 6XX XXX XXX
                    </a>
                    <p className="text-sm text-muted-foreground">WhatsApp available</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Office</h3>
                    <p className="text-muted-foreground">
                      Casablanca, Morocco
                    </p>
                    <p className="text-sm text-muted-foreground">By appointment only</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Office Hours</h3>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-muted-foreground">GMT+1 (Morocco Time)</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
                <h3 className="mb-4 font-semibold">Before You Reach Out</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  You might find quick answers to common questions in these resources:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/process" className="text-primary hover:underline">
                      → How Our Process Works
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="text-primary hover:underline">
                      → Service Packages & Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/study-usa" className="text-primary hover:underline">
                      → Study in USA Information
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-12 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Visit Our Office</h3>
            <p className="text-muted-foreground">
              We're located in Casablanca. Schedule an appointment to visit our office and meet our team in person.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
