import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface TutorialStepProps {
  title: string;
  description: string;
  highlightId: string;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  highlightId,
  onNext,
  onPrevious,
  onClose,
  isFirstStep,
  isLastStep,
  dontShowAgain,
  setDontShowAgain,
}) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const tutorialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (isFirstStep || isLastStep) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const cardHeight = tutorialRef.current?.offsetHeight || 0;
        setPosition({
          top: Math.min(windowHeight / 2 - cardHeight / 2, windowHeight - cardHeight - 20),
          left: windowWidth / 2 - 200,
        });
      } else {
        const element = document.getElementById(highlightId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;
          const cardHeight = tutorialRef.current?.offsetHeight || 0;

          let top = rect.top > windowHeight / 2 ? rect.top - cardHeight - 20 : rect.bottom + 20;
          let left = rect.left + rect.width / 2 - 200;

          top = Math.max(20, Math.min(top, windowHeight - cardHeight - 20));
          left = Math.max(20, Math.min(left, windowWidth - 420));

          setPosition({ top, left });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [highlightId, isFirstStep, isLastStep]);

  

  return (
    <motion.div
      ref={tutorialRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="tutorial-step dark:bg-[#121212] bg-stone-100 p-6 rounded-lg shadow-lg w-[400px] border-2 border-slate-900 dark:border-stone-100"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        pointerEvents: 'auto',
      }}
    >
      <Alert className="bg-brand border-none">
        <AlertTitle className="dark:text-stone-100 text-stone-900 text-[1.15rem] font-bold mb-4">{title}</AlertTitle>
        <AlertDescription className="dark:text-stone-100 text-stone-900">{description}</AlertDescription>
      </Alert>
      
      {isLastStep && (
        <div className="flex justify-center mt-4 mb-4">
          <Checkbox
            id="dontShowAgain"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
          />
          <label htmlFor="dontShowAgain" className="ml-2 dark:text-stone-100 text-stone-900 text-sm">
            Don't show this again
          </label>
        </div>
      )}

      <div className="flex justify-between mt-4">
        {!isFirstStep && (
          <Button onClick={onPrevious} className="text-stone-900 dark:text-stone-100 hover:text-stone-900 dark:hover:text-stone-100" variant="ghost">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {!isLastStep ? (
          <Button onClick={onNext} className="text-stone-900 dark:text-stone-100 ml-auto hover:text-stone-900 dark:hover:text-stone-100" variant="ghost">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onClose} className="text-stone-900 dark:text-stone-100 ml-auto w-md hover:text-stone-900 dark:hover:text-stone-100" variant="ghost">
            Finish
          </Button>
        )}
      </div>
    </motion.div>
  );
};