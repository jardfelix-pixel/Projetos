# Clima

Aplicação web para consultar as condições climáticas atuais de uma cidade. A interface exibe temperatura, descrição do tempo, umidade, sensação térmica, precipitação, vento, horário local e um indicador de dia/noite.

## Acessar

O site publicado no GitHub Pages fica em:

<https://jardfelix-pixel.github.io/Projetos/CLIMA/>

## Executar localmente

Requisitos: Node.js 22 ou superior e npm.

No PowerShell:

```powershell
cd C:\Projetos\Clima\vite-project
npm.cmd ci
npm.cmd run dev
```

Abra no navegador o endereço local mostrado no terminal.

Para gerar e conferir a versão de produção:

```powershell
npm.cmd run build
npm.cmd run preview
```

## Publicação

O workflow [`deploy-clima.yml`](../../.github/workflows/deploy-clima.yml) compila o projeto e publica o conteúdo em `/CLIMA/` no GitHub Pages a cada push para a branch `main`. Também pode ser executado manualmente pela aba **Actions** do GitHub.

## Tecnologias e dados

- Vite e TypeScript.
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) para localizar cidades.
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) para consultar as condições atuais.
