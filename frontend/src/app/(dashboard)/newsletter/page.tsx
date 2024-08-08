'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { NewsletterForm } from '@/components/newsletter-config'
import { getSession, getUserDetails } from '@/app/_data/user'
import { getNewsletterChats } from '@/app/_data/chat'
import { Chat } from '@/types/index'
import { toast } from "sonner"

type User = {
  id: string;
};

type FormData = {
  topic: string;
  style: 'succinct' | 'standard' | 'in-depth';
  cadence: string;
};

const NewsletterPage: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [newsletters, setNewsletters] = useState<Chat[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const [report, setReport] = useState<string>('')

  useEffect(() => {
    const fetchUserAndNewsletters = async () => {
      const session = await getSession()
      if (!session) {
        router.push('/auth/sign-in')
        return
      }

      const userDetails = await getUserDetails()
      setUser(userDetails)

      const fetchedNewsletters = await getNewsletterChats(session.user.id)
      setNewsletters(fetchedNewsletters)
    }

    fetchUserAndNewsletters()
  }, [router])

  useEffect(() => {
    const ws_uri = `ws://localhost:8000/ws`
    const newSocket = new WebSocket(ws_uri)
    setSocket(newSocket)
    socketRef.current = newSocket

    newSocket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    newSocket.onerror = (error: Event) => {
      console.error("WebSocket error:", error)
    }

    newSocket.onclose = () => {
      console.log("WebSocket connection closed")
    }

    return () => {
      if (newSocket) {
        newSocket.close()
      }
    }
  }, [])

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open')
        reject(new Error('WebSocket is not open'))
        return
      }

      const chatId = nanoid()
      const reportType = {
        'succinct': 'paragraph',
        'standard': 'research_report',
        'in-depth': 'detailed_report'
      }[formData.style]

      const requestData = {
        task: formData.topic,
        report_type: reportType,
        style: formData.style,
        cadence: formData.cadence,
        chatId: chatId,
      }

      console.log('Sending data to WebSocket:', requestData)
      socketRef.current.send(JSON.stringify(requestData))

      toast.success("Newsletter generation started", {
        description: `Topic: ${formData.topic}, Style: ${formData.style}, Cadence: ${formData.cadence}`,
      })

      let accumulatedReport = ''

      socketRef.current.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.type === 'report') {
          accumulatedReport += data.output
          setReport(prev => prev + data.output)
        }
        if (data.type === 'complete') {
          saveNewsletter(formData, accumulatedReport, chatId)
            .then(() => resolve())
            .catch(error => reject(error))
        }
      }
    })
  }

  const saveNewsletter = async (formData: FormData, content: string, chatId: string): Promise<void> => {
    try {
      const response = await fetch('/api/save-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          completion: content,
          messages: [
            { role: 'user', content: `${formData.topic}` },
            { role: 'assistant', content: content }
          ],
          isNewsletter: true,
          cadence: formData.cadence,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save newsletter')
      }

      console.log('Newsletter saved successfully')
      toast.success("Newsletter saved successfully", {
        description: `Your ${formData.cadence} newsletter about ${formData.topic} has been saved.`,
        action: {
          label: "View Newsletters",
          onClick: () => router.push('/newsletters'),
        },
      })

      // Refresh the newsletters list
      if (user) {
        const updatedNewsletters = await getNewsletterChats(user.id)
        setNewsletters(updatedNewsletters)
      }
    } catch (error) {
      console.error('Error saving newsletter:', error)
      toast.error("Failed to save newsletter", {
        description: "An error occurred while saving your newsletter. Please try again.",
      })
      throw error // Re-throw the error to be caught by the Promise in handleFormSubmit
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 flex flex-col">
        <NewsletterForm onSubmit={handleFormSubmit} />
        {report && (
          <div className="mt-8">
            <h3 className="text-xl mb-2">Generated Report</h3>
            <div className="border p-4 h-64 overflow-auto">
              {report}
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2 p-4">
        <ul className="space-y-2">
          {newsletters.map((newsletter) => (
            <li key={newsletter.id} className="border p-2 rounded">
              <h3 className="font-bold">{newsletter.title}</h3>
              <p>Cadence: {newsletter.payload?.cadence || 'No cadence set'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NewsletterPage