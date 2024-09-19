import React, { useState, useEffect, forwardRef } from 'react';
import { PlaceholdersAndVanishInput } from "@/components/cult/placeholder-vanish-input";

interface SimpleInputFormProps {
  id?: string;
  onSubmit: (value: string) => void;
  onStartOver: () => void;
  inputDisabled: boolean;
  placeholders?: string[];
  currentStep: string;
  hasContent: boolean;
}

const SimpleInputForm = forwardRef<HTMLDivElement, SimpleInputFormProps>(({
  onSubmit,
  onStartOver,
  inputDisabled,
  placeholders=[],
  currentStep,
  hasContent
}, ref) => {

  useEffect(() => {
    const handleWindowClick = () => {
      if (!inputDisabled && !hasContent) {
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [inputDisabled, hasContent]);

  return (
    <div ref={ref} className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onSubmit={onSubmit}
          onStartOver={onStartOver}
          disabled={inputDisabled}
          currentStep={currentStep}
          hasContent={hasContent}
        />
      </div>
    </div>
  );
});

export default SimpleInputForm;
