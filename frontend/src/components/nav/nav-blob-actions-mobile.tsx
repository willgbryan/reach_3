// 'use client'

// import { useRouter } from 'next/navigation'
// import { FolderPlusIcon, PanelRightOpen, Search, Trash } from 'lucide-react'

// import { FadeInSmall } from '@/components/animations/fade-in'
// import { CultButton } from '@/components/cult/cult-button'
// import { SIZE_PRESETS, useDynamicBlobSize } from '@/components/cult/dynamic-blob'
// import { useGetDocumentSets } from '@/hooks/use-get-document-sets'
// import { useStage, useToggleMobileNav } from '@/hooks/use-vector-blob'

// export function MobileNavSearchActions({ messages, handleReset, isChat = false }) {
//   const { data, isLoading } = useGetDocumentSets() // fetch users previous document sets
//   const router = useRouter()
//   const { setStage } = useStage()

//   const { setSize } = useDynamicBlobSize()
//   const { setIsMobileNavOpen } = useToggleMobileNav()

//   function handleSearch() {
//     setStage('reset-search')
//     router.push('/chat')
//     setSize(SIZE_PRESETS.LONG)
//   }

//   function handleUpload() {
//     router.push('/chat')
//     setStage('reset')
//     setSize(SIZE_PRESETS.COMPACT)
//   }

//   function handleOpenNav() {
//     setIsMobileNavOpen(true)
//   }

//   return (
//     <div className="flex  items-center justify-center rounded-t-md bg-transparent w-full">
//       <div className="flex-row items-center justify-center flex w-full max-w-[250px] gap-2 group">
//         {isChat && !isLoading ? (
//           <FadeInSmall>
//             <CultButton className="p-5" handleClick={handleUpload}>
//               <FolderPlusIcon className="h-5 w-5 " />
//             </CultButton>
//           </FadeInSmall>
//         ) : null}

//         {isChat && data ? (
//           <FadeInSmall>
//             <CultButton className="p-5" handleClick={handleSearch}>
//               <Search className="h-5 w-5 " />
//             </CultButton>
//           </FadeInSmall>
//         ) : null}

//         {data ? (
//           <div className="md:hidden">
//             <FadeInSmall>
//               <CultButton className="p-5" handleClick={handleOpenNav}>
//                 <PanelRightOpen className="h-5 w-5 " />
//               </CultButton>
//             </FadeInSmall>
//           </div>
//         ) : null}

//         {isChat && messages.length > 1 ? (
//           <FadeInSmall>
//             <CultButton className="p-5" handleClick={handleReset}>
//               <Trash className="h-5 w-5 " />
//             </CultButton>
//           </FadeInSmall>
//         ) : null}
//       </div>
//     </div>
//   )
// }
