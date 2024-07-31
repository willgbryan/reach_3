'use client'

import React, { useEffect } from 'react'

import { ChatMessageActions } from '@/components/chat/chat-blob-actions'
import { DynamicBlob, SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
import { useFileData, usePreviousDocSet, useStage } from '@/hooks/use-vector-blob'

import { InitialChatState } from './chat-states/initial'
import { DocSetFormState } from './upload-states/doc-set-form'
import { DefaultState, InitialUploadState } from './upload-states/initial'
import { UploadLoadingState } from './upload-states/loading'
import { UploadState } from './upload-states/upload'

export function BlobStates({ isLoading, reload, messages, stop, children }) {
  const { scheduleAnimation, state: blobState } = useDynamicBlobSize()
  const { fileData } = useFileData()
  const { previousDocSet } = usePreviousDocSet()
  const { stage } = useStage()

  const isWelcomeAnimation = !fileData && !previousDocSet && stage == 'reset'

  // First Render Animate in
  useEffect(() => {
    if (isWelcomeAnimation) {
      scheduleAnimation([
        { size: SIZE_PRESETS.COMPACT, delay: 1200 },
        { size: SIZE_PRESETS.LARGE, delay: 2100 },
      ])
    }
  }, [])

  // Rig all potential blob states up here
  function renderBlobState() {
    switch (blobState.size) {
      // UPLOAD STAGE
      case SIZE_PRESETS.COMPACT:
        return stage === 'reset-search' ? <InitialChatState /> : <InitialUploadState />
      // Upload File
      case SIZE_PRESETS.LARGE:
        return <UploadState />
      // Set Document Set Name and Embed File
      case SIZE_PRESETS.MEDIUM:
        return <DocSetFormState />
      // Show loading state while embedding
      case SIZE_PRESETS.COMPACT_MEDIUM:
        return <UploadLoadingState />
      // CHAT STAGE
      case SIZE_PRESETS.LONG:
        return children // Chat input passed as children to rig up shared state
      // DEFAULT SIZE
      case SIZE_PRESETS.DEFAULT:
        return <DefaultState />

      default:
        return null // blob defaults to rendering nothing -> fully animate in
    }
  }

  return (
    <>
      <div className="mb-8 flex w-full flex-col items-center justify-center ">
        <ChatMessageActions loading={isLoading} reload={reload} messages={messages} stop={stop} />
        <DynamicBlob id="action-input-qa">{renderBlobState()}</DynamicBlob>
      </div>
    </>
  )
}
