/**
 * Notifications API Routes
 * Sprint 08: Payments and Notifications
 * 
 * GET /api/notifications - List user's notifications
 * PATCH /api/notifications - Mark notifications as read
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { markNotificationRead, markAllNotificationsRead } from '@/lib/notifications';
import { markNotificationReadSchema } from '@/lib/validations/notifications';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Filter by read status
    const unreadOnly = searchParams.get('unread') === 'true';
    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    // Limit results
    const limit = parseInt(searchParams.get('limit') || '50');
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    return NextResponse.json({
      data,
      unread_count: unreadCount || 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validation = markNotificationReadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { notification_id, mark_all } = validation.data;

    if (mark_all) {
      // Mark all as read
      const success = await markAllNotificationsRead(user.id);
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to mark all as read' },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: 'All notifications marked as read' });
    } else if (notification_id) {
      // Mark single notification as read
      const success = await markNotificationRead(notification_id);
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to mark notification as read' },
          { status: 500 }
        );
      }
      return NextResponse.json({ message: 'Notification marked as read' });
    } else {
      return NextResponse.json(
        { error: 'notification_id or mark_all required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
