import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';

interface SimpleInputFormProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

const SimpleInputForm: React.FC<SimpleInputFormProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWindowClick = () => {
      inputRef.current?.focus();
    };

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="absolute bottom-2 md:bottom-8 left-0 right-0 px-4">
      <div className="relative max-w-3xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          placeholder="Type your query and press 'Enter' to submit..."
          className="w-full p-3 rounded-md border text-lg border-stone-300 dark:border-gray-600 bg-brand dark:bg-brand text-black dark:text-white focus:outline-none shadow-md"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleInputForm;