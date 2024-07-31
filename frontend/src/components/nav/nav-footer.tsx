'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

import { HeaderAccountDropdown } from '@/components/header-account-dropdown'
import { ModeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function NavFooter({ isCollapsed, user }) {
  return (
    <div className="mt-auto">
      <div
        className={cn(
          isCollapsed ? 'flex-col items-center' : 'flex-row px-4',
          'flex justify-between pb-6',
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {user ? (
            <HeaderAccountDropdown user={user} />
          ) : (
            <Link
              href="/auth/sign-in"
              className={cn('border-black/10 border space-x-1', 'button-variant-ghost')}
            >
              <span className={cn(isCollapsed ? 'hidden' : '')}>Login</span>
              <LogIn className="h-4 w-4 bg-background/95" />
            </Link>
          )}
        </Suspense>
        <ModeToggle />
      </div>
    </div>
  )
}
