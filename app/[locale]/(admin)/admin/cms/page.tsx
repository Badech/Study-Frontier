/**
 * Admin CMS Page
 * Sprint 09: CMS and i18n - Content Management
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { CMSEditor } from '@/components/admin/cms-editor';
import { Button } from '@/components/ui/button';
import { Save, Eye, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCMSPage() {
  const profile = await getUserProfile();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'counselor')) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage website content and translations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Languages
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-semibold text-sm mb-1">Content Management System</h3>
        <p className="text-sm text-muted-foreground">
          Edit homepage sections, service descriptions, and FAQ content. Changes are saved to the database 
          and reflected across all language versions. Use the language selector to manage translations.
        </p>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Homepage Sections */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Homepage Sections</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Hero Section</div>
              <div className="text-sm text-muted-foreground">Title, subtitle, and CTAs</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Trust Indicators</div>
              <div className="text-sm text-muted-foreground">Statistics and numbers</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Services Overview</div>
              <div className="text-sm text-muted-foreground">Service descriptions and features</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Packages</div>
              <div className="text-sm text-muted-foreground">Package names, features, and pricing</div>
            </button>
          </div>
        </div>

        {/* Other Content */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Other Content</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">FAQ Questions</div>
              <div className="text-sm text-muted-foreground">Add, edit, or remove FAQ entries</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">About Page</div>
              <div className="text-sm text-muted-foreground">Company story and mission</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Contact Information</div>
              <div className="text-sm text-muted-foreground">Email, phone, address, hours</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="font-medium">Legal Pages</div>
              <div className="text-sm text-muted-foreground">Privacy, Terms, Refund policies</div>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Component (Optional - can be expanded) */}
      <CMSEditor />

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="w-full justify-start">
            <Globe className="h-4 w-4 mr-2" />
            Manage Translations
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Save className="h-4 w-4 mr-2" />
            Export Content
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Import Content
          </Button>
        </div>
      </div>
    </div>
  );
}
