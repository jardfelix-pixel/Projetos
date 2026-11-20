# Tarefas de implementação — Clima

Este arquivo divide a implementação do [PRD](./prd.md) em etapas progressivas para execução, uma tarefa por vez, por agentes de IA. O PRD é a fonte de verdade para os requisitos completos; as referências abaixo apontam para as seções que cada tarefa deve cumprir, sem repetir suas especificações.

## Instruções de execução

- Executar as tarefas na ordem apresentada. Cada tarefa depende da conclusão das anteriores.
- Antes de começar uma tarefa, ler suas referências no PRD e inspecionar o código existente.
- Implementar somente o escopo da tarefa atual; preservar mudanças existentes e não antecipar etapas futuras.
- Marcar `[x]` somente depois de cumprir todos os critérios de aprovação da tarefa.
- Ao concluir, informar arquivos alterados, verificações realizadas e qualquer bloqueio. Não marcar como concluída se algum critério falhar.

## Etapas

- [x] **T01 — Preparar a estrutura inicial da aplicação**

  **Referência no PRD:** RF-01; seções 3, 5 e 7.

  Remover a experiência de demonstração padrão do Vite e preparar a estrutura semântica da aplicação Clima, incluindo a área superior para busca e o contêiner principal com espaço para a barra lateral e a área principal. Implementar o estado vazio inicial, sem dados meteorológicos fictícios, e a base visual global descrita no PRD.

  **Critérios de aprovação:**
  - Ao abrir a aplicação sem pesquisar, aparece um estado vazio em português e não aparecem elementos de demonstração do Vite ou do TypeScript.
  - A composição inicial tem fundo azul-escuro, área superior sem painel de fundo e contêiner de resultados branco, centralizado, arredondado e com largura máxima de 800 px.
  - A estrutura prevê semanticamente a barra lateral e a área principal sem exibir resultados inventados.
  - O build de produção existente do projeto termina sem erros.

- [x] **T02 — Implementar o módulo de integração com Open-Meteo**

  **Referência no PRD:** RF-02, RF-03 e RF-06; seção 6, “Integração Open-Meteo” e “Organização do código”.

  Criar um módulo dedicado para as chamadas de geocodificação e clima. Definir tipos para as respostas e os dados necessários; montar os parâmetros de URL com codificação apropriada; validar parâmetros, respostas HTTP, formato e campos necessários. A busca deve usar o primeiro resultado de geocodificação. Não implementar chamadas diretas aos endpoints na interface.

  **Critérios de aprovação:**
  - A geocodificação usa o endpoint e os parâmetros especificados no PRD e retorna os campos necessários da primeira cidade encontrada.
  - A consulta de clima só é feita após uma localização válida e usa latitude, longitude e fuso horário dessa localização.
  - O módulo trata resposta sem resultados, parâmetros ausentes, resposta inválida, erro HTTP e falha de rede sem retornar sucesso falso.
  - URLs e parâmetros dos endpoints ficam encapsulados no módulo; o restante da aplicação não chama esses endpoints diretamente.
  - O projeto compila sem erros de TypeScript.

- [x] **T03 — Implementar interpretação e formatação dos dados meteorológicos**

  **Referência no PRD:** RF-04 e RF-05; seção 6, “Clima atual” e “Códigos de condição do tempo”.

  Implementar a interpretação dos dados validados da API: descrição dos códigos WMO da tabela do brain dump, apresentação das unidades retornadas, data e horário local, e determinação de dia/noite usando `is_day` ou a regra de fallback do PRD.

  **Critérios de aprovação:**
  - Cada código WMO listado no brain dump tem uma descrição correspondente; um código desconhecido resulta em descrição neutra e não impede a apresentação dos outros dados.
  - Os valores obrigatórios e suas unidades são disponibilizados para a interface, sem substituir unidades retornadas pela API por valores incompatíveis.
  - Data e horário são interpretados no fuso horário da cidade.
  - `is_day = 1` resulta em dia e `is_day = 0` resulta em noite; quando ausente, o horário local entre 06:00 e 17:59 resulta em dia e os demais horários em noite.
  - Valores ou campos obrigatórios inválidos são rejeitados como dados utilizáveis, de acordo com o comportamento sem resultado do PRD.

- [x] **T04 — Implementar o formulário de busca e o fluxo de consulta**

  **Referência no PRD:** RF-02, RF-03, RF-06 e RF-07; seções 5, 6 e 7.

  Implementar o campo de cidade e a ação de busca, conectando a interface ao módulo Open-Meteo. Orquestrar a geocodificação e a consulta de clima como uma única busca, controlando os estados de carregamento, sucesso e sem resultado.

  **Critérios de aprovação:**
  - Uma busca válida inicia a geocodificação e, se houver cidade válida, a consulta do clima, mantendo um único estado de carregamento até o fim das duas etapas.
  - Campo vazio ou composto apenas por espaços não inicia requisições.
  - Durante a busca, a interface comunica claramente que está carregando e não apresenta conclusão prematura.
  - Cidade não encontrada, dados climáticos inutilizáveis ou erro de rede terminam em estado sem resultado, sem deixar a interface carregando indefinidamente nem exibir dados desatualizados como resultado atual.
  - Depois de uma busca sem resultado, a pessoa usuária pode corrigir a cidade e tentar novamente.

- [x] **T05 — Exibir os resultados da consulta**

  **Referência no PRD:** RF-04, RF-05 e RF-08; seções 6 e 7.

  Conectar os dados interpretados à apresentação da barra lateral e da área principal, seguindo a hierarquia visual e a distribuição de informações especificadas no PRD.

  **Critérios de aprovação:**
  - A barra lateral apresenta temperatura atual, nome da cidade, UF brasileira quando disponível, código do país, data local, dia/noite e descrição de `weather_code`; o ícone de localização abre as coordenadas da cidade no Google Maps em nova guia.
  - A área principal apresenta umidade relativa, temperatura aparente, probabilidade de precipitação e velocidade/direção do vento.
  - Cada valor é acompanhado de sua unidade; nenhum campo obrigatório é apresentado como dado válido quando ausente ou inválido.
  - A interface distingue visualmente estado inicial, carregamento, sem resultado e resultado.
  - Uma nova busca substitui os dados anteriores somente quando o novo resultado válido estiver pronto; falhas não deixam dados antigos parecerem atuais.
  - O histórico persistido contém no máximo 10 localizações únicas, ordenadas por busca bem-sucedida mais recente; selecionar uma atualiza e exibe seus dados climáticos.

- [x] **T06 — Finalizar responsividade e acessibilidade**

  **Referência no PRD:** seção 5; seção 7, “Responsividade e acessibilidade”.

  Ajustar a interface completa para telas estreitas e largas e verificar a acessibilidade dos controles, dos estados e das informações exibidas.

  **Critérios de aprovação:**
  - Em viewport estreita, a barra lateral e a área principal se reorganizam sem rolagem horizontal e continuam legíveis.
  - O campo de busca tem rótulo acessível; os controles podem ser operados por teclado e têm foco visível.
  - Mensagens de carregamento e sem resultado são compreensíveis sem depender exclusivamente de cor.
  - O contraste entre conteúdo e fundos permite a leitura da interface.
  - A apresentação continua utilizável nos quatro estados definidos no PRD.

- [x] **T07 — Validar o fluxo completo e corrigir regressões**

  **Referência no PRD:** seção 8, “Critérios de aceite”; seções 5 a 7.

  Executar o build e validar o fluxo integrado, cobrindo uma busca bem-sucedida e os principais estados de falha. Usar as ferramentas de validação já existentes no projeto; não introduzir infraestrutura de teste sem necessidade ou autorização.

  **Critérios de aprovação:**
  - O build de produção termina sem erros.
  - Uma busca bem-sucedida exibe todos os dados requeridos, com unidades, data local e dia/noite corretos.
  - São verificados os cenários de cidade não encontrada, falha de rede ou resposta inválida, nova tentativa após falha e ausência de `is_day`.
  - Os critérios de aceite do PRD foram revisados e nenhum requisito funcional, técnico ou visual desta versão ficou sem implementação.
  - O resultado da validação e qualquer limitação restante são informados antes de marcar a tarefa como concluída.
