import { Heading } from '@/components/cult/gradient-heading'
// import { MobileNavSearchActions } from '@/components/nav/nav-blob-actions-mobile'
import { LifetimePayment, Pricing } from '@/components/pricing'

export const dynamic = 'force-dynamic'

// Example of requiring payment to use app
export default async function PaidExamplePage() {
  return (
    <>
      <div className="mt-4 ml-4 ">
        <Heading size="xs">*Payment required to access this feature</Heading>
        <p className="pl-6 tracking-tight text-muted-foreground">demo purpose only</p>
      </div>
      <Pricing>
        <LifetimePayment />
      </Pricing>

      <div className="absolute bottom-8  right-8">
        {/* <MobileNavSearchActions messages={[]} handleReset={null} /> */}
      </div>
    </>
  )
}
