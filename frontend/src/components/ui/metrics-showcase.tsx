"use client";

import React from "react";
import { AnimatedNumber } from "@/components/cult/animated-number";
import { Heading } from "@/components/cult/gradient-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MetricsShowcase() {
  const frequentThemes = ["AI Ethics", "Climate Change", "Quantum Computing", "Blockchain"];

  return (
    <Card className="w-full border-none shadow-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-4xl font-normal">Metrics Overview</CardTitle>
        <CardDescription>Key statistics and insights.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard title="Number of Dives" value={29} />
          <StatCard title="Unique Sources Cited" value={1438} />
          <StatCard 
            title="Estimated Internet Coverage" 
            value={0.1} 
            format={(value) => `${value.toFixed(1)}%`}
          />
          <div>
            <Heading weight="base" size="sm" className="mb-4">Frequent Themes</Heading>
            <ul className="list-disc list-inside">
              {frequentThemes.map((theme, index) => (
                <li key={index} className="text-lg mb-2">{theme}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, format }: { title: string; value: number; format?: (value: number) => string }) {
  return (
    <div className="bg-white/10 dark:bg-transparent p-6 rounded-lg">
      <Heading weight="base" size="sm" className="mb-2">{title}</Heading>
      <div className="text-4xl font-bold">
        <AnimatedNumber value={value} format={format} />
      </div>
    </div>
  );
}