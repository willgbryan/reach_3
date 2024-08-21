import React from 'react';
import { motion } from 'framer-motion';

interface TutorialOverlayProps {
  children: React.ReactNode;
  isFirstOrLastStep: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ children, isFirstOrLastStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    //   className={`fixed inset-0 z-50 ${isFirstOrLastStep ? 'bg-black bg-opacity-50' : ''}`}
      className={`fixed inset-0 z-50 ${isFirstOrLastStep ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-50'}`}
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  );
};