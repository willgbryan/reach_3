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

  try {
    const { data: userConfig, error: userConfigError } = await db
      .from('user_config')
      .select('favorite_theme')
      .eq('user_id', userId)
      .single();

    if (userConfigError) throw userConfigError;

    const favoriteTheme = userConfig?.favorite_theme || 'default_template.pptx';

    const filePath = `${favoriteTheme}`;

    const { data: signedUrlData, error: signedUrlError } = await db
      .storage
      .from('slide_themes')
      .createSignedUrl(filePath, 60);

    if (signedUrlError) {
      console.error('Error generating signed URL:', signedUrlError);
      return createResponse('default_template.pptx', 'default_template.pptx', null);
    }
    console.log('Signed URL:', signedUrlData.signedUrl);

    return createResponse(filePath, favoriteTheme, signedUrlData.signedUrl);
  } catch (error) {
    console.error('Error fetching PowerPoint file:', error);
    return new NextResponse('Error fetching file', { status: 500 });
  }
}

function createResponse(filePath: string, favoriteTheme: string, signedUrl: string | null) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Favorite-Theme', favoriteTheme);

  return new NextResponse(JSON.stringify({ filePath, signedUrl }), {
    status: 200,
    headers,
  });
}