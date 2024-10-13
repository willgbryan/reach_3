'use client'
import { Suspense } from 'react'
import { Heading } from '@/components/cult/gradient-heading'
import { NavLinks } from '@/components/nav/nav-links'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarBody } from "@/components/cult/sidebar"
import { useToggleMobileNav } from '@/hooks/use-vector-blob'
import { FreeSearchCounter } from '@/components/free-search-counter'
import { cn } from '@/lib/utils'

export function MobileLayout({ historyChildren, children, user }) {
  const { isMobileNavOpen, setIsMobileNavOpen } = useToggleMobileNav()

  return (
    <div className="flex flex-col h-screen dark:bg-zinc-800 bg-stone-100">
      <Sidebar open={isMobileNavOpen} setOpen={setIsMobileNavOpen}>
        <SidebarBody className="justify-between gap-10 h-full bg-white dark:bg-zinc-800">
          <div className="flex flex-col h-full">
            <div className="px-3 py-2">
              <FreeSearchCounter />
            </div>
            
            <NavLinks isCollapsed={false} />
            <div className="pr-4">
              <Separator className="my-2" />
            </div>
            <Suspense
              fallback={
                <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto pl-2 pr-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-6 rounded-md shrink-0 animate-pulse bg-neutral-200 dark:bg-neutral-800"
                    />
                  ))}
                </div>
              }
            >
              <Heading variant="default" size={'xxs'}>
                History
              </Heading>
              <ScrollArea className="flex-grow">
                {user ? historyChildren : null}
              </ScrollArea>
            </Suspense>
            <div className="mt-auto">
              {/* <NavFooter isCollapsed={false} user={user} /> */}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-grow rounded-lg flex flex-col items-center w-full overflow-auto">
        {children}
      </main>
    </div>
  )
}
