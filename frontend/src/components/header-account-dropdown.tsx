'use client'
import React from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { User } from 'lucide-react'
import { Separator } from './ui/separator'
import { Button } from './cult/moving-border'

export function HeaderAccountDropdown({ user }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Button
          borderRadius="9999px"
          className="bg-transparent p-0"
          containerClassName="h-8 w-8"
          borderClassName="bg-[radial-gradient(var(--zinc-500)_40%,var(--orange-500)_60%)]"
        >
          <div className="h-full w-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-black dark:text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 px-0 py-1" align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col text-left text-sm">
            {user.name ? <h2 className="font-medium">@{user.name}</h2> : null}
            <h1>{user.email}</h1>
          </div>
        </div>
        <Separator />
        <div className="py-1">
          <DropdownMenuItem>
            <Link href="/profile" className="flex w-full items-center justify-between gap-2">
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/billing" className="flex w-full items-center justify-between gap-2">
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/pricing" className="flex w-full items-center justify-between gap-2">
              <span>Pricing</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <Separator />
        <div className="py-1">
          <DropdownMenuItem>
            <form className="block" action="/auth/sign-out" method="post">
              <button type="submit">Sign out</button>
            </form>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}