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
    const { data, error } = await db.storage
      .from('slide_themes')
      .list(userId + '/', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) throw error;

    const themes = data
      .filter(item => item.name.endsWith('.pptx'))
      .map(item => ({
        name: item.name.replace('.pptx', ''),
        path: `${userId}/${item.name}`
      }));

    return new NextResponse(JSON.stringify({ themes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return new NextResponse(JSON.stringify({ message: 'Error fetching themes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}