import React from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

// Utility function to conditionally apply classes
const applyClasses = (condition, classes) => (condition ? classes : '')

// Define constant classes for readability and reusability
const baseClasses =
  ' relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-neutral-100/20 before:opacity-0 before:ring-2 before:ring-brand-100/40 before:transition dark:before:border-brand-400/40 dark:before:ring-2 dark:before:ring-brand-600/40 button-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition'
const collapsedClasses =
  'focus-within:before:opacity-100 focus-within:after:shadow-brand-100/20 dark:after:shadow-brand-500/30 dark:focus-within:after:shadow-brand-500/50'
const buttonBaseClasses =
  'w-full text-lg font-semibold hover:outline-none bg-white hover:bg-neutral-50/80 dark:hover:ring-brand-600/20  hover:ring-1 dark:hover:ring-2 hover:ring-inset hover:ring-black/20 hover:bg-offBlack-950 hover:text-brand-400 focus:ring-brand-100 dark:ring-brand-900 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 dark:border dark:border-black/40 button-shadow rounded-[9988px] !outline-none relative border border-black/5 bg-neutral-50/90 p-4 shadow-black/5  focus:bg-white text-muted-foreground dark:bg-neutral-900/90 dark:hover:text-brand-300 dark:shadow-black/10  dark:focus:bg-neutral-900  '
const collapsedButtonClasses = 'py-8 px-5'

export const CultButtonCollapse = ({ isCollapsed, ...props }) => {
  return (
    <div className={cn(baseClasses, applyClasses(isCollapsed, collapsedClasses))}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(buttonBaseClasses, applyClasses(isCollapsed, collapsedButtonClasses))}
        {...props}
      >
        {props.children}
      </Button>
    </div>
  )
}

export function CultButton({ className, handleClick, children }) {
  return (
    <div
      className={cn(
        'relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-neutral-100/20 before:opacity-0 before:ring-2 before:ring-brand-100/40 before:transition dark:before:border-brand-400/40 dark:before:ring-2 dark:before:ring-brand-900/40',
        'button-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition',
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        className={cn(
          'w-full  text-lg font-semibold',
          'focus-within:before:opacity-100 focus-within:after:shadow-brand-100/20 dark:after:shadow-brand-500/30 dark:focus-within:after:shadow-brand-500/50',
          'w-full text-lg font-semibold hover:outline-none bg-white hover:bg-neutral-50/80 dark:hover:ring-brand-600/20 hover:ring-black/20 hover:bg-offBlack-950 hover:text-brand-400 dark:hover:ring-2 hover:ring-inset hover:ring-brand-100 focus:ring-brand-100 dark:ring-brand-900 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 dark:border dark:border-black/40 button-shadow rounded-[9988px] !outline-none relative border border-black/5 bg-neutral-50/90 p-4 shadow-black/5 placeholder:text-neutral-400 focus:bg-white text-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-100 dark:shadow-black/10 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:hover:text-brand-300',
          className,
        )}
      >
        {children}
      </Button>
    </div>
  )
}
