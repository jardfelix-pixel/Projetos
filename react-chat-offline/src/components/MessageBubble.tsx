import type { ChatMessage } from '../types/chat'

type MessageBubbleProps = {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.author === 'user'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] sm:text-base ${
          isUser
            ? 'rounded-br-md bg-blue-500 text-white'
            : 'rounded-bl-md bg-white text-slate-900'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
