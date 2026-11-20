# PRD — Painel de despesas

## 1. Resumo do projeto

Construir uma aplicação web de controle de despesas pessoais utilizando Vite, HTML, CSS e TypeScript vanilla. A interface permitirá cadastrar despesas, visualizar todas as despesas em uma lista e acompanhar o total geral e os totais por categoria.

Os dados terão duração apenas durante a sessão atual da página. Não haverá banco de dados, API ou armazenamento local.

## 2. Objetivos

- Permitir o registro rápido de novas despesas.
- Facilitar a leitura de todas as despesas cadastradas.
- Apresentar uma visão clara do gasto total.
- Mostrar a distribuição dos gastos por categoria.
- Entregar uma interface simples, responsiva e fácil de manter.

## 3. Público-alvo

Pessoa que deseja registrar gastos pessoais básicos sem necessidade de conta, autenticação ou funcionalidades avançadas de gestão financeira.

## 4. Escopo

### 4.1 Incluído

- Cadastro de despesa por título, valor e categoria.
- Listagem das despesas cadastradas.
- Cálculo e atualização do total geral.
- Cálculo e atualização do total de cada categoria fixa.
- Estado vazio com orientação ao usuário.
- Validação dos campos do formulário.
- Feedback visual após cadastro válido.
- Layout responsivo para desktop e dispositivos móveis.

### 4.2 Fora do escopo

- Persistência em banco de dados, `localStorage`, cookies ou sessão.
- Autenticação e perfil de usuário.
- API ou integração externa.
- Exclusão ou edição de despesas.
- Filtros, ordenação ou busca.
- Importação/exportação de dados.
- Gráficos.
- Orçamentos, metas ou previsões.
- Múltiplas moedas.

## 5. Requisitos funcionais

### RF-01 — Adicionar despesa

O usuário poderá informar:

- Título da despesa.
- Valor da despesa.
- Categoria da despesa.

Ao confirmar o cadastro:

- A despesa será criada em memória.
- Um identificador único será associado à despesa.
- A despesa será incluída na lista.
- Os totais gerais e da categoria correspondente serão recalculados.
- Os campos do formulário serão reiniciados.

### RF-02 — Campos do formulário

- O campo título será do tipo texto e obrigatório.
- O campo valor será numérico e obrigatório.
- O campo categoria será uma seleção obrigatória.
- Espaços vazios no título não deverão ser considerados válidos.
- O valor deverá ser maior que zero.
- Não deverão ser aceitos valores negativos, infinitos ou inválidos.

### RF-03 — Categorias fixas

A aplicação deverá utilizar exclusivamente as seguintes categorias:

- `moradia`
- `alimento`
- `transporte`
- `lazer`
- `saúde`
- `outros`

Os rótulos visualizados poderão iniciar com letra maiúscula, mas os valores armazenados deverão permanecer exatamente em minúsculas.

### RF-04 — Listagem de despesas

A área principal deverá listar todas as despesas cadastradas.

Cada item deverá exibir:

- Título.
- Categoria.
- Valor formatado em moeda brasileira.

Cada novo item deverá aparecer na lista após o envio válido do formulário.

Não é necessário remover ou editar itens.

### RF-05 — Estado vazio

Quando não houver despesas, a lista deverá apresentar uma mensagem clara, como:

> Nenhuma despesa cadastrada.

A interface não deverá exibir linhas vazias ou valores aleatórios.

### RF-06 — Total geral

A barra lateral deverá apresentar a soma de todas as despesas cadastradas.

O total deverá:

- Iniciar em `R$ 0,00`.
- Atualizar após cada novo cadastro.
- Ser calculado somando os valores das despesas existentes.

### RF-07 — Totais por categoria

A barra lateral deverá apresentar o total de cada uma das seis categorias fixas.

Cada categoria deverá:

- Iniciar em `R$ 0,00`.
- Exibir o acumulado das despesas que pertencem à categoria.
- Ser atualizada após cada cadastro.

### RF-08 — Validação e feedback

Quando houver erro de validação:

- O formulário não deverá cadastrar a despesa.
- Uma mensagem clara deverá informar o problema.
- Os campos inválidos deverão receber indicação visual.
- O erro deverá permanecer até que o usuário corrija o campo ou o formulário seja enviado novamente com dados válidos.

Após o cadastro válido:

- Os dados deverão ser adicionados à interface.
- Os campos deverão ser limpos.
- Poderá ser exibida uma confirmação breve e discreta.

### RF-09 — Dados em memória

Todas as despesas deverão permanecer apenas em um array em memória.

Ao recarregar a página:

- Todas as despesas serão removidas.
- Os totais voltarão a `R$ 0,00`.
- Nenhuma informação anterior será restaurada.

## 6. Requisitos técnicos

### RT-01 — Stack

- Vite.
- HTML.
- CSS.
- TypeScript vanilla.
- Nenhum framework ou biblioteca de interface.

### RT-02 — Organização de tipos

Todos os tipos TypeScript deverão ser definidos no arquivo `src/types.ts`.

Tipos obrigatórios:

```ts
type Category =
  | "moradia"
  | "alimento"
  | "transporte"
  | "lazer"
  | "saúde"
  | "outros";

interface Expense {
  id: string;
  titulo: string;
  valor: number;
  categoria: Category;
}
```

Demais tipos auxiliares, como estados de validação ou dados de formulário, poderão ser definidos no mesmo arquivo.

### RT-03 — Manipulação de eventos

Todos os eventos deverão ser registrados no TypeScript com APIs como `addEventListener`.

Não deverá haver atributos de evento inline no HTML, como `onclick`, `onchange` ou `onsubmit`.

### RT-04 — Estrutura sugerida

Uma estrutura simples e adequada ao projeto será:

```text
src/
  main.ts
  style.css
  types.ts
```

Os arquivos poderão ser divididos em módulos quando isso melhorar a organização, desde que o projeto continue simples e fácil de manter.

### RT-05 — Código

- Preferir funções pequenas e com responsabilidades claras.
- Evitar duplicação de cálculos e regras de validação.
- Usar nomes em português coerentes com o domínio.
- Não introduzir abstrações desnecessárias.
- Reutilizar referências a elementos do DOM.
- Evitar manipulação direta de HTML inline desnecessária.

### RT-06 — Identificador

Cada despesa deverá receber um identificador único em `string`.

Para esta implementação simples, pode ser usada uma combinação baseada em timestamp e aleatoriedade ou um contador monotônico.

### RT-07 — Formatação monetária

Os valores deverão ser exibidos em reais com o padrão brasileiro:

- Separador decimal: vírgula.
- Separador de milhares: ponto.
- Prefixo: `R$`.
- Exemplo: `R$ 1.234,56`.

## 7. Requisitos visuais

### RV-01 — Estrutura geral

A página deverá apresentar um layout em três regiões:

- Conteúdo principal com o formulário e a lista.
- Barra lateral à esquerda com o total geral e os totais por categoria.
- Espaçamento consistente entre cards e seções.

Em telas pequenas, a barra lateral deverá aparecer acima do conteúdo principal ou tornar-se um bloco destacado no início da página.

### RV-02 — Card de nova despesa

Deverá existir um card principal contendo:

- Título da seção.
- Campo título.
- Campo valor.
- Campo categoria.
- Botão de cadastro.

Os campos deverão ocupar uma largura adequada e manter espaçamento suficiente para evitar confusão visual.

### RV-03 — Lista de despesas

A lista deverá aparecer abaixo do card de nova despesa.

Cada despesa poderá ser apresentada em um card ou linha contendo:

- Título em destaque.
- Categoria em destaque secundário ou etiqueta.
- Valor alinhado à direita.

A última versão visual deverá manter boa leitura em uma única coluna em telas estreitas.

### RV-04 — Barra lateral

A barra lateral deverá conter:

- Um bloco para o total geral.
- Uma seção com uma linha para cada categoria fixa.
- Totais alinhados de forma consistente.

O total geral deverá receber maior destaque visual que os totais individuais.

### RV-05 — Responsividade

O layout deverá:

- Comportar-se em desktop com barra lateral e conteúdo lado a lado.
- Adaptar-se a tablet e celular em uma única coluna.
- Ter largura máxima para evitar expansão excessiva.
- Manter campos utilizáveis em telas pequenas.
- Evitar transbordamento horizontal.

### RV-06 — Estados visuais

A interface deverá possuir estados visuais claros para:

- Campo normal.
- Campo em foco.
- Campo inválido.
- Hover e foco no botão.
- Lista vazia.
- Despesa cadastrada.

### RV-07 — Acessibilidade visual

- Contraste suficiente entre texto e fundo.
- Botões com área clicável adequada.
- Indicadores de foco visíveis.
- Campos associados aos respectivos rótulos por `label` e `for`.
- Mensagens de erro identificáveis por texto, não apenas por cor.
- Uso de `aria-invalid` nos campos inválidos quando aplicável.
- Uso de `aria-live` para mensagens de feedback.

## 8. Comportamento e regras de apresentação

### Moeda

Os valores serão interpretados como números decimais de até duas casas.

A implementação pode converter o campo de entrada com `Number` após limpar formatação, desde que o valor final seja validado.

### Ordenação

As despesas serão exibidas na ordem em que forem cadastradas.

Não é necessário ordenar por título, categoria ou valor.

### Categoria

A categoria deverá ser apresentada de forma legível e padronizada:

- Moradia
- Alimento
- Transporte
- Lazer
- Saúde
- Outros

### Total por categoria

Todas as seis categorias deverão ser exibidas na barra lateral, inclusive com valor zerado.

## 9. Critérios de aceite

### CA-01 — Primeiro acesso

- A aplicação abre sem erros.
- O total geral mostra `R$ 0,00`.
- Os seis totais por categoria mostram `R$ 0,00`.
- A lista exibe o estado vazio.
- Nenhuma despesa é carregada automaticamente.

### CA-02 — Cadastro válido

Quando o usuário cadastra uma despesa válida:

- O título aparece na lista.
- A categoria aparece na despesa.
- O valor aparece em formato brasileiro.
- O total geral aumenta pelo valor informado.
- O total da categoria correspondente aumenta pelo mesmo valor.
- Os campos do formulário são reiniciados.

### CA-03 — Validação

Quando o usuário tenta cadastrar sem título:

- Nenhuma despesa é adicionada.
- O campo título recebe indicação de erro.
- Uma mensagem de erro é exibida.

O mesmo comportamento deverá ocorrer para valor ausente, valor menor ou igual a zero e categoria não selecionada.

### CA-04 — Atualização de totais

Ao cadastrar duas despesas:

- O total geral será igual à soma dos dois valores.
- Cada categoria somará somente as despesas que lhe pertencem.
- Categoria sem despesas permanecerá com `R$ 0,00`.

### CA-05 — Recarregar página

Ao recarregar o navegador:

- A lista ficará vazia.
- Os totais voltarão a zero.
- Não serão usados dados persistidos.

### CA-06 — Responsividade

No desktop, a barra lateral deverá permanecer à esquerda do conteúdo.

Em largura móvel, o layout deverá ser legível, sem transbordamento e sem componentes inacessíveis.

### CA-07 — Eventos

Não deverá haver eventos inline no HTML.

Todos os eventos relevantes deverão estar registrados no TypeScript.

### CA-08 — Tipos

Todos os tipos definidos pelo projeto deverão residir em `src/types.ts`.

## 10. Implementação mínima

1. Criar `src/types.ts` com `Category` e `Expense`.
2. Criar o array de despesas em `src/main.ts`.
3. Criar o HTML da aplicação via template no TypeScript ou markup estático no `index.html`.
4. Registrar os eventos de submit e dos campos no TypeScript.
5. Implementar validação do formulário.
6. Implementar as funções de cálculo dos totais.
7. Implementar a renderização da lista e da barra lateral.
8. Aplicar os estilos responsivos em `src/style.css`.
9. Executar o build e corrigir erros de TypeScript ou Vite.
