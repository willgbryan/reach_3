import { createClient } from '@/db/server'
import { cookies } from 'next/headers'
import { BillingPageClient } from "@/components/billing"
import { getCurrentUserId, getSession, getSubscriptionStatus, getUserDetails } from '@/app/_data/user'

type Payment = {
  amount: number | null;
  created: string;
  currency: string | null;
  description: string | null;
  id: string;
  metadata: any;
  price_id: string | null;
  status: string | null;
  user_id: string;
}

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
  console.log(subscription)
  let paymentHistory: Payment[] = []

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
  console.log(paymentHistory)

  return (
    <BillingPageClient
      user={userDetails}
      subscription={subscription}
      paymentHistory={paymentHistory}
    />
  )
}