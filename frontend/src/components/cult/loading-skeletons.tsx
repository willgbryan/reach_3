import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Meteors } from './meteors';

export const CardSkeleton = ({ index }: { index: number }) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-gray-100 dark:bg-zinc-800 h-full w-full overflow-hidden flex flex-col items-start justify-start relative z-10",
        "lg:border-r lg:border-b dark:border-zinc-800",
        index % 4 === 0 && "lg:border-l",
        "group/feature transition-all duration-300",
        "animate-[pulse_8s_ease-in-out_infinite]"
      )}
    >
      <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 group-hover/feature:opacity-0 transition-opacity duration-300" />
      
      <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gray-900 dark:bg-zinc-800" />
      </div>

      <div className="relative z-40 p-8 h-full w-full flex flex-col justify-start group-hover/feature:justify-end transition-all duration-300">
        <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500 animate-[pulse_8s_ease-in-out_infinite]">
          <div className="h-2 w-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
        
        <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-[pulse_8s_ease-in-out_infinite] mb-2" />
        
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-700 rounded animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-[pulse_8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* <div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
        <Meteors number={20} />
      </div> */}

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-[0.05] -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};