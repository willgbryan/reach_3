"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/cult/gradient-heading";
import { Meteors } from './meteors';

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  title: string;
  category: string;
  disabled?: boolean;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    if (!card.disabled) {
      setSelected(card);
    }
  };

  const handleOutsideClick = () => {
    setSelected(null);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "h-full")}>
          <div
            onClick={() => handleClick(card)}
            className={cn(
              "relative overflow-hidden rounded-lg h-full",
              selected?.id === card.id
                ? "cursor-pointer absolute inset-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 m-auto z-50 flex justify-center items-center"
                : "bg-gray-100 dark:bg-zinc-800",
              card.disabled && "cursor-not-allowed opacity-75",
              "group/feature transition-all duration-300"
            )}
          >
            {selected?.id === card.id ? (
              <SelectedCard selected={selected} />
            ) : (
              <GridCard card={card} />
            )}
          </div>
        </div>
      ))}
      {selected && (
        <div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
        />
      )}
    </div>
  );
};

const GridCard = ({ card }: { card: Card }) => {
  return (
    <>
      <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 group-hover/feature:opacity-0 transition-opacity duration-300" />
      
      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gray-900 dark:bg-zinc-800" />
      </div>

      <div className="relative z-40 p-8 h-full w-full flex flex-col justify-end">
        <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-2 w-2 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
            />
          </svg>
        </div>
        
        <p className="text-neutral-600 dark:text-neutral-400 group-hover/feature:text-stone-100 text-sm md:text-base font-medium font-sans text-left mb-2 transition-colors duration-300 transform group-hover/feature:translate-x-2">
          {card.category}
        </p>
        
        <p className="text-neutral-800 dark:text-neutral-100 group-hover/feature:text-stone-100 text-xl md:text-3xl font-normal max-w-xs text-left [text-wrap:balance] font-sans transform group-hover/feature:translate-x-2 transition duration-300">
          {card.title}
        </p>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
        <Meteors number={20} />
      </div>
    </>
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 h-full w-full flex flex-col justify-start rounded-lg shadow-2xl relative z-[60] overflow-y-auto p-6 transition-opacity duration-300 ease-in-out opacity-0 animate-fade-in">
      <div className="flex-grow">
        {selected?.content}
      </div>
    </div>
  );
};

export default LayoutGrid;