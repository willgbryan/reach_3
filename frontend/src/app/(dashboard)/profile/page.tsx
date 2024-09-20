import { getSession } from '@/app/_data/user'
import { getStripeCustomerId, getSubscriptionStatus } from '@/app/_data/stripe'
import ConfigGrid from './client'

export default async function ConfigGridPage() {
  const session = await getSession()
  let isProUser = false

  if (session?.user?.id) {
    try {
      const customerId = await getStripeCustomerId(session.user.id)
      if (customerId) {
        const subscription = await getSubscriptionStatus(customerId)
        isProUser = subscription?.status === 'active' && subscription?.items?.data[0]?.price.id === 'price_id_for_pro_tier' // Replace with your actual Pro tier price ID
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  return <ConfigGrid isProUser={isProUser} />
}