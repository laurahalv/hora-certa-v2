const logoButton = document.querySelector(".perfil-image");
if (logoButton) {
  logoButton.addEventListener("click", function () {
    window.location.href = "pageMedicosConfig.html";
  });
}

// =============================================
// ===== DADOS DO MÉDICO (LOCALSTORAGE) ========
// =============================================
const LOGGED_MEDICO_ID = localStorage.getItem("medicoId");
const LOGGED_MEDICO_NOME = localStorage.getItem("medicoNome");
const CLINICA_ID = localStorage.getItem("clinicaId");

// =============================================
// ===== ESTADO GLOBAL DA SPA ==================
// =============================================
let pacientesAtuais = []; // Armazenará os pacientes vindos da API
let tabAtiva = "todos";

// ===== CARREGAMENTO INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  const txtMedicoNome = document.getElementById("loggedMedicoNome");
  if (txtMedicoNome) {
    txtMedicoNome.textContent = LOGGED_MEDICO_NOME
      ? `Dr(a). ${LOGGED_MEDICO_NOME}`
      : "Médico Responsável";
  }

  renderizarTabs();
  carregarPacientes(); // Busca os dados filtrados assim que a página carrega
});

// =============================================
// ===== UTILITÁRIOS ===========================
// =============================================
function corAdesao(valor) {
  if (valor >= 90) return { cor: "#22c55e", texto: "Excelente adesão" };
  if (valor >= 75) return { cor: "#f59e0b", texto: "Adesão moderada" };
  return { cor: "#ef4444", texto: "Adesão baixa" };
}

function inicialNome(nome) {
  return nome ? nome.charAt(0).toUpperCase() : "?";
}

function formatarDataBR(dataISO) {
  if (!dataISO) return "—";
  if (dataISO.includes("/")) return dataISO;
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// =============================================
// ===== REQUISIÇÕES DA API (FETCH GET) ========
// =============================================

async function carregarPacientes() {
  try {
    const response = await fetch(
      `http://localhost:8080/api/pacientes/medico/${LOGGED_MEDICO_ID}`,
    );
    if (!response.ok) throw new Error("Erro ao buscar pacientes do médico");

    pacientesAtuais = await response.json();
    console.log("Pacientes received from API:", pacientesAtuais);

    selecionarTab(tabAtiva);
  } catch (err) {
    console.error("Erro ao carregar pacientes:", err);
    const container = document.querySelector(".cards-container");
    if (container)
      container.innerHTML = `<p class="erro-api">Não foi possível carregar os seus pacientes.</p>`;
  }
}

// ===== CARREGAMENTO DE MEDICAMENTOS EM USO EM TEMPO REAL =====
async function carregarMedicamentosDoApi(pacienteId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/pacientes/${pacienteId}/medicamentos`,
    );
    if (!response.ok)
      throw new Error("Erro ao buscar medicamentos do paciente");

    const medicamentos = await response.json();
    console.log("Medicamentos recebidos da API:", medicamentos);
    
    // 1. Renderiza a lista de medicamentos nos cards inferiores
    renderizarMedicamentos(medicamentos);

    // 2. Sincroniza dinamicamente os contadores e cartões do topo baseado na listagem real do banco
    if (medicamentos && medicamentos.length > 0) {
      // Atualiza a contagem textual de Tratamentos Ativos
      const txtTratamentos = document.querySelector(".resumo-grid .resumo-card:nth-child(2) .resumo-valor");
      if (txtTratamentos) {
        txtTratamentos.textContent = medicamentos.length;
      }

      // Calcula a média de adesão aritmética real baseada no retorno dos objetos
      const somaAdesao = medicamentos.reduce((acc, med) => acc + (med.adesao || 0), 0);
      const mediaAdesao = Math.round(somaAdesao / medicamentos.length);

      // Captura os ponteiros do cartão de adesão
      const txtAdesao = document.querySelector(".resumo-grid .resumo-card:nth-child(1) .resumo-valor");
      const barraAdesao = document.querySelector(".resumo-grid .resumo-card:nth-child(1) .adesao-bar");
      const labelAdesao = document.querySelector(".resumo-grid .resumo-card:nth-child(1) .adesao-label");

      const statusAdesao = corAdesao(mediaAdesao);

      if (txtAdesao) {
        txtAdesao.textContent = `${mediaAdesao}%`;
        txtAdesao.style.color = statusAdesao.cor;
      }
      if (barraAdesao) {
        barraAdesao.style.width = `${mediaAdesao}%`;
        barraAdesao.style.background = statusAdesao.cor;
      }
      if (labelAdesao) {
        labelAdesao.textContent = statusAdesao.texto;
        labelAdesao.style.color = statusAdesao.cor;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar medicamentos:", err);
    renderizarMedicamentos([]); // Renderiza lista vazia em caso de erro
  }
}

// =============================================
// ===== TELA: LISTA DE PACIENTES ==============
// =============================================

function mostrarLista() {
  document.getElementById("tela-lista").style.display = "block";
  document.getElementById("tela-detalhe").style.display = "none";

  const tabList = document.querySelector(".tab-list");
  if (tabList) tabList.style.display = "flex";

  carregarPacientes();
}

function criarCard(paciente) {
  const { cor } = corAdesao(paciente.adesao || 0);
  const card = document.createElement("div");
  card.classList.add("card");

  let nomeMedicoExibir = LOGGED_MEDICO_NOME || "Você";
  if (paciente.medico) {
    nomeMedicoExibir =
      typeof paciente.medico === "object"
        ? paciente.medico.nome
        : paciente.medico;
  }

  card.innerHTML = `
    <div class="avatar">${inicialNome(paciente.nome)}</div>
    <div class="info-principal">
      <div class="nome">${paciente.nome}</div>
      <div class="contatos">
        <span class="contato-item">✉ ${paciente.email}</span>
        <span class="contato-item">☎ ${paciente.telefone || "—"}</span>
      </div>
    </div>
    <div class="divider-v"></div>
    <div class="col-medico">
      <div class="col-label">Médico</div>
      <div class="col-value">${nomeMedicoExibir}</div>
    </div>
    <div class="divider-v"></div>
    <div class="col-tratamentos">
      <div class="col-label">Tratamentos</div>
      <div class="tratamentos-num">${paciente.tratamentos || 0}</div>
    </div>
    <div class="divider-v"></div>
    <div class="col-adesao">
      <div class="col-label">Adesão</div>
      <div class="adesao-bar-bg">
        <div class="adesao-bar" style="width:${paciente.adesao || 0}%;background:${cor};"></div>
      </div>
      ${(paciente.adesao || 0) < 100 ? `<div class="adesao-valor" style="color:${cor};">${paciente.adesao || 0}%</div>` : ""}
    </div>
    <div class="divider-v"></div>
    <div class="col-consulta">
      <div class="col-label">Próxima consulta</div>
      <div class="consulta-data">📅 ${formatarDataBR(paciente.proximaConsulta)}</div>
    </div>
    <button class="btn-detalhes" onclick="verDetalhes(${paciente.id})">Ver detalhes</button>
  `;
  return card;
}

function renderizarPacientes(lista) {
  const container = document.querySelector(".cards-container");
  if (!container) return;
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = `<p style="color:#9ca3af; padding: 20px;">Você não possui nenhum paciente cadastrado nesta categoria.</p>`;
    return;
  }

  lista.forEach((p) => container.appendChild(criarCard(p)));
}

// =============================================
// ===== TELA: DETALHE DO PACIENTE =============
// =============================================

function verDetalhes(id) {
  const paciente = pacientesAtuais.find((p) => p.id === id);
  if (!paciente) return;

  const tabList = document.querySelector(".tab-list");
  if (tabList) tabList.style.display = "none";

  const { cor, texto } = corAdesao(paciente.adesao || 0);
  const tela = document.getElementById("tela-detalhe");

  let nomeMedicoExibir = LOGGED_MEDICO_NOME || "Você";
  if (paciente.medico) {
    nomeMedicoExibir =
      typeof paciente.medico === "object"
        ? paciente.medico.nome
        : paciente.medico;
  }

  tela.innerHTML = `
    <button class="btn-voltar" onclick="mostrarLista()">
      ← Voltar para a tela de pacientes
    </button>

    <div class="paciente-header">
      <div class="header-esquerda">
        <div class="avatar-grande">${inicialNome(paciente.nome)}</div>
        <div>
          <div class="paciente-nome">${paciente.nome}</div>
          <div class="paciente-contatos">
            <span>✉ ${paciente.email}</span>
            <span>☎ ${paciente.telefone || "—"}</span>
          </div>
        </div>
      </div>
      <div class="header-direita">
        <div class="col-label">Médico responsável</div>
        <div class="medico-nome">${nomeMedicoExibir}</div>
      </div>
    </div>

    <div class="resumo-grid">
      <div class="resumo-card">
        <div class="col-label">Adesão ao Tratamento</div>
        <div class="resumo-valor" style="color:${cor}">${paciente.adesao || 0}%</div>
        <div class="adesao-bar-bg" style="margin:10px 0 6px;">
          <div class="adesao-bar" style="width:${paciente.adesao || 0}%;background:${cor};"></div>
        </div>
        <div class="adesao-label" style="color:${cor}">${texto}</div>
      </div>

      <div class="resumo-card">
        <div class="col-label">Tratamentos Ativos</div>
        <div class="resumo-valor">${paciente.tratamentos || 0}</div>
        <div class="col-label" style="margin-top:6px;">Medicamentos em uso</div>
        <div class="resumo-icone">💊</div>
      </div>

      <div class="resumo-card">
        <div class="col-label">Próxima consulta</div>
        <div class="resumo-valor resumo-data">${formatarDataBR(paciente.proximaConsulta)}</div>
        <div class="col-label" style="margin-top:6px;">Última: ${formatarDataBR(paciente.ultimaConsulta)}</div>
        <div class="resumo-icone">📅</div>
      </div>
    </div>

    <div class="medicamentos-secao">
      <div class="medicamentos-header">
        <div>
          <h3>Medicamentos em Uso</h3>
          <p class="col-label">Lista de todos os medicamentos prescritos e suas respectivas adesões</p>
        </div>
        <button class="btn-add-medicamento" onclick="abrirModalMedicamento(${paciente.id})">
          + Adicionar Medicamento
        </button>
      </div>
      <div class="medicamentos-lista" id="medicamentosLista"></div>
    </div>
  `;

  document.getElementById("tela-lista").style.display = "none";
  tela.style.display = "block";

  // Busca os medicamentos em uso do paciente via API
  carregarMedicamentosDoApi(paciente.id);
}

function renderizarMedicamentos(medicamentos) {
  const fileira = document.getElementById("medicamentosLista");
  if (!fileira) return;

  if (!medicamentos || medicamentos.length === 0) {
    fileira.innerHTML = `<p style="color:#9ca3af;font-size:14px;">Nenhum medicamento cadastrado.</p>`;
    return;
  }

  fileira.innerHTML = medicamentos
    .map((med) => {
      const { cor } = corAdesao(med.adesao || 0);
      return `
      <div class="med-card">
        <div class="med-topo">
          <div>
            <div class="med-nome" style="font-weight: bold; color: #000;">${med.nome}</div>
            <div class="med-dose" style="color: #4b5563;">${med.dose} • ${med.frequencia}</div>
          </div>
          <div class="med-adesao-info">
            <div class="col-label">Adesão</div>
            <div class="med-adesao-valor" style="color:${cor}; font-weight: bold;">${med.adesao || 0}%</div>
          </div>
        </div>
        <div class="adesao-bar-bg" style="margin:10px 0 8px; background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
          <div class="adesao-bar" style="width:${med.adesao || 0}%; background:${cor}; height: 100%;"></div>
        </div>
        <div class="med-periodo" style="font-size: 12px; color: #6b7280;">
          Início: ${formatarDataBR(med.inicio)} • Término: ${formatarDataBR(med.termino)}
        </div>
      </div>
    `;
    })
    .join("");
}

// =============================================
// ===== GERENCIAMENTO DE CADASTROS / CONVITES =
// =============================================

async function cadastrarPaciente() {
  if (!CLINICA_ID || !LOGGED_MEDICO_NOME) {
    alert(
      "Erro de autenticação: Dados da clínica ou médico não encontrados. Faça login novamente.",
    );
    return;
  }

  const email = document.getElementById("pacEmail").value.trim();
  const nome = document.getElementById("pacNome").value.trim();

  if (!nome || !email) {
    alert("Preencha o Nome e o E-mail para enviar o convite.");
    return;
  }

  try {
    const url = new URL("http://localhost:8080/api/convites");
    url.searchParams.append("clinicaId", CLINICA_ID);
    url.searchParams.append("email", email);
    url.searchParams.append("tipo", "PACIENTE");
    url.searchParams.append("enviadoPor", LOGGED_MEDICO_NOME);
    url.searchParams.append("especialidade", "");
    url.searchParams.append("medicoId", LOGGED_MEDICO_ID);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Convite para o paciente enviado com sucesso!");
      fecharModal();
      await carregarPacientes();
    } else {
      const errorData = await response.json().catch(() => ({}));
      alert(
        "Erro ao enviar convite: " + (errorData.message || "Tente novamente."),
      );
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Falha na comunicação com o servidor.");
  }
}

async function salvarMedicamento(pacienteId) {
  const dados = {
    nome: document.getElementById("medNome").value.trim(),
    dose: document.getElementById("medDose").value.trim(),
    frequencia: document.getElementById("medFrequencia").value,
    inicio: document.getElementById("medInicio").value,
    termino: document.getElementById("medTermino").value,
    observacoes: document.getElementById("medObservacoes").value.trim(),
  };

  if (
    !dados.nome ||
    !dados.dose ||
    !dados.frequencia ||
    !dados.inicio ||
    !dados.termino
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    // Aponta para a rota de criação dinâmica configurada no seu PrescricaoController
    const response = await fetch(
      `http://localhost:8080/api/prescricoes/api/pacientes/${pacienteId}/medicamentos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      },
    );

    if (response.ok) {
      alert("Medicamento adicionado com sucesso!");
      fecharModalMedicamento();

      await carregarPacientes();
      verDetalhes(pacienteId); // Recarrega os detalhes forçando os novos contadores
    } else {
      alert("Erro ao adicionar medicamento no servidor.");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

// =============================================
// ===== TABS DE FILTRO DE ADESÃO ==============
// =============================================

const tabs = [
  { label: "Todos", valor: "todos" },
  { label: "Alta adesão", valor: "alta" },
  { label: "Média adesão", valor: "media" },
  { label: "Baixa adesão", valor: "baixa" },
  { label: "Filtrar por data", valor: "data" },
];

function renderizarTabs() {
  const container = document.querySelector(".tab-list");
  if (!container) return;

  container.innerHTML = tabs
    .map(
      (tab) => `
    <button
      class="tab-paciente ${tabAtiva === tab.valor ? "tab-paciente-ativa" : ""}"
      onclick="selecionarTab('${tab.valor}')">
      ${tab.label}
    </button>
  `,
    )
    .join("");
}

function selecionarTab(valor) {
  tabAtiva = valor;
  renderizarTabs();

  const existente = document.getElementById("filtroDataBox");
  if (existente && valor !== "data") existente.remove();

  if (valor === "data") {
    abrirFiltroData();
    return;
  }

  const filtrado = filtrarPorAdesao(valor);
  renderizarPacientes(filtrado);
}

function filtrarPorAdesao(valor) {
  switch (valor) {
    case "alta":
      return pacientesAtuais.filter((p) => (p.adesao || 0) >= 90);
    case "media":
      return pacientesAtuais.filter(
        (p) => (p.adesao || 0) >= 75 && (p.adesao || 0) < 90,
      );
    case "baixa":
      return pacientesAtuais.filter((p) => (p.adesao || 0) < 75);
    default:
      return pacientesAtuais;
  }
}

function abrirFiltroData() {
  const existente = document.getElementById("filtroDataBox");
  if (existente) return;

  const box = document.createElement("div");
  box.id = "filtroDataBox";
  box.innerHTML = `
    <label>De:</label>
    <input type="date" id="dataInicio">
    <label>Até:</label>
    <input type="date" id="dataFim">
    <button onclick="aplicarFiltroData()">Aplicar</button>
    <button onclick="document.getElementById('filtroDataBox').remove(); selecionarTab('todos')">Limpar</button>
  `;

  const tabList = document.querySelector(".tab-list");
  if (tabList) tabList.insertAdjacentElement("afterend", box);
}

function aplicarFiltroData() {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;

  if (!inicio && !fim) {
    renderizarPacientes(pacientesAtuais);
    return;
  }

  const filtrado = pacientesAtuais.filter((p) => {
    if (!p.proximaConsulta) return false;

    let dataFormatada = p.proximaConsulta;
    if (p.proximaConsulta.includes("/")) {
      const partes = p.proximaConsulta.split("/");
      dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    const data = new Date(dataFormatada);
    const de = inicio ? new Date(inicio) : null;
    const ate = fim ? new Date(fim) : null;

    if (de && data < de) return false;
    if (ate && data > ate) return false;
    return true;
  });

  renderizarPacientes(filtrado);
}

// =============================================
// ===== CONSTRUTORES DE MODAIS VISUAIS ========
// =============================================

function criarModal() {
  if (document.getElementById("modalPaciente")) return;
  const modal = document.createElement("div");
  modal.id = "modalPaciente";

  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModal()"></div>
    <div class="modal-box">
      <h2>Convidar Novo Paciente</h2>
      <p class="modal-sub">Insira os dados. O sistema criará a conta temporária automaticamente.</p>
      <div class="modal-campo">
        <label>Nome completo</label>
        <input type="text" id="pacNome" placeholder="Digite o nome do paciente">
      </div>
      <div class="modal-campo">
        <label>E-mail</label>
        <input type="email" id="pacEmail" placeholder="email@exemplo.com">
      </div>
      <div class="modal-campo">
        <label>Telefone <span class="label-opcional">(opcional)</span></label>
        <input type="text" id="pacTelefone" placeholder="(11) 91234-5678">
      </div>
      <div class="modal-campo">
        <label>Médico responsável</label>
        <select id="pacMedico" disabled style="background-color: #f3f4f6; cursor: not-allowed;">
          <option value="${LOGGED_MEDICO_ID}" selected>${LOGGED_MEDICO_NOME || "Você"}</option>
        </select>
      </div>
      <div class="modal-acoes">
        <button class="btn-cancelar" onclick="fecharModal()">Cancelar</button>
        <button class="btn-cadastrar" onclick="cadastrarPaciente()">Enviar Convite</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function abrirModal() {
  criarModal();
  requestAnimationFrame(() => {
    const modal = document.getElementById("modalPaciente");
    if (modal) modal.classList.add("ativo");
  });
}

function fecharModal() {
  const modal = document.getElementById("modalPaciente");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

function criarModalMedicamento(pacienteId) {
  if (document.getElementById("modalMedicamento")) return;
  const modal = document.createElement("div");
  modal.id = "modalMedicamento";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModalMedicamento()"></div>
    <div class="modal-box">
      <h2>Adicionar Medicamento</h2>
      <p class="modal-sub">Preencha os dados do medicamento para o paciente.</p>

      <div class="modal-campo">
        <label>Nome do medicamento</label>
        <input type="text" id="medNome" placeholder="Ex: Losartana 50mg">
      </div>

      <div class="modal-campo">
        <label>Dose</label>
        <input type="text" id="medDose" placeholder="Ex: 1 comprimido">
      </div>

      <div class="modal-campo">
        <label>Frequência</label>
        <select id="medFrequencia">
          <option value="">Selecione a frequência</option>
          <option value="1x ao dia">1x ao dia</option>
          <option value="2x ao dia">2x ao dia</option>
          <option value="3x ao dia">3x ao dia</option>
          <option value="A cada 8 horas">A cada 8 horas</option>
          <option value="A cada 12 horas">A cada 12 horas</option>
          <option value="Se necessário">Se necessário</option>
        </select>
      </div>

      <div class="modal-campo modal-campo-inline">
        <div>
          <label>Data de início</label>
          <input type="date" id="medInicio">
        </div>
        <div>
          <label>Data de término</label>
          <input type="date" id="medTermino">
        </div>
      </div>

      <div class="modal-campo">
        <label>Observações <span class="label-opcional">(opcional)</span></label>
        <textarea id="medObservacoes" placeholder="Ex: Tomar após as refeições..." rows="3"></textarea>
      </div>

      <div class="modal-acoes">
        <button class="btn-cancelar" onclick="fecharModalMedicamento()">Cancelar</button>
        <button class="btn-cadastrar" onclick="salvarMedicamento(${pacienteId})">Adicionar Medicamento</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function abrirModalMedicamento(pacienteId) {
  criarModalMedicamento(pacienteId);
  requestAnimationFrame(() => {
    const modal = document.getElementById("modalMedicamento");
    if (modal) modal.classList.add("ativo");
  });
}

function fecharModalMedicamento() {
  const modal = document.getElementById("modalMedicamento");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

// ===== ATRIBUIÇÃO DE GATILHOS INICIAIS =====
const btnAdicionar = document.querySelector(".addPaciente .btn");
if (btnAdicionar) {
  btnAdicionar.addEventListener("click", abrirModal);
}