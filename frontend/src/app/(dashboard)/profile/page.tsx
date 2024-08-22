"use client";
import React from "react";
import { LayoutGrid } from "@/components/cult/layout-grid";
import { Heading } from "@/components/cult/gradient-heading";
import { ProfileForm } from "@/components/ui/profile-form";
import { SlidesForm } from "@/components/ui/slides-form"; // Make sure to adjust this import path

export default function ConfigGrid() {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-zinc-950">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div className="w-full">
      <div className="mt-4">
        <ProfileForm />
      </div>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="w-full">
      <div className="mt-4">
        <SlidesForm />
      </div>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Reports</Heading>
      <p className="font-normal text-base my-4 text-neutral-600 dark:text-neutral-300">
        Generate and analyze reports to gain insights into your business performance.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Metrics</Heading>
      <p className="font-normal text-base my-4 text-neutral-600 dark:text-neutral-300">
        Track and visualize key performance indicators and metrics for your projects and teams.
      </p>
    </div>
  );
};

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