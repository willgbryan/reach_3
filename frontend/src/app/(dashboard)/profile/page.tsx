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
        isProUser = subscription?.status === 'active'
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  return <ConfigGrid isProUser={isProUser} />
}