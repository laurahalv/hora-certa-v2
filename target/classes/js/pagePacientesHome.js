// =============================================
// ===== DADOS DO PACIENTE (LOCALSTORAGE) ======
// =============================================
const LOGGED_PACIENTE_ID = localStorage.getItem("pacienteId");
const LOGGED_PACIENTE_NOME = localStorage.getItem("pacienteNome");

// ===== ESTADO GLOBAL DA SPA ==================
let pacientesAtuais = [];
let proximosMedicamentos = [];
let proximosVisiveis = false;

// ===== CARREGAMENTO INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  // Injeta o nome do paciente no título fixo do HTML
  const txtPacienteNome = document.getElementById("loggedPacienteNome");
  if (txtPacienteNome) {
    txtPacienteNome.textContent = LOGGED_PACIENTE_NOME || "Paciente";
  }

  if (!LOGGED_PACIENTE_ID) {
    console.error("ID do paciente não encontrado no localStorage.");
    return;
  }

  carregarDashboard();
  carregarProximosMedicamentosData();
});

// ===== CONFIG DE STATUS =====
function configStatusMed(status) {
  switch (status) {
    case "Não Tomado":
    case "NAO_TOMADO":
      return { statusTexto: "Não Tomado", cor: "#ef4444", bg: "#fee2e2" };
    case "Tomado no horário":
    case "NO_HORARIO":
      return {
        statusTexto: "Tomado no horário",
        cor: "#16a34a",
        bg: "#dcfce7",
      };
    case "Tomado com atraso":
    case "COM_ATRASO":
      return {
        statusTexto: "Tomado com atraso",
        cor: "#d97706",
        bg: "#fef9c3",
      };
    default:
      return {
        statusTexto: status || "Pendente",
        cor: "#6b7280",
        bg: "#f3f4f6",
      };
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

async function carregarDashboard() {
  try {
    // Ajustado para bater no controller de pacientes
    const response = await fetch(
      `http://localhost:8080/api/pacientes/dashboard/${LOGGED_PACIENTE_ID}`,
    );
    if (!response.ok) throw new Error("Erro ao buscar dados do dashboard");

    const dados = await response.json();
    renderizarDashboard(dados);
  } catch (err) {
    console.error("Erro ao carregar dashboard da API:", err);
    const container = document.querySelector(".medicamento-data");
    if (container)
      container.innerHTML = `<p class="erro-api">Não foi possível carregar os dados do painel.</p>`;
  }
}

// ===== BUSCA DA API: PRÓXIMOS MEDICAMENTOS =====
async function carregarProximosMedicamentosData() {
  try {
    const response = await fetch(
      `http://localhost:8080/api/pacientes/${LOGGED_PACIENTE_ID}/proximos`,
    );
    if (response.ok) {
      proximosMedicamentos = await response.json();
      // Atualiza o contador de pendências em tempo real na tela
      const contadorEl = document.querySelector(".dash-prox-numero");
      if (contadorEl) contadorEl.textContent = proximosMedicamentos.length;
    }
  } catch (err) {
    console.error("Erro ao carregar próximos medicamentos:", err);
  }
}

// ===== RENDERIZA DASHBOARD =====
function renderizarDashboard(dados) {
  const container = document.querySelector(".medicamento-data");
  if (!container) return;

  // Proteções contra listas nulas vindas do Java
  const listaHistorico = dados.historico || [];
  const listaNaoTomados = dados.naoTomados || [];

  container.innerHTML = `
    <div class="dash-grid-3">
      <div class="dash-card">
        <div class="dash-card-label">Adesão Geral</div>
        <div class="dash-adesao-valor">${dados.adesaoGeral || 0}%</div>
        <div class="dash-card-sub">${dados.medicamentosTomadosHoje || 0} de ${dados.totalMedicamentosHoje || 0} tomados hoje</div>
      </div>

      <div class="dash-card dash-card-center">
        <div class="dash-card-label">Próximos Medicamentos</div>
        <div class="dash-prox-numero">${proximosMedicamentos.length || dados.proximosMedicamentos || 0}</div>
        <a class="dash-ver-todos" href="#" onclick="event.preventDefault(); toggleProximosMedicamentos()">Ver todos →</a>
      </div>

      <div class="dash-card">
        <div class="dash-card-label">Médico Responsável</div>
        <div class="dash-medico-nome">${dados.medicoResponsavel || "Não atribuído"}</div>
      </div>
    </div>

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

    <div class="dash-grid-2">
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
            ${listaHistorico.length === 0 ? '<tr><td colspan="5" style="color:#9ca3af; text-align:center;">Nenhum registro no histórico.</td></tr>' : ""}
            ${listaHistorico
              .map((h) => {
                const { statusTexto, cor, bg } = configStatusMed(h.status);
                return `
                <tr>
                  <td><strong>${h.medicamento || h.nome}</strong></td>
                  <td>${h.dose || "—"}</td>
                  <td>${h.data}</td>
                  <td>${h.horario}</td>
                  <td>
                    <span class="dash-badge" style="color:${cor};background:${bg};">
                      ${statusTexto}
                    </span>
                  </td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="dash-card">
        <div class="dash-secao-titulo">
          ${iconeAlerta()}
          Medicamentos não tomados (${listaNaoTomados.length})
        </div>
        <div class="dash-nao-tomados-lista">
          ${listaNaoTomados.length === 0 ? '<p style="color:#9ca3af;font-size:14px;padding:20px 0;">Nenhum alerta de dose perdida.</p>' : ""}
          ${listaNaoTomados
            .map(
              (m) => `
            <div class="dash-nao-tomado-item">
              <div>
                <div class="dash-nao-tomado-nome">${m.medicamento || m.nome} ${m.dose || ""}</div>
                <div class="dash-nao-tomado-info">Horário planejado: ${m.horario}</div>
                <div class="dash-nao-tomado-info">Data: ${m.data}</div>
              </div>
              <div class="dash-nao-tomado-acoes">
                <button class="dash-btn-atraso" onclick="marcarDosePerdida('${m.id}', 'COM_ATRASO')">
                  Tomado com atraso
                </button>
                <button class="dash-btn-tomado" onclick="marcarDosePerdida('${m.id}', 'NO_HORARIO')">
                  Tomado
                </button>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

// ===== REQUISIÇÃO (PATCH): MARCAR DOSE QUE ESTAVA PERDIDA =====
async function marcarDosePerdida(id, statusFim) {
  try {
    // Usa o endpoint PATCH para registrar o consumo da dose não tomada
    const endpoint =
      statusFim === "COM_ATRASO" || statusFim === "NO_HORARIO"
        ? `http://localhost:8080/api/registro-consumo/${id}/registrar`
        : `http://localhost:8080/api/registro-consumo/${id}/desnecessario`;

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Status atualizado com sucesso!");
      await carregarDashboard();
      await carregarProximosMedicamentosData();
    }
  } catch (err) {
    console.error("Erro ao atualizar dose perdida:", err);
  }
}

// ===== RENDERIZA PRÓXIMOS MEDICAMENTOS =====
function renderizarProximosMedicamentos() {
  const container = document.querySelector(".proximos-medicamentos");
  if (!container) return;

  container.innerHTML = `
    <div class="prox-header">
      <h2 class="prox-titulo">Próximos Medicamentos</h2>
      <button class="btn-registrar-dose" onclick="abrirRegistrarDose()">
        + Registrar Outra Dose
      </button>
    </div>

    <div class="prox-lista">
      ${proximosMedicamentos.length === 0 ? '<p style="color:#9ca3af;font-size:14px;padding:20px 0;">Nenhum medicamento agendado para as próximas horas.</p>' : ""}
      ${proximosMedicamentos
        .map(
          (med) => `
        <div class="prox-card" id="prox-card-${med.id}" data-prescricao="${med.id}">
          <div class="prox-card-esquerda">
            <div class="prox-icone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="prox-info">
              <div class="prox-nome">${med.nome || med.medicamento}</div>
              <div class="prox-dose">${med.dose}</div>
              <div class="prox-frequencia">${med.frequencia || "—"}</div>
            </div>
          </div>
          <div class="prox-card-direita">
            <div class="prox-horario">${med.horario}</div>
            <button class="btn-marcar-tomado" onclick="marcarComoTomado(${med.id})">
              ✓ Marcar como tomado
            </button>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== REQUISIÇÃO (POST): MARCAR COMO TOMADO AGORA =====
async function marcarComoTomado(id) {
  const card = document.getElementById(`prox-card-${id}`);
  if (!card) return;

  try {
    // Busca a prescrição para obter o prescricaoId (que é armazenado no atributo data-prescricao)
    const prescricaoId = card.getAttribute("data-prescricao") || id;
    const agora = new Date();
    const dataHoraAgora = agora.toISOString();

    const response = await fetch(`http://localhost:8080/api/registro-consumo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataHoraPrevista: dataHoraAgora,
        dataHoraConsumida: dataHoraAgora,
        prescricaoId: Number(prescricaoId),
        pacienteId: Number(LOGGED_PACIENTE_ID),
        observacoes: "",
      }),
    });

    if (response.ok) {
      const btn = card.querySelector(".btn-marcar-tomado");
      btn.textContent = "✓ Tomado!";
      btn.style.background = "#16a34a";
      btn.disabled = true;
      card.style.opacity = "0.5";

      setTimeout(async () => {
        card.style.display = "none";
        await carregarDashboard();
        await carregarProximosMedicamentosData();
        if (proximosVisiveis) renderizarProximosMedicamentos();
      }, 600);
    }
  } catch (err) {
    console.error("Erro ao registrar tomada do medicamento:", err);
  }
}

// ===== TOGGLE VISIBILIDADE ABAS =====
function toggleProximosMedicamentos() {
  const container = document.querySelector(".proximos-medicamentos");
  if (!container) return;

  if (proximosVisiveis) {
    container.style.opacity = "0";
    container.style.transform = "translateY(-8px)";
    setTimeout(() => {
      container.style.display = "none";
      container.innerHTML = "";
    }, 250);
    proximosVisiveis = false;
    const link = document.querySelector(".dash-ver-todos");
    if (link) link.textContent = "Ver todos →";
  } else {
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
    const link = document.querySelector(".dash-ver-todos");
    if (link) link.textContent = "Fechar ×";
  }
}

// ===== MODAL — REGISTRAR DOSE MANUAL =====
function criarModalRegistrarDose() {
  if (document.getElementById("modalRegistrarDose")) return;
  const modal = document.createElement("div");
  modal.id = "modalRegistrarDose";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModalRegistrarDose()"></div>
    <div class="modal-box-dose">
      <h2>Marcar Medicamento</h2>
      <div class="modal-campo">
        <label>Selecione o Medicamento</label>
        <select id="doseNome">
          <option value="">Selecione</option>
          ${proximosMedicamentos.map((m) => `<option value="${m.id}">${m.nome || m.medicamento} (${m.dose})</option>`).join("")}
        </select>
      </div>
      <div class="modal-campo">
        <label>Quando o medicamento foi tomado?</label>
        <select id="doseQuando">
          <option value="">Selecione</option>
          <option value="NO_HORARIO">No horário</option>
          <option value="COM_ATRASO">Com atraso</option>
          <option value="NAO_TOMADO">Não tomei</option>
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
        <textarea id="doseObservacoes" rows="4" placeholder="Como está se sentindo ou reações encontradas..."></textarea>
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
    const modal = document.getElementById("modalRegistrarDose");
    if (modal) modal.classList.add("ativo");
  });
}

function fecharModalRegistrarDose() {
  const modal = document.getElementById("modalRegistrarDose");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

async function registrarDose() {
  const prescricaoId = document.getElementById("doseNome").value;
  const quando = document.getElementById("doseQuando").value;
  const dia = document.getElementById("doseDia").value;
  const horario = document.getElementById("doseHorario").value;
  const observacoes = document.getElementById("doseObservacoes").value.trim();

  if (!prescricaoId || !quando || !dia || !horario) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  // Constrói a data e hora prevista a partir dos inputs
  const dataHoraPrevista = new Date(`${dia}T${horario}:00`).toISOString();

  // Se foi marcado "tomado no horário" ou "tomado com atraso", registra também a data/hora consumida
  let dataHoraConsumida = null;
  if (quando === "NO_HORARIO" || quando === "COM_ATRASO") {
    dataHoraConsumida = new Date().toISOString(); // Data e hora atual
  }

  const dados = {
    dataHoraPrevista: dataHoraPrevista,
    dataHoraConsumida: dataHoraConsumida,
    prescricaoId: Number(prescricaoId),
    pacienteId: Number(LOGGED_PACIENTE_ID),
    observacoes: observacoes,
  };

  try {
    const response = await fetch("http://localhost:8080/api/registro-consumo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert("Dose registrada!");
      fecharModalRegistrarDose();
      await carregarDashboard();
      await carregarProximosMedicamentosData();
      if (proximosVisiveis) renderizarProximosMedicamentos();
    } else {
      alert("Erro ao registrar dose.");
    }
  } catch (err) {
    console.error("Erro na comunicação:", err);
  }
}

// ===== REDIRECIONAMENTOS DE ATALHOS =====
function abrirObservacoes() {
  window.location.href = "pagePacientesObs.html";
}
function abrirAgendamento() {
  window.location.href = "pagePacientesConfig.html";
}
