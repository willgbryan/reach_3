import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/db/server';

export async function GET(req: NextRequest) {
  const db = createClient(cookies());
  const { data: { session } } = await db.auth.getSession();
  const userId = session?.user.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const filePath = url.searchParams.get('path');

  if (!filePath) {
    return new NextResponse('File path is required', { status: 400 });
  }

  try {
    // Fetch user's favorite theme
    const { data: userConfig, error: userConfigError } = await db
      .from('user_config')
      .select('favorite_theme')
      .eq('user_id', userId)
      .single();

    if (userConfigError) throw userConfigError;

    const favoriteTheme = userConfig?.favorite_theme || '';

    // Fetch the PowerPoint file
    const { data, error } = await db.storage
      .from('slide_themes')
      .download(filePath);

    if (error) throw error;

    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    headers.set('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
    headers.set('X-Favorite-Theme', favoriteTheme);

    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error fetching PowerPoint file:', error);
    return new NextResponse('Error fetching file', { status: 500 });
  }
}