import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/db/server';

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
}

export async function POST(req: NextRequest) {
  const db = createClient(cookies());
  const { data: { session } } = await db.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return new NextResponse('No files uploaded', { status: 400 });
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const sanitizedFileName = sanitizeFileName(file.name);
        const filePath = `${userId}/${sanitizedFileName}`;

        const { data, error } = await db.storage
          .from('user_uploads')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: true
          });

        if (error) {
          console.error('Supabase storage error:', error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        return { originalName: file.name, uploadedPath: filePath, data };
      })
    );

    return new NextResponse(JSON.stringify({
      message: 'Files uploaded successfully',
      data: uploadResults
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return new NextResponse(JSON.stringify({ 
      message: 'Error uploading files',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}