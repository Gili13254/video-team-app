import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `videos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
