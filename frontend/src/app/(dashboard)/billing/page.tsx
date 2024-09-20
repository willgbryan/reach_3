import { createClient } from '@/db/server'
import { cookies } from 'next/headers'
import { BillingPageClient } from "@/components/billing"
import { getCurrentUserId, getSession, getSubscriptionStatus, getUserDetails } from '@/app/_data/user'

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

export default async function Page() {
  const session = await getSession()
  if (!session) {
    return <div>Please log in to access billing information.</div>
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const userDetails = await getUserDetails()
  const userId = await getCurrentUserId()
  const subscription = await getSubscriptionStatus()
  let paymentHistory: Subscription[] = []

  if (userId) {
    const { data: paymentHistoryData, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created', { ascending: false })

    if (error) {
      console.error('Error fetching payment history:', error)
    } else {
      paymentHistory = paymentHistoryData || []
    }
  }

  console.log('Payment History:', paymentHistory)

  return (
    <BillingPageClient
      user={userDetails}
      subscription={subscription as Subscription | null}
      paymentHistory={paymentHistory}
    />
  )
}