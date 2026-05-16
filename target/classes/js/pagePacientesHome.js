// ===== DADOS (substituir por fetch quando tiver API) =====
const dashboardData = {
  adesaoGeral: 95,
  medicamentosTomadosHoje: 2,
  totalMedicamentosHoje: 3,
  medicoResponsavel: "Dra. Rafaelly Abreu",
  proximosMedicamentos: 2,

  historico: [
    { medicamento: "Sertralina",  dose: "50mg",  data: "21/03/2026", horario: "09:00", status: "Não Tomado" },
    { medicamento: "Clonazepam", dose: "0,5mg", data: "21/03/2026", horario: "17:00", status: "Tomado no horário" },
    { medicamento: "Clonazepam", dose: "0,5mg", data: "21/03/2026", horario: "09:00", status: "Tomado com atraso" }
  ],

  naoTomados: [
    { nome: "Sertralina 50mg", horario: "20:00", data: "17/04/2026" }
  ]
};


// ===== CONFIG DE STATUS =====
function configStatusMed(status) {
  switch (status) {
    case "Não Tomado":
      return { cor: "#ef4444", bg: "#fee2e2" };
    case "Tomado no horário":
      return { cor: "#16a34a", bg: "#dcfce7" };
    case "Tomado com atraso":
      return { cor: "#d97706", bg: "#fef9c3" };
    default:
      return { cor: "#6b7280", bg: "#f3f4f6" };
  }
}


// ===== ÍCONES SVG =====
function iconeDoc() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
}

function iconeCalendario() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
}

function iconeHistorico() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`;
}

function iconeAlerta() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
}


// ===== RENDERIZA TUDO =====
function renderizarDashboard(dados) {
  const container = document.querySelector(".medicamento-data");
  if (!container) return;

  container.innerHTML = `

    <!-- ===== LINHA 1: 3 CARDS DE RESUMO ===== -->
    <div class="dash-grid-3">

      <div class="dash-card">
        <div class="dash-card-label">Adesão Geral</div>
        <div class="dash-adesao-valor">${dados.adesaoGeral}%</div>
        <div class="dash-card-sub">${dados.medicamentosTomadosHoje} de ${dados.totalMedicamentosHoje} medicamentos tomados hoje</div>
      </div>

      <div class="dash-card dash-card-center">
        <div class="dash-card-label">Próximos Medicamentos</div>
        <div class="dash-prox-numero">${dados.proximosMedicamentos}</div>
        <a class="dash-ver-todos" href="#" onclick="event.preventDefault(); toggleProximosMedicamentos()">Ver todos →</a>
      </div>

      <div class="dash-card">
        <div class="dash-card-label">Médicos responsável</div>
        <div class="dash-medico-nome">${dados.medicoResponsavel}</div>
      </div>

    </div>

    <!-- ===== LINHA 2: ATALHOS ===== -->
    <div class="dash-grid-2">

      <div class="dash-atalho" onclick="abrirObservacoes()">
        <div class="dash-atalho-icone dash-icone-azul">${iconeDoc()}</div>
        <div>
          <div class="dash-atalho-titulo">Minhas Observações</div>
          <div class="dash-atalho-sub">Registre sintomas e observações</div>
        </div>
      </div>

      <div class="dash-atalho" onclick="abrirAgendamento()">
        <div class="dash-atalho-icone dash-icone-verde">${iconeCalendario()}</div>
        <div>
          <div class="dash-atalho-titulo">Agendar Medicamento</div>
          <div class="dash-atalho-sub">Defina os horários de seus medicamentos</div>
        </div>
      </div>

    </div>

    <!-- ===== LINHA 3: HISTÓRICO + NÃO TOMADOS ===== -->
    <div class="dash-grid-2">

      <!-- Histórico -->
      <div class="dash-card">
        <div class="dash-secao-titulo">
          ${iconeHistorico()}
          Histórico de Medicamentos
        </div>
        <table class="dash-tabela">
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Dose</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${dados.historico.map(h => {
              const { cor, bg } = configStatusMed(h.status);
              return `
                <tr>
                  <td><strong>${h.medicamento}</strong></td>
                  <td>${h.dose}</td>
                  <td>${h.data}</td>
                  <td>${h.horario}</td>
                  <td>
                    <span class="dash-badge" style="color:${cor};background:${bg};">
                      ${h.status}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <!-- Não tomados -->
      <div class="dash-card">
        <div class="dash-secao-titulo">
          ${iconeAlerta()}
          Medicamentos não tomados (${dados.naoTomados.length})
        </div>
        <div class="dash-nao-tomados-lista">
          ${dados.naoTomados.map(m => `
            <div class="dash-nao-tomado-item">
              <div>
                <div class="dash-nao-tomado-nome">${m.nome}</div>
                <div class="dash-nao-tomado-info">Horário: ${m.horario}</div>
                <div class="dash-nao-tomado-info">Data: ${m.data}</div>
              </div>
              <div class="dash-nao-tomado-acoes">
                <button class="dash-btn-atraso" onclick="marcarAtraso('${m.nome}')">
                  Marcar como tomado com atraso
                </button>
                <button class="dash-btn-tomado" onclick="marcarTomado('${m.nome}')">
                  Marcar como tomado
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

    </div>
  `;
}


// ===== AÇÕES DOS BOTÕES =====
function marcarTomado(nome) {
  console.log("Marcar como tomado:", nome);
  // fetch POST /api/medicamentos/marcar-tomado
}

function marcarAtraso(nome) {
  console.log("Marcar com atraso:", nome);
  // fetch POST /api/medicamentos/marcar-atraso
}

function abrirObservacoes() {
  console.log("Abrir observações");
  // Redireciona ou abre modal
}

function abrirAgendamento() {
  console.log("Abrir agendamento");
  // Redireciona ou abre modal
}


// ===== BUSCA DA API =====
async function carregarDashboard() {
  try {
    const response = await fetch("/api/dashboard/paciente");
    const dados = await response.json();
    renderizarDashboard(dados);
  } catch (err) {
    // Usa dados locais enquanto não tem API
    renderizarDashboard(dashboardData);
  }
}


// ===== DADOS PRÓXIMOS MEDICAMENTOS =====
const proximosMedicamentos = [
  {
    id: 1,
    nome: "Metformina",
    dose: "850mg",
    frequencia: "2x ao dia",
    horario: "12:00"
  },
  {
    id: 2,
    nome: "Sinvastatina",
    dose: "20mg",
    frequencia: "1x ao dia",
    horario: "20:00"
  }
];


// ===== RENDERIZA PRÓXIMOS MEDICAMENTOS =====
function renderizarProximosMedicamentos() {
  const container = document.querySelector(".proximos-medicamentos");
  if (!container) return;

  container.innerHTML = `
    <div class="prox-header">
      <h2 class="prox-titulo">Proximos Medicamentos</h2>
      <button class="btn-registrar-dose" onclick="abrirRegistrarDose()">
        + Registrar Dose
      </button>
    </div>

    <div class="prox-lista">
      ${proximosMedicamentos.map(med => `
        <div class="prox-card" id="prox-card-${med.id}">
          <div class="prox-card-esquerda">
            <div class="prox-icone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="prox-info">
              <div class="prox-nome">${med.nome}</div>
              <div class="prox-dose">${med.dose}</div>
              <div class="prox-frequencia">${med.frequencia}</div>
            </div>
          </div>
          <div class="prox-card-direita">
            <div class="prox-horario">${med.horario}</div>
            <button class="btn-marcar-tomado" onclick="marcarComoTomado(${med.id})">
              ✓ Marcar como tomado
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Scroll suave até a seção
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== TOGGLE PRÓXIMOS MEDICAMENTOS =====
let proximosVisiveis = false;

function toggleProximosMedicamentos() {
  const container = document.querySelector(".proximos-medicamentos");
  if (!container) return;

  if (proximosVisiveis) {
    // ===== ESCONDE =====
    container.style.opacity = "0";
    container.style.transform = "translateY(-8px)";
    setTimeout(() => {
      container.style.display = "none";
      container.innerHTML = "";
    }, 250);

    proximosVisiveis = false;

    // Muda o link de volta
    const link = document.querySelector(".dash-ver-todos");
    if (link) link.textContent = "Ver todos →";

  } else {
    // ===== MOSTRA =====
    container.style.display = "block";
    container.style.opacity = "0";
    container.style.transform = "translateY(-8px)";
    container.style.transition = "opacity 0.25s ease, transform 0.25s ease";

    renderizarProximosMedicamentos();

    requestAnimationFrame(() => {
      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    });

    proximosVisiveis = true;

    // Muda o link para "Fechar"
    const link = document.querySelector(".dash-ver-todos");
    if (link) link.textContent = "Fechar ×";
  }
}


// ===== MARCAR COMO TOMADO =====
function marcarComoTomado(id) {
  const card = document.getElementById(`prox-card-${id}`);
  if (!card) return;

  // Feedback visual
  const btn = card.querySelector(".btn-marcar-tomado");
  btn.textContent = "✓ Tomado!";
  btn.style.background = "#16a34a";
  btn.disabled = true;

  card.style.opacity = "0.5";
  card.style.transition = "opacity 0.4s ease";

  setTimeout(() => {
    card.style.display = "none";

    // Remove do array local
    const idx = proximosMedicamentos.findIndex(m => m.id === id);
    if (idx !== -1) proximosMedicamentos.splice(idx, 1);

    // Atualiza contador no dashboard
    const contadorEl = document.querySelector(".dash-prox-numero");
    if (contadorEl) contadorEl.textContent = proximosMedicamentos.length;

    // Se não sobrar nenhum
    const lista = document.querySelector(".prox-lista");
    if (lista && proximosMedicamentos.length === 0) {
      lista.innerHTML = `<p style="color:#9ca3af;font-size:14px;padding:20px 0;">Nenhum medicamento pendente.</p>`;
    }
  }, 600);

  // fetch POST /api/medicamentos/:id/tomar
  console.log("Marcar como tomado:", id);
}


// ===== MODAL — REGISTRAR DOSE =====

function criarModalRegistrarDose() {
  const modal = document.createElement("div");
  modal.id = "modalRegistrarDose";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModalRegistrarDose()"></div>
    <div class="modal-box-dose">

      <h2>Marcar Medicamento</h2>

      <div class="modal-campo">
        <label>Nome do Medicamento</label>
        <select id="doseNome">
          <option value="">Selecione</option>
          ${proximosMedicamentos.map(m => `
            <option value="${m.id}">${m.nome} ${m.dose}</option>
          `).join("")}
        </select>
      </div>

      <div class="modal-campo">
        <label>Quando o medicamento foi tomado?</label>
        <select id="doseQuando">
          <option value="">Selecione</option>
          <option value="no_horario">No horário</option>
          <option value="com_atraso">Com atraso</option>
          <option value="nao_tomado">Não tomei</option>
        </select>
      </div>

      <div class="modal-campo">
        <label>Dia</label>
        <input type="date" id="doseDia">
      </div>

      <div class="modal-campo">
        <label>Horário</label>
        <input type="time" id="doseHorario">
      </div>

      <div class="modal-campo">
        <label>Observações <span class="label-opcional">(opcional)</span></label>
        <textarea id="doseObservacoes" rows="4"
          placeholder="Registre como está se sentindo ou possiveis reações com esse medicamento"></textarea>
      </div>

      <div class="modal-dose-acoes">
        <button class="btn-dose-registrar" onclick="registrarDose()">Registrar</button>
        <button class="btn-dose-cancelar" onclick="fecharModalRegistrarDose()">Cancelar</button>
      </div>

    </div>
  `;
  document.body.appendChild(modal);
}

function abrirRegistrarDose() {
  criarModalRegistrarDose();
  requestAnimationFrame(() => {
    document.getElementById("modalRegistrarDose").classList.add("ativo");
  });
}

function fecharModalRegistrarDose() {
  const modal = document.getElementById("modalRegistrarDose");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

async function registrarDose() {
  const dados = {
    medicamento_id: document.getElementById("doseNome").value,
    quando:         document.getElementById("doseQuando").value,
    dia:            document.getElementById("doseDia").value,
    horario:        document.getElementById("doseHorario").value,
    observacoes:    document.getElementById("doseObservacoes").value.trim()
  };

  if (!dados.medicamento_id || !dados.quando || !dados.dia || !dados.horario) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const response = await fetch("/api/doses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      fecharModalRegistrarDose();
      carregarDashboard(); // atualiza o dashboard
    } else {
      alert("Erro ao registrar dose.");
    }
  } catch (err) {
    // Sem API ainda: fecha e dá feedback
    fecharModalRegistrarDose();
    console.log("Dose registrada localmente:", dados);
  }
}

// ===== INICIA =====
carregarDashboard();