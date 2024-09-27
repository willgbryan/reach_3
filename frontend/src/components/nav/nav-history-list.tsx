import { cache } from 'react'
import { clearChats, getChats } from '@/app/_data/chat'
import { clearAnalyses, getDocumentAnalyses, DocumentAnalysis } from '@/app/_data/document-analysis'
import { ClearHistory } from '../chat/chat-clear-history'
import { HistoryItems, MobileHistoryItems } from './history/history-items'
import { AnalysisItems } from './history/analysis-items'
import { Separator } from '@/components/ui/separator'

interface SidebarListProps {
  user?: any
  children?: React.ReactNode
  isCollapsed?: boolean
  mobile?: boolean
}

const loadChats = cache(async (userId?: string | null) => {
  return await getChats(userId)
})

const loadAnalyses = cache(async (userId?: string | null) => {
  return await getDocumentAnalyses(userId)
})

export async function NavHistoryList({ mobile, user }: SidebarListProps) {
  const chats = await loadChats(user?.id)
  const analyses = await loadAnalyses(user?.id)
  console.log(`analyses: ${analyses}`)
  const hasHistory = (chats?.length ?? 0) > 0 || analyses.length > 0
  return (
    <div className={'flex flex-col h-full'}>
      <div className="flex-1 pb-4">
        {hasHistory ? (
          <div className="space-y-2">
            {(chats?.length ?? 0) > 0 && (
              <>
                {mobile ? <MobileHistoryItems chats={chats ?? []} /> : <HistoryItems chats={chats ?? []} />}
              </>
            )}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No history yet</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center p-4 pl-2">
        <ClearHistory 
          clearChats={clearChats} 
          clearAnalyses={clearAnalyses}
          isEnabled={hasHistory && ((chats?.length ?? 0) + analyses.length > 10)}
        />
      </div>
    </div>
  )
}