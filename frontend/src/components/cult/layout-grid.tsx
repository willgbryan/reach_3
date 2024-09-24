"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Meteors } from './meteors';
import { motion } from "framer-motion";

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
          {selected?.id === card.id ? (
            <div
              className="cursor-pointer absolute inset-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 m-auto z-50 flex justify-center items-center"
              onClick={handleOutsideClick}
            >
              <SelectedCard selected={selected} />
            </div>
          ) : (
            <motion.button
              onClick={() => handleClick(card)}
              className={cn(
                "rounded-lg bg-gray-100 dark:bg-zinc-800 h-full w-full overflow-hidden flex flex-col items-start justify-start relative z-10",
                "lg:border-r lg:border-b dark:border-zinc-800",
                i % 4 === 0 && "lg:border-l",
                "group/feature transition-all duration-300",
                card.disabled && "cursor-not-allowed opacity-75"
              )}
            >
              <GridCard card={card} />
            </motion.button>
          )}
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
      {/* Background layers */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 group-hover/feature:opacity-0 transition-opacity duration-300" />

      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gray-900 dark:bg-zinc-800" />
      </div>

      {/* Card content */}
      <div className="relative z-40 p-8 h-full w-full flex flex-col justify-center items-center">

        <p className="text-neutral-600 dark:text-neutral-400 group-hover/feature:text-neutral-300 text-sm md:text-base font-medium font-sans text-center mb-2 transition-colors duration-300">
          {card.category}
        </p>

        <p className="text-neutral-800 dark:text-neutral-100 group-hover/feature:text-white text-xl md:text-3xl font-normal max-w-xs text-center [text-wrap:balance] font-sans transition duration-300">
          {card.title}
        </p>
      </div>

      {/* Meteors effect */}
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
