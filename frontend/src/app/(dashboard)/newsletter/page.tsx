import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { NewsletterForm } from '@/components/newsletter-config'
import { getSession, getUserDetails } from '@/app/_data/user'
import { getNewsletterChats } from '@/app/_data/chat'
import { Chat } from '@/types/index'
import { toast } from "sonner"
import { Carousel, Card } from "@/components/cult/apple-cards-carousel"

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
    const isProduction = process.env.NODE_ENV === 'production';
    const ws_protocol = isProduction ? 'wss://' : 'ws://';
    const ws_host = isProduction ? 'themagi.systems' : 'localhost:8000';
    //PROD
      // const ws_uri = `wss://themagi.systems/ws`;

    //DEV
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
      'in-depth': 'long_newsletter_report'
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
        'in-depth': 'long_newsletter_report'
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

  const groupNewslettersByTitle = (newsletters: Chat[]) => {
    return newsletters.reduce((acc, newsletter) => {
      if (!acc[newsletter.title]) {
        acc[newsletter.title] = []
      }
      acc[newsletter.title].push(newsletter)
      return acc
    }, {} as Record<string, Chat[]>)
  }

  const renderNewsletterCarousels = () => {
    const groupedNewsletters = groupNewslettersByTitle(newsletters)

    return Object.entries(groupedNewsletters).map(([title, newslettersGroup]) => {
      const cards = newslettersGroup.map((newsletter, index) => (
        <Card
          key={newsletter.id}
          card={{
            category: newsletter.payload?.cadence || 'No cadence set',
            title: title,
            src: "",
            content: (
              <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                  <span className="font-bold text-neutral-700 dark:text-neutral-200">
                    {new Date(newsletter.payload?.createdAt).toLocaleDateString()}
                  </span>{" "}
                  {newsletter.messages[0].content.substring(0, 200)}...
                </p>
              </div>
            ),
          }}
          index={index}
        />
      ))

      return (
        <div key={title} className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            {title}
          </h2>
          <Carousel items={cards} />
        </div>
      )
    })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full p-4">
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
      <div className="w-full p-4 overflow-y-auto">
        {renderNewsletterCarousels()}
      </div>
    </div>
  )
}

export default NewsletterPage