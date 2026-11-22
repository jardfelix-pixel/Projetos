import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types/chat'
import MessageBubble from './MessageBubble'

type ChatHistoryProps = {
  messages: ChatMessage[]
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <section
      aria-label="Histórico do chat"
      className="min-h-0 flex-1 overflow-y-auto px-1 py-4"
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-400">
            Nenhuma mensagem ainda
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </section>
  )
}
