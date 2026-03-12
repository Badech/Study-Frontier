"use client";

import { useEffect, useState } from 'react';
import { CMSEditor } from '@/components/admin/cms-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const locales = ['en', 'fr', 'ar'];
const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

const contentSections = [
  { key: 'packages', label: 'Service Packages', page: 'homepage' },
  { key: 'hero', label: 'Hero Section', page: 'homepage' },
  { key: 'about', label: 'About Section', page: 'about' },
  { key: 'process', label: 'Process Section', page: 'process' },
];


export const dynamic = 'force-dynamic';

export default function ContentManagementPage() {
  const [selectedLocale, setSelectedLocale] = useState('en');
  const [selectedSection, setSelectedSection] = useState(contentSections[0]);
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [selectedLocale, selectedSection]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/cms?page_slug=${selectedSection.page}&locale=${selectedLocale}`
      );
      const data = await response.json();

      // Find the selected section
      const section = data.data?.find(
        (item: any) => item.section_key === selectedSection.key
      );

      if (section) {
        setContent(section.content);
      } else {
        setContent({});
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
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
            <h1 className="text-3xl font-bold">Content Block Management</h1>
            <p className="text-muted-foreground">
              Edit content blocks for marketing pages
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">Language</label>
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
      </div>

      {/* Section Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium">Content Section</label>
        <div className="flex flex-wrap gap-2">
          {contentSections.map((section) => (
            <Button
              key={section.key}
              variant={
                selectedSection.key === section.key ? 'secondary' : 'outline'
              }
              onClick={() => setSelectedSection(section)}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <CMSEditor
          initialContent={content}
          pageSlug={selectedSection.page}
          sectionKey={selectedSection.key}
          locale={selectedLocale}
          onSave={fetchContent}
        />
      )}

      {/* Helper Text */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h3 className="mb-2 font-semibold">Content Format Examples</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-semibold">Hero Section:</h4>
            <pre className="overflow-x-auto rounded bg-background p-3 text-xs">
{`{
  "title": "Your Journey to American Universities Starts Here",
  "subtitle": "Premium USA Study Consulting",
  "description": "Clear Process. No Confusion..."
}`}
            </pre>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold">Packages Section:</h4>
            <pre className="overflow-x-auto rounded bg-background p-3 text-xs">
{`{
  "packages": [
    {
      "name": "Starter",
      "description": "Initial assessment and planning",
      "features": ["Profile evaluation", "School matching"]
    },
    {
      "name": "Complete Journey",
      "description": "End-to-end support",
      "features": ["Everything in Starter", "Application support"]
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
