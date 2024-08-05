// 'use client'
// import { useState, useRef, useEffect } from 'react'
// import { useChat } from 'ai/react'
// import { toast } from 'sonner'

// export function useVectorChat(id, docSetName, initialMessages, initialSources, edits = '') {
//   const [sourcesForMessages, setSourcesForMessages] = useState(() => initialSources)
//   const [accumulatedData, setAccumulatedData] = useState('')
//   const wsRef = useRef(null)

//   const { 
//     messages, 
//     append, 
//     reload, 
//     isLoading, 
//     input, 
//     setInput, 
//     setMessages, 
//     stop 
//   } = useChat({
//     initialMessages,
//     api: `/api/chat`,
//     id,
//     body: {
//       id,
//       setName: docSetName,
//       sources: sourcesForMessages,
//       ...(edits && { edits }),
//     },
//     onResponse,
//     onError,
//   })

//   useEffect(() => {
//     console.log('useChat hook initialized');
//     return () => {
//       console.log('useChat hook cleanup');
//     }
//   }, []);

//   useEffect(() => {
//     console.log('accumulatedData updated:', accumulatedData);
//   }, [accumulatedData]);

//   function onResponse(response) {
//     console.log('onResponse called', response);
//     const reader = response.body.getReader()
//     const decoder = new TextDecoder()
  
//     async function readStream() {
//       console.log('readStream started');
//       try {
//         while (true) {
//           const { done, value } = await reader.read()
//           if (done) {
//             console.log('Stream complete');
//             break;
//           }
//           const chunk = decoder.decode(value)
//           console.log('Received chunk:', chunk);
          
//           // Process the chunk
//           const lines = chunk.split('\n')
//           for (let line of lines) {
//             if (line.trim() !== '') {
//               try {
//                 const data = JSON.parse(line)
//                 console.log('Parsed data:', data);
//                 if (data.type === 'report') {
//                   setAccumulatedData(prev => {
//                     console.log('Updating accumulatedData:', prev + data.output);
//                     return prev + data.output;
//                   })
//                 }
//               } catch (parseError) {
//                 console.error('Error parsing JSON:', parseError)
//                 console.log('Problematic line:', line)
//               }
//             }
//           }
//         }
//       } catch (streamError) {
//         console.error('Error reading stream:', streamError)
//       }
//     }
  
//     readStream()
//   }

//   function onError(e) {
//     console.error('Error in useChat:', e);
//     toast(e.message)
//   }

//   return {
//     messages,
//     append,
//     reload,
//     isLoading,
//     input,
//     stop,
//     setInput,
//     setMessages,
//     sourcesForMessages,
//     setSourcesForMessages,
//     accumulatedData,
//   }
// }