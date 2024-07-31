'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

import { IconSpinner } from '@/components/ui/icons'
import { InputButton } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function Search() {
  let { replace } = useRouter()
  let pathname = usePathname()

  let [isPending, startTransition] = useTransition()

  let debouncedSearch = debounce((value) => {
    let params = new URLSearchParams(window.location.search)
    if (value) {
      params.delete('tag')
      params.delete('categoryId')
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page')
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 200)

  const handleInputChange = (e) => {
    // @ts-ignore
    debouncedSearch(e.target.value)
  }

  return (
    <div className="relative md:min-w-[500px] max-w-[45ch]">
      <InputButton
        hasIcon
        id="search"
        className={cn('relative pr-10 pl-12 shadow-sm md:py-5  ')}
        tabIndex={0}
        onChange={handleInputChange}
        placeholder="Search all documents"
        spellCheck={false}
        enterKeyHint="go"
      >
        <div className="relative -ml-10 hidden items-center justify-center md:flex">
          <div className="absolute ml-4 w-14 rounded-r-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <AnimatePresence>
                  {isPending ? (
                    <IconSpinner className="-ml-0.5 h-7 w-7 animate-spin stroke-teal-500/80 group-hover:text-teal-500  dark:stroke-teal-400 dark:group-hover:text-teal-300" />
                  ) : null}
                </AnimatePresence>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </InputButton>
    </div>
  )
}

const debounce = (func, delay) => {
  let inDebounce

  return function () {
    const context = this
    const args = arguments

    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}
