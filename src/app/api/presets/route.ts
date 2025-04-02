import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const includePublic = url.searchParams.get('includePublic') === 'true';
    
    let query = supabase.from('presets').select('*');
    
    if (userId) {
      // If userId is provided, get user's presets and optionally public presets
      if (includePublic) {
        query = query.or(`created_by.eq.${userId},is_public.eq.true`);
      } else {
        query = query.eq('created_by', userId);
      }
    } else if (includePublic) {
      // If no userId but includePublic is true, get only public presets
      query = query.eq('is_public', true);
    } else {
      // If neither userId nor includePublic, return empty array
      return NextResponse.json({ presets: [] });
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ presets: data });
  } catch (error) {
    console.error('Error fetching presets:', error);
    return NextResponse.json({ error: 'Failed to fetch presets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const preset = await request.json();
    
    const { data, error } = await supabase
      .from('presets')
      .insert([preset])
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ preset: data[0] });
  } catch (error) {
    console.error('Error creating preset:', error);
    return NextResponse.json({ error: 'Failed to create preset' }, { status: 500 });
  }
}
