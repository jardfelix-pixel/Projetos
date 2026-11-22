import './style.css'
import {
  getCityWeather,
  searchCityWeather,
  WeatherServiceError,
  type CityLocation,
  type CityWeather,
} from './weather/openMeteo'
import {
  formatLocalDateTime,
  formatNumber,
  formatWindDirection,
  getDayPhase,
  getWeatherDescription,
} from './weather/format'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) {
  throw new Error('O elemento principal da aplicação não foi encontrado.')
}

app.innerHTML = `
  <div class="weather-app">
    <h1 class="sr-only">Clima atual por cidade</h1>
    <form class="search-form" id="city-search" role="search">
      <label class="sr-only" for="city-input">Nome da cidade</label>
      <div class="search-field">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8"></circle>
          <path d="m16 16 4.5 4.5"></path>
        </svg>
        <input
          id="city-input"
          name="city"
          type="search"
          placeholder="Digite o nome da cidade"
          autocomplete="off"
          aria-describedby="search-hint"
          aria-required="true"
        />
        <span id="search-hint" class="sr-only">Pressione Enter ou use o botão para consultar.</span>
      </div>
      <button class="search-button" type="submit" aria-label="Buscar clima">
        <span class="button-label">Buscar</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6"></path>
        </svg>
      </button>
    </form>

    <section class="recent-section" id="recent-section" aria-labelledby="recent-heading" hidden>
      <div class="recent-heading-row">
        <h2 id="recent-heading">Últimas cidades pesquisadas</h2>
        <span class="recent-count" id="recent-count"></span>
      </div>
      <ul class="recent-list" id="recent-list"></ul>
      <p class="recent-feedback" id="recent-feedback" role="status" hidden></p>
    </section>

    <section class="weather-panel" aria-label="Condições climáticas">
      <div class="status-panel" id="status-panel" role="status" aria-live="polite" aria-atomic="true">
        <div class="empty-state" id="empty-state">
          <span class="weather-symbol" aria-hidden="true">☁</span>
          <p class="status-title">O clima da sua cidade, em um só lugar</p>
          <p class="status-description">Pesquise uma cidade para consultar as condições atuais.</p>
        </div>
        <div class="loading-state" id="loading-state" hidden>
          <span class="spinner" aria-hidden="true"></span>
          <p class="status-title">Buscando condições atuais...</p>
          <p class="status-description">Isso pode levar alguns segundos.</p>
        </div>
        <div class="error-state" id="error-state" hidden>
          <span class="error-symbol" aria-hidden="true">!</span>
          <p class="status-title">Não encontramos os dados do clima</p>
          <p class="status-description" id="error-message"></p>
        </div>
      </div>

      <div class="weather-result" id="weather-result" aria-live="polite" hidden>
        <aside class="weather-sidebar" aria-label="Resumo do clima">
          <p class="eyebrow">CLIMA AGORA</p>
          <div class="temperature-line">
            <span class="temperature" id="temperature"></span>
            <span class="temperature-unit" id="temperature-unit"></span>
          </div>
          <p class="condition" id="condition"></p>
          <div class="location">
            <a
              class="location-link"
              id="location-map-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
                <circle cx="12" cy="10" r="2.3"></circle>
              </svg>
              <span class="sr-only">Abrir localização no Google Maps (abre em nova guia)</span>
            </a>
            <span class="location-name">
              <strong id="city-name"></strong>
              <span class="state-name" id="state-name"></span>
              <span class="country-code" id="country-code"></span>
            </span>
          </div>
          <div class="sidebar-divider"></div>
          <div class="local-time">
            <span class="small-label">HOJE</span>
            <span id="local-date"></span>
            <span class="clock-line">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>
              <span id="local-time"></span>
            </span>
          </div>
          <div class="day-phase" id="day-phase"></div>
        </aside>

        <div class="weather-details">
          <div class="details-heading">
            <p class="eyebrow">DETALHES DO TEMPO</p>
            <h2>Condições atuais</h2>
          </div>
          <div class="metrics-grid">
            <article class="metric-card">
              <span class="metric-icon humidity-icon" aria-hidden="true">%</span>
              <p class="metric-label">Umidade relativa</p>
              <p class="metric-value"><span id="humidity"></span><span class="metric-unit" id="humidity-unit"></span></p>
            </article>
            <article class="metric-card">
              <span class="metric-icon feels-icon" aria-hidden="true">≈</span>
              <p class="metric-label">Sensação térmica</p>
              <p class="metric-value"><span id="apparent-temperature"></span><span class="metric-unit" id="apparent-unit"></span></p>
            </article>
            <article class="metric-card">
              <span class="metric-icon rain-icon" aria-hidden="true">◌</span>
              <p class="metric-label">Probabilidade de chuva</p>
              <p class="metric-value"><span id="precipitation-probability"></span><span class="metric-unit" id="precipitation-unit"></span></p>
            </article>
            <article class="metric-card">
              <span class="metric-icon wind-icon" aria-hidden="true">↗</span>
              <p class="metric-label">Vento</p>
              <p class="metric-value"><span id="wind-speed"></span><span class="metric-unit" id="wind-speed-unit"></span></p>
              <p class="wind-direction" id="wind-direction"></p>
            </article>
          </div>
          <p class="data-source">Dados meteorológicos por Open-Meteo</p>
        </div>
      </div>
    </section>
  </div>
`

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`O elemento ${selector} não foi encontrado.`)
  }
  return element
}

const form = getElement<HTMLFormElement>('#city-search')
const input = getElement<HTMLInputElement>('#city-input')
const searchButton = getElement<HTMLButtonElement>('.search-button')
const statusPanel = getElement<HTMLDivElement>('#status-panel')
const emptyState = getElement<HTMLDivElement>('#empty-state')
const loadingState = getElement<HTMLDivElement>('#loading-state')
const errorState = getElement<HTMLDivElement>('#error-state')
const weatherResult = getElement<HTMLDivElement>('#weather-result')
const errorMessage = getElement<HTMLParagraphElement>('#error-message')
const locationMapLink = getElement<HTMLAnchorElement>('#location-map-link')
const dayPhaseElement = getElement<HTMLDivElement>('#day-phase')
const recentSection = getElement<HTMLElement>('#recent-section')
const recentList = getElement<HTMLUListElement>('#recent-list')
const recentCount = getElement<HTMLSpanElement>('#recent-count')
const recentFeedback = getElement<HTMLParagraphElement>('#recent-feedback')
const RECENT_CITIES_KEY = 'clima.recent-cities.v1'
const MAX_RECENT_CITIES = 10

let recentCities: CityLocation[] = loadRecentCities()

const brazilianStates: Record<string, string> = {
  acre: 'AC',
  alagoas: 'AL',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceara: 'CE',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  goias: 'GO',
  maranhao: 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  para: 'PA',
  paraiba: 'PB',
  parana: 'PR',
  pernambuco: 'PE',
  piaui: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  rondonia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
}

function formatRegion(region: string | undefined, countryCode: string): string {
  if (!region) {
    return ''
  }

  if (countryCode.toUpperCase() !== 'BR') {
    return region
  }

  const normalizedRegion = region
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')

  return brazilianStates[normalizedRegion] ?? region
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCityLocation(value: unknown): value is CityLocation {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.latitude === 'number' &&
    Number.isFinite(value.latitude) &&
    typeof value.longitude === 'number' &&
    Number.isFinite(value.longitude) &&
    typeof value.countryCode === 'string' &&
    value.countryCode.trim().length > 0 &&
    typeof value.timezone === 'string' &&
    value.timezone.trim().length > 0 &&
    (value.region === undefined || typeof value.region === 'string')
  )
}

function loadRecentCities(): CityLocation[] {
  try {
    const storedCities = localStorage.getItem(RECENT_CITIES_KEY)
    if (!storedCities) {
      return []
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(storedCities)
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        showRecentFeedback(
          'O histórico salvo está inválido e não pôde ser carregado.',
        )
        return []
      }

      throw error
    }

    if (!Array.isArray(parsed)) {
      showRecentFeedback('O histórico salvo possui um formato inválido.')
      return []
    }

    const validCities = parsed.filter(isCityLocation)
    const uniqueCities = validCities.filter(
      (city, index, cities) =>
        cities.findIndex(
          (candidate) =>
            candidate.latitude === city.latitude &&
            candidate.longitude === city.longitude,
        ) === index,
    )

    if (validCities.length !== parsed.length || uniqueCities.length !== validCities.length) {
      showRecentFeedback(
        'Algumas entradas inválidas ou repetidas do histórico foram ignoradas.',
      )
    }

    return uniqueCities.slice(0, MAX_RECENT_CITIES)
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'SecurityError') {
      showRecentFeedback(
        'O navegador não permitiu carregar as pesquisas recentes salvas.',
      )
      return []
    }

    throw error
  }
}

function showRecentFeedback(message: string): void {
  recentFeedback.textContent = message
  recentFeedback.hidden = message.length === 0
}

function renderRecentCities(cities: CityLocation[]): void {
  recentList.replaceChildren()
  recentSection.hidden = cities.length === 0 && recentFeedback.hidden
  recentCount.textContent = cities.length > 0 ? `${cities.length} de ${MAX_RECENT_CITIES}` : ''

  cities.forEach((city, index) => {
    const item = document.createElement('li')
    const button = document.createElement('button')
    const name = document.createElement('span')
    const detail = document.createElement('span')
    const region = formatRegion(city.region, city.countryCode)

    button.type = 'button'
    button.className = 'recent-city'
    button.dataset.recentIndex = String(index)
    button.setAttribute(
      'aria-label',
      `Consultar clima de ${city.name}${region ? `, ${region}` : ''}, ${city.countryCode.toUpperCase()}`,
    )
    name.className = 'recent-city-name'
    name.textContent = city.name
    detail.className = 'recent-city-detail'
    detail.textContent = [region, city.countryCode.toUpperCase()].filter(Boolean).join(' · ')
    button.append(name, detail)
    item.append(button)
    recentList.append(item)
  })
}

function saveRecentCity(city: CityLocation): void {
  const isSameCity = (recentCity: CityLocation): boolean =>
    recentCity.latitude === city.latitude &&
    recentCity.longitude === city.longitude

  recentCities = [
    city,
    ...recentCities.filter((recentCity) => !isSameCity(recentCity)),
  ].slice(0, MAX_RECENT_CITIES)

  renderRecentCities(recentCities)

  try {
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities))
    showRecentFeedback('')
  } catch (error: unknown) {
    if (
      error instanceof DOMException &&
      (error.name === 'SecurityError' || error.name === 'QuotaExceededError')
    ) {
      showRecentFeedback(
        'A cidade foi adicionada à lista, mas não foi possível salvar o histórico neste navegador.',
      )
      return
    }

    if (error instanceof Error) {
      showRecentFeedback(
        `A cidade foi adicionada à lista, mas o histórico não pôde ser salvo: ${error.message}`,
      )
      return
    }

    throw error
  }
}

function setText(selector: string, value: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  if (!element) {
    throw new Error(`O elemento ${selector} não foi encontrado.`)
  }
  element.textContent = value
}

function renderDayPhase(phase: 'Dia' | 'Noite'): void {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 24 24')
  icon.setAttribute('aria-hidden', 'true')
  icon.classList.add('day-phase-icon', phase === 'Dia' ? 'day-sun' : 'day-moon')
  icon.innerHTML =
    phase === 'Dia'
      ? '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/>'
      : '<path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" fill="currentColor"/>'

  const label = document.createElement('span')
  label.textContent = phase
  dayPhaseElement.replaceChildren(icon, label)
}

function showStatus(state: 'empty' | 'loading' | 'error', message = ''): void {
  emptyState.hidden = state !== 'empty'
  loadingState.hidden = state !== 'loading'
  errorState.hidden = state !== 'error'
  weatherResult.hidden = true
  statusPanel.hidden = false
  errorMessage.textContent = message
  statusPanel.setAttribute('aria-busy', String(state === 'loading'))
}

function showWeather(data: CityWeather): boolean {
  const localDateTime = formatLocalDateTime(data.current.time, data.city.timezone)
  const dayPhase = getDayPhase(data.current, data.city.timezone)

  if (!localDateTime || !dayPhase) {
    showStatus(
      'error',
      'A resposta do serviço não contém uma data ou horário local válido. Tente novamente.',
    )
    return false
  }

  setText('#temperature', formatNumber(data.current.temperature))
  setText('#temperature-unit', data.current.units.temperature)
  setText('#condition', getWeatherDescription(data.current.weatherCode))
  setText('#city-name', data.city.name)
  setText('#state-name', formatRegion(data.city.region, data.city.countryCode))
  setText('#country-code', data.city.countryCode.toUpperCase())
  const mapUrl = new URL('https://www.google.com/maps/search/')
  mapUrl.searchParams.set('api', '1')
  mapUrl.searchParams.set(
    'query',
    `${data.city.latitude},${data.city.longitude}`,
  )
  locationMapLink.href = mapUrl.toString()
  locationMapLink.setAttribute(
    'aria-label',
    `Ver localização de ${data.city.name}${data.city.region ? `, ${formatRegion(data.city.region, data.city.countryCode)}` : ''} no Google Maps (abre em nova guia)`,
  )
  setText('#local-date', localDateTime.date)
  setText('#local-time', localDateTime.time)
  renderDayPhase(dayPhase)

  setText('#humidity', formatNumber(data.current.humidity))
  setText('#humidity-unit', data.current.units.humidity)
  setText('#apparent-temperature', formatNumber(data.current.apparentTemperature))
  setText('#apparent-unit', data.current.units.apparentTemperature)
  setText(
    '#precipitation-probability',
    formatNumber(data.current.precipitationProbability),
  )
  setText('#precipitation-unit', data.current.units.precipitationProbability)
  setText('#wind-speed', formatNumber(data.current.windSpeed))
  setText('#wind-speed-unit', data.current.units.windSpeed)
  setText(
    '#wind-direction',
    formatWindDirection(data.current.windDirection, data.current.units.windDirection),
  )

  statusPanel.hidden = true
  statusPanel.setAttribute('aria-busy', 'false')
  weatherResult.hidden = false
  return true
}

async function runCitySearch(
  cityName: string,
  recentCity?: CityLocation,
): Promise<void> {
  input.removeAttribute('aria-invalid')
  input.disabled = true
  searchButton.disabled = true
  recentList.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
    button.disabled = true
  })
  showStatus('loading')

  try {
    const result = recentCity
      ? await getCityWeather(recentCity)
      : await searchCityWeather(cityName)
    if (!result) {
      showStatus(
        'error',
        'Confira o nome da cidade e tente novamente. Não foi possível obter dados climáticos válidos.',
      )
      return
    }

    if (showWeather(result)) {
      saveRecentCity(result.city)
    }
  } catch (error: unknown) {
    if (error instanceof WeatherServiceError) {
      showStatus('error', error.message)
    } else if (error instanceof Error) {
      showStatus(
        'error',
        'Não foi possível conectar ao serviço de clima. Verifique sua conexão e tente novamente.',
      )
    } else {
      showStatus('error', 'Ocorreu um erro inesperado. Tente novamente.')
    }
  } finally {
    input.disabled = false
    searchButton.disabled = false
    recentList.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = false
    })
  }
}

input.addEventListener('input', () => {
  input.removeAttribute('aria-invalid')
})

recentList.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return
  }

  const button = event.target.closest<HTMLButtonElement>('[data-recent-index]')
  if (!button) {
    return
  }

  const city = recentCities[Number(button.dataset.recentIndex)]
  if (!city) {
    return
  }

  input.value = city.name
  void runCitySearch(city.name, city)
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const cityName = input.value.trim()
  if (!cityName) {
    input.setAttribute('aria-invalid', 'true')
    showStatus('error', 'Digite o nome de uma cidade para iniciar a busca.')
    input.focus()
    return
  }

  await runCitySearch(cityName)
})

renderRecentCities(recentCities)
