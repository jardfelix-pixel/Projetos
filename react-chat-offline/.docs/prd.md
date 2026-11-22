# PRD - Chat Offline

## 1. Resumo do produto

Construir uma interface de chat offline em que o usuário possa enviar mensagens manualmente como participante ou como robô. A aplicação será usada como ferramenta visual e demonstrativa, sem integração com backend, IA real ou persistência de dados.

O projeto utiliza Vite, React, TypeScript e Tailwind CSS, que já estão configurados.

## 2. Objetivo

- Disponibilizar uma janela única de chat responsiva.
- Permitir alternar a autoria da próxima mensagem entre usuário e robô.
- Exibir mensagens enviadas com alinhamento e aparência diferentes por autoria.
- Manter o histórico apenas enquanto a aplicação estiver aberta.
- Entregar uma experiência simples, clara e centrada no conteúdo.

## 3. Escopo

### 3.1 Dentro do escopo

- Layout de tela inteira com fundo azul escuro.
- Histórico de mensagens em memória.
- Composer fixado na parte inferior da tela.
- Campo de texto com altura automática.
- Toggle para escolher entre usuário e robô.
- Botão de envio desabilitado sem mensagem válida.
- Diferenciação visual entre mensagens de usuário e robô.
- Responsividade para telas pequenas e grandes.
- Estados vazios e estados básicos da interação.

### 3.2 Fora do escopo

- Integração com API ou serviço de IA.
- Respostas automáticas.
- Login, perfis ou identificação persistente.
- Persistência em LocalStorage, banco de dados ou backend.
- Histórico compartilhado entre recarregamentos.
- Upload de arquivos, áudio ou anexos.
- Pesquisa, edição ou exclusão de mensagens.
- Reações, indicadores de digitação ou entregas.

## 4. Público-alvo

- Pessoas que desejam demonstrar ou testar visualmente uma conversa em dois papéis.
- Desenvolvedores que precisam de uma base de chat offline para prototipação.
- Usuários que precisam simular manualmente mensagens de usuário e robô.

## 5. Diretrizes visuais

- Fundo principal: azul escuro.
- Conteúdo do chat limitado à largura `2xl` e centralizado em telas maiores.
- O histórico e o composer compartilham o mesmo limite horizontal.
- O composer fica fixado na parte inferior da área visível.
- O campo de mensagem usa card branco.
- O card cresce verticalmente conforme o conteúdo do texto.
- Mensagens do usuário ficam alinhadas à direita.
- Mensagens do robô ficam alinhadas à esquerda.
- Quando o modo robô estiver ativo:
  - o card do composer recebe borda verde;
  - a seleção indica que a próxima mensagem será enviada como robô.
- Quando o modo usuário estiver ativo:
  - o card não usa a borda verde;
  - a próxima mensagem será enviada como usuário.

## 6. Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF01 | A aplicação deve exibir o histórico no estado React | O histórico desaparece ao recarregar a página |
| RF02 | O usuário deve poder digitar uma mensagem | O texto aparece no campo e atualiza o estado controlado |
| RF03 | O usuário deve alternar a autoria da próxima mensagem | A alternância muda visualmente o modo ativo |
| RF04 | O toggle deve iniciar no modo usuário | A mensagem padrão é enviada à direita |
| RF05 | O envio como usuário deve adicionar uma mensagem à direita | A mensagem exibida é associada ao tipo `user` |
| RF06 | O envio como robô deve adicionar uma mensagem à esquerda | A mensagem exibida é associada ao tipo `robot` |
| RF07 | A mensagem deve ser limpa após o envio | O campo volta ao estado vazio |
| RF08 | O botão de enviar deve ficar desabilitado sem texto | Espaços vazios não podem habilitar o envio |
| RF09 | Enter pode ser usado para enviar | `Enter` envia; `Shift+Enter` insere quebra de linha |
| RF10 | Mensagens podem preservar quebras de linha | Quebras digitadas são exibidas no histórico |
| RF11 | O histórico deve acompanhar novas mensagens | O chat faz scroll automático até a última mensagem |
| RF12 | O histórico vazio deve ser indicado por um estado neutro | Nenhum item fictício é persistido ou criado inicialmente |

## 7. Modelo de dados

Todos os types devem ficar em `src/types` e usar `type`, não `interface`.

```ts
export type MessageAuthor = 'user' | 'robot'

export type ChatMessage = {
  id: string
  author: MessageAuthor
  content: string
  createdAt: number
}
```

Esse modelo poderá ser ampliado posteriormente, mas a versão inicial não exige metadados visíveis para data ou avatar.

## 8. Arquitetura proposta

```text
src/
  components/
    ChatComposer.tsx
    ChatHistory.tsx
    MessageBubble.tsx
    AuthorToggle.tsx
  types/
    chat.ts
  App.tsx
  index.css
  main.tsx
```

Responsabilidades:

- `App.tsx`: dono do estado global das mensagens, do texto em edição e do modo de autoria.
- `ChatHistory`: renderiza a lista e controla o scroll até a última mensagem.
- `MessageBubble`: apresenta uma mensagem conforme seu autor.
- `ChatComposer`: reúne textarea, toggle e botão de envio.
- `AuthorToggle`: controla a seleção entre usuário e robô.
- `chat.ts`: concentra os types relacionados ao domínio.

## 9. Comportamentos do composer

- O textarea terá placeholder neutro e conteúdo vazio no primeiro carregamento.
- O tamanho mínimo será adequado para uma linha.
- A altura máxima deve evitar que o composer ocupe a maior parte da tela.
- A partir da altura máxima, o texto deverá usar scroll interno.
- O clique no botão esquerdo alterna o modo de autoria.
- O botão de envio fica no lado direito.
- A borda verde do card representa o modo robô.
- O envio não altera automaticamente o modo ativo.

## 10. Comportamento das mensagens

- Usuário:
  - alinhado à direita;
  - bolha em uma cor distinta;
  - texto legível sobre o fundo escolhido.
- Robô:
  - alinhado à esquerda;
  - bolha em uma cor distinta;
  - pode usar contraste neutro para diferenciar do usuário.
- As mensagens longas devem quebrar linha e respeitar o limite disponível.
- Não deve haver nomes ou avatares nesta primeira versão.

## 11. Requisitos não funcionais

- A aplicação deve iniciar com `npm run dev`.
- A build de produção deve passar com `npm run build`.
- O lint deve passar com `npm run lint`.
- Não utilizar dependências adicionais para recursos que podem ser implementados com React e Tailwind.
- Garantir contraste suficiente entre texto, bolhas e fundo.
- Manter estados controlados sem mutações diretas das mensagens.
- A interface deve funcionar em tamanhos móveis e desktop.
- Não usar persistência externa nesta etapa.

## 12. Plano de implementação

As tarefas abaixo são progressivas e devem ser realizadas nesta ordem.

### Tarefa 1 - Estruturar os types do domínio

**Status: Concluída**

- Criar `src/types/chat.ts`.
- Definir `MessageAuthor` e `ChatMessage`.
- Exportar os types necessários à aplicação.

**Dependências:** nenhuma.

**Critério de conclusão:** os types compilam sem erros e são usados pelos componentes.

### Tarefa 2 - Implementar o estado inicial da aplicação

**Status: Concluída**

- Criar o estado de mensagens vazio.
- Criar o estado controlado do texto do composer.
- Criar o estado inicial do modo de autoria como `user`.
- Centralizar funções de atualização e envio em `App.tsx`.

**Dependências:** Tarefa 1.

**Critério de conclusão:** o estado existe e pode ser alterado sem persistência.

### Tarefa 3 - Criar o componente de mensagem

**Status: Concluída**

- Criar `src/components/MessageBubble.tsx`.
- Receber `ChatMessage` por props.
- Renderizar alinhamento à direita para usuário.
- Renderizar alinhamento à esquerda para robô.
- Aplicar classes Tailwind distintas por autoria.
- Preservar quebras de linha no texto.

**Dependências:** Tarefa 1.

**Critério de conclusão:** mensagens dos dois tipos podem ser demonstradas isoladamente.

### Tarefa 4 - Criar o histórico de mensagens

**Status: Concluída**

- Criar `src/components/ChatHistory.tsx`.
- Renderizar `MessageBubble` para cada mensagem.
- Mostrar um estado vazio antes da primeira mensagem.
- Aplicar espaçamento vertical e scroll vertical.
- Fazer scroll até a última mensagem após alterações no histórico.

**Dependências:** Tarefas 1 e 3.

**Critério de conclusão:** uma lista vazia e uma lista com mensagens são exibidas corretamente.

### Tarefa 5 - Criar o toggle de autoria

**Status: Concluída**

- Criar `src/components/AuthorToggle.tsx`.
- Renderizar o estado atual de usuário ou robô.
- Permitir alternância por clique.
- Usar um indicador visual claro para o modo ativo.
- Garantir acessibilidade básica por meio de `aria-label` e estado.
- Exibir um ícone representando usuário no modo usuário e um ícone representando robô no modo robô.

**Dependências:** Tarefa 1.

**Critério de conclusão:** o usuário consegue alternar o modo sem perder o texto digitado.

### Tarefa 6 - Criar o composer

**Status: Concluída**

- Criar `src/components/ChatComposer.tsx`.
- Integrar o textarea ao estado controlado.
- Integrar o toggle de autoria.
- Integrar o botão de envio.
- Desabilitar o envio quando não houver texto válido.
- Aplicar borda verde no modo robô.
- Implementar altura automática com limite máximo.
- Tratar `Enter` e `Shift+Enter`.

**Dependências:** Tarefas 2 e 5.

**Critério de conclusão:** o texto pode ser editado, alternado e enviado pela interface.

### Tarefa 7 - Montar o layout principal

**Status: Concluída**

- Atualizar `src/App.tsx`.
- Configurar fundo azul escuro.
- Centralizar o chat com largura máxima `2xl`.
- Posicionar o histórico acima do composer.
- Fixar o composer na parte inferior.
- Garantir que a lista não fique coberta pelo composer.

**Dependências:** Tarefas 2, 4 e 6.

**Critério de conclusão:** o layout principal corresponde às diretrizes visuais em telas grandes e pequenas.

### Tarefa 8 - Polir estados e responsividade

**Status: Concluída**

- Ajustar espaçamentos para desktop e mobile.
- Ajustar altura do composer em texto curto e longo.
- Evitar que o composer ultrapasse o tamanho da viewport.
- Revisar contraste e estados desabilitados.
- Melhorar estados vazios e de foco.

**Dependências:** Tarefa 7.

**Critério de conclusão:** a interface permanece utilizável em viewport estreita e ampla.

### Tarefa 9 - Validar fluxos principais

**Status: Concluída**

- Testar envio como usuário.
- Testar envio como robô.
- Testar alternância repetida.
- Testar mensagens vazias e compostas apenas por espaços.
- Testar quebras de linha.
- Testar scroll após várias mensagens.
- Executar lint e build.

**Dependências:** Tarefa 8.

**Critério de conclusão:** todos os critérios dos requisitos RF01-RF12 são atendidos e os comandos de validação passam.

## 13. Critérios gerais de aceitação

A entrega será considerada concluída quando:

- Não existir backend ou persistência.
- Todas as mensagens forem mantidas apenas em state.
- O composer estiver fixado na parte inferior.
- O histórico estiver centralizado e limitado à largura `2xl`.
- O toggle permitir enviar manualmente como usuário ou robô.
- Usuário e robô tiverem posições e estilos visualmente distintos.
- O modo robô indicar a mudança por uma borda verde.
- O botão de envio respeitar texto vazio e espaços.
- A aplicação passar por lint e build.
- A interface continuar utilizável em desktop e mobile.

## 14. Ordenação resumida

1. Types do chat.
2. State da aplicação.
3. Componente da bolha de mensagem.
4. Histórico de mensagens.
5. Toggle de autoria.
6. Composer.
7. Layout principal.
8. Responsividade e polimento.
9. Validação completa.
