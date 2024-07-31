'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { removeChat, shareChat } from '@/app/_data/chat'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'
import { Chat } from '@/types'

import { HistoryActions } from './history-actions'
import { HistoryItem, MobileHistoryItem } from './history-item'

interface HistoryItemsProps {
  chats?: Chat[]
}

export function HistoryItems({ chats }: HistoryItemsProps) {
  if (!chats?.length) return null

  const { isGlobalCollapsed } = useCollapsedState()

  return (
    <ScrollArea className={cn(isGlobalCollapsed ? ' h-[280px]' : 'md:h-96 lg:h-[480px]')}>
      <div className="h-full">
        <AnimatePresence>
          {chats.map(
            (chat, index) =>
              chat && (
                <motion.div
                  key={chat?.id}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                >
                  <HistoryItem index={index} chat={chat}>
                    <HistoryActions
                      chat={chat}
                      removeChat={removeChat}
                      shareChat={() => shareChat(chat)}
                    />
                  </HistoryItem>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>

      <ScrollBar className="bg-background w-[1px] " />
    </ScrollArea>
  )
}

export function MobileHistoryItems({ chats }: HistoryItemsProps) {
  if (!chats?.length) return null

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >
              <MobileHistoryItem index={index} chat={chat}>
                <HistoryActions
                  chat={chat}
                  removeChat={removeChat}
                  shareChat={() => shareChat(chat)}
                />
              </MobileHistoryItem>
            </motion.div>
          ),
      )}
    </AnimatePresence>
  )
}
