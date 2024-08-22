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

const pricingTiers = [
  {
    title: "Basic",
    price: 0,
    description: "Take it for a spin",
    features: [
      "Individual use",
      "10 queries per month",
      { text: "Maximum of 1 concurrent newsletter(s)", subtext: "then $0.99 per newsletter" },
      "Default static file exports"
    ]
  },
  {
    title: "Pro",
    price: 29,
    description: "Accelerate your professional work",
    features: [
      "Individual use with added memory layer",
      "Unlimited queries",
      { text: "Maximum of 5 concurrent newsletters", subtext: "then $0.99 per newsletter" },
      "Static file export customization",
      "24/7 support"
    ],
    emphasized: true
  },
  {
    title: "Team",
    price: 49,
    description: "Collaborative tools for teams",
    features: [
      "Team level memory layer",
      "Unlimited queries",
      { text: "Maximum of 5 concurrent newsletters per team member", subtext: "then $0.99 per newsletter" },
      "Export sharing via Slack",
      "24/7 support"
    ]
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Integrated analytics and acceleration",
    features: [
      "Custom user limit",
      "Configurable memory layer granularity",
      "Organization wide observability dashboard",
      "Unlimited queries",
      "Unlimited concurrent newsletters",
      "24/7 support"
    ]
  }
];

const PricingCard = ({ tier, session, emphasized, index, totalCards }) => {
  const isFirst = index === 0;
  const isLast = index === totalCards - 1;

  return (
    <div className={cn(
      "relative w-full",
      emphasized ? "z-10 scale-y-[1.03] -mt-1.5 -mb-1.5" : ""
    )}>
      <Card className={cn(
        "h-full flex flex-col",
        emphasized ? "shadow-lg" : "shadow-sm",
        isFirst ? "rounded-r-none" : isLast ? "rounded-l-none" : "rounded-none",
        emphasized && "rounded-lg"
      )}>
        <CardHeader>
          <CardTitle>{tier.title}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <StripeCheckout
            metadata={{
              userId: session?.user.id ?? null,
              pricingTier: tier.title,
            }}
            paymentType="subscription"
            price={typeof tier.price === 'number' ? tier.price * 100 : 0}
            className="w-full"
          >
            <Button className={cn(
              "w-full",
              emphasized ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
            )}>
              Get started
            </Button>
          </StripeCheckout>
          <div className="flex items-baseline justify-center gap-x-2">
            <span className="text-3xl font-bold">
              {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
            </span>
            {typeof tier.price === 'number' && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>
          <Separator className="my-2" />
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

export function PricingPage({ session }) {
  return (
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}