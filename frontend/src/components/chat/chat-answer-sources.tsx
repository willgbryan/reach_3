// import * as React from 'react'
// import { motion, Variants } from 'framer-motion'
// import { LinkIcon, ListIcon } from 'lucide-react'
// import Balancer from 'react-wrap-balancer'

// import { FadeIn } from '@/components/animations/fade-in'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
// import { cn, pluralize, truncateLongFileName, truncateLongUrl } from '@/lib/utils'

// export type Source = {
//   reference: string
//   url: string
//   source?: string
//   pageContent?: string
//   metadata?: any
// }

// type SourcesProps = {
//   sources: Source[]
// }

// type ToggleFunction = () => void
// export const useToggle = (initialState: boolean = false): [boolean, ToggleFunction] => {
//   // Initialize the state
//   const [state, setState] = React.useState<boolean>(initialState)
//   // Define and memoize toggler function in case we pass down the component,
//   const toggle = React.useCallback((): void => setState((state) => !state), [])
//   return [state, toggle]
// }

// const animateList: Variants = {
//   hidden: { opacity: 1, scale: 0 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       delayChildren: 1.1,
//       staggerChildren: 0.2,
//     },
//   },
// }

// const animateItem: Variants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//   },
// }

// export function Sources({ sources }: SourcesProps): React.ReactElement {
//   const [isOpen, toggleIsOpen] = useToggle()

//   return (
//     <div className="my-2 ml-4 w-[300px] sm:w-[400px]  md:w-[600px]">
//       <Collapsible open={isOpen} onOpenChange={toggleIsOpen} className=" space-y-2">
//         <div className="flex  justify-between">
//           <Header sources={sources} />
//           <div>
//             <CollapsibleTrigger asChild>
//               <Button variant="ghost" size="sm" className="mt-2 w-9 p-0">
//                 <ListIcon className="h-4 w-4" />
//               </Button>
//             </CollapsibleTrigger>
//           </div>
//         </div>
//         <PillList sources={sources} />
//         <FadeIn>
//           <ContentList sources={sources} isOpen={isOpen} />
//         </FadeIn>
//       </Collapsible>
//     </div>
//   )
// }

// type HeaderProps = {
//   sources: Source[]
// }

// function Header({ sources }: HeaderProps): React.ReactElement {
//   const sourceCount = `${sources.length} ${pluralize('Source', sources.length)}`

//   return (
//     <div className="mt-1 flex items-center justify-between space-x-4 pr-4">
//       <div className="flex gap-2 pl-2">
//         <LinkIcon className="h-3 w-3  stroke-stone-400 dark:stroke-stone-400" />
//         <p className="font-aboreto text-xs font-bold leading-tight tracking-wide text-stone-600 dark:text-stone-400">
//           {sourceCount}
//         </p>
//       </div>
//     </div>
//   )
// }

// type PillListProps = {
//   sources: Source[]
// }

// function PillList({ sources }: PillListProps): React.ReactElement {
//   return (
//     <motion.ul
//       variants={animateList}
//       initial="hidden"
//       animate="visible"
//       className="flex flex-wrap gap-2 after:mb-2"
//     >
//       {sources.map((source, i) => (
//         <PillListItem key={`${source?.metadata.id}-${i}`} order={i} source={source?.metadata} />
//       ))}
//     </motion.ul>
//   )
// }

// type PillListItemProps = {
//   order: number
//   source: Source
// }

// function PillListItem({ order, source }: PillListItemProps): React.ReactElement {
//   const srcLength = 15

//   const formattedSource = source.url
//     ? truncateLongUrl(source.url, srcLength)
//     : truncateLongFileName(source.source ?? '', srcLength)

//   if (source.url) {
//     return (
//       <motion.li
//         variants={animateItem}
//         className=" group block max-w-lg cursor-pointer rounded-full "
//       >
//         <motion.a
//           href={source.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className=" group flex items-center gap-x-1 divide-x divide-stone-500/70 rounded-full  bg-transparent p-1 transition  duration-300 dark:border-stone-400/50 md:gap-x-2 md:p-2"
//         >
//           <Pill order={order} source={formattedSource} />
//         </motion.a>
//       </motion.li>
//     )
//   }

//   return (
//     <motion.li variants={animateItem} className="group block max-w-lg cursor-default rounded-full ">
//       {/* <motion.div className="group-hover:border-violet-10 group flex items-center gap-x-1 divide-x divide-stone-500/70 rounded-full border border-stone-700/50 bg-transparent p-1 transition  duration-300 dark:border-stone-400/50 md:gap-x-2 md:p-2"> */}
//       <Pill order={order} source={formattedSource} />
//       {/* </motion.div> */}
//     </motion.li>
//   )
// }

// type PillProps = {
//   order: number
//   source: string
// }

// function Pill({ order, source }: PillProps): React.ReactElement {
//   return (
//     <>
//       <Badge variant={'outline'}>
//         <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-1.5 transition duration-300 md:pl-2 ">
//           <div className="  group-hover:text-brand-9 text-xs font-bold uppercase leading-none tracking-widest text-stone-600 transition duration-300 selection:bg-brand-800 selection:text-white dark:text-stone-400 dark:group-hover:text-brand-500 sm:text-sm ">
//             {order + 1}
//           </div>
//         </div>
//         <div className="px-1 md:px-3">
//           <div className="divide-mauve-1 border-mauve-6  flex items-center bg-transparent transition duration-300 ">
//             <div className="text-mauve-12 selection:bg-brand-8 group-hover:text-brand-9 dark:group-hover:text-brand-10 font-sans text-xs font-medium transition-all duration-300 selection:text-white sm:text-sm ">
//               {source}
//             </div>
//           </div>
//         </div>
//       </Badge>
//     </>
//   )
// }

// type ContentListProps = {
//   sources: Source[]
//   isOpen: boolean
// }

// function ContentList({ sources, isOpen }: ContentListProps): React.ReactElement {
//   return (
//     <CollapsibleContent className=" pt-3">
//       <ul className="my-2 flex  flex-col gap-3">
//         <FadeIn>
//           {sources.map((source, i) => (
//             <li key={`document-${i}`} className="max-w-[390px] sm:max-w-[750px] ">
//               <Content
//                 key={`document-${i}`}
//                 order={i}
//                 isOpen={isOpen}
//                 sourceContent={source.metadata.chunk}
//               />
//             </li>
//           ))}
//         </FadeIn>
//       </ul>
//     </CollapsibleContent>
//   )
// }

// type ContentProps = {
//   order: number
//   sourceContent?: string
//   isOpen: boolean
// }

// function Content({ order, sourceContent, isOpen }: ContentProps): React.ReactElement {
//   return (
//     <div className=" group mb-4 block  cursor-pointer ">
//       <div className="group-hover:border-pink-10 group flex items-center rounded-xl  bg-transparent  transition duration-300 sm:gap-x-2">
//         <div className=" bg-transparent pr-2 transition duration-300 ">
//           <div className=" font-aboreto text-mauve-11 selection:bg-brand-8 group-hover:text-brand-9 dark:group-hover:text-brand-10 text-xs font-bold uppercase leading-none tracking-widest transition duration-300 selection:text-white ">
//             {order + 1}
//           </div>
//         </div>
//         <div className="mb-2 mr-2">
//           <div className="flex  items-center gap-x-1  bg-transparent transition duration-300 ">
//             {isOpen ? <AnimatedParagraph content={sourceContent} /> : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// type AnimatedParagraphProps = {
//   content?: string
// }

// function AnimatedParagraph({ content }: AnimatedParagraphProps): React.ReactElement | null {
//   const [isClamped, toggleIsClamped] = useToggle()

//   if (content) {
//     return (
//       <p
//         key={content}
//         onClick={toggleIsClamped}
//         className={cn(
//           '  group-hover:text-violet-9  dark:group-hover:text-violet-11 max-w-xs font-sans text-xs text-stone-500 transition-all duration-300 selection:bg-brand-800 selection:text-white sm:max-w-2xl sm:text-sm    ',
//           isClamped ? '' : 'line-clamp-4',
//         )}
//       >
//         <Balancer>{content}</Balancer>
//       </p>
//     )
//   }

//   return null
// }
