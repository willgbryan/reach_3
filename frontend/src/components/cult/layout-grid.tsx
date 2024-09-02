"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/cult/gradient-heading";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  title: string;
  disabled?: boolean;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    if (!card.disabled) {
      setLastSelected(selected);
      setSelected(card);
    }
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "h-full")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              "relative overflow-hidden rounded-lg h-full",
              selected?.id === card.id
                ? "cursor-pointer absolute inset-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 m-auto z-50 flex justify-center items-center"
                : "bg-white dark:bg-zinc-800",
              card.disabled && "cursor-not-allowed opacity-75"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id ? (
              <SelectedCard selected={selected} />
            ) : (
              <div className="flex items-center justify-center h-full p-6">
                <Heading weight="base" size="xl">
                  {card.title}
                </Heading>
              </div>
            )}
          </motion.div>
        </div>
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-white dark:bg-zinc-800 h-full w-full flex flex-col justify-start rounded-lg shadow-2xl relative z-[60] overflow-y-auto p-6">
      <div className="flex-grow">
        {selected?.content}
      </div>
    </div>
  );
};