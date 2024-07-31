'use client'

import useIsMobile from '@/hooks/use-is-mobile'

import { DesktopLayout } from './desktop'
import { MobileLayout } from './mobile'

export function AppLayout({ historyChildren, children, user }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="dark:bg-white md:hidden">
        <MobileLayout historyChildren={historyChildren} user={user}>
          {children}
        </MobileLayout>
      </div>
    )
  }

  return (
    <div className="dark:bg-white hidden md:block">
      <DesktopLayout historyChildren={historyChildren} user={user}>
        {children}
      </DesktopLayout>
    </div>
  )
}
