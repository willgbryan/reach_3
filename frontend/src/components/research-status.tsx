import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const steps = {
  'initial': [
    'Building search space',
    'Exploring known sources',
    'Collecting valid secondary sources',
    'Exploring unknown sources',
    'Collecting valid secondary sources',
  ],
  'dive-1': [
    'Building search space',
    'Exploring known sources',
    'Collecting valid secondary sources',
    'Exploring unknown sources',
    'Collecting valid secondary sources',
  ],
  'dive-2': [
    'Expanding search space',
    'Cross-referencing existing material',
    'Collecting new secondary sources',
    'Indexing new sources',
    'Evaluating existing sources'
  ],
  'dive-3': [
    'Expanding search space',
    'Analyzing existing findings',
    'Compiling applicable material',
    'Indexing new sources',
    'Evaluating existing sources'
  ],
  'dive-4': [
    'Expanding search space',
    'Deep diving prior sources',
    'Indexing new sources',
    'Evaluating existing sources'
  ],
  'dive-5': [
    'Expanding search space',
    'Validating sources',
    'Compiling insights',
    'Indexing new sources',
    'Evaluating existing sources'
  ],
  'dive-6': [
    'Expanding search space',
    'Collecting new sources',
    'Validating material',
    'Indexing new sources',
    'Evaluating existing sources'
  ],
  'condensing': [
    'Consolidating findings',
    'Organizing key points',
    'Correcting citation formatting',
    'Preparing final report',
  ]
};

export const ResearchStatus = ({
    currentStep,
    query,
    className
  }: {
    currentStep: string;
    query: string;
    className?: string;
  }) => {
    const [currentWord, setCurrentWord] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const getActiveStepMessages = useCallback(() => {
      if (currentStep === 'condensing') {
        return steps.condensing;
      }
      
      const isDiveStep = /^dive-\d+$/.test(currentStep);
      return steps[currentStep as keyof typeof steps] || steps.initial;
    }, [currentStep]);
  
    const startAnimation = useCallback(() => {
      const activeMessages = getActiveStepMessages();
      const nextIndex = (currentIndex + 1) % activeMessages.length;
      const nextWord = activeMessages[nextIndex];
      
      setCurrentIndex(nextIndex);
      setCurrentWord(nextWord);
      setIsAnimating(true);
    }, [currentIndex, getActiveStepMessages]);
  
    useEffect(() => {
      const activeMessages = getActiveStepMessages();
      setCurrentWord(activeMessages[0]);
      setCurrentIndex(0);
      setIsAnimating(false);
    }, [currentStep, getActiveStepMessages]);
  
    useEffect(() => {
      if (!isAnimating) {
        const timer = setTimeout(() => {
          startAnimation();
        }, 10000);
        return () => clearTimeout(timer);
      }
    }, [isAnimating, startAnimation]);
  
    return (
      <div className={cn("flex flex-col items-center justify-center py-20", className)}>
        <div className="relative flex items-center text-xl text-neutral-600 dark:text-neutral-400">
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <LoaderIcon className="animate-spin h-5 w-5" />
          </div>
          <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="pl-8"
            >
              {currentWord}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    );
  };