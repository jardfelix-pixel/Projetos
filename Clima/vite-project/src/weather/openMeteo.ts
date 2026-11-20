export interface CityLocation {
  name: string
  latitude: number
  longitude: number
  countryCode: string
  timezone: string
  region?: string
}

export interface WeatherUnits {
  temperature: string
  humidity: string
  apparentTemperature: string
  precipitationProbability: string
  windSpeed: string
  windDirection: string
}

export interface CurrentWeather {
  time: string
  temperature: number
  humidity: number
  apparentTemperature: number
  isDay?: 0 | 1
  precipitationProbability: number
  windSpeed: number
  windDirection: number
  weatherCode: number
  units: WeatherUnits
}

export interface CityWeather {
  city: CityLocation
  current: CurrentWeather
}

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeatherServiceError'
  }
}

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: timezone })
    return true
  } catch (error) {
    if (error instanceof RangeError) {
      return false
    }

    throw error
  }
}

async function requestJson(url: URL): Promise<unknown> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new WeatherServiceError(
      'O serviço de clima está indisponível no momento. Tente novamente.',
    )
  }

  return response.json()
}

function parseLocation(payload: unknown): CityLocation | null {
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    return null
  }

  const firstResult: unknown = payload.results[0]
  if (!isRecord(firstResult)) {
    return null
  }

  const {
    name,
    latitude,
    longitude,
    country_code: countryCode,
    timezone,
    admin1,
  } = firstResult

  if (
    !isNonEmptyString(name) ||
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude) ||
    !isNonEmptyString(countryCode) ||
    !isNonEmptyString(timezone) ||
    !isValidTimezone(timezone)
  ) {
    return null
  }

  return {
    name,
    latitude,
    longitude,
    countryCode,
    timezone,
    ...(isNonEmptyString(admin1) ? { region: admin1.trim() } : {}),
  }
}

function parseWeather(payload: unknown): CurrentWeather | null {
  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.current_units)) {
    return null
  }

  const current = payload.current
  const units = payload.current_units
  const {
    time,
    temperature_2m: temperature,
    relative_humidity_2m: humidity,
    apparent_temperature: apparentTemperature,
    is_day: isDay,
    precipitation_probability: precipitationProbability,
    wind_speed_10m: windSpeed,
    wind_direction_10m: windDirection,
    weather_code: weatherCode,
  } = current

  const temperatureUnit = units.temperature_2m
  const humidityUnit = units.relative_humidity_2m
  const apparentTemperatureUnit = units.apparent_temperature
  const precipitationProbabilityUnit = units.precipitation_probability
  const windSpeedUnit = units.wind_speed_10m
  const windDirectionUnit = units.wind_direction_10m

  if (
    !isNonEmptyString(time) ||
    !isFiniteNumber(temperature) ||
    !isFiniteNumber(humidity) ||
    !isFiniteNumber(apparentTemperature) ||
    !isFiniteNumber(precipitationProbability) ||
    !isFiniteNumber(windSpeed) ||
    !isFiniteNumber(windDirection) ||
    !isFiniteNumber(weatherCode) ||
    !Number.isInteger(weatherCode) ||
    (isDay !== undefined && isDay !== 0 && isDay !== 1) ||
    !isNonEmptyString(temperatureUnit) ||
    !isNonEmptyString(humidityUnit) ||
    !isNonEmptyString(apparentTemperatureUnit) ||
    !isNonEmptyString(precipitationProbabilityUnit) ||
    !isNonEmptyString(windSpeedUnit) ||
    !isNonEmptyString(windDirectionUnit)
  ) {
    return null
  }

  return {
    time,
    temperature,
    humidity,
    apparentTemperature,
    ...(isDay === 0 || isDay === 1 ? { isDay } : {}),
    precipitationProbability,
    windSpeed,
    windDirection,
    weatherCode,
    units: {
      temperature: temperatureUnit,
      humidity: humidityUnit,
      apparentTemperature: apparentTemperatureUnit,
      precipitationProbability: precipitationProbabilityUnit,
      windSpeed: windSpeedUnit,
      windDirection: windDirectionUnit,
    },
  }
}

async function findCity(name: string): Promise<CityLocation | null> {
  const url = new URL(GEOCODING_ENDPOINT)
  url.search = new URLSearchParams({
    name,
    count: '1',
    language: 'pt',
    format: 'json',
  }).toString()

  return parseLocation(await requestJson(url))
}

export async function getCityWeather(city: CityLocation): Promise<CityWeather | null> {
  if (
    !isNonEmptyString(city.name) ||
    !isFiniteNumber(city.latitude) ||
    !isFiniteNumber(city.longitude) ||
    !isNonEmptyString(city.countryCode) ||
    !isNonEmptyString(city.timezone) ||
    !isValidTimezone(city.timezone)
  ) {
    return null
  }

  const url = new URL(FORECAST_ENDPOINT)
  url.search = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    hourly: 'temperature_2m',
    current:
      'precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code',
    timezone: city.timezone,
  }).toString()

  const current = parseWeather(await requestJson(url))
  return current ? { city, current } : null
}

export async function searchCityWeather(name: string): Promise<CityWeather | null> {
  const normalizedName = name.trim()
  if (!normalizedName) {
    return null
  }

  const city = await findCity(normalizedName)
  if (!city) {
    return null
  }

  return getCityWeather(city)
}
