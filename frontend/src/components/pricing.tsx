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
import { Heading } from './cult/gradient-heading';

const pricingTiers = [
  {
    title: "Basic",
    price: 0,
    description: "Take it for a spin",
    features: [
      "Individual use",
      "10 queries per month",
      "Maximum of 1 concurrent newsletter(s)",
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
      "Maximum of 5 concurrent newsletters",
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
      "Maximum of 5 concurrent newsletters per team member",
      "Export sharing via Slack",
      "24/7 support"
    ]
  },
  {
    title: "Enterprise",
    price: 99,
    description: "Integrated analysis ",
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
        "h-full",
        emphasized ? "shadow-lg" : "shadow-sm",
        // Apply different border radius based on card position
        isFirst ? "rounded-r-none" : isLast ? "rounded-l-none" : "rounded-none",
        emphasized && "rounded-lg" // Keep all corners rounded for emphasized card
      )}>
        <CardHeader>
          <CardTitle>{tier.title}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        <StripeCheckout
            metadata={{
              userId: session?.user.id ?? null,
              pricingTier: tier.title,
            }}
            paymentType="subscription"
            price={tier.price * 100} // Convert to cents
            className="w-full"
          >
            <Button className={cn(
              "w-full",
              emphasized ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
            )}>
              Get started
            </Button>
          </StripeCheckout>
        <CardContent className="grid gap-4">
          <div className="flex items-baseline justify-center gap-x-2">
            <span className="text-3xl font-bold">${tier.price}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <div>
            {tier.features.map((feature, index) => (
              <div
                key={index}
                className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <Check className="h-4 w-4 text-green-500" />
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  );
};

export function PricingPage({ session }) {
  return (
    <div className="py-18 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading variant="default" size="xl">
            Choose Your Plan
          </Heading>
          <p className="mt-6 text-lg leading-8 text-gray-600">
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