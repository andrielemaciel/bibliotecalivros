const API = "http://localhost:3000/brinquedos";
const botaoListar = document.getElementById("btnListar");
const tabela = document.getElementById("tabelaBrinquedos");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");
const campoFaixaEtaria = document.getElementById("faixaEtaria");
const campoPreco = document.getElementById("preco");
const campoImagem = document.getElementById("imagem");
const previaImagem = document.getElementById("previaImagem");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
let idEdicao = null;
let imagemAtual = null;
let urlPreviaImagem = null;

botaoListar.addEventListener("click", buscarBrinquedos);
formulario.addEventListener("submit", salvarBrinquedo);
botaoCancelar.addEventListener("click", limparFormulario);
campoImagem.addEventListener("change", atualizarPreviaImagem);
previaImagem.addEventListener("error", () => {
  previaImagem.hidden = true;
});

function formatarPreco(preco) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function buscarBrinquedos() {
  try {
    mensagem.textContent = "Carregando brinquedos...";
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
    const brinquedos = await resposta.json();
    tabela.innerHTML = "";
    if (brinquedos.length === 0) {
      mensagem.textContent = "Nenhum brinquedo cadastrado.";
      return;
    }
    for (const brinquedo of brinquedos) {
      const linha = document.createElement("tr");
      const celulaImagem = document.createElement("td");
      if (brinquedo.imagem_url) {
        const imagem = document.createElement("img");
        imagem.src = obterUrlImagem(brinquedo.imagem_url);
        imagem.alt = `Imagem de ${brinquedo.nome}`;
        imagem.className = "miniatura-brinquedo";
        imagem.loading = "lazy";
        imagem.addEventListener("error", () => {
          imagem.replaceWith(document.createTextNode("Indisponível"));
        }, { once: true });
        celulaImagem.appendChild(imagem);
      } else {
        celulaImagem.textContent = "Sem imagem";
      }
      linha.appendChild(celulaImagem);
      const valores = [brinquedo.id, brinquedo.nome, brinquedo.categoria, brinquedo.faixa_etaria, formatarPreco(brinquedo.preco)];
      for (const valor of valores) {
        const celula = document.createElement("td");
        celula.textContent = valor;
        linha.appendChild(celula);
      }
      const acoes = document.createElement("td");
      const editar = document.createElement("button");
      editar.textContent = "Editar";
      editar.className = "pequeno";
      editar.addEventListener("click", () => editarBrinquedo(brinquedo.id));
      const excluir = document.createElement("button");
      excluir.textContent = "Excluir";
      excluir.className = "pequeno perigo";
      excluir.addEventListener("click", () => excluirBrinquedo(brinquedo.id));
      acoes.append(editar, excluir);
      linha.appendChild(acoes);
      tabela.appendChild(linha);
    }
    mensagem.textContent = `${brinquedos.length} brinquedo(s) encontrado(s).`;
  } catch (erro) {
    mensagem.textContent = "Não foi possível carregar os brinquedos. Confira se a API e o banco estão funcionando.";
    console.error(erro);
  }
}

function obterDadosFormulario() {
  return {
    nome: campoNome.value.trim(),
    categoria: campoCategoria.value,
    faixa_etaria: campoFaixaEtaria.value,
    preco: Number(campoPreco.value)
  };
}

async function salvarBrinquedo(evento) {
  evento.preventDefault();
  const brinquedo = obterDadosFormulario();
  const formularioDados = new FormData();
  for (const [campo, valor] of Object.entries(brinquedo)) {
    formularioDados.append(campo, valor);
  }
  if (campoImagem.files[0]) formularioDados.append("imagem", campoImagem.files[0]);
  try {
    const resposta = await fetch(idEdicao === null ? API : `${API}/${idEdicao}`, {
      method: idEdicao === null ? "POST" : "PUT",
      body: formularioDados
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível salvar.");
    mensagem.textContent = dados.mensagem;
    limparFormulario();
    await buscarBrinquedos();
  } catch (erro) {
    mensagem.textContent = erro.message || "Não foi possível salvar o brinquedo.";
    console.error(erro);
  }
}

async function editarBrinquedo(id) {
  try {
    const resposta = await fetch(`${API}/${id}`);
    const brinquedo = await resposta.json();
    if (!resposta.ok) throw new Error(brinquedo.mensagem || "Brinquedo não encontrado.");
    campoNome.value = brinquedo.nome;
    campoCategoria.value = brinquedo.categoria;
    campoFaixaEtaria.value = brinquedo.faixa_etaria;
    campoPreco.value = Number(brinquedo.preco).toFixed(2);
    campoImagem.value = "";
    imagemAtual = brinquedo.imagem_url || null;
    atualizarPreviaImagem();
    idEdicao = brinquedo.id;
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;
    tituloFormulario.textContent = `Editar brinquedo #${id}`;
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    mensagem.textContent = `Editando o brinquedo de ID ${id}.`;
  } catch (erro) {
    mensagem.textContent = erro.message;
  }
}

async function excluirBrinquedo(id) {
  if (!confirm("Deseja realmente excluir este brinquedo?")) return;
  try {
    const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível excluir.");
    mensagem.textContent = dados.mensagem;
    if (idEdicao === id) limparFormulario();
    await buscarBrinquedos();
  } catch (erro) {
    mensagem.textContent = erro.message || "Não foi possível excluir o brinquedo.";
  }
}

function limparFormulario() {
  formulario.reset();
  if (urlPreviaImagem) URL.revokeObjectURL(urlPreviaImagem);
  urlPreviaImagem = null;
  imagemAtual = null;
  previaImagem.hidden = true;
  previaImagem.removeAttribute("src");
  idEdicao = null;
  botaoSalvar.textContent = "Cadastrar brinquedo";
  botaoCancelar.hidden = true;
  tituloFormulario.textContent = "Cadastrar brinquedo";
}

function atualizarPreviaImagem() {
  const arquivo = campoImagem.files[0];
  if (arquivo && !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(arquivo.type)) {
    campoImagem.value = "";
    mensagem.textContent = "Escolha uma imagem JPG, PNG, WEBP ou GIF.";
    previaImagem.hidden = true;
    return;
  }
  if (arquivo && arquivo.size > 5 * 1024 * 1024) {
    campoImagem.value = "";
    mensagem.textContent = "A imagem deve ter no máximo 5 MB.";
    previaImagem.hidden = true;
    return;
  }
  if (urlPreviaImagem) {
    URL.revokeObjectURL(urlPreviaImagem);
    urlPreviaImagem = null;
  }
  if (arquivo) {
    mensagem.textContent = "Imagem selecionada. Preencha os dados e salve o brinquedo.";
    urlPreviaImagem = URL.createObjectURL(arquivo);
    previaImagem.src = urlPreviaImagem;
    previaImagem.hidden = false;
    return;
  }
  if (imagemAtual) {
    previaImagem.src = obterUrlImagem(imagemAtual);
    previaImagem.hidden = false;
    return;
  }
  if (!arquivo) {
    previaImagem.hidden = true;
    previaImagem.removeAttribute("src");
  }
}

function obterUrlImagem(caminho) {
  try {
    return new URL(caminho, API).href;
  } catch {
    return "";
  }
}

buscarBrinquedos();
