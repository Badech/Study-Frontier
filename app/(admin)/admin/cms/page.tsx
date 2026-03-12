import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CMSPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Manage editable content blocks and FAQ for the marketing site.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">FAQ Management</h2>
              <p className="text-sm text-muted-foreground">
                Edit frequently asked questions
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/admin/cms/faq">Manage FAQ</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Content Blocks</h2>
              <p className="text-sm text-muted-foreground">
                Edit packages and content sections
              </p>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link href="/admin/cms/content">Manage Content</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
