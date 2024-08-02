// import { cache } from 'react'

// import { clearChats, getChats } from '@/app/_data/chat'

// import { ClearHistory } from '../chat/chat-clear-history'
// import { HistoryItems, MobileHistoryItems } from './history/history-items'

// interface SidebarListProps {
//   user?: any
//   children?: React.ReactNode
//   isCollapsed?: boolean
//   mobile?: boolean
// }

// // TODO: revalidate tags?
// const loadChats = cache(async (userId?: string | null) => {
//   return await getChats(userId)
// })

// export async function NavHistoryList({ mobile, user }: SidebarListProps) {
//   const chats = await loadChats(user?.id)

//   return (
//     <div className={'flex  flex-col  h-full'}>
//       <div className="flex-1  pb-4">
//         {chats?.length ? (
//           <div className="space-y-2 ">
//             {mobile ? <MobileHistoryItems chats={chats} /> : <HistoryItems chats={chats} />}
//           </div>
//         ) : (
//           <div className="p-4 text-center">
//             <p className="text-sm text-muted-foreground">Empty</p>
//           </div>
//         )}
//       </div>
//       <div className="flex items-start justify-between p-4 pl-2">
//         <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 10} />
//       </div>
//     </div>
//   )
// }
