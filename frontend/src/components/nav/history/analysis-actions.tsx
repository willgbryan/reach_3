'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { LoaderIcon, ShareIcon, TrashIcon } from 'lucide-react'
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ServerActionResult } from '@/types'

interface DocumentAnalysis {
    id: string;
    path: string;
    title: string;
    messages: any[];
    createdAt: string;
    filePaths: string[];
}

interface AnalysisActionsProps {
  analysis: DocumentAnalysis
  removeAnalysis: (args: { id: string; path: string }) => ServerActionResult<void>
  shareAnalysis: (id: string) => ServerActionResult<DocumentAnalysis>
}

export function AnalysisActions({ analysis, removeAnalysis, shareAnalysis }: AnalysisActionsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  return (
    <>
      <div className="space-x-1 mt-1">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Button
              variant="ghost"
              className="w-6 h-6 p-0 hover: hover:text-brand-500 hover:bg-black"
              disabled
              // onClick={() => handleShare()}
            >
              <ShareIcon className="h-4 w-4 text-white" />
              <span className="sr-only">Share</span>
            </Button> */}
          </TooltipTrigger>
          <TooltipContent>Share analysis</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Button
              variant="ghost"
              className="w-6 h-6 p-0 hover:text-red-300 hover:bg-black"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <TrashIcon className="h-4 w-4 text-white" />
              <span className="sr-only">Delete</span>
            </Button> */}
          </TooltipTrigger>
          <TooltipContent>Delete analysis</TooltipContent>
        </Tooltip>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your document analysis and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={(event) => {
                event.preventDefault()
                startRemoveTransition(async () => {
                  const result = await removeAnalysis({
                    id: analysis.id,
                    path: analysis.path,
                  })
                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }
                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push('/')
                  toast.success('Analysis deleted')
                })
              }}
            >
              {isRemovePending && <LoaderIcon className="mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}