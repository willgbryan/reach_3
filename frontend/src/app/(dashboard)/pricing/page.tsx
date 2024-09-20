import { PricingPage } from '@/components/pricing';
import { getSession } from '@/app/_data/user';
import { getStripeCustomerId, getSubscriptionStatus } from '@/app/_data/stripe';
import { Stripe } from 'stripe';

export default async function Page() {
  const session = await getSession();
  let userSubscription: Stripe.Subscription | null = null;

  if (session?.user?.id) {
    try {
      const customerId = await getStripeCustomerId(session.user.id);
      if (customerId) {
        userSubscription = await getSubscriptionStatus(customerId);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  }

  return <PricingPage session={session} userSubscription={userSubscription} />;
}