# Projeto: Clima

Este projeto vai pegar a cidade e baseado nisso, consultar o climea daquela região, exibindo as principais informações de clima, temperatura, humidade e etc.

### Aspectos Técnicos

o projeto vai ser feito em Vite + Vanilla + Typescript

### Informações da API que será usada no projeto

Ele vai usar a API OpenMeteo, com os seguintes ednpoints:

#### Para pegar a latitude, longitude e temezone, baseado no nome da cidade:
https://geocoding-api.open-meteo.com/v1/search?name={NOME DA CIDADE}&count=1&language=pt&format=json

{NOME_DA_CIDADE}= Nome da cidade que o usuário digitou

Exemplo de resposta:
{
  "results": [
    {
      "id": 3392887,
      "name": "Patos",
      "latitude": -7.02444,
      "longitude": -37.28,
      "elevation": 243,
      "feature_code": "PPL",
      "country_code": "BR",
      "admin1_id": 3393098,
      "admin2_id": 6320375,
      "timezone": "America/Fortaleza",
      "population": 92575,
      "country_id": 3469034,
      "country": "Brasil",
      "admin1": "Paraíba",
      "admin2": "Patos"
    }
  ],
  "generationtime_ms": 0.101685524
}

Informações que PRECISAMOS:
- name
- latitude
- longitude
- country_code
- timezone

#### Para pegar as informações de clima:
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&hourly=temperature_2m&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code&timezone={TIMEZONE}


{LATITUDE}= Latitude
{LONGITUDE}= longitude
{TIMEZONE}= Timezone

Exemplo de resposta:

{
  "latitude": -22.952549,
  "longitude": -43.215027,
  "generationtime_ms": 0.215530395507813,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 12,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "precipitation_probability": "%",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "precipitation": "mm",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-11-19T20:45",
    "interval": 900,
    "precipitation_probability": 27,
    "temperature_2m": 26,
    "relative_humidity_2m": 88,
    "apparent_temperature": 31.9,
    "precipitation": 0,
    "wind_speed_10m": 1.5,
    "wind_direction_10m": 111,
    "weather_code": 3

  }
}

Informações que precisamos da esposta:
Na resposta eu tenho 2 itens:
- current_units tem as unidades de medida das propriedades
- current tem os valores das propriedades

Propriedades obrigatórias:
 - temperature_2m
 - relative_humidity_2m
 - apparent_temperature
 - is_day or Night
 - wind_speed_10m
 - wind_direction_10m
 - precipitation_probability


#### Informações importantes:
Teremos um arquivo com as funções do OpenMeteo, para que o projeto não faça requisição direta a API mas sim use as funções desse aquivo.

Fluxo de pesquisa para receber o nome da cidade e pegar as finormações de clima:
- o usuário digita o nome da cidade
- o projeto pega o nome e usa o OpenMeteo para pegar a latitude, longitude e timezone da cidade solicitada
- Ao pegar a latitude, longitude e timezone, o projeto usa essas informações para fazer a requisição e pegar as informações do clima da localicalização.
- Caso não ache as informções da cidade, se comportar como se não tivesse achado nada.
- Caso ache as informações da cidade mais não as de clima, se comportar como se não tivesse achado nada.

A busca envolve as 2 requisições (buscar latitude/longitude/timezone + buscar clima), mais para o usuário é uma só, com loading.

As funções do OpenMeteo devem verificar se os parâmetros vieram, caso contrario, age como se não tivesse vindo.

### Aspectos visuais (desing e UX)

Tem que ter Empty State

teremos uma area superior centralizada que tem apenas o campo de busca da cidade

o projeto tera um sibebar na esquerda com as seguintes informções:
- Temperatura
- Nome da Cdidade, Código do pais
- Dia atual
- Se é dia/noite
- weather_code

Na área principal:

- Humidade relativa
- temperatura aparente
- probabilidade de precipitação
- velocidade/direção do vento

Desing geral:

- O projeto tera um fundo zaul escuro
- A parte superrior não terá backgroud, mas sidebar quanto a área principal dentro deuma div com borda bem arredondada, fundo branco, centralizada e largura maxima de 800px

Informações do weather_code: "Code":, "Descrição":

{
	"0": "Clear sky",
	"1": "Mainly clear",
	"2": "Partly cloudy",
	"3": "Overcast",
	"45": "Fog",
	"48": "Depositing rime fog",
	"51": "Light drizzle",
	"53": "Moderate drizzle",
	"55": "Dense drizzle",
	"56": "Light freezing drizzle",
	"57": "Dense freezing drizzle",
	"61": "Slight rain",
	"63": "Moderate rain",
	"65": "Heavy rain",
	"66": "Light freezing rain",
	"67": "Heavy freezing rain",
	"71": "Slight snowfall",
	"73": "Moderate snowfall",
	"75": "Heavy snowfall",
	"77": "Snow grains",
	"80": "Slight rain showers",
	"81": "Moderate rain showers",
	"82": "Violent rain showers",
	"85": "Slight snow showers",
	"86": "Heavy snow showers",
	"95": "Thunderstorm",
	"96": "Thunderstorm with slight hail",
	"97": "Heavy thunderstorm",
	"99": "Thunderstorm with heavy hail"
}