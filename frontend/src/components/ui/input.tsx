import * as React from 'react'

import { cn } from '@/lib/utils'

function SearchIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-5 w-5"
    >
      <path
        {...props}
        d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasIcon?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

const InputButton = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onKeyDown, hasIcon, children, ...props }, ref) => {
    return (
      <div className="mt-2 flex  rounded-md ">
        <div
          className={cn(
            // 'relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-neutral-100/20 before:opacity-0 before:ring-2 before:ring-neutral-100/40 before:transition dark:before:border-brand-400/40 dark:before:ring-2 dark:before:ring-brand-500/0',
            'input-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition',
            'focus-within:before:opacity-100 focus-within:after:shadow-brand-100/20  dark:focus-within:after:shadow-brand-500/80',
            'relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-neutral-100/20 before:opacity-0 before:ring-2 before:ring-brand-100/40 before:transition dark:before:border-brand-400/40 dark:before:ring-2 dark:before:ring-brand-900/40',
            'button-shadow-glow after:pointer-events-none after:absolute after:inset-px after:rounded-[9987px] after:shadow-white/5 after:transition',
          )}
        >
          <input
            type="search"
            onKeyDown={onKeyDown}
            autoComplete="false"
            className={cn(
              'w-full  text-lg font-semibold',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-900 dark:focus:ring-brand-900 ',
              'disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 ',
              'dark:border dark:border-black/40 ',
              'input-shadow rounded-[9988px] !outline-none',
              'relative border border-black/5 bg-black/90 py-4 pl-8 pr-7  shadow-black/5 placeholder:text-stone-400 focus:bg-black ',
              'focus-within:before:opacity-100 focus-within:after:shadow-brand-100/20 dark:after:shadow-brand-500/30 dark:focus-within:after:shadow-brand-500/50',
              'w-full text-lg font-semibold hover:outline-none bg-white hover:bg-neutral-50/80 dark:hover:ring-brand-600/20 hover:ring-black/20 hover:bg-offBlack-950 hover:text-brand-400 dark:hover:ring-2 hover:ring-inset hover:ring-brand-100 focus:ring-brand-100 dark:ring-brand-900 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 dark:border dark:border-black/40 button-shadow rounded-[9988px] !outline-none relative border border-black/5 bg-neutral-50/90 p-4 shadow-black/5 placeholder:text-neutral-400 focus:bg-white text-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-100 dark:shadow-black/10 dark:placeholder:text-neutral-500 ',
              ' focus:bg-neutral-50/80 dark:focus:ring-brand-600/20 focus:ring-black/20 focus:bg-offBlack-950 focus:text-brand-400 dark:focus:ring-2 focus:ring-inset focus:ring-brand-100  dark:ring-brand-900 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 dark:border dark:border-black/40 button-shadow rounded-[9988px] !outline-none relative border border-black/5 bg-neutral-50/90 p-4 shadow-black/5 placeholder:text-neutral-400  text-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-100 dark:shadow-black/10 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900 dark:focus:text-brand-50',
              'dark:focus:bg-black',
              className,
            )}
            ref={ref}
            {...props}
          />
          {hasIcon ? (
            <div
              className="pointer-events-none absolute inset-y-0 left-0  
                    flex items-center  
                    pl-5"
            >
              <SearchIcon className="stroke-stone-500/70" />
            </div>
          ) : null}
        </div>
        {children}
      </div>
    )
  },
)

InputButton.displayName = 'InputButton'

export { Input, InputButton }
