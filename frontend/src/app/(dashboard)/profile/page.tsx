"use client";
import React from "react";
import { LayoutGrid } from "@/components/cult/layout-grid";
import { Heading } from "@/components/cult/gradient-heading";
export default function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Profile</Heading>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        View and manage your profile information, settings, and preferences.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Slides</Heading>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Create, edit, and present your slides with ease. Collaborate with your team in real-time.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Reports</Heading>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Generate and analyze reports to gain insights into your business performance.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <Heading weight="base" size="xl">Metrics</Heading>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
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
    thumbnail:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Profile",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Slides",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Reports",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Metrics",
  },
];