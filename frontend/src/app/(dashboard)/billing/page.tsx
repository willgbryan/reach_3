import { BillingPageClient } from "@/components/billing"
import { getCurrentUserId, getSession, getUserDetails } from '@/app/_data/user'
import { getPaymentHistory, getStripeCustomerId, getSubscriptionStatus } from "@/app/_data/stripe";
import { Stripe } from 'stripe';

type Json = any;

type Subscription = {
  id: string;
  user_id: string;
  price_id: string | null;
  status: string | null;
  amount: number | null;
  currency: string | null;
  created: string;
  metadata: {
    customerId?: string;
    isTestEvent?: boolean;
    paymentType?: string;
    subscriptionId?: string;
  } | Json;
  description: string | null;
  stripe_customer_id: string;
  isActive?: boolean;
};

type PaymentHistoryItem = {
  id: string;
  amount: number | null;
  currency: string | null;
  created: string;
  status: string | null;
  description: string | null;
};

function mapStripeSubscriptionToSubscription(stripeSubscription: Stripe.Subscription | null): Subscription | null {
  if (!stripeSubscription) return null;
  return {
    id: stripeSubscription.id,
    user_id: stripeSubscription.customer as string,
    price_id: stripeSubscription.items.data[0]?.price.id || null,
    status: stripeSubscription.status,
    amount: stripeSubscription.items.data[0]?.price.unit_amount,
    currency: stripeSubscription.currency,
    created: new Date(stripeSubscription.created * 1000).toISOString(),
    metadata: stripeSubscription.metadata,
    description: null,
    stripe_customer_id: stripeSubscription.customer as string,
    isActive: stripeSubscription.status === 'active',
  };
}

function mapStripeChargeToPaymentHistoryItem(charge: {
  id: string;
  amount: number;
  currency: string;
  created: string | number;
  status: string;
  description: string | null;
}): PaymentHistoryItem {
  return {
    id: charge.id,
    amount: charge.amount,
    currency: charge.currency,
    created: typeof charge.created === 'number'
      ? new Date(charge.created * 1000).toISOString()
      : charge.created,
    status: charge.status,
    description: charge.description,
  };
}

export default async function Page() {
  const session = await getSession()
  if (!session) {
    return <div>Please log in to access billing information.</div>
  }

  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('User ID not found')
  }

  const stripeCustomerId = await getStripeCustomerId(userId)
  if (!stripeCustomerId) {
    throw new Error('Stripe Customer ID not found')
  }

  const stripeSubscription = await getSubscriptionStatus(stripeCustomerId)
  const stripePaymentHistory = await getPaymentHistory(stripeCustomerId)

  const subscription = mapStripeSubscriptionToSubscription(stripeSubscription)
  const paymentHistory = stripePaymentHistory.map(mapStripeChargeToPaymentHistoryItem)

  return (
    <BillingPageClient
      user={session.user}
      subscription={subscription}
      paymentHistory={paymentHistory}
    />
  )
}