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
    const { data, error } = await db
      .from('user_config')
      .select('favorite_theme')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return new NextResponse(JSON.stringify({ favoriteTheme: data?.favorite_theme || '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching favorite theme:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching favorite theme' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}