import "./style.css";
import type { Category, CategoryOption, Expense, TotalsByCategory } from "./types";

const categorias: CategoryOption[] = [
  { value: "moradia", label: "Moradia" },
  { value: "alimento", label: "Alimento" },
  { value: "transporte", label: "Transporte" },
  { value: "lazer", label: "Lazer" },
  { value: "saúde", label: "Saúde" },
  { value: "outros", label: "Outros" },
];

const despesas: Expense[] = [];
let proximoId = 1;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Elemento raiz da aplicação não encontrado.");
}

app.innerHTML = `
  <main class="painel">
    <aside class="resumo" aria-label="Resumo das despesas">
      <h1>Painel de despesas</h1>

      <section class="total-geral">
        <p>Total geral</p>
        <strong id="total-geral">R$ 0,00</strong>
      </section>

      <section class="totais-categorias" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias">Por categoria</h2>
        <ul id="lista-totais">
          ${categorias
            .map(
              (categoria) => `
                <li>
                  <span>${categoria.label}</span>
                  <strong id="total-${categoria.value}">R$ 0,00</strong>
                </li>
              `,
            )
            .join("")}
        </ul>
      </section>
    </aside>

    <div class="conteudo">
      <section class="card formulario-card" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Nova despesa</h2>

        <form id="form-despesa" novalidate>
          <div class="campo">
            <label for="titulo">Título</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ex.: Aluguel"
              aria-describedby="erro-titulo"
            />
            <span class="erro" id="erro-titulo" aria-live="polite"></span>
          </div>

          <div class="campo">
            <label for="valor">Valor</label>
            <input
              id="valor"
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              placeholder="0,00"
              aria-describedby="erro-valor"
            />
            <span class="erro" id="erro-valor" aria-live="polite"></span>
          </div>

          <div class="campo">
            <label for="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              aria-describedby="erro-categoria"
            >
              <option value="">Selecione uma categoria</option>
              ${categorias
                .map(
                  (categoria) =>
                    `<option value="${categoria.value}">${categoria.label}</option>`,
                )
                .join("")}
            </select>
            <span class="erro" id="erro-categoria" aria-live="polite"></span>
          </div>

          <button type="submit">Adicionar despesa</button>
          <p class="feedback" id="feedback" aria-live="polite"></p>
        </form>
      </section>

      <section class="despesas" aria-labelledby="titulo-despesas">
        <h2 id="titulo-despesas">Despesas</h2>
        <div id="lista-despesas" class="lista-despesas">
          <p class="estado-vazio">Nenhuma despesa cadastrada.</p>
        </div>
      </section>
    </div>
  </main>
`;

function obterElemento<T extends HTMLElement>(seletor: string): T {
  const elemento = document.querySelector<T>(seletor);

  if (!elemento) {
    throw new Error(`Elemento obrigatório não encontrado: ${seletor}`);
  }

  return elemento;
}

const formulario = obterElemento<HTMLFormElement>("#form-despesa");
const campoTitulo = obterElemento<HTMLInputElement>("#titulo");
const campoValor = obterElemento<HTMLInputElement>("#valor");
const campoCategoria = obterElemento<HTMLSelectElement>("#categoria");
const listaDespesas = obterElemento<HTMLDivElement>("#lista-despesas");
const feedback = obterElemento<HTMLParagraphElement>("#feedback");
const totalGeral = obterElemento<HTMLElement>("#total-geral");

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarMoeda(valor: number): string {
  return formatadorMoeda.format(valor);
}

function calcularTotaisPorCategoria(): TotalsByCategory {
  const totais: TotalsByCategory = {
    moradia: 0,
    alimento: 0,
    transporte: 0,
    lazer: 0,
    saúde: 0,
    outros: 0,
  };

  for (const despesa of despesas) {
    totais[despesa.categoria] += despesa.valor;
  }

  return totais;
}

function obterLabelCategoria(categoria: Category): string {
  const opcao = categorias.find((item) => item.value === categoria);
  return opcao?.label ?? categoria;
}

function renderizarDespesas(): void {
  listaDespesas.replaceChildren();

  if (despesas.length === 0) {
    const estadoVazio = document.createElement("p");
    estadoVazio.className = "estado-vazio";
    estadoVazio.textContent = "Nenhuma despesa cadastrada.";
    listaDespesas.append(estadoVazio);
    return;
  }

  for (const despesa of despesas) {
    const item = document.createElement("article");
    item.className = "despesa";

    const informacoes = document.createElement("div");
    informacoes.className = "despesa-info";

    const titulo = document.createElement("h3");
    titulo.textContent = despesa.titulo;

    const categoria = document.createElement("span");
    categoria.className = "categoria";
    categoria.textContent = obterLabelCategoria(despesa.categoria);

    const valor = document.createElement("strong");
    valor.className = "despesa-valor";
    valor.textContent = formatarMoeda(despesa.valor);

    informacoes.append(titulo, categoria);
    item.append(informacoes, valor);
    listaDespesas.append(item);
  }
}

function renderizarTotais(): void {
  const totais = calcularTotaisPorCategoria();
  const soma = despesas.reduce((total, despesa) => total + despesa.valor, 0);

  totalGeral.textContent = formatarMoeda(soma);

  for (const categoria of categorias) {
    const elemento = document.querySelector<HTMLElement>(
      `#total-${categoria.value}`,
    );

    if (elemento) {
      elemento.textContent = formatarMoeda(totais[categoria.value]);
    }
  }
}

function limparErro(campo: HTMLInputElement | HTMLSelectElement): void {
  campo.classList.remove("invalido");
  campo.removeAttribute("aria-invalid");

  const elementoErro = document.querySelector<HTMLElement>(
    `#erro-${campo.name}`,
  );
  if (elementoErro) {
    elementoErro.textContent = "";
  }
}

function mostrarErro(
  campo: HTMLInputElement | HTMLSelectElement,
  mensagem: string,
): void {
  campo.classList.add("invalido");
  campo.setAttribute("aria-invalid", "true");

  const elementoErro = document.querySelector<HTMLElement>(
    `#erro-${campo.name}`,
  );
  if (elementoErro) {
    elementoErro.textContent = mensagem;
  }
}

function validarFormulario(): Expense | null {
  limparErro(campoTitulo);
  limparErro(campoValor);
  limparErro(campoCategoria);

  const titulo = campoTitulo.value.trim();
  const textoValor = campoValor.value;
  const valor = Number(textoValor);
  const categoria = campoCategoria.value as Category | "";

  let formularioValido = true;

  if (!titulo) {
    mostrarErro(campoTitulo, "Informe um título para a despesa.");
    formularioValido = false;
  }

  if (!textoValor) {
    mostrarErro(campoValor, "Informe o valor da despesa.");
    formularioValido = false;
  } else if (!Number.isFinite(valor) || valor <= 0) {
    mostrarErro(campoValor, "O valor deve ser maior que zero.");
    formularioValido = false;
  } else if (!/^\d+(\.\d{1,2})?$/.test(textoValor)) {
    mostrarErro(campoValor, "Use até duas casas decimais.");
    formularioValido = false;
  }

  if (!categoria) {
    mostrarErro(campoCategoria, "Selecione uma categoria.");
    formularioValido = false;
  }

  if (!formularioValido) {
    return null;
  }

  return {
    id: String(proximoId++),
    titulo,
    valor: Math.round(valor * 100) / 100,
    categoria: categoria as Category,
  };
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const novaDespesa = validarFormulario();
  if (!novaDespesa) {
    feedback.textContent = "";
    return;
  }

  despesas.push(novaDespesa);
  formulario.reset();
  renderizarDespesas();
  renderizarTotais();

  feedback.textContent = "Despesa adicionada.";
});

campoTitulo.addEventListener("input", () => limparErro(campoTitulo));
campoValor.addEventListener("input", () => limparErro(campoValor));
campoCategoria.addEventListener("change", () => limparErro(campoCategoria));

renderizarDespesas();
renderizarTotais();