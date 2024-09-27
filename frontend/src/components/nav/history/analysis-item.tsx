'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileTextIcon } from 'lucide-react'

import { useCollapsedState } from '@/hooks/use-vector-blob'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn } from '@/lib/utils'

interface DocumentAnalysis {
    id: string;
    path: string;
    title: string;
    messages: any[];
    createdAt: string;
    filePaths: string[];
}

interface AnalysisItemProps {
  index: number
  analysis: DocumentAnalysis
  children: React.ReactNode
}

export function AnalysisItem({ index, analysis, children }: AnalysisItemProps) {
  const pathname = usePathname()
  const isActive = pathname === analysis.path
  const [newAnalysisId, setNewAnalysisId] = useLocalStorage('newAnalysisId', null)
  const shouldAnimate = index === 0 && isActive && newAnalysisId
  const { isGlobalCollapsed } = useCollapsedState()

  if (!analysis?.id) return null

  return (
    <motion.div
      className={cn('relative ', isGlobalCollapsed ? 'h-10' : 'h-8')}
      variants={{
        initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1 },
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{ duration: 0.25, ease: 'easeIn' }}
    >
      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center ">
        {!isGlobalCollapsed && !isActive ? (
          <AnalysisTypeIcon isActive={isActive} />
        ) : null}
      </div>
      <div className="mr-0 max-w-[95%]">
        <Link
          href={analysis.path}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'group w-full px-8 transition-colors',
            isActive && 'pr-4 pl-14 font-semibold dark:bg-[#040404] border dark:border-brand-50/10 dark:text-white bg-neutral-100/50 hover:bg-neutral-100/70 hover:text-black border-black/5 text-black',
            !isActive && 'dark:hover:bg-transparent dark:hover:text-stone-100 text-muted-foreground z-10 hover:bg-transparent hover:text-stone-900',
            isGlobalCollapsed && 'pl-2 pr-2 w-[70px]',
            isGlobalCollapsed && isActive && 'dark:bg-black/80 dark:text-white bg-neutral-100/50 hover:bg-black hover:text-white text-black pl-2 pr-2 w-[70px]',
          )}
        >
          <div
            className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
            title={analysis.title}
          >
            <span className="whitespace-nowrap">
              {!isGlobalCollapsed ? analysis.title : (
                isActive ? (
                  <div className="-top-2 absolute left-0">{children}</div>
                ) : (
                  <AnalysisTypeIcon isActive={isActive} isGlobalCollapsed={isGlobalCollapsed} />
                )
              )}
            </span>
          </div>
        </Link>
      </div>
      {isActive && !isGlobalCollapsed ? (
        <div className="absolute left-1 top-1">{children}</div>
      ) : null}
    </motion.div>
  )
}

function AnalysisTypeIcon({ isActive, isGlobalCollapsed = false }) {
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger tabIndex={-1} className="focus:bg-muted focus:ring-1 focus:ring-ring ">
        <FileTextIcon
          className={cn(
            'h-5 w-5 text-muted-foreground',
            isGlobalCollapsed ? 'ml-2' : '',
            isActive && 'text-foreground',
          )}
        />
      </TooltipTrigger>
      <TooltipContent>This is a document analysis.</TooltipContent>
    </Tooltip>
  )
}