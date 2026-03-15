/**
 * Student Messages Page
 * Sprint 04: Student Portal - Messages
 */

import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getUserProfile();

  if (!profile) {
    redirect(`/${locale}/login?redirect=/${locale}/dashboard/messages`);
  }

  // Fetch recent messages/notifications
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const messages = notifications || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Messages & Notifications</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Stay updated with important information from your counselor
        </p>
      </div>

      {/* Communication Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">In-App Messages</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check your notifications below for updates from your counselor
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Important updates are also sent to your email
          </p>
          <p className="text-xs text-muted-foreground">{profile.email}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Phone className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">WhatsApp</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For urgent matters, contact us on WhatsApp
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="https://wa.me/17168904684" target="_blank" rel="noopener noreferrer">
              Open Chat
            </a>
          </Button>
        </div>
      </div>

      {/* Notifications/Messages */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        {messages.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Messages Yet</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive notifications here when your counselor sends you updates about your application progress.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg border p-4 transition-colors ${
                  msg.is_read
                    ? 'border-border bg-card/50 opacity-75'
                    : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                      <h3 className="font-medium">{msg.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(msg.created_at)}</span>
                      {msg.notification_type && (
                        <span className="capitalize">{msg.notification_type.replace('_', ' ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold mb-3">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you have questions or need assistance, here's how to reach us:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium w-24">Email:</span>
            <a href="mailto:support@studyfrontier.com" className="text-primary hover:underline">
              support@studyfrontier.com
            </a>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium w-24">WhatsApp:</span>
            <a href="https://wa.me/17168904684" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              +1 (716) 890-4684
            </a>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium w-24">Hours:</span>
            <span className="text-muted-foreground">Monday - Friday, 9 AM - 6 PM (GMT)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
