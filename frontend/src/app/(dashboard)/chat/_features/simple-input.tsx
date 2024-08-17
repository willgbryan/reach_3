import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface SimpleInputFormProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
  inputDisabled: boolean;
}

const SimpleInputForm: React.FC<SimpleInputFormProps> = ({ onSubmit, isLoading, inputDisabled }) => {
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
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !inputDisabled) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const isInputDisabled = isLoading || inputDisabled;

  return (
    <div className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isInputDisabled}
          placeholder={
            inputDisabled
              ? ""
              : "Ask anything..."
          }
          className="w-full p-3 rounded-l-md border text-lg border-stone-300 dark:border-stone-600 bg-brand dark:bg-brand text-black dark:text-white focus:outline-none shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isLoading ? (
          <div className="p-3 bg-brand dark:bg-brand border border-l-0 border-stone-300 dark:border-stone-600 rounded-r-md">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isInputDisabled}
            className="p-3 bg-purple-500 text-white rounded-r-md focus:outline-none hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SimpleInputForm;