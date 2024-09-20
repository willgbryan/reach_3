import React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StripeCheckout } from '@/app/api/stripe/server';
import { Heading } from '@/components/cult/gradient-heading';
import { Separator } from "@/components/ui/separator";
import { Meteors } from '@/components/cult/meteors';
import EnterpriseFormPopover from '@/components/enterprise-popover';
import { toast } from 'sonner';
import InfoButton from './tutorial/info-button';
import UserProvider from './user-provider';
import { ModeToggle } from './theme-toggle';

const pricingTiers = [
  {
    title: "Basic",
    price: 0,
    description: "Take it for a spin",
    features: [
      "Individual use",
      "10 queries per month",
      "Default static file exports"
    ]
  },
  {
    title: "Pro",
    price: 39,
    description: "Accelerate your work",
    features: [
      "Basic tier features",
      "Document Analysis",
      { text: "Unlimited queries", subtext: "Rate limit: 20 /hour"},
      "Static file export customization",
      "24/7 support"
    ],
    emphasized: true
  },
  {
    title: "Team",
    price: "Coming Soon",
    description: "Collaborative tools for teams",
    features: [
      "Pro tier features",
      { text: "Unlimited queries", subtext: "Rate limit: 100 /hour"},
      "Session sharing",
      "Export sharing via Slack",
      "24/7 support"
    ],
    comingSoon: true
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Integrated observability and tailored optimization",
    features: [
      "Custom user limit",
      "Organization wide observability dashboard",
      { text: "Unlimited queries", subtext: "Priority uptime and no rate limits"},
      "24/7 support"
    ]
  }
];

const PricingCard = ({ tier, session, emphasized, index, totalCards, userSubscription }) => {
  const isFirst = index === 0;
  const isLast = index === totalCards - 1;
  const isBasic = tier.title === "Basic";
  const isComingSoon = tier.comingSoon;
  const isEnterprise = tier.title === "Enterprise";
  const isPro = tier.title === "Pro";
  const isUserOnPro = userSubscription?.status === 'active';

  const handleProButtonClick = () => {
    if (isUserOnPro) {
      toast.success("You're currently subscribed to the Pro tier.")
    }
  };

  return (
    <div className={cn(
      "relative w-full",
      emphasized ? "z-10 scale-y-[1.03] -mt-1.5 -mb-1.5" : ""
    )}>
      <Card className={cn(
        "h-full flex flex-col dark:bg-zinc-800 dark:border-white",
        emphasized ? "shadow-lg" : "shadow-sm",
        isFirst ? "rounded-r-none" : isLast ? "rounded-l-none" : "rounded-none",
        emphasized && "rounded-lg",
        isComingSoon && "opacity-70"
      )}>
        <CardHeader>
          <CardTitle>{tier.title}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!isBasic && !isComingSoon && !isEnterprise && (
            isPro && isUserOnPro ? (
              <Button
                onClick={handleProButtonClick}
                className="relative mb-4 text-stone-100 dark:text-stone-900 bg-stone-900 dark:bg-stone-100 from-neutral-800 via-neutral-800 to-black px-6 py-2 rounded-lg group transition-[width] duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] text-lg flex items-center mx-auto w-auto shadow-[0_1px_5px_rgba(0,0,0,0.2)]"
              >
                Current Plan
              </Button>
            ) : (
              <StripeCheckout
                metadata={{
                  userId: session?.user.id ?? null,
                  pricingTier: tier.title,
                }}
                paymentType="subscription"
                price={typeof tier.price === 'number' ? tier.price * 100 : 0}
                className="w-full"
                tierDescription={tier.description}
              >
                <Button className="relative mb-4 text-stone-100 dark:text-stone-900 bg-stone-900 dark:bg-stone-100 from-neutral-800 via-neutral-800 to-black px-6 py-2 rounded-lg group transition-[width] duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] text-lg flex items-center mx-auto w-auto shadow-[0_1px_5px_rgba(0,0,0,0.2)]">
                  Get started
                  <div className="w-0 opacity-0 group-hover:w-[16px] group-hover:opacity-100 ml-1 overflow-hidden duration-100 ease-[cubic-bezier(0.64_0.57_0.67_1.53)] transition-[width]">
                    →
                  </div>
                </Button>
              </StripeCheckout>
            )
          )}
          {isEnterprise && <EnterpriseFormPopover />}
          <div className="flex items-baseline justify-center gap-x-2">
            <span className="text-3xl font-bold">
              {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
            </span>
            {typeof tier.price === 'number' && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>
          <Separator className="my-2 dark:bg-white" />
          <div>
            {tier.features.map((feature, index) => (
              <div
                key={index}
                className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <Check className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm">{typeof feature === 'string' ? feature : feature.text}</p>
                  {typeof feature === 'object' && feature.subtext && (
                    <p className="text-xs text-muted-foreground mt-1">{feature.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function PricingPage({ session, userSubscription }) {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 pt-4 pr-4 flex items-center space-x-2">
        <ModeToggle />
        <UserProvider id="profile" />
      </div>
      <div className="py-18 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <Heading weight="base" variant="default" size="xl">
              Choose Your Plan
            </Heading>
            <p className="mt-6 text-lg leading-8 text-stone-900 dark:text-stone-100">
              Select the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 sm:mt-20 lg:max-w-none lg:grid-cols-4">
            {pricingTiers.map((tier, index) => (
              <PricingCard
                key={index}
                tier={tier}
                session={session}
                emphasized={tier.title === "Pro"}
                index={index}
                totalCards={pricingTiers.length}
                userSubscription={userSubscription}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}