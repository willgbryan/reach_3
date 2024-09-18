import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/db/server';

export async function POST(req: NextRequest) {
  const db = createClient(cookies());
  const { data: { session } } = await db.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('Missing file', { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${file.name}`;

    const { data, error } = await db.storage
      .from('user_uploads')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });

    if (error) throw error;

    return new NextResponse(JSON.stringify({ message: 'File uploaded successfully', data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse(JSON.stringify({ message: 'Error uploading file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}