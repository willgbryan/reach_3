import React from 'react'
import { type Message } from 'ai'
import { LayoutGroup } from 'framer-motion'

import { AnswerCard } from './chat-answer'

export interface ChatList {
  messages: Message[]
  sources: any
}

export function ChatList({ messages, sources }: ChatList) {
  if (!messages.length) {
    return null
  }

  const aiAnswer = messages.filter((message) => message.role !== 'user')
  const userQuestion = messages.filter((message) => message.role === 'user')

  return (
    <div className="relative mx-auto max-w-5xl px-4">
      <LayoutGroup>
        {aiAnswer.map((answer, i) => {
          const isCurrentAnswer = aiAnswer.length - 1 === i
          const currentQuestion = userQuestion[i]
          const sourceKey = (2 * i + 1).toString()
          const sourceData = sources && sourceKey in sources ? sources[sourceKey] : null

          return (
            <AnswerCard
              sources={sourceData}
              question={currentQuestion?.content}
              key={`${aiAnswer[aiAnswer.length - 1]}-container-${i}`}
              answer={answer.content}
              isCurrentAnswer={isCurrentAnswer}
            />
          )
        })}
      </LayoutGroup>
    </div>
  )
}
