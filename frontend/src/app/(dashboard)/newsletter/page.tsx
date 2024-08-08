'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { NewsletterForm } from '@/components/newsletter-config'
import { getSession, getUserDetails } from '@/app/_data/user'
import { getNewsletterChats } from '@/app/_data/chat'
import { Chat } from '@/types/index'

type User = {
  id: string;
};

type FormData = {
  topic: string;
  style: string;
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

  const handleFormSubmit = async (formData: FormData) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open')
      return
    }

    const chatId = nanoid()
    const requestData = {
      task: formData.topic,
      report_type: "newsletter",
      style: formData.style,
      cadence: formData.cadence,
      chatId: chatId,
    }

    console.log('Sending data to WebSocket:', requestData)
    socketRef.current.send(JSON.stringify(requestData))

    let accumulatedReport = ''

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type === 'report') {
        accumulatedReport += data.output
        setReport(prev => prev + data.output)
      }
      if (data.type === 'complete') {
        saveNewsletter(formData, accumulatedReport, chatId)
      }
    }
  }

  const saveNewsletter = async (formData: FormData, content: string, chatId: string) => {
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
            { role: 'user', content: `Generate a ${formData.style} newsletter about ${formData.topic}` },
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
      // Refresh the newsletters list
      if (user) {
        const updatedNewsletters = await getNewsletterChats(user.id)
        setNewsletters(updatedNewsletters)
      }
    } catch (error) {
      console.error('Error saving newsletter:', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4">
        <NewsletterForm onSubmit={handleFormSubmit} />
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Your Newsletters</h2>
          <ul>
            {newsletters.map((newsletter) => (
              <li key={newsletter.id} className="mb-2">
                {newsletter.title} - {newsletter.payload?.cadence || 'No cadence set'}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <h2 className="text-2xl mb-4">Generated Report</h2>
        <div className="border p-4 h-full overflow-auto">
          {report}
        </div>
      </div>
    </div>
  )
}

export default NewsletterPage