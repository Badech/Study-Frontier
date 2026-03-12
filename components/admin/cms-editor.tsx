"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CMSEditorProps {
  initialContent: any;
  pageSlug: string;
  sectionKey: string;
  locale: string;
  onSave?: () => void;
}

export function CMSEditor({
  initialContent,
  pageSlug,
  sectionKey,
  locale,
  onSave,
}: CMSEditorProps) {
  const [content, setContent] = useState(
    JSON.stringify(initialContent, null, 2)
  );
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate JSON
      const parsedContent = JSON.parse(content);

      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_slug: pageSlug,
          section_key: sectionKey,
          locale,
          content: parsedContent,
          is_published: isPublished,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save content');
      }

      setSuccess(true);
      onSave?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {pageSlug} / {sectionKey} ({locale})
          </h3>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Content (JSON)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] w-full rounded-lg border border-border bg-background p-3 font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`published-${pageSlug}-${sectionKey}-${locale}`}
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <label
            htmlFor={`published-${pageSlug}-${sectionKey}-${locale}`}
            className="text-sm font-medium"
          >
            Published
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
            Content saved successfully!
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Content'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
