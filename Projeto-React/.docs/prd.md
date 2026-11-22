# PRD — Jarvis de JFELIX

## 1. Visão geral

O Jarvis de JFELIX é a interface inicial de um chat com IA. A primeira entrega consiste em uma única tela de entrada, com tema escuro, identidade visual em azul-marinho e um campo central para escrever uma mensagem.

Esta versão é somente a interface: não consulta serviços, não envia mensagens e não apresenta respostas de IA.

## 2. Objetivo

Implementar uma tela inicial simples e responsiva que apresente a identidade do Jarvis e permita ao usuário explorar visualmente os modos e controles disponíveis, sem depender de um backend.

## 3. Escopo

### Incluído

- Tela inicial do Jarvis de JFELIX.
- Tema escuro com azul-marinho como cor principal.
- Seletor de modo com as opções **Rápido** e **Especialista**.
- Campo central para digitação de texto.
- Controles de alternância **Pensamento profundo** e **Pesquisa Inteligente**.
- Botão arredondado de envio.
- Componentes reutilizáveis organizados em `my-project/src/components`.
- Layout utilizável em telas desktop e mobile.

### Fora de escopo

- Busca na web ou pesquisa inteligente real.
- Integração com modelos ou APIs de IA.
- Envio de mensagens, respostas ou histórico de conversa.
- Autenticação, persistência de dados ou backend.
- Terceiro modo: a interface terá somente **Rápido** e **Especialista**.

## 4. Requisitos funcionais

### RF-01 — Identidade do produto

Exibir o nome **Jarvis de JFELIX** acima do seletor de modo e do campo de entrada.

### RF-02 — Seleção de modo

Exibir as opções **Rápido** e **Especialista** como opções selecionáveis, semelhantes a tabs. Deve haver sempre uma opção visualmente selecionada. A troca altera somente o estado visual da interface; não altera uma busca ou resposta.

### RF-03 — Entrada de texto

Exibir um campo central que permita digitar uma mensagem. O texto digitado não será enviado nem armazenado.

### RF-04 — Pensamento profundo

Exibir dentro da área do campo de entrada, no canto inferior esquerdo, um controle denominado **Pensamento profundo**. O controle deve alternar entre ligado e desligado e indicar visualmente o estado atual. A alternância não inicia processamento.

### RF-05 — Pesquisa Inteligente

Exibir ao lado de **Pensamento profundo**, dentro da área do campo de entrada e no canto inferior esquerdo, um controle denominado **Pesquisa Inteligente**. O controle deve alternar entre ligado e desligado e indicar visualmente o estado atual. A alternância não realiza pesquisa.

### RF-06 — Envio

Exibir no canto inferior direito da área do campo de entrada um botão de envio arredondado. Nesta versão, ativá-lo não deve enviar a mensagem, criar uma conversa nem produzir uma resposta.

## 5. Requisitos visuais e de interação

- Usar uma composição escura, com azul-marinho como tom predominante.
- Manter o seletor de modo e a área de entrada centralizados na tela, com o nome do produto acima deles.
- Agrupar o campo de texto e os controles de modo que os dois controles fiquem na parte inferior esquerda e o botão de envio na parte inferior direita.
- Destacar claramente o modo selecionado e os estados ligado/desligado dos controles.
- Adaptar espaçamentos e disposição para telas estreitas, sem ocultar controles ou causar rolagem horizontal.
- Tornar estados de foco e seleção perceptíveis durante a navegação por teclado.
- Não há valores de cor, tipografia, texto de placeholder ou especificação de ícone definidos neste PRD; esses detalhes podem ser escolhidos durante a implementação, preservando a identidade escura e azul-marinho.

## 6. Requisitos técnicos

- Implementar no projeto existente, localizado em `my-project`.
- Utilizar a configuração existente de Vite, React, TypeScript e Tailwind CSS.
- Criar e organizar componentes reutilizáveis em `my-project/src/components`, evitando duplicação desnecessária.
- Manter a montagem da tela principal no componente da aplicação e limitar cada componente a responsabilidades claras.
- Não adicionar integração de rede ou dependência de backend para esta entrega.

## 7. Critérios de aceite

1. A aplicação inicia e renderiza a tela do Jarvis de JFELIX.
2. O nome do produto aparece acima das opções de modo.
3. Há exatamente duas opções de modo: **Rápido** e **Especialista**; a opção selecionada é visualmente distinguível e pode ser alterada.
4. O campo central aceita digitação.
5. Os controles **Pensamento profundo** e **Pesquisa Inteligente** alternam seus estados visuais independentemente.
6. O botão de envio é arredondado e aparece no canto inferior direito da área de entrada.
7. Ativar o botão de envio não envia texto nem cria uma resposta ou conversa.
8. A composição permanece utilizável em desktop e mobile, e todos os controles podem receber foco por teclado.
9. A implementação não depende de API, backend ou serviço externo de IA.
