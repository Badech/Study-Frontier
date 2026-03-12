"use client";

import { useEffect, useState } from 'react';
import { CMSEditor } from '@/components/admin/cms-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  items: FAQItem[];
}

const locales = ['en', 'fr', 'ar'];
const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};


export const dynamic = 'force-dynamic';

export default function FAQManagementPage() {
  const [selectedLocale, setSelectedLocale] = useState('en');
  const [content, setContent] = useState<FAQContent>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [selectedLocale]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/cms?page_slug=homepage&locale=${selectedLocale}`
      );
      const data = await response.json();

      // Find FAQ section
      const faqSection = data.data?.find(
        (item: any) => item.section_key === 'faq'
      );

      if (faqSection) {
        setContent(faqSection.content);
      } else {
        setContent({ items: [] });
      }
    } catch (error) {
      console.error('Failed to fetch FAQ content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/cms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CMS
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">FAQ Management</h1>
            <p className="text-muted-foreground">
              Edit frequently asked questions for each language
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex gap-2">
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={selectedLocale === locale ? 'secondary' : 'outline'}
            onClick={() => setSelectedLocale(locale)}
          >
            {localeNames[locale]}
          </Button>
        ))}
      </div>

      {/* Content Editor */}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <CMSEditor
          initialContent={content}
          pageSlug="homepage"
          sectionKey="faq"
          locale={selectedLocale}
          onSave={fetchContent}
        />
      )}

      {/* Helper Text */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h3 className="mb-2 font-semibold">FAQ Content Format</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          The FAQ content should be a JSON object with an array of items:
        </p>
        <pre className="overflow-x-auto rounded bg-background p-3 text-xs">
{`{
  "items": [
    {
      "question": "How long does the process take?",
      "answer": "The complete process typically takes 6-12 months..."
    },
    {
      "question": "What are your fees?",
      "answer": "Our fees vary based on the service package..."
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
