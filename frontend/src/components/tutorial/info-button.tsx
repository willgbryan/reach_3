import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface InfoButtonProps {
  stepInfo: {
    title: string;
    description: string;
  };
}

const InfoButton: React.FC<InfoButtonProps> = ({ stepInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      let top = buttonRect.bottom + window.scrollY;
      let left = buttonRect.right - popupRect.width + window.scrollX;

      // Adjust if popup goes off-screen
      if (left < 0) left = 0;
      if (top + popupRect.height > window.innerHeight) {
        top = buttonRect.top - popupRect.height + window.scrollY;
      }

      popupRef.current.style.top = `${top}px`;
      popupRef.current.style.left = `${left}px`;
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Info className="h-4 w-4" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bg-[#121212] p-6 rounded-md shadow-lg z-[51] w-80 max-w-[90vw]"
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="font-bold mb-2 text-lg">{stepInfo.title}</h3>
              <p className="text-sm">{stepInfo.description}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoButton;