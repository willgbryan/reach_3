import React, { useState, useEffect, useRef, forwardRef } from 'react';
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
  placeholders = ["Ask anything..."],
  currentStep,
  hasContent
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWindowClick = () => {
      if (!inputDisabled && inputRef.current && !hasContent) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [inputDisabled, hasContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputDisabled) {
      setInputValue(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !inputDisabled) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div ref={ref} className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
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