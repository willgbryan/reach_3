'use client'

import { ReactNode } from 'react'

import { ScrollArea } from '../ui/scroll-area'

interface MainPanelLayoutProps {
  children?: ReactNode
  className?: string
}

export function MainPanelLayout({ children, className, ...props }: MainPanelLayoutProps) {
  return (
    <div className="w-full h-full md:h-screen    overflow-y-hidden md:py-2 md:pr-3 md:pl-1 dark:md:py-3 dark:md:pr-3  dark:md:pl-1.5">
      <ScrollArea className=" h-[calc(100vh-30px)] dark:bg-background bg-background md:dark:h-[calc(100vh-24px)] md:h-[calc(100vh-17px)]   w-full rounded-lg border dark:border-white/10 border-black/10">
        <div className="h-full w-full" {...props}>
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}
