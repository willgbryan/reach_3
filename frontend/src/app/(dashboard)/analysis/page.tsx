import { getSession } from '@/app/_data/user'
import { getStripeCustomerId, getSubscriptionStatus } from '@/app/_data/stripe'
import PdfUploadAndRenderPage from './client'

export default async function DocumentAnalysisPage() {
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

  return <PdfUploadAndRenderPage/>
}