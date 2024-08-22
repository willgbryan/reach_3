"use client";
import React from "react";
import { LayoutGrid } from "@/components/cult/layout-grid";
import { ProfileForm } from "@/components/ui/profile-form";
import { SlidesForm } from "@/components/ui/slides-form";
import { ReportsForm } from "@/components/ui/reports-form";
import { MetricsShowcase } from "@/components/ui/metrics-showcase";

export default function ConfigGrid() {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-zinc-950">
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
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    title: "Slides",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    title: "Reports",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    title: "Metrics",
  },
];