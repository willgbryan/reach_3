'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { LoaderIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useCollapsedState } from '@/hooks/use-vector-blob'
import { ServerActionResult } from '@/types'

interface ClearHistoryProps {
  isEnabled: boolean
  clearChats: () => ServerActionResult<void>
  clearAnalyses: () => ServerActionResult<void>
}

export function ClearHistory({ isEnabled = false, clearChats, clearAnalyses }: ClearHistoryProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()
  const { isGlobalCollapsed } = useCollapsedState()

  const handleClear = async () => {
    try {
      await clearChats()
      await clearAnalyses()
      setOpen(false)
      router.push('/')
      toast.success('History cleared successfully')
    } catch (error) {
      toast.error('Failed to clear history')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {isEnabled ? (
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            disabled={!isEnabled || isPending}
            className="hover:bg-red-500/50 group"
          >
            {isPending && <LoaderIcon className="mr-2" />}
            {isGlobalCollapsed ? (
              <Trash className="h-5 w-5 text-neutral-500 group-hover:text-red-50" />
            ) : (
              'Clear All History'
            )}
          </Button>
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your chat history and document analyses, removing all data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              startTransition(() => {
                handleClear()
              })
            }}
          >
            {isPending && <LoaderIcon className="mr-2 animate-spin" />}
            Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}