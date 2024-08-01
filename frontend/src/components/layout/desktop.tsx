import { Suspense } from 'react'
import { Heading } from '@/components/cult/gradient-heading'
import { Separator } from '@/components/ui/separator'
import { SidebarPanel } from './sidebar-panel'

export function DesktopLayout({ historyChildren, children, user }) {
  return (
    <div className="flex h-full items-stretch dark:bg-stone-800 bg-stone-100">
      <SidebarPanel user={user?.id}>
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
          <Heading variant="secondary" size={'xxs'}>
            History
          </Heading>
          <div className="">{user ? historyChildren : null}</div>
        </Suspense>
      </SidebarPanel>
      <div className="flex-grow rounded-lg flex flex-col items-center w-full">
        {children}
      </div>
    </div>
  )
}