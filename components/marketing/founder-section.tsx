/**
 * Founder Section
 * PRD Section 10.5: Balanced founder introduction
 * Brand first, founder visible second
 */

import Image from 'next/image';
import { Quote } from 'lucide-react';

export function FounderSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Founder Image */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
                {/* Placeholder for founder photo */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="text-center">
                    <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 mx-auto">
                      <span className="text-5xl font-bold text-primary">SF</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Founder Photo</p>
                  </div>
                </div>
                {/* Replace above div with actual image when available:
                <Image
                  src="/images/founder.jpg"
                  alt="Founder of Study Frontier"
                  fill
                  className="object-cover"
                />
                */}
              </div>
            </div>

            {/* Founder Story */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <Quote className="h-12 w-12 text-primary/20" />
              </div>

              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Why Study Frontier Exists
              </h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  As a former international student who navigated the complex journey to studying in the USA, 
                  I experienced firsthand the confusion, uncertainty, and lack of clear guidance that many students face.
                </p>

                <p>
                  Too many agencies make false promises. Too many students get lost in paperwork. 
                  Too many families spend money without understanding the real process.
                </p>

                <p className="font-medium text-foreground">
                  Study Frontier was built on a simple principle: Clear Process. No Confusion.
                </p>

                <p>
                  We don't promise miracles. We don't guarantee admissions or visas—no one honestly can. 
                  What we do promise is honest guidance, structured support, and a transparent process from start to finish.
                </p>

                <p>
                  Every student deserves to know exactly where they stand, what's required next, and who's responsible. 
                  That's what we deliver—premium service with integrity at its core.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-semibold text-foreground">
                  — Founder, Study Frontier
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Former U.S. Student | Educational Consultant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
