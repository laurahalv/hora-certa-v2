// =============================================
// ===== SPA — UMA PÁGINA SÓ ==================
// =============================================

// ===== UTILITÁRIOS =====
function corAdesao(valor) {
  if (valor >= 90) return { cor: "#22c55e", texto: "Excelente adesão" };
  if (valor >= 75) return { cor: "#f59e0b", texto: "Adesão moderada" };
  return { cor: "#ef4444", texto: "Adesão baixa" };
}

function inicialNome(nome) {
  return nome.charAt(0).toUpperCase();
}

// ===== DADOS (substituir por fetch futuramente) =====
const pacientes = [
  {
    id: 1,
    nome: "Laura Alves",
    email: "LauraAlves@gmail.com",
    telefone: "(11)98111-1111",
    medico: "Dr. Marcelo Rossi",
    tratamentos: 2,
    adesao: 100,
    proximaConsulta: "09/04/2026",
    ultimaConsulta: "09/03/2026",
    medicamentos: [
      { nome: "Losartana 50mg", dose: "1 comprimido", frequencia: "1x ao dia", adesao: 95, inicio: "31/12/2025", termino: "30/12/2026" },
      { nome: "Atenolol 25mg", dose: "1 comprimido", frequencia: "2x ao dia", adesao: 89, inicio: "31/12/2025", termino: "30/12/2026" }
    ]
  },
  {
    id: 2,
    nome: "Luiz Oliveira",
    email: "LuizOliveira@gmail.com",
    telefone: "(11)98222-2222",
    medico: "Dr. Bruno Lins",
    tratamentos: 3,
    adesao: 88,
    proximaConsulta: "04/04/2026",
    ultimaConsulta: "04/03/2026",
    medicamentos: []
  },
  {
    id: 3,
    nome: "Natalia Fogaça",
    email: "NataliaFogaca@gmail.com",
    telefone: "(11)98333-3333",
    medico: "Dr. Rafalaelly Abreu",
    tratamentos: 1,
    adesao: 76,
    proximaConsulta: "27/03/2026",
    ultimaConsulta: "27/02/2026",
    medicamentos: []
  }
];


// =============================================
// ===== TELA: LISTA DE PACIENTES ==============
// =============================================

function mostrarLista() {
  document.getElementById("tela-lista").style.display = "block";
  document.getElementById("tela-detalhe").style.display = "none";
}

function criarCard(paciente) {
  const { cor } = corAdesao(paciente.adesao);
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <div class="avatar">${inicialNome(paciente.nome)}</div>
    <div class="info-principal">
      <div class="nome">${paciente.nome}</div>
      <div class="contatos">
        <span class="contato-item">✉ ${paciente.email}</span>
        <span class="contato-item">☎ ${paciente.telefone}</span>
      </div>
    </div>
    <div class="divider-v"></div>
    <div class="col-medico">
      <div class="col-label">Médico</div>
      <div class="col-value">${paciente.medico}</div>
    </div>
    <div class="divider-v"></div>
    <div class="col-tratamentos">
      <div class="col-label">Tratamentos</div>
      <div class="tratamentos-num">${paciente.tratamentos}</div>
    </div>
    <div class="divider-v"></div>
    <div class="col-adesao">
      <div class="col-label">Adesão</div>
      <div class="adesao-bar-bg">
        <div class="adesao-bar" style="width:${paciente.adesao}%;background:${cor};"></div>
      </div>
      ${paciente.adesao < 100 ? `<div class="adesao-valor" style="color:${cor};">${paciente.adesao}%</div>` : ""}
    </div>
    <div class="divider-v"></div>
    <div class="col-consulta">
      <div class="col-label">Próxima consulta</div>
      <div class="consulta-data">📅 ${paciente.proximaConsulta}</div>
    </div>
    <button class="btn-detalhes" onclick="verDetalhes(${paciente.id})">Ver detalhes</button>
  `;
  return card;
}

function renderizarPacientes(lista) {
  const container = document.querySelector(".cards-container");
  if (!container) return;
  container.innerHTML = "";
  lista.forEach(p => container.appendChild(criarCard(p)));
}


// =============================================
// ===== TELA: DETALHE DO PACIENTE =============
// =============================================

function verDetalhes(id) {
  const paciente = pacientes.find(p => p.id === id);
  if (!paciente) return;

  const { cor, texto } = corAdesao(paciente.adesao);
  const tela = document.getElementById("tela-detalhe");

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
            <span>☎ ${paciente.telefone}</span>
          </div>
        </div>
      </div>
      <div class="header-direita">
        <div class="col-label">Médico responsável</div>
        <div class="medico-nome">${paciente.medico}</div>
      </div>
    </div>

    <div class="resumo-grid">
      <div class="resumo-card">
        <div class="col-label">Adesão ao Tratamento</div>
        <div class="resumo-valor" style="color:${cor}">${paciente.adesao}%</div>
        <div class="adesao-bar-bg" style="margin:10px 0 6px;">
          <div class="adesao-bar" style="width:${paciente.adesao}%;background:${cor};"></div>
        </div>
        <div class="adesao-label" style="color:${cor}">${texto}</div>
      </div>

      <div class="resumo-card">
        <div class="col-label">Tratamentos Ativos</div>
        <div class="resumo-valor">${paciente.tratamentos}</div>
        <div class="col-label" style="margin-top:6px;">Medicamentos em uso</div>
        <div class="resumo-icone">💊</div>
      </div>

      <div class="resumo-card">
        <div class="col-label">Próxima consulta</div>
        <div class="resumo-valor resumo-data">${paciente.proximaConsulta}</div>
        <div class="col-label" style="margin-top:6px;">Última: ${paciente.ultimaConsulta || "—"}</div>
        <div class="resumo-icone">📅</div>
      </div>
    </div>

    <div class="medicamentos-secao">
      <h3>Medicamentos em Uso</h3>
      <p class="col-label">Lista de todos os medicamentos prescritos e suas respectivas adesões</p>
      <div class="medicamentos-lista" id="medicamentosLista"></div>
    </div>
  `;

  // Mostra a tela de detalhe e esconde a lista
  document.getElementById("tela-lista").style.display = "none";
  tela.style.display = "block";

  renderizarMedicamentos(paciente.medicamentos || []);
}

function renderizarMedicamentos(medicamentos) {
  const lista = document.getElementById("medicamentosLista");
  if (!medicamentos.length) {
    lista.innerHTML = `<p style="color:#9ca3af;font-size:14px;">Nenhum medicamento cadastrado.</p>`;
    return;
  }
  lista.innerHTML = medicamentos.map(med => {
    const { cor } = corAdesao(med.adesao);
    return `
      <div class="med-card">
        <div class="med-topo">
          <div>
            <div class="med-nome">${med.nome}</div>
            <div class="med-dose">${med.dose} • ${med.frequencia}</div>
          </div>
          <div class="med-adesao-info">
            <div class="col-label">Adesão</div>
            <div class="med-adesao-valor" style="color:${cor}">${med.adesao}%</div>
          </div>
        </div>
        <div class="adesao-bar-bg" style="margin:10px 0 8px;">
          <div class="adesao-bar" style="width:${med.adesao}%;background:${cor};"></div>
        </div>
        <div class="med-periodo">Início: ${med.inicio} • Término: ${med.termino}</div>
      </div>
    `;
  }).join("");
}


// =============================================
// ===== MODAL — CADASTRAR PACIENTE ============
// =============================================

function criarModal() {
  const modal = document.createElement("div");
  modal.id = "modalPaciente";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModal()"></div>
    <div class="modal-box">
      <h2>Cadastrar Novo Paciente</h2>
      <p class="modal-sub">Preencha os dados do paciente para cadastrá-lo no sistema.</p>
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
        <label>Nome do Responsável</label>
        <input type="text" id="pacResponsavel" placeholder="Digite o nome do responsável">
      </div>
      <div class="modal-campo">
        <label>Médico responsável</label>
        <select id="pacMedico">
          <option value="">Selecione o médico</option>
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

async function abrirModal() {
  criarModal();
  await carregarMedicos();
  requestAnimationFrame(() => {
    document.getElementById("modalPaciente").classList.add("ativo");
  });
}

function fecharModal() {
  const modal = document.getElementById("modalPaciente");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

async function carregarMedicos() {
  try {
    const response = await fetch("/api/medicos");
    const medicos = await response.json();
    const select = document.getElementById("pacMedico");
    medicos.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = m.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar médicos:", err);
  }
}

async function cadastrarPaciente() {
  const dados = {
    nome: document.getElementById("pacNome").value.trim(),
    email: document.getElementById("pacEmail").value.trim(),
    telefone: document.getElementById("pacTelefone").value.trim(),
    responsavel: document.getElementById("pacResponsavel").value.trim(),
    medico_id: document.getElementById("pacMedico").value
  };

  if (!dados.nome || !dados.email || !dados.medico_id) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  try {
    const response = await fetch("/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    if (response.ok) {
      fecharModal();
      renderizarPacientes(pacientes);
    } else {
      alert("Erro ao cadastrar paciente.");
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}


// =============================================
// ===== INICIALIZA ============================
// =============================================

renderizarPacientes(pacientes);

const btnAdicionar = document.querySelector(".addPaciente .btn");
if (btnAdicionar) btnAdicionar.addEventListener("click", abrirModal);