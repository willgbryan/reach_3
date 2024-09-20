import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/db/server';
import { getStripeCustomerId, getSubscriptionStatus } from '@/app/_data/stripe';

export async function GET(req: NextRequest) {
  const db = createClient(cookies());
  const { data: { session } } = await db.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { data: userData, error: userError } = await db
      .from('users')
      .select('free_searches_remaining, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const customerId = userData?.stripe_customer_id;
    if (customerId) {
      const subscription = await getSubscriptionStatus(customerId);
      if (subscription?.status === 'active') {
        return new NextResponse(JSON.stringify({ isPro: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const freeSearches = userData?.free_searches_remaining ?? 5;
    return new NextResponse(JSON.stringify({ isPro: false, freeSearches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    return new NextResponse('Error fetching user status', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = createClient(cookies());
  const { data: { session } } = await db.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { data: userData, error: userError } = await db
      .from('users')
      .select('free_searches_remaining, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    if (!userData) {
      return new NextResponse('User not found', { status: 404 });
    }

    const customerId = userData.stripe_customer_id;
    if (customerId) {
      const subscription = await getSubscriptionStatus(customerId);
      if (subscription?.status === 'active') {
        return new NextResponse(JSON.stringify({ isPro: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const newFreeSearches = Math.max(userData.free_searches_remaining - 1, 0);
    const { data: updatedUserData, error: updateError } = await db
      .from('users')
      .update({
        free_searches_remaining: newFreeSearches
      })
      .eq('id', userId)
      .select('free_searches_remaining')
      .single();

    if (updateError) throw updateError;

    const freeSearches = updatedUserData?.free_searches_remaining ?? 0;
    return new NextResponse(JSON.stringify({ isPro: false, freeSearches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating free searches:', error);
    return new NextResponse('Error updating free searches', { status: 500 });
  }
}