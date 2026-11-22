import { useState } from 'react'
import { ChatComposer } from './components/ChatComposer'
import { ModeSelector, type ChatMode } from './components/ModeSelector'

export default function App() {
  const [mode, setMode] = useState<ChatMode>('rapido')

  return (
    <main className="app-shell relative flex min-h-screen flex-col items-center overflow-hidden px-5 py-8 text-slate-100 sm:px-8 sm:py-10">
      <div aria-hidden="true" className="ambient-glow pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex items-center gap-3">
        <div className="brand-mark flex size-10 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-sm font-bold tracking-wide text-blue-200">
          J
        </div>
        <span className="text-sm font-semibold tracking-[0.16em] text-slate-200 uppercase">
          Jarvis <span className="text-blue-300">de JFELIX</span>
        </span>
      </header>

      <section className="relative z-10 flex w-full max-w-3xl flex-1 flex-col items-center justify-center pb-12">
        <div className="mb-9 text-center">
          <p className="mb-3 text-xs font-medium tracking-[0.22em] text-blue-300/80 uppercase">
            Seu espaço de ideias
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Como posso ajudar?
          </h1>
          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Escolha um modo e comece a escrever.
          </p>
        </div>

        <ModeSelector mode={mode} onModeChange={setMode} />
        <ChatComposer />
      </section>

      <footer className="relative z-10 text-center text-xs text-slate-500">
        Interface de demonstração · sem conexão com IA
      </footer>
    </main>
  )
}
