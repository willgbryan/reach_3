'use client'

import React from 'react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

export function HeaderAccountDropdown({ user }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} alt="user" />
          <AvatarFallback className="bg-gradient-to-r from-brand-300 to-brand-200 text-white">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 px-0 py-1" align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col text-left text-xs">
            {user.name ? <h2 className="text-[14px] font-medium">@{user.name}</h2> : null}
            <h1>{user.email}</h1>
          </div>
        </div>
        <Separator />
        <div className="py-1">
          {/* <DropdownMenuItem>
            <Link href="/discover" className="flex w-full items-center justify-between gap-2">
              <span>Try Pro</span>
            </Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <Link href="/chat" className="flex w-full items-center justify-between gap-2">
              <span>Home</span>
            </Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <Link href="/library" className="flex w-full items-center justify-between gap-2">
              <span>Library</span>
            </Link>
          </DropdownMenuItem> */}
        </div>
        <Separator />
        <div className="py-1">
          <DropdownMenuItem className="px-2"></DropdownMenuItem>
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
