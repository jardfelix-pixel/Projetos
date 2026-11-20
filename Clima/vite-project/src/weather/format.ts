import type { CurrentWeather } from './openMeteo'

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante leve',
  57: 'Garoa congelante intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva intensa',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante intensa',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve intensa',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  85: 'Pancadas de neve leves',
  86: 'Pancadas de neve intensas',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  97: 'Trovoada intensa',
  99: 'Trovoada com granizo intenso',
}

const COMPASS_DIRECTIONS = [
  'Norte',
  'Nordeste',
  'Leste',
  'Sudeste',
  'Sul',
  'Sudoeste',
  'Oeste',
  'Noroeste',
]

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

interface LocalDateTime {
  date: string
  time: string
  hour: number
  minute: number
}

function parseLocalDateTime(value: string, timezone: string): LocalDateTime | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/.exec(value)
  if (!match) {
    return null
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59
  ) {
    return null
  }

  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: timezone })
  } catch (error) {
    if (error instanceof RangeError) {
      return null
    }

    throw error
  }

  // Open-Meteo returns this timestamp in the requested timezone without an offset.
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date)

  return {
    date: dateLabel.charAt(0).toLocaleUpperCase('pt-BR') + dateLabel.slice(1),
    time: `${hourText}:${minuteText}`,
    hour,
    minute,
  }
}

export function getWeatherDescription(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? 'Condição atual indisponível'
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatLocalDateTime(
  value: string,
  timezone: string,
): { date: string; time: string } | null {
  const localDateTime = parseLocalDateTime(value, timezone)
  if (!localDateTime) {
    return null
  }

  return { date: localDateTime.date, time: localDateTime.time }
}

export function getDayPhase(
  current: CurrentWeather,
  timezone: string,
): 'Dia' | 'Noite' | null {
  if (current.isDay !== undefined) {
    return current.isDay === 1 ? 'Dia' : 'Noite'
  }

  const localDateTime = parseLocalDateTime(current.time, timezone)
  if (!localDateTime) {
    return null
  }

  return localDateTime.hour >= 6 && localDateTime.hour < 18 ? 'Dia' : 'Noite'
}

export function formatWindDirection(degrees: number, unit: string): string {
  const normalizedDegrees = ((degrees % 360) + 360) % 360
  const directionIndex = Math.round(normalizedDegrees / 45) % COMPASS_DIRECTIONS.length
  return `${COMPASS_DIRECTIONS[directionIndex]} (${formatNumber(normalizedDegrees)}${unit})`
}
