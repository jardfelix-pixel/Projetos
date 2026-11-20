# PRD — Clima

## 1. Visão geral

O Clima é uma aplicação web que permite consultar as condições climáticas atuais de uma cidade. A pessoa informa o nome da cidade; o sistema localiza o lugar pela API de geocodificação do Open-Meteo e, em seguida, consulta a previsão atual para suas coordenadas.

O produto deve apresentar os dados em uma interface simples, em português, com foco na leitura rápida das condições atuais.

## 2. Objetivos e escopo

### Objetivos

- Permitir a consulta do clima atual pelo nome da cidade.
- Exibir temperatura, condições do tempo e os principais indicadores solicitados.
- Manter a busca simples para a pessoa usuária, apresentando as duas consultas à API como uma única operação.
- Informar claramente os estados inicial, de carregamento e sem resultado.

### Fora do escopo desta versão

- Previsão para vários dias ou por hora.
- Favoritos, histórico de buscas, geolocalização automática ou criação de conta.
- Seleção entre várias cidades com o mesmo nome. A geocodificação usa o primeiro resultado retornado (`count=1`).

## 3. Público e idioma

- Aplicação destinada a pessoas que querem consultar rapidamente o clima de uma cidade.
- Interface e mensagens em português.
- Nome do país apresentado com o código de país recebido da API, conforme definido no layout.

## 4. Requisitos funcionais

### RF-01 — Estado inicial

- Ao abrir a aplicação sem uma busca realizada, apresentar um estado vazio (empty state).
- Exibir uma área de busca centralizada na parte superior.
- Não apresentar dados climáticos fictícios como se fossem reais.

### RF-02 — Busca por cidade

- Permitir digitar o nome de uma cidade e iniciar a busca.
- Validar que o campo não esteja vazio antes de enviar a solicitação.
- Usar o texto digitado para consultar o serviço de geocodificação do Open-Meteo.
- Para esta versão, usar o primeiro resultado (`count=1`).

### RF-03 — Consulta encadeada

1. Consultar a geocodificação para obter nome, latitude, longitude, código do país e fuso horário.
2. Se a cidade for encontrada e os dados necessários estiverem presentes, consultar o clima atual usando latitude, longitude e fuso horário.
3. Apresentar os dados climáticos somente depois de ambas as etapas terem sucesso.

As duas requisições constituem uma única busca para a pessoa usuária e compartilham um único estado de carregamento.

### RF-04 — Apresentação dos resultados

Na barra lateral, apresentar:

- Temperatura atual.
- Nome da cidade, UF para cidades brasileiras (quando disponível) e código do país.
- Ícone de localização clicável, que abre as coordenadas da cidade no Google Maps em uma nova guia.
- Data do dia atual no fuso horário da cidade.
- Indicador de dia ou noite.
- Descrição das condições baseada no código WMO (`weather_code`).

Na área principal, apresentar:

- Umidade relativa.
- Temperatura aparente.
- Probabilidade de precipitação.
- Velocidade e direção do vento.

Usar as unidades retornadas pela API. A configuração descrita neste PRD usa os valores padrão do endpoint de previsão, incluindo °C, %, mm, km/h e graus para direção do vento.

### RF-05 — Dia e noite

- Usar `current.is_day` quando presente: `1` representa dia e `0` representa noite.
- Se `current.is_day` estiver ausente, inferir pelo horário local da cidade: considerar dia entre 06:00 e 17:59 e noite nos demais horários.
- Usar o fuso horário da cidade retornado pela geocodificação para obter o horário local no fallback.

### RF-06 — Sem resultado e falhas

- Se a cidade não for encontrada, apresentar o estado sem resultado.
- Se a cidade for encontrada, mas a consulta do clima não retornar dados utilizáveis, apresentar o mesmo estado sem resultado, conforme definido no escopo inicial.
- Tratar falhas de rede ou respostas inválidas sem exibir dados antigos como se fossem resultado da busca atual.
- Permitir que a pessoa usuária corrija a busca e tente novamente.

### RF-07 — Carregamento

- Mostrar um indicador de carregamento desde o início da busca até a conclusão das etapas de geocodificação e clima.
- Evitar que a interface apresente uma conclusão antes de ambas as etapas terminarem.

### RF-08 — Pesquisas recentes

- Manter uma lista com até 10 cidades consultadas com sucesso, da mais recente para a mais antiga, sem entradas duplicadas para a mesma localização.
- Persistir a lista no armazenamento local do navegador para que permaneça disponível em visitas futuras no mesmo navegador.
- Apresentar as cidades recentes como controles acessíveis e permitir selecionar uma para atualizar e exibir novamente suas condições climáticas.
- Não adicionar buscas sem resultado ao histórico.
- Comunicar quando o navegador não permitir carregar ou salvar o histórico; a consulta atual do clima ainda deve funcionar.

## 5. Requisitos não funcionais e de sistema

- Aplicação web executada em navegadores modernos com suporte a JavaScript e TypeScript compilado.
- Layout responsivo, utilizável em telas estreitas e largas.
- A interface deve permanecer legível durante carregamento, sem resultado e exibição dos dados.
- Controles de formulário devem ter rótulos acessíveis, foco visível e operação por teclado.
- Valores numéricos devem ser apresentados com suas unidades e com formatação consistente.
- As requisições dependem de conexão com a internet e da disponibilidade dos serviços Open-Meteo.
- Não há backend ou banco de dados previstos para esta versão.

## 6. Requisitos técnicos

### Tecnologias

- Vite para desenvolvimento e build.
- TypeScript com JavaScript Vanilla, sem framework de interface.
- HTML e CSS para estrutura e apresentação.

### Integração Open-Meteo

#### Geocodificação

Usar:

```text
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json
```

Codificar o nome da cidade como parâmetro de URL. Consumir do primeiro resultado:

- `name`
- `latitude`
- `longitude`
- `country_code`
- `timezone`
- `admin1`, quando disponível, para mostrar a UF brasileira correspondente (ou a região em outros países).

#### Clima atual

Usar:

```text
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&hourly=temperature_2m&current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code&timezone={TIMEZONE}
```

Construir os parâmetros com os valores da cidade encontrada e codificar o fuso horário corretamente.

Do objeto `current_units`, usar as unidades correspondentes aos valores. Do objeto `current`, usar:

- `temperature_2m`
- `relative_humidity_2m`
- `apparent_temperature`
- `is_day`, quando presente
- `wind_speed_10m`
- `wind_direction_10m`
- `precipitation_probability`
- `weather_code`
- `time`, para data/hora da observação no fuso solicitado

`precipitation` também faz parte da solicitação atual, mas não é um dado obrigatório na interface desta versão.

### Organização do código

- Encapsular as chamadas e a interpretação das respostas do Open-Meteo em um módulo próprio, evitando requisições diretas espalhadas pela interface.
- Separar a lógica de consulta dos elementos responsáveis por renderizar e atualizar a interface.
- Definir tipos TypeScript para os dados consumidos e validar a presença dos campos obrigatórios antes de exibir o resultado.
- Tratar ausência de parâmetros necessários, resultados vazios e respostas de erro sem deixar a interface em estado de carregamento.
- Manter os endereços e parâmetros dos endpoints centralizados no módulo de integração.

### Códigos de condição do tempo

Mapear `weather_code` usando a tabela WMO fornecida no brain dump. O mapeamento contempla céu limpo, nebulosidade, neblina, garoa, chuva, neve, pancadas e tempestades. A interface deve exibir uma descrição correspondente ao código recebido; códigos desconhecidos devem ter uma apresentação neutra, sem interromper a exibição dos demais dados.

## 7. Instruções visuais e UX

### Composição

- Usar fundo geral azul-escuro.
- Manter a área superior sem fundo próprio, com o campo de busca centralizado.
- Abaixo da busca, exibir um contêiner principal centralizado, com largura máxima de 800 px, fundo branco e bordas bem arredondadas.
- Dentro do contêiner, organizar os resultados em uma barra lateral à esquerda e uma área principal.
- A barra lateral destaca temperatura, local, data, período do dia e condição do tempo.
- A área principal organiza os indicadores de umidade, sensação térmica, precipitação e vento.

### Estados visuais

- **Inicial:** estado vazio com orientação breve para pesquisar uma cidade.
- **Carregando:** indicador visual e texto que comuniquem que a consulta está em andamento.
- **Sem resultado:** mensagem clara de que não foi possível encontrar dados para a busca, com possibilidade de tentar novamente.
- **Com resultado:** exibir os dados com hierarquia visual clara, destacando a temperatura e mantendo unidades junto dos valores.

### Responsividade e acessibilidade

- Em telas estreitas, adaptar a barra lateral e a área principal para uma composição vertical, sem exigir rolagem horizontal.
- Manter contraste suficiente entre texto, fundo azul-escuro e contêiner branco.
- Indicar foco de teclado nos controles interativos e associar o campo de busca a um rótulo acessível.
- Não depender somente de cor para comunicar carregamento, erro ou condição do tempo.

## 8. Critérios de aceite

1. Uma busca por cidade encontrada executa geocodificação e consulta do clima, mostrando um único carregamento durante o fluxo.
2. Com respostas válidas, todos os dados listados em RF-04 são exibidos com suas unidades.
3. A data e a hora usadas para a apresentação respeitam o fuso horário da cidade.
4. O indicador de dia/noite usa `is_day` quando fornecido e aplica a regra de 06:00 a 17:59 no horário local quando o campo estiver ausente.
5. Uma busca sem cidade correspondente ou sem dados climáticos termina no estado sem resultado, sem mostrar dados incompletos como sucesso.
6. O estado inicial, o carregamento e o resultado são visualmente distinguíveis.
7. A interface permanece utilizável em telas estreitas e pode ser operada por teclado.
8. As chamadas ao Open-Meteo ficam encapsuladas no módulo de integração, e a interface não faz chamadas diretas aos endpoints.
9. O histórico apresenta no máximo 10 localizações únicas, coloca a pesquisa bem-sucedida mais recente no início e continua disponível após recarregar a página.
10. Selecionar uma cidade recente atualiza o clima daquela localização; uma falha não apaga o histórico.

## 9. Dependências e riscos

- Disponibilidade e formato das respostas das APIs públicas do Open-Meteo.
- A busca usa somente o primeiro resultado; cidades homônimas podem não corresponder à intenção da pessoa usuária.
- O fallback de dia/noite por horário é uma aproximação fixa (06:00–17:59), não baseada no nascer e pôr do sol.
- A resposta de exemplo do brain dump não inclui `current.is_day`, embora o endpoint o solicite. Por isso, o comportamento de fallback está especificado em RF-05.
