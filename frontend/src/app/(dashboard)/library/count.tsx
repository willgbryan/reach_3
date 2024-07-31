/* These components could be useful for tracking user stats */

import { cache } from 'react'
import { Database, File, MessageCircleIcon } from 'lucide-react'

import { getChats } from '@/app/_data/chat'
import { getAllDocuments } from '@/app/_data/document_sections'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const loadDocumentCount = cache(async () => {
  return await getAllDocuments()
})

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function DocumentCount() {
  const count = loadDocumentCount()
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Document Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">25 remaining upload credits</p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Database className="fill-brand-400 stroke-black" />
          <Badge>Example</Badge>
        </CardFooter>
      </Card>
    </div>
  )
}

export async function ChatCount({ user }) {
  const chats = await loadChats(user)

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{chats.length}</div>
          <p className="text-xs text-muted-foreground">500 remaining chat credits</p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <MessageCircleIcon className="fill-brand-400 stroke-black" />
          <Badge>Example</Badge>
        </CardFooter>
      </Card>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton />
          </CardTitle>

          <CardDescription className="text-xs">
            <Skeleton />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Skeleton />
          </div>
          <p className="text-xs text-muted-foreground">
            <Skeleton />
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
