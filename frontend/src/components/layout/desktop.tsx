import { Suspense } from 'react'

import { Heading } from '@/components/cult/gradient-heading'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'

import { SidebarPanel } from './sidebar-panel'

export function DesktopLayout({ historyChildren, children, user }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch dark:bg-black bg-offBlack-950"
    >
      <SidebarPanel user={user?.id}>
        <div className="pr-4">
          <Separator className="my-2 " />
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
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={83} className=" rounded-lg flex flex-col items-center w-full ">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
