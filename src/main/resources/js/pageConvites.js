// ===== DADOS DOS CONVITES =====
const convites = [
  {
    id: 1,
    email: "dr.ricardo@email.com",
    status: "Expirado",
    enviadoPor: "Administrador Clínica",
    data: "14/03/2026",
    tipo: "Médico"
  },
  {
    id: 2,
    email: "dra.patricia@email.com",
    status: "Expirado",
    enviadoPor: "Administrador Clínica",
    data: "17/03/2026",
    tipo: "Médico"
  },
  {
    id: 3,
    email: "lucas.ferreira@email.com",
    status: "Aceito",
    enviadoPor: "Dr. Carlos Silva",
    data: "09/03/2026",
    tipo: "Paciente"
  },
  {
    id: 4,
    email: "camila.rodrigues@email.com",
    status: "Pendente",
    enviadoPor: "Dra. Maria Santos",
    data: "27/02/2026",
    tipo: "Paciente"
  }
];

// ===== FILTRO ATIVO =====
let filtroAtivo = "Todos";


// ===== CONFIGURAÇÕES POR STATUS =====
function configStatus(status) {
  switch (status) {
    case "Pendente":  return { cor: "#f59e0b", bg: "#fef9c3", icone: iconePendente() };
    case "Aceito":    return { cor: "#22c55e", bg: "#dcfce7", icone: iconeAceito() };
    case "Expirado":  return { cor: "#ef4444", bg: "#fee2e2", icone: iconeExpirado() };
    default:          return { cor: "#9ca3af", bg: "#f3f4f6", icone: "" };
  }
}

function iconePendente() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
}

function iconeAceito() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
}

function iconeExpirado() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
}

function iconeSend() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
}


// ===== BOTÕES DE AÇÃO =====
function botoesAcao(convite) {
  if (convite.status === "Expirado") {
    return `
      <button class="btn-acao btn-cancelar-convite" onclick="cancelarConvite(${convite.id})">Cancelar</button>
      <button class="btn-acao btn-reenviar" onclick="reenviarConvite(${convite.id})">${iconeSend()} Reenviar</button>
    `;
  }
  if (convite.status === "Pendente") {
    return `
      <button class="btn-acao btn-reenviar" onclick="reenviarConvite(${convite.id})">${iconeSend()} Enviar Novamente</button>
    `;
  }
  return ""; // Aceito não tem botões
}


// ===== CRIA ITEM DA LISTA =====
function criarItemConvite(convite) {
  const { cor, bg, icone } = configStatus(convite.status);

  const item = document.createElement("div");
  item.classList.add("convite-item");
  item.dataset.status = convite.status;

  item.innerHTML = `
    <div class="convite-icone" style="background:${bg};">
      ${icone}
    </div>

    <div class="convite-info">
      <div class="convite-email-linha">
        <span class="convite-email">${convite.email}</span>
        <span class="convite-badge" style="color:${cor};background:${bg};">${convite.status}</span>
      </div>
      <div class="convite-detalhe">
        Enviado por: ${convite.enviadoPor} &bull; ${convite.data} &bull; ${convite.tipo}
      </div>
    </div>

    <div class="convite-acoes">
      ${botoesAcao(convite)}
    </div>
  `;

  return item;
}


// ===== RENDERIZA RESUMO (3 cards do topo) =====
function renderizarResumo() {
  const pendentes = convites.filter(c => c.status === "Pendente").length;
  const aceitos   = convites.filter(c => c.status === "Aceito").length;
  const expirados = convites.filter(c => c.status === "Expirado").length;

  const resumo = document.getElementById("resumo-convites");
  if (!resumo) return;

  resumo.innerHTML = `
    <div class="resumo-card-convite">
      <div class="resumo-card-titulo">Pendentes</div>
      <div class="resumo-card-rodape">
        <span class="resumo-card-numero">${pendentes}</span>
        <div class="resumo-card-icone" style="background:#fef9c3;">${iconePendente()}</div>
      </div>
    </div>

    <div class="resumo-card-convite">
      <div class="resumo-card-titulo">Aceitos</div>
      <div class="resumo-card-rodape">
        <span class="resumo-card-numero">${aceitos}</span>
        <div class="resumo-card-icone" style="background:#dcfce7;">${iconeAceito()}</div>
      </div>
    </div>

    <div class="resumo-card-convite">
      <div class="resumo-card-titulo">Expirados</div>
      <div class="resumo-card-rodape">
        <span class="resumo-card-numero">${expirados}</span>
        <div class="resumo-card-icone" style="background:#fee2e2;">${iconeExpirado()}</div>
      </div>
    </div>
  `;
}


// ===== RENDERIZA TABS =====
function renderizarTabs() {
  const total     = convites.length;
  const pendentes = convites.filter(c => c.status === "Pendente").length;
  const aceitos   = convites.filter(c => c.status === "Aceito").length;
  const expirados = convites.filter(c => c.status === "Expirado").length;

  const tabs = [
    { label: "Todos",     count: total,     valor: "Todos" },
    { label: "Pendentes", count: pendentes, valor: "Pendente" },
    { label: "Aceitos",   count: aceitos,   valor: "Aceito" },
    { label: "Expirados", count: expirados, valor: "Expirado" }
  ];

  const tabsContainer = document.getElementById("convites-tabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = tabs.map(tab => `
    <button
      class="tab-btn ${filtroAtivo === tab.valor ? 'tab-ativa' : ''}"
      onclick="filtrarConvites('${tab.valor}')">
      ${tab.label} (${tab.count})
    </button>
  `).join("");
}


// ===== RENDERIZA LISTA DE CONVITES =====
function renderizarConvites(lista) {
  const container = document.getElementById("lista-convites");
  if (!container) return;

  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = `<p class="convites-vazio">Nenhum convite encontrado.</p>`;
    return;
  }

  lista.forEach(c => container.appendChild(criarItemConvite(c)));
}


// ===== FILTRAR =====
function filtrarConvites(status) {
  filtroAtivo = status;

  const lista = status === "Todos"
    ? convites
    : convites.filter(c => c.status === status);

  renderizarTabs();
  renderizarConvites(lista);
}


// ===== AÇÕES =====
function cancelarConvite(id) {
  console.log("Cancelar convite:", id);
  // fetch DELETE /api/convites/:id
}

function reenviarConvite(id) {
  console.log("Reenviar convite:", id);
  // fetch POST /api/convites/:id/reenviar
}

// ===== MODAL — NOVO CONVITE =====

function criarModalConvite() {
  const modal = document.createElement("div");
  modal.id = "modalConvite";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModalConvite()"></div>
    <div class="modal-box">

      <div class="modal-voltar" onclick="fecharModalConvite()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Enviar novo convite
      </div>
      <p class="modal-sub">Envie um convite para que médicos ou pacientes acessem o sistema.</p>

      <div class="modal-campo">
        <label>Tipo de convite</label>
        <select id="convTipo" onchange="alterarTipoConvite()">
          <option value="Medico">Médico</option>
          <option value="Paciente">Paciente</option>
        </select>
      </div>

      <div class="modal-campo">
        <label>E-mail</label>
        <input type="email" id="convEmail" placeholder="email@exemplo.com">
      </div>

      <div class="modal-campo" id="campoEspecialidade">
        <label>Especialidade</label>
        <input type="text" id="convEspecialidade" placeholder="Ex: Cardiologia">
      </div>

      <div class="modal-aviso">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Um e-mail será enviado para o endereço informado com as instruções de acesso.
      </div>

      <div class="modal-acoes">
        <button class="btn-cancelar" onclick="fecharModalConvite()">Cancelar</button>
        <button class="btn-cadastrar" onclick="enviarConvite()">Enviar Convite</button>
      </div>

    </div>
  `;
  document.body.appendChild(modal);
}

function abrirModalConvite() {
  criarModalConvite();
  requestAnimationFrame(() => {
    document.getElementById("modalConvite").classList.add("ativo");
  });
}

function fecharModalConvite() {
  const modal = document.getElementById("modalConvite");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

// Mostra/esconde campo especialidade conforme tipo
function alterarTipoConvite() {
  const tipo   = document.getElementById("convTipo").value;
  const campo  = document.getElementById("campoEspecialidade");
  campo.style.display = tipo === "Medico" ? "block" : "none";
}

async function enviarConvite() {
  const dados = {
    tipo:          document.getElementById("convTipo").value,
    email:         document.getElementById("convEmail").value.trim(),
    especialidade: document.getElementById("convEspecialidade")?.value.trim() || ""
  };

  if (!dados.email) {
    alert("Informe o e-mail do destinatário.");
    return;
  }

  try {
    const response = await fetch("/api/convites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      fecharModalConvite();
      renderizarResumo();
      renderizarTabs();
      renderizarConvites(convites);
    } else {
      alert("Erro ao enviar convite.");
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}

// ===== EVENTO DO BOTÃO =====
const btnNovoConvite = document.querySelector(".addConvite .btn");
if (btnNovoConvite) {
  btnNovoConvite.addEventListener("click", abrirModalConvite);
}



// ===== INICIA =====
renderizarResumo();
renderizarTabs();
renderizarConvites(convites);