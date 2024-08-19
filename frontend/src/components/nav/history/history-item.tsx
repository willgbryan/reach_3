'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageSquareDashedIcon, MessageSquareIcon } from 'lucide-react'

import { useCollapsedState } from '@//hooks/use-vector-blob'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn } from '@/lib/utils'
import { type Chat } from '@/types'

interface HistoryItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function HistoryItem({ index, chat, children }: HistoryItemProps) {
  const pathname = usePathname()

  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive && newChatId
  const { isGlobalCollapsed } = useCollapsedState()

  if (!chat?.id) return null

  return (
    <motion.div
      className={cn('relative ', isGlobalCollapsed ? 'h-10' : 'h-8  ')}
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: 'auto',
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn',
      }}
    >
      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center ">
        {!isGlobalCollapsed && !isActive ? (
          <ItemTypeIcon isActive={isActive} path={chat.path} />
        ) : null}
      </div>
      <div className="mr-0 max-w-[95%]">
        <Link
          href={chat.path}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'group w-full px-8  transition-colors ',
            isActive &&
              ' pr-4 pl-14 font-semibold dark:bg-[#040404] border dark:border-brand-50/10 dark:text-white bg-neutral-100/50 hover:bg-neutral-100/70 hover:text-black border-black/5 text-black',
            !isActive &&
              'dark:hover:bg-transparent dark:hover:text-stone-100 text-muted-foreground z-10 hover:bg-transparent hover:text-stone-900',
            isGlobalCollapsed && ' pl-2 pr-2 w-[70px]',
            isGlobalCollapsed &&
              isActive &&
              ' dark:bg-black/80 dark:text-white bg-neutral-100/50 hover:bg-black hover:text-white text-black pl-2 pr-2 w-[70px]',
          )}
        >
          <div
            className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
            title={chat.title}
          >
            <span className="whitespace-nowrap">
              {shouldAnimate ? (
                chat.title.split('').map((character, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      initial: {
                        opacity: 0,
                        x: -100,
                      },
                      animate: {
                        opacity: 1,
                        x: 0,
                      },
                    }}
                    initial={shouldAnimate ? 'initial' : undefined}
                    animate={shouldAnimate ? 'animate' : undefined}
                    transition={{
                      duration: 0.25,
                      ease: 'easeIn',
                      delay: index * 0.05,
                      staggerChildren: 0.05,
                    }}
                    onAnimationComplete={() => {
                      if (index === chat.title.length - 1) {
                        setNewChatId(null)
                      }
                    }}
                  >
                    {character}
                  </motion.span>
                ))
              ) : (
                <span className="ml-2">
                  {!isGlobalCollapsed ? (
                    chat.title
                  ) : isActive ? (
                    <div className="-top-2 absolute left-0">{children}</div>
                  ) : (
                    <ItemTypeIcon
                      path={chat.path}
                      isGlobalCollapsed={isGlobalCollapsed}
                      isActive={isActive}
                    />
                  )}
                </span>
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

export function MobileHistoryItem({ index, chat, children }: HistoryItemProps) {
  const pathname = usePathname()

  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive && newChatId
  const { isGlobalCollapsed } = useCollapsedState()

  if (!chat?.id) return null

  return (
    <motion.div
      className={cn('relative ', isGlobalCollapsed ? 'h-10' : 'h-7 ')}
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: 'auto',
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn',
      }}
    >
      <div className="absolute left-1 top-2 flex h-6 w-6 items-center justify-center">
        {!isGlobalCollapsed ? <ItemTypeIcon isActive={isActive} path={chat.path} /> : null}
      </div>
      <div className="mr-4">
        <Link
          href={chat.path}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'group w-full px-8  transition-colors ',
            isActive && 'pr-16 font-semibold ',
          )}
        >
          <div
            className="relative text-left max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
            title={chat.title}
          >
            <span className="whitespace-nowrap">
              {shouldAnimate ? (
                chat.title.split('').map((character, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      initial: {
                        opacity: 0,
                        x: -100,
                      },
                      animate: {
                        opacity: 1,
                        x: 0,
                      },
                    }}
                    initial={shouldAnimate ? 'initial' : undefined}
                    animate={shouldAnimate ? 'animate' : undefined}
                    transition={{
                      duration: 0.25,
                      ease: 'easeIn',
                      delay: index * 0.05,
                      staggerChildren: 0.05,
                    }}
                    onAnimationComplete={() => {
                      if (index === chat.title.length - 1) {
                        setNewChatId(null)
                      }
                    }}
                  >
                    {character}
                  </motion.span>
                ))
              ) : (
                <span className="ml-2">
                  {!isGlobalCollapsed ? (
                    chat.title
                  ) : isActive ? (
                    <div className="-top-2 absolute -left-1">{children}</div>
                  ) : (
                    <ItemTypeIcon isActive={isActive} path={chat.path} />
                  )}
                </span>
              )}
            </span>
          </div>
        </Link>
      </div>
      {isActive && !isGlobalCollapsed ? (
        <div className="absolute right-5 top-1">{children}</div>
      ) : null}
    </motion.div>
  )
}

function ItemTypeIcon({ path, isActive, isGlobalCollapsed = false }) {
  if (path) {
    return (
      <Tooltip delayDuration={1000}>
        <TooltipTrigger tabIndex={-1} className="focus:bg-muted focus:ring-1 focus:ring-ring ">
          <MessageSquareDashedIcon
            className={cn(
              'h-5 w-5 text-muted-foreground',
              isGlobalCollapsed ? 'ml-2' : '',
              isActive && 'text-foreground',
            )}
          />
        </TooltipTrigger>
        <TooltipContent>This is a previous chat.</TooltipContent>
      </Tooltip>
    )
  }
  if (!isActive) return <MessageSquareIcon className="mr-2 mt-2 text-muted-foreground" />
  return null
}
