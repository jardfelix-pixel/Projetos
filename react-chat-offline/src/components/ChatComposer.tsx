import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { MessageAuthor } from '../types/chat'
import AuthorToggle from './AuthorToggle'

type ChatComposerProps = {
  draft: string
  author: MessageAuthor
  onDraftChange: (draft: string) => void
  onAuthorChange: (author: MessageAuthor) => void
  onSend: () => void
}

export default function ChatComposer({
  draft,
  author,
  onDraftChange,
  onAuthorChange,
  onSend,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = draft.trim().length > 0

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`
  }, [draft])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (canSend) {
        onSend()
      }
    }
  }

  return (
    <div
      className={`flex items-end gap-2 rounded-2xl border-2 bg-white p-2 shadow-xl transition-colors sm:gap-3 sm:p-3 ${
        author === 'robot' ? 'border-green-500' : 'border-transparent'
      }`}
    >
      <AuthorToggle author={author} onChange={onAuthorChange} />

      <textarea
        ref={textareaRef}
        rows={1}
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite uma mensagem"
        aria-label="Mensagem"
        className="max-h-32 min-h-11 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2.5 text-base leading-6 text-slate-900 outline-none placeholder:text-slate-400"
      />

      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Enviar mensagem"
        className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        Enviar
      </button>
    </div>
  )
}
