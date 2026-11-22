import { useState } from 'react'
import type { ChatMessage, MessageAuthor } from './types/chat'
import ChatComposer from './components/ChatComposer'
import ChatHistory from './components/ChatHistory'

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState<MessageAuthor>('user')

  const sendMessage = () => {
    const content = draft.trim()

    if (!content) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        author,
        content,
        createdAt: Date.now(),
      },
    ])
    setDraft('')
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-950 text-slate-900">
      <div className="mx-auto flex h-full max-w-2xl flex-col px-3 pb-3 sm:px-5 sm:pb-5">
        <ChatHistory messages={messages} />
        <ChatComposer
          draft={draft}
          author={author}
          onDraftChange={setDraft}
          onAuthorChange={setAuthor}
          onSend={sendMessage}
        />
      </div>
    </main>
  )
}