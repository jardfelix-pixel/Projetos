import { useState } from 'react'

interface ToggleOptionProps {
  label: string
  pressed: boolean
  onClick: () => void
}

function ToggleOption({ label, pressed, onClick }: ToggleOptionProps) {
  return (
    <button
      aria-pressed={pressed}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-xs transition-colors sm:text-sm ${
        pressed
          ? 'border-blue-300/35 bg-blue-400/15 text-blue-100'
          : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${pressed ? 'bg-blue-300' : 'bg-slate-600'}`}
      />
      {label}
    </button>
  )
}

export function ChatComposer() {
  const [deepThinking, setDeepThinking] = useState(false)
  const [smartSearch, setSmartSearch] = useState(false)

  return (
    <div className="composer w-full rounded-3xl border border-white/10 bg-slate-950/70 p-3 shadow-2xl shadow-black/20 transition-colors focus-within:border-blue-300/35 sm:p-4">
      <label className="sr-only" htmlFor="message">
        Escreva sua mensagem
      </label>
      <textarea
        className="min-h-28 w-full resize-none bg-transparent px-2 py-2 text-base leading-relaxed text-slate-100 outline-none placeholder:text-slate-500 sm:min-h-32 sm:px-3"
        id="message"
        placeholder="Escreva sua mensagem..."
        rows={3}
      />

      <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <ToggleOption
            label="Pensamento profundo"
            onClick={() => setDeepThinking((enabled) => !enabled)}
            pressed={deepThinking}
          />
          <ToggleOption
            label="Pesquisa Inteligente"
            onClick={() => setSmartSearch((enabled) => !enabled)}
            pressed={smartSearch}
          />
        </div>

        <button
          aria-label="Enviar mensagem"
          className="send-button inline-flex size-11 shrink-0 items-center justify-center self-end rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 sm:self-auto"
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="20"
            viewBox="0 0 20 20"
            width="20"
          >
            <path
              d="M10 15.833V4.167m0 0L4.75 9.417M10 4.167l5.25 5.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
