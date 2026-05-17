// =============================================
// ===== ESTADO GLOBAL DA SPA ==================
// =============================================
const CLINICA_ID = localStorage.getItem("clinicaId");

let pacientes = [];
let medicosClinica = []; // Armazena a lista de médicos para popular os selects sem repetir fetches

// ===== CARREGAMENTO INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  if (!CLINICA_ID) {
    console.error("Clínica não encontrada no localStorage. Faça login novamente.");
    return;
  }

  inicializarEventos();
  carregarMedicosDaClinica(); // Primeiro carrega os médicos da clínica
});

function inicializarEventos() {
  const inputPesquisa = document.getElementById("inputPesquisa");
  const filtroMedico = document.getElementById("filtroMedico");
  const btnAdicionar = document.querySelector(".addPaciente .btn");

  if (inputPesquisa) inputPesquisa.addEventListener("input", filtrarPainelPacientes);
  if (filtroMedico) filtroMedico.addEventListener("change", filtrarPainelPacientes);
  if (btnAdicionar) btnAdicionar.addEventListener("click", abrirModal);
}

// =============================================
// ===== UTILITÁRIOS ===========================
// =============================================
function corAdesao(valor) {
  const n = valor || 0;
  if (n >= 90) return { cor: "#22c55e", texto: "Excelente adesão" };
  if (n >= 75) return { cor: "#f59e0b", texto: "Adesão moderada" };
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
// ===== REQUISIÇÕES DA API (FETCH) ============
// =============================================

async function carregarMedicosDaClinica() {
  try {
    const response = await fetch(`http://localhost:8080/api/medicos/clinica/${CLINICA_ID}`);
    if (!response.ok) throw new Error("Erro ao buscar médicos da clínica");
    
    medicosClinica = await response.json();
    
    // Popula o filtro principal do topo da tela
    const selectFiltro = document.getElementById("filtroMedico");
    if (selectFiltro) {
      medicosClinica.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.nome;
        selectFiltro.appendChild(opt);
      });
    }

    // Com os médicos carregados, busca os pacientes com segurança
    await carregarPacientes();
  } catch (err) {
    console.error("Falha ao inicializar lista de médicos:", err);
    await carregarPacientes(); // Tenta carregar pacientes mesmo se os médicos falharem
  }
}

async function carregarPacientes() {
  try {
    // Rota mapeada no seu PacienteController que retorna a lista estruturada com DTOs da clínica
    const response = await fetch(`http://localhost:8080/api/pacientes/clinica/${CLINICA_ID}`);
    if (!response.ok) throw new Error("Erro ao obter lista de pacientes da clínica");

    pacientes = await response.json();
    renderizarPacientes(pacientes);
  } catch (error) {
    console.error("Erro ao carregar pacientes:", error);
    const container = document.querySelector(".cards-container");
    if (container) container.innerHTML = `<p class="erro-api">Não foi possível processar a lista de pacientes.</p>`;
  }
}

// ===== AÇÃO CRÍTICA: ATRIBUIR / REATRIBUIR MÉDICO AO PACIENTE =====
async function reatribuirMedico(pacienteId, novoMedicoId) {
  try {
    const response = await fetch(`http://localhost:8080/api/pacientes/${pacienteId}/vincular-medico`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicoId: novoMedicoId ? Number(novoMedicoId) : null })
    });

    if (!response.ok) throw new Error("Erro na reatribuição do especialista");

    alert("Médico responsável atualizado com sucesso!");
    await carregarPacientes(); // Recarrega o estado atualizado do banco
  } catch (err) {
    console.error("Erro ao reatribuir médico:", err);
    alert("Falha ao atualizar médico responsável no servidor.");
    await carregarPacientes(); // Reverte alterações visuais na tela voltando ao estado original
  }
}

// =============================================
// ===== TELA: LISTA DE PACIENTES ==============
// =============================================

function mostrarLista() {
  document.getElementById("tela-lista").style.display = "block";
  document.getElementById("tela-detalhe").style.display = "none";
  carregarPacientes();
}

function criarCard(paciente) {
  const { cor } = corAdesao(paciente.adesao || 0);
  const card = document.createElement("div");
  card.classList.add("card");

  // Cria as opções do select de médicos baseado no estado global da clínica
  const opcoesMedicos = medicosClinica.map(m => `
    <option value="${m.id}" ${paciente.medicoId === m.id ? "selected" : ""}>${m.nome}</option>
  `).join("");

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
      <div class="col-label">Médico Responsável</div>
      <select class="select-reatribuir" onchange="reatribuirMedico(${paciente.id}, this.value)">
        <option value="">Nenhum médico vinculado</option>
        ${opcoesMedicos}
      </select>
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
    container.innerHTML = `<p style="color:#9ca3af; padding: 20px;">Nenhum paciente localizado para os filtros informados.</p>`;
    return;
  }

  lista.forEach((p) => container.appendChild(criarCard(p)));
}

function filtrarPainelPacientes() {
  const termo = document.getElementById("inputPesquisa").value.toLowerCase().trim();
  const medicoIdSelecionado = document.getElementById("filtroMedico").value;

  const filtrados = pacientes.filter(p => {
    const bateTexto = p.nome.toLowerCase().includes(termo) || 
                      p.email.toLowerCase().includes(termo) || 
                      (p.cpf && p.cpf.includes(termo));
    
    const bateMedico = !medicoIdSelecionado || String(p.medicoId) === String(medicoIdSelecionado);

    return bateTexto && bateMedico;
  });

  renderizarPacientes(filtrados);
}

// =============================================
// ===== TELA: DETALHE DO PACIENTE =============
// =============================================

function verDetalhes(id) {
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) return;

  const { cor, texto } = corAdesao(paciente.adesao || 0);
  const tela = document.getElementById("tela-detalhe");

  const opcoesMedicos = medicosClinica.map(m => `
    <option value="${m.id}" ${paciente.medicoId === m.id ? "selected" : ""}>${m.nome}</option>
  `).join("");

  tela.innerHTML = `
    <button class="btn-voltar" onclick="mostrarLista()">
      ← Voltar para a lista de pacientes
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
        <div class="col-label">Gerenciar Atribuição de Especialista</div>
        <select class="select-reatribuir-detalhe" onchange="reatribuirMedico(${paciente.id}, this.value)">
          <option value="">Sem médico responsável</option>
          ${opcoesMedicos}
        </select>
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
        <div class="col-label" style="margin-top:6px;">Última Consulta: ${formatarDataBR(paciente.ultimaConsulta)}</div>
        <div class="resumo-icone">📅</div>
      </div>
    </div>

    <div class="medicamentos-secao">
      <h3>Medicamentos em Uso</h3>
      <p class="col-label">Lista de todos os medicamentos prescritos e suas respectivas adesões</p>
      <div class="medicamentos-lista" id="medicamentosLista"></div>
    </div>
  `;

  document.getElementById("tela-lista").style.display = "none";
  tela.style.display = "block";

  renderizarMedicamentos(paciente.medicamentos || []);
}

function renderizarMedicamentos(medicamentos) {
  const lista = document.getElementById("medicamentosLista");
  if (!lista) return;

  if (!medicamentos || medicamentos.length === 0) {
    lista.innerHTML = `<p style="color:#9ca3af;font-size:14px;">Nenhum medicamento ativo registrado.</p>`;
    return;
  }
  
  lista.innerHTML = medicamentos.map((med) => {
      const { cor } = corAdesao(med.adesao || 0);
      return `
      <div class="med-card">
        <div class="med-topo">
          <div>
            <div class="med-nome">${med.nome}</div>
            <div class="med-dose">${med.dose} • ${med.frequencia}</div>
          </div>
          <div class="med-adesao-info">
            <div class="col-label">Adesão</div>
            <div class="med-adesao-valor" style="color:${cor}">${med.adesao || 0}%</div>
          </div>
        </div>
        <div class="adesao-bar-bg" style="margin:10px 0 8px;">
          <div class="adesao-bar" style="width:${med.adesao || 0}%;background:${cor};"></div>
        </div>
        <div class="med-periodo">Início: ${formatarDataBR(med.inicio)} • Término: ${formatarDataBR(med.termino)}</div>
      </div>
    `;
    }).join("");
}

// =============================================
// ===== GERENCIAMENTO DE MODAIS ===============
// =============================================

function criarModal() {
  if (document.getElementById("modalPaciente")) return;
  const modal = document.createElement("div");
  modal.id = "modalPaciente";
  
  const opcoesMedicos = medicosClinica.map(m => `
    <option value="${m.id}">${m.nome}</option>
  `).join("");

  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModal()"></div>
    <div class="modal-box">
      <h2>Cadastrar Novo Paciente</h2>
      <p class="modal-sub">Insira os dados cadastrais do paciente na clínica.</p>
      <div class="modal-campo">
        <label>Nome completo</label>
        <input type="text" id="pacNome" placeholder="Digite o nome do paciente">
      </div>
      <div class="modal-campo">
        <label>E-mail</label>
        <input type="email" id="pacEmail" placeholder="email@exemplo.com">
      </div>
      <div class="modal-campo">
        <label>Telefone</label>
        <input type="text" id="pacTelefone" placeholder="(11) 91234-5678">
      </div>
      <div class="modal-campo">
        <label>Médico responsável</label>
        <select id="pacMedico">
          <option value="">Deixar sem vínculo inicial</option>
          ${opcoesMedicos}
        </select>
      </div>
      <div class="modal-acoes">
        <button class="btn-cancelar" onclick="fecharModal()">Cancelar</button>
        <button class="btn-cadastrar" onclick="cadastrarPaciente()">Cadastrar paciente</button>
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

async function cadastrarPaciente() {
  const dados = {
    nome: document.getElementById("pacNome").value.trim(),
    email: document.getElementById("pacEmail").value.trim(),
    telefone: document.getElementById("pacTelefone").value.trim(),
    cpf: "000.000.000-00", 
    clinicaId: Number(CLINICA_ID),
    medicoId: document.getElementById("pacMedico").value ? Number(document.getElementById("pacMedico").value) : null
  };

  if (!dados.nome || !dados.email) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (response.ok) {
      fecharModal();
      await carregarPacientes();
    } else {
      alert("Erro ao cadastrar paciente.");
    }
  } catch (err) {
    console.error("Erro na criação do paciente:", err);
  }
}