/**
 * FAQ Section
 * PRD Section 10.6: Mixed student/parent questions
 * Expandable accordion component
 */

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
  category: 'student' | 'parent';
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // Student Questions
    {
      category: 'student',
      question: "How does the process work from start to finish?",
      answer: "The process starts with a free eligibility assessment where we review your academic background and goals. Next, we create a personalized university shortlist and application strategy. Then we guide you through document preparation, application submission, and visa preparation. The entire journey typically takes 6-12 months depending on your timeline and intake."
    },
    {
      category: 'student',
      question: "When should I start applying for Fall or Spring intake?",
      answer: "For Fall intake (August/September), start 12-18 months before. For Spring intake (January/February), start 8-12 months before. Early preparation gives you better chances for scholarships and more time for visa processing. However, we can work with tighter timelines if needed."
    },
    {
      category: 'student',
      question: "What are the requirements for studying in the USA?",
      answer: "General requirements include: completed high school or bachelor's degree (depending on program level), English proficiency test (TOEFL/IELTS), financial proof for visa, passport, academic transcripts, and letters of recommendation. Specific requirements vary by university and program—we'll guide you through exactly what you need."
    },
    {
      category: 'student',
      question: "How long does the entire process take?",
      answer: "From initial assessment to departure, the typical timeline is 8-14 months. This includes university research (1-2 months), application preparation (2-3 months), waiting for decisions (2-4 months), and visa processing (2-3 months). We can expedite when necessary, but quality preparation takes time."
    },

    // Parent Questions
    {
      category: 'parent',
      question: "How do I know which package is right for my child?",
      answer: "After your child completes the free eligibility assessment, we'll review their academic profile, goals, timeline, and your budget. Based on this, we recommend the package that provides the right level of support. You're never locked in—we can adjust as needs evolve. The key is matching support to your child's independence level and application complexity."
    },
    {
      category: 'parent',
      question: "What exactly is included in each service package?",
      answer: "Each package builds on the previous: Starter includes assessment and planning. Application adds full application support for up to 5 universities, essay review, and document prep. Visa Ready adds complete visa coaching, interview prep, and pre-departure support. During consultation, we'll explain exactly what's included and what's not, so there are no surprises."
    },
    {
      category: 'parent',
      question: "Do you guarantee admission or visa approval?",
      answer: "No—and be wary of anyone who does. Admission decisions are made by universities, and visa decisions by U.S. consulates. What we guarantee is honest guidance, professional document preparation, and strategic application planning to maximize your child's chances. We've helped hundreds of students, but we never make false promises."
    },
    {
      category: 'parent',
      question: "How do we communicate with you during the process?",
      answer: "You'll have access to a dedicated student portal where you can track progress, upload documents, and see next steps 24/7. We communicate via email for updates and scheduled video calls for consultations. For urgent questions, WhatsApp support is available. Parents can also access a read-only view to monitor progress without interfering with the student's journey."
    },
    {
      category: 'parent',
      question: "What are the payment options and schedule?",
      answer: "Payment plans are flexible and discussed during your consultation. We typically offer installment-based payment tied to milestones (after assessment, after university selection, after applications submitted, etc.). We accept bank transfers and online payment. Pricing is transparent—no hidden fees. Refund policy is clearly explained upfront."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get answers to common questions from students and parents. Can't find what you're looking for?{' '}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-foreground pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Panel */}
                {openIndex === index && (
                  <div className="border-t border-border bg-muted/30 px-6 py-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions? We're here to help.{' '}
            <a href="#contact" className="text-primary hover:underline font-medium">
              Get in touch
            </a>
            {' '}or{' '}
            <a href="#assessment" className="text-primary hover:underline font-medium">
              start your free assessment
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
