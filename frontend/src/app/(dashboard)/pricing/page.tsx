import { PricingPage } from '@/components/pricing';
import { getSession } from '@/app/_data/user';

export default async function Page() {
  const session = await getSession();
  return <PricingPage session={session} />;
}