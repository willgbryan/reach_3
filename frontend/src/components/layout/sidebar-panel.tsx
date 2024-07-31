'use client'

import { ReactNode, useState } from 'react'

import { NavSearchActions } from '@/components/nav/nav-blob-actions'
import { NavFooter } from '@/components/nav/nav-footer'
import { NavHeading } from '@/components/nav/nav-heading'
import { NavLinks } from '@/components/nav/nav-links'
import { ResizablePanel } from '@/components/ui/resizable'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'

interface PanelLayoutProps {
  children?: ReactNode // Children for the main panel
  user?: any
}

export function SidebarPanel({ children, user }: PanelLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { setIsGlobalCollapsed } = useCollapsedState()

  // retrieve users collapse preferences
  function handleCollapse(collapsed: boolean) {
    setIsCollapsed(collapsed)
    setIsGlobalCollapsed(collapsed)
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(collapsed)}`
  }

  return (
    <ResizablePanel
      defaultSize={17}
      collapsedSize={6}
      collapsible={true}
      minSize={15}
      maxSize={23}
      onCollapse={handleCollapse}
      className={cn(
        ' dark:py-3 dark:pl-3 dark:pr-1.5 py-2 pl-3 pr-1  dark:bg-black  bg-offBlack-950 ',
        isCollapsed && 'min-w-[110px] relative transition-all duration-300 ease-in-out',
      )}
    >
      <div className="bg-background dark:bg-offBlack-950 h-full flex flex-col rounded-lg border dark:border-white/10 border-black/10">
        <NavHeading isCollapsed={isCollapsed} />
        <NavSearchActions isCollapsed={isCollapsed} />
        <NavLinks isCollapsed={isCollapsed} />

        <div className={cn(isCollapsed ? 'pl-4' : 'pl-3 ')}>{children}</div>
        <NavFooter isCollapsed={isCollapsed} user={user} />
      </div>
    </ResizablePanel>
  )
}
