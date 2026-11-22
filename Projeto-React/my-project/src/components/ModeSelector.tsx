export type ChatMode = 'rapido' | 'especialista'

interface ModeSelectorProps {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
}

const modes: { id: ChatMode; label: string; description: string }[] = [
  { id: 'rapido', label: 'Rápido', description: 'Respostas diretas' },
  { id: 'especialista', label: 'Especialista', description: 'Análise detalhada' },
]

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div
      aria-label="Modo de resposta"
      className="mb-5 flex flex-wrap justify-center gap-2"
      role="group"
    >
      {modes.map((option) => {
        const isSelected = mode === option.id

        return (
          <button
            key={option.id}
            aria-pressed={isSelected}
            className={`mode-option rounded-full border px-4 py-2 text-sm transition-colors ${
              isSelected
                ? 'border-blue-300/40 bg-blue-400/15 text-blue-100'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
            }`}
            onClick={() => onModeChange(option.id)}
            type="button"
          >
            <span className="font-medium">{option.label}</span>
            <span className="ml-2 hidden text-xs opacity-70 sm:inline">
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
