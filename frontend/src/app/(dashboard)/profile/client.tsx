"use client";
import React from "react";
import { LayoutGrid } from "@/components/cult/layout-grid";
import { ProfileForm } from "@/components/ui/profile-form";
import { SlidesForm } from "@/components/ui/slides-form";
import { ReportsForm } from "@/components/ui/reports-form";
import { MetricsShowcase } from "@/components/ui/metrics-showcase";
import { ChartsForm } from "@/components/ui/charts-form";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from "@/components/theme-toggle";
import UserProvider from "@/components/user-provider";

interface ConfigGridProps {
  isProUser: boolean;
}

export default function ConfigGrid({ isProUser }: ConfigGridProps) {
  if (!isProUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-100 dark:bg-zinc-950">
        <h1 className="text-6xl font-base mb-2">Pro Tier Required</h1>
        <p className="mb-6">Heighliner configuration is only available for Pro tier users.</p>
        <Link href="/pricing">
          <Button>Upgrade to Pro</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-zinc-950 relative">
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        <ModeToggle />
        <UserProvider id="profile" />
      </div>
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => (
  <div className="w-full">
    <div className="mt-4">
      <ProfileForm />
    </div>
  </div>
);

const SkeletonTwo = () => (
  <div className="w-full">
    <div className="mt-4">
      <SlidesForm />
    </div>
  </div>
);

const SkeletonThree = () => (
  <div className="w-full">
    <div className="mt-4">
      <ReportsForm />
    </div>
  </div>
);

const SkeletonFour = () => (
  <div className="w-full">
    <div className="mt-4">
      <ChartsForm />
    </div>
  </div>
);

const SkeletonFive = () => (
  <div className="w-full">
    <div className="mt-4">
      <MetricsShowcase />
    </div>
  </div>
);

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    title: "Profile",
    category: "",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    title: "Slides",
    category: "",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    title: "Reports",
    category: "",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    title: "Charts",
    category: "",
  },
  {
    id: 5,
    content: <SkeletonFive />,
    className: "md:col-span-2 opacity-75",
    title: "Diagrams",
    category: "Coming Soon",
    disabled: true
  },
];