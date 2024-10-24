import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { nanoid } from 'nanoid';
import { Message } from 'ai';

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
  placeholders = [],
  currentStep,
  hasContent
}, ref) => {
  const [value, setValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isPopoverOpen) {
      inputRef.current?.focus();
    }
  }, [isPopoverOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handlePlaceholderSelect = (placeholder: string) => {
    setValue(placeholder);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputDisabled && value) {
      setIsPopoverOpen(false);
      onSubmit(value);
    }
  };

  return (
    <div ref={ref} className="w-full">
      <div className="relative max-w-3xl mx-auto">
        <Popover 
          open={isPopoverOpen} 
          onOpenChange={(open) => {
            if (open) setIsPopoverOpen(true);
          }}
        >
          <form
            className={cn(
              "w-full relative bg-white dark:bg-zinc-800 rounded-md overflow-hidden shadow transition duration-200",
              value && "bg-gray-50",
              inputDisabled && !hasContent && "opacity-50 cursor-not-allowed"
            )}
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <PopoverTrigger asChild>
                <Textarea
                  ref={inputRef}
                  value={value}
                  onChange={handleInputChange}
                  disabled={inputDisabled}
                  className={cn(
                    "w-full text-sm sm:text-base border-none dark:text-white bg-transparent text-black focus:outline-none focus:ring-0 p-4 pr-12 resize-none overflow-hidden",
                    inputDisabled && "cursor-not-allowed"
                  )}
                  rows={1}
                  placeholder="Research with Heighliner..."
                  autoFocus
                />
              </PopoverTrigger>
              {currentStep !== "initial" ? (
                <div className="absolute top-4 right-4 h-6 w-6 flex items-center justify-center">
                  <LoaderIcon className="animate-spin" />
                </div>
              ) : hasContent ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onStartOver();
                    setIsPopoverOpen(false);
                  }}
                  className={cn(
                    "absolute top-4 right-4 h-8 px-4 rounded-full",
                    "bg-stone-100 dark:bg-zinc-900 text-stone-900 dark:text-stone-100",
                    "transition duration-200 flex items-center justify-center",
                    "hover:bg-gray-800 dark:hover:bg-zinc-700 hover:text-stone-100",
                    "active:bg-gray-700 dark:active:bg-zinc-600"
                  )}
                >
                  Start over
                </button>
              ) : (
                <button
                  disabled={!value || inputDisabled}
                  type="submit"
                  className={cn(
                    "absolute top-4 right-4 h-8 w-8 rounded-full",
                    "disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800",
                    "transition duration-200 flex items-center justify-center",
                    inputDisabled && "cursor-not-allowed"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 h-4 w-4"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 18 6-6" />
                    <path d="m13 6 6 6" />
                  </svg>
                </button>
              )}
            </div>
          </form>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0 border-none" 
            align="start"
            sideOffset={0}
          >
            <Command className="border-none">
              <CommandList>
                <CommandEmpty>No examples found.</CommandEmpty>
                <CommandGroup heading="Suggested Questions">
                  {placeholders.filter(Boolean).map((placeholder, index) => (
                    <CommandItem
                      key={index}
                      value={placeholder}
                      onSelect={() => handlePlaceholderSelect(placeholder)}
                      className="cursor-pointer"
                    >
                      {placeholder}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

SimpleInputForm.displayName = 'SimpleInputForm';

export default SimpleInputForm;