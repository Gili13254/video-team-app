import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabase
      .from('presets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ preset: data });
  } catch (error) {
    console.error('Error fetching preset:', error);
    return NextResponse.json({ error: 'Failed to fetch preset' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('presets')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting preset:', error);
    return NextResponse.json({ error: 'Failed to delete preset' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const { data, error } = await supabase
      .from('presets')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ preset: data[0] });
  } catch (error) {
    console.error('Error updating preset:', error);
    return NextResponse.json({ error: 'Failed to update preset' }, { status: 500 });
  }
}
