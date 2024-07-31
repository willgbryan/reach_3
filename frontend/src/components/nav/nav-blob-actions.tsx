'use client'

import { useRouter } from 'next/navigation'
import { FolderPlusIcon, Plus } from 'lucide-react'

import { FadeInSmall } from '@/components/animations/fade-in'
import { SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
import { useStage } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'

import { CultButtonCollapse } from '../cult/cult-button'

export function NavSearchActions({ isCollapsed }) {
  const { data, isLoading } = useGetDocumentSets() // fetch users previous document sets
  const router = useRouter()
  const { setStage } = useStage()

  const { scheduleAnimation } = useDynamicBlobSize()

  function handleSearch() {
    router.push('/chat')
    setStage('reset-search')
    scheduleAnimation([
      { size: SIZE_PRESETS.COMPACT, delay: 200 },
      { size: SIZE_PRESETS.LONG, delay: 1100 },
    ])
  }

  function handleUpload() {
    router.push('/chat')
    setStage('reset-upload')
    scheduleAnimation([
      { size: SIZE_PRESETS.COMPACT, delay: 200 },
      { size: SIZE_PRESETS.LARGE, delay: 1100 },
    ])
  }
  const showBeam = isCollapsed && !isLoading

  return (
    <div
      className={cn(
        'flex h-[52px] items-center justify-center ',
        isCollapsed ? 'h-[205px] ' : 'px-4 py-8 md:pl-6',
      )}
    >
      <div
        className={cn(
          isCollapsed ? 'flex-col justify-start items-center' : 'flex-row items-center',
          'flex  w-full  gap-[1px] group',
        )}
      >
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/90" />
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/80" />
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/70" />

        {!isLoading ? (
          <FadeInSmall>
            <CultButtonCollapse variant="ghost" isCollapsed={isCollapsed} onClick={handleUpload}>
              <FolderPlusIcon className={cn(isCollapsed ? 'h-6 w-6 ' : 'h-5 w-5 ')} />
            </CultButtonCollapse>
          </FadeInSmall>
        ) : null}

        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/60" />
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/50" />
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/50" />

        {data ? (
          <FadeInSmall>
            <CultButtonCollapse variant="ghost" isCollapsed={isCollapsed} onClick={handleSearch}>
              <span className={cn(isCollapsed ? 'hidden' : 'hidden md:block text-base  ')}>
                Search
              </span>
              <Plus className={cn(isCollapsed ? 'h-6 w-6 ' : 'h-5 w-5 ml-1')} />
            </CultButtonCollapse>
          </FadeInSmall>
        ) : null}

        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/40" />
        <GlowingConnector showBeam={showBeam} round={null} color="bg-brand-500/40" />
        <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
        {isCollapsed ? null : (
          <>
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
            <GlowingConnector showBeam={showBeam} round={'bottom'} color="bg-brand-500/30" />
          </>
        )}
      </div>
    </div>
  )
}

function GlowingConnector({ showBeam, round, color }) {
  const getRoundClass = () => {
    if (round === 'top') {
      return showBeam ? 'rounded-t-2xl' : 'rounded-l-2xl'
    } else if (round === 'bottom') {
      return showBeam ? 'rounded-b-2xl' : 'rounded-r-2xl'
    }
    return '' // No rounding if neither 'top' nor 'bottom' is passed
  }

  const roundClass = getRoundClass()
  const baseClass = showBeam
    ? `h-[6px] delay-150 transition-colors ${color} group-hover:bg-brand-500`
    : 'h-[4px] dark:bg-neutral-300/5 bg-[#2A2A27]/5 group-hover:bg-brand-500/50 delay-150 transition-colors'

  return <div className={cn(roundClass, baseClass, 'w-1')}></div>
}
