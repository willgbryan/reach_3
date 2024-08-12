"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { NewsletterForm } from '@/components/newsletter-config'
import { getSession, getUserDetails } from '@/app/_data/user'
import { getNewsletterChats, NewsletterChat } from '@/app/_data/chat'
import { toast } from "sonner"
import { Carousel, Card } from "@/components/cult/apple-cards-carousel"
import ReactMarkdown from 'react-markdown'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type User = {
  id: string;
};

type FormData = {
  topic: string;
  style: 'succinct' | 'standard' | 'in-depth';
  cadence: string;
};

const SkeletonCard = () => {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }
  
  const SkeletonCarousel = () => {
    return (
      <div className="flex space-x-4 overflow-x-auto p-4">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

const NewsletterPage: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [newsletters, setNewsletters] = useState<NewsletterChat[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const [report, setReport] = useState<string>('')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndNewsletters = async () => {
      setIsLoading(true)
      const session = await getSession()
      if (!session) {
        router.push('/auth/sign-in')
        return
      }

      const userDetails = await getUserDetails()
      setUser(userDetails)

      const fetchedNewsletters = await getNewsletterChats(session.user.id)
      setNewsletters(fetchedNewsletters)
      setIsLoading(false)
    }

    fetchUserAndNewsletters()
  }, [router])

  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production';
    const ws_protocol = isProduction ? 'wss://' : 'ws://';
    const ws_host = isProduction ? 'themagi.systems' : 'localhost:8000';
    //PROD
    // const ws_uri = `wss://themagi.systems/ws`;

    // //DEV
    const ws_uri = `ws://localhost:8000/ws`

    const newSocket = new WebSocket(ws_uri);
    setSocket(newSocket);
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
      setSocket(newSocket);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const waitForSocketConnection = async (socket: WebSocket): Promise<void> => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 10;
      const intervalTime = 1000;
      let currentAttempt = 0;

      const interval = setInterval(() => {
        if (currentAttempt > maxAttempts - 1) {
          clearInterval(interval);
          reject(new Error('Maximum number of attempts exceeded'));
        } else if (socket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    if (!socketRef.current) {
      toast.error("Connection error", {
        description: "WebSocket is not initialized. Please try again later.",
      });
      throw new Error('WebSocket is not initialized');
    }

    try {
      await waitForSocketConnection(socketRef.current);
    } catch (error) {
      toast.error("Connection error", {
        description: "Unable to establish a stable connection. Please try again later.",
      });
      throw error;
    }

    const chatId = nanoid()
    const reportType = {
      'succinct': 'newsletter_paragraph',
      'standard': 'newsletter_report',
      'in-depth': 'detailed_report'
    }[formData.style]

    const requestData = {
      task: formData.topic,
      report_type: reportType,
      sources: ['WEB'],
      style: formData.style,
      cadence: formData.cadence,
      chatId: chatId,
    }

    console.log('Sending data to WebSocket:', requestData)
    socketRef.current.send(JSON.stringify(requestData))

    toast.success("Newsletter generation started", {
      description: `Topic: ${formData.topic}, Style: ${formData.style}, Cadence: ${formData.cadence}`,
    })

    return new Promise((resolve, reject) => {
      let accumulatedReport = ''

      const messageHandler = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.type === 'report') {
          accumulatedReport += data.output
          setReport(prev => prev + data.output)
        }
        if (data.type === 'complete') {
          socketRef.current!.removeEventListener('message', messageHandler)
          saveNewsletter(formData, accumulatedReport, chatId)
            .then(() => resolve())
            .catch(error => reject(error))
        }
      }

      socketRef.current!.addEventListener('message', messageHandler)

      socketRef.current!.onerror = (error) => {
        socketRef.current!.removeEventListener('message', messageHandler)
        reject(error)
      }
    })
  }

  const saveNewsletter = async (formData: FormData, content: string, chatId: string): Promise<void> => {
    try {
      const reportType = {
        'succinct': 'newsletter_paragraph',
        'standard': 'newsletter_report',
        'in-depth': 'detailed_report'
      }[formData.style]

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
          topic: formData.topic,
          style: formData.style,
          reportType: reportType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save newsletter')
      }

      console.log('Newsletter saved successfully')
      toast.success("Newsletter saved successfully", {
        description: `Your ${formData.cadence} newsletter about ${formData.topic} has been saved.`,
        // action: {
        //   label: "View Newsletters",
        //   onClick: () => router.push('/newsletters'),
        // },
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
      throw error
    }
  }

  const getCadenceFromCronExpression = (cronExpression: string): string => {
    switch (cronExpression) {
      case '0 0 * * *':
        return 'Daily'
      case '0 0 * * 0':
        return 'Weekly'
      case '0 0 1 * *':
        return 'Monthly'
      default:
        return 'Custom'
    }
  }

  const groupNewslettersByTitle = (newsletters: NewsletterChat[]) => {
    return newsletters.reduce((acc, newsletter) => {
      if (!acc[newsletter.title]) {
        acc[newsletter.title] = []
      }
      acc[newsletter.title].push(newsletter)
      return acc
    }, {} as Record<string, NewsletterChat[]>)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  }

  const renderNewsletterCarousels = () => {
    if (isLoading) {
      return [...Array(3)].map((_, index) => (
        <div key={index} className="mb-8">
          <SkeletonCarousel />
          <div className="mb-4"></div>
          <Separator />
        </div>
      ))
    }

    const groupedNewsletters = groupNewslettersByTitle(newsletters)

    return Object.entries(groupedNewsletters).map(([title, newslettersGroup]) => {
      const cards = newslettersGroup.map((newsletter, index) => (
        <Card
          key={index}
          card={{
            category: `${getCadenceFromCronExpression(newsletter.cron_expression)} ${formatDate(newsletter.createdAt)}`,
            title: newsletter.title,
            src: "",
            content: (
              <div className="bg-[#e4e4e4] p-8 rounded-3xl mb-4 overflow-auto max-h-[60vh]">
                <ReactMarkdown 
                  className="text-stone-900 text-base md:text-xl font-sans prose prose-invert max-w-3xl mx-auto prose-a:text-blue-400 hover:prose-a:text-blue-300"
                  components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                  }}
                >
                  {newsletter.messages[1].content}
                </ReactMarkdown>
              </div>
            ),
          }}
          index={index}
        />
      ))

      return (
        <div key={title} className="">
          <Carousel items={cards} />
          <div className="mb-4"></div>
          <Separator/>
        </div>
      )
    })
  }

  return (
    <div className="flex h-screen bg-[#e4e4e4] text-white">
      <div className="w-1/3 h-full overflow-y-auto p-8">
        <NewsletterForm onSubmit={handleFormSubmit}/>
        <div className="mb-4"></div>
        <Separator/>
        {report && (
          <div className="mt-4">
            <h3 className="text-xl mb-2 text-stone-900">First Report</h3>
            <div className="text-stone-900 h-72 overflow-auto bg-brand rounded-md">
              {report}
            </div>
          </div>
        )}
      </div>
      <Separator orientation="vertical" />
      <div className="w-2/3 h-full overflow-y-auto p-8">
        {renderNewsletterCarousels()}
      </div>
    </div>
  )
}

export default NewsletterPage