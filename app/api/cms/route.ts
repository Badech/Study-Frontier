import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cmsContentSchema } from '@/lib/validations/cms';

// GET /api/cms?page_slug=homepage&locale=en
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page_slug = searchParams.get('page_slug');
    const locale = searchParams.get('locale') || 'en';

    const supabase = await createClient();

    let query = supabase
      .from('cms_content')
      .select('*')
      .eq('locale', locale)
      .eq('is_published', true);

    if (page_slug) {
      query = query.eq('page_slug', page_slug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('CMS fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cms - Create or update CMS content
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validation = cmsContentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { page_slug, section_key, locale, content, is_published } = validation.data;

    // Upsert content
    const { data, error } = await supabase
      .from('cms_content')
      .upsert(
        {
          page_slug,
          section_key,
          locale,
          content,
          is_published: is_published ?? true,
          last_edited_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'page_slug,section_key,locale',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('CMS upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('cms_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('CMS delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
