'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createStripePortalSession } from '@/app/_actions/stripe';
import { Tabs } from "@/components/cult/tabs";

type BillingPageClientProps = {
  user: any;
  subscription: any;
  paymentHistory: any[];
}

export const BillingPageClient: React.FC<BillingPageClientProps> = ({ user, subscription, paymentHistory }) => {
  const router = useRouter();

  const handleManageSubscription = async () => {
    if (subscription) {
      try {
        const { url } = await createStripePortalSession(user.id);
        window.location.href = url;
      } catch (error) {
        alert('Failed to open Stripe portal: ' + error.message);
      }
    } else {
      router.push('/pricing');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount / 100);
  };

  const tabs = [
    {
      title: "Current Subscription",
      value: "subscription",
      content: (
        <Card className="w-full h-full bg-white dark:bg-zinc-800">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div>
                <p>Plan: {subscription.metadata?.plan || 'Unknown'}</p>
                <p>Status: {subscription.isActive ? 'Active' : 'Inactive'}</p>
                <p>Amount: {formatCurrency(subscription.amount, subscription.currency)}</p>
                <p>Last Payment: {formatDate(subscription.created)}</p>
                {subscription.metadata?.cancelAtPeriodEnd && (
                  <p className="text-red-500">Your subscription will be canceled at the end of the current period.</p>
                )}
              </div>
            ) : (
              <p>You don't have an active subscription.</p>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Payment History",
      value: "payment-history",
      content: (
        <Card className="w-full h-full bg-white dark:bg-zinc-800">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(payment.created)}</TableCell>
                    <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>{payment.description || 'Subscription Payment'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ),
    },
    {
      title: "Manage Subscription",
      value: "manage",
      content: (
        <Card className="w-full h-full bg-white dark:bg-zinc-800">
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <p>Click the button below to manage your subscription, update payment methods, or change your plan.</p>
            ) : (
              <p>You don't have an active subscription. Click the button below to view our pricing plans and subscribe.</p>
            )}
            <Button onClick={handleManageSubscription} className="mt-4">
              {subscription ? 'Manage Subscription' : 'View Pricing Plans'}
            </Button>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-10">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};