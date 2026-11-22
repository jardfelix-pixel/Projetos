import type { MessageAuthor } from '../types/chat'

type AuthorToggleProps = {
  author: MessageAuthor
  onChange: (author: MessageAuthor) => void
}

export default function AuthorToggle({ author, onChange }: AuthorToggleProps) {
  const isRobot = author === 'robot'

  return (
    <button
      type="button"
      aria-label={`Enviar como ${isRobot ? 'robô' : 'usuário'}. Clique para alternar`}
      aria-pressed={isRobot}
      onClick={() => onChange(isRobot ? 'user' : 'robot')}
      className={`flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${
        isRobot
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {isRobot ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect x="4" y="7" width="16" height="12" rx="3" />
          <path d="M9 12h.01M15 12h.01M8 19v2M16 19v2M12 7V3M9.5 3h5" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
        </svg>
      )}
      {isRobot ? 'Robô' : 'Usuário'}
    </button>
  )
}
