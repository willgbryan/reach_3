import React, { useState, useEffect, useRef } from 'react';
import { PlaceholdersAndVanishInput } from "@/components/cult/placeholder-vanish-input";

interface SimpleInputFormProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
  inputDisabled: boolean;
  placeholders?: string[];
}

const SimpleInputForm: React.FC<SimpleInputFormProps> = ({
  onSubmit,
  isLoading,
  inputDisabled,
  placeholders = ["Ask anything..."]
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWindowClick = () => {
      if (!inputDisabled && inputRef.current) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [inputDisabled]);

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
    <div className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={inputDisabled}
        />
        {isLoading && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleInputForm;