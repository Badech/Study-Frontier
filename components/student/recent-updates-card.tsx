/**
 * Recent Updates Card Component
 * Sprint 04: Shows recent messages and activity
 */

import { MessageSquare, User, Calendar } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import type { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentUpdatesCardProps {
  messages: Message[];
}

export function RecentUpdatesCard({ messages }: RecentUpdatesCardProps) {
  const hasMessages = messages.length > 0;

  return (
    <DashboardCard
      title="Recent Updates"
      subtitle={hasMessages ? 'Latest messages from your advisor' : 'No recent messages'}
      icon={<MessageSquare className="h-5 w-5" />}
      action={
        hasMessages ? (
          <a
            href="/dashboard/messages"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </a>
        ) : null
      }
    >
      {!hasMessages ? (
        <div className="text-center py-6">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No messages yet. We&apos;ll notify you when there are updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                !message.is_read
                  ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              {/* Message Icon/Avatar */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-medium text-sm text-card-foreground">
                    {message.subject || 'Message from advisor'}
                  </h5>
                  {!message.is_read && (
                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>

                {message.body && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {message.body}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {messages.length >= 5 && (
            <div className="text-center pt-2">
              <a
                href="/dashboard/messages"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View all messages →
              </a>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
