// ===== DADOS DOS MÉDICOS =====
const medicos = [
  {
    id: 1,
    nome: "Dr. Marcelo Rossi",
    especialidade: "Cardiologia",
    email: "Marcelo.Rossi@Horacerta.com",
    telefone: "(11) 98121-2112",
    crm: "CRM/SP 125635",
    cadastro: "14/01/2024",
    status: "Ativo",
    pacientes: 45,
    adesaoMedia: 89
  },
  {
    id: 2,
    nome: "Dr. Bruno Lins",
    especialidade: "Endocrinologia",
    email: "BrunoLins@Horacerta.com",
    telefone: "(11) 98232-3233",
    crm: "CRM/RJ 654321",
    cadastro: "19/02/2024",
    status: "Ativo",
    pacientes: 38,
    adesaoMedia: 88
  },
  {
    id: 3,
    nome: "Dra. Rafaelly Abreu",
    especialidade: "Neurologia",
    email: "Rafaelly.Abreu@Horacerta.com",
    telefone: "(11) 98343-4355",
    crm: "CRM/SP 924536",
    cadastro: "09/03/2024",
    status: "Ativo",
    pacientes: 32,
    adesaoMedia: 76
  },
  {
    id: 4,
    nome: "Dr. Igor Dantas",
    especialidade: "Psiquiatria",
    email: "Igor.Dantas@Horacerta.com",
    telefone: "(11) 98565-6566",
    crm: "CRM/SP 245896",
    cadastro: "04/04/2024",
    status: "Ativo",
    pacientes: 28,
    adesaoMedia: 94
  }
];

// ===== PACIENTES POR MÉDICO =====
const pacientesPorMedico = {
  1: [
    { id: 1, nome: "Laura Alves",        email: "LauraAlves@gmail.com",   telefone: "(11)98111-1111", medico: "Dr. Marcelo Rossi",   tratamentos: 2, adesao: 100, proximaConsulta: "09/04/2026" },
    { id: 2, nome: "Carlos Pereira",     email: "CarlosP@gmail.com",       telefone: "(11)98112-2222", medico: "Dr. Marcelo Rossi",   tratamentos: 1, adesao: 85,  proximaConsulta: "12/04/2026" }
  ],
  2: [
    { id: 3, nome: "Luiz Oliveira",      email: "LuizOliveira@gmail.com",  telefone: "(11)98222-2222", medico: "Dr. Bruno Lins",      tratamentos: 3, adesao: 88,  proximaConsulta: "04/04/2026" },
    { id: 4, nome: "Ana Costa",          email: "AnaCosta@gmail.com",       telefone: "(11)98223-3333", medico: "Dr. Bruno Lins",      tratamentos: 2, adesao: 72,  proximaConsulta: "15/04/2026" }
  ],
  3: [
    { id: 5, nome: "Natalia Fogaça",     email: "NataliaFogaca@gmail.com", telefone: "(11)98333-3333", medico: "Dra. Rafaelly Abreu", tratamentos: 1, adesao: 76,  proximaConsulta: "27/03/2026" }
  ],
  4: [
    { id: 6, nome: "Larissa Nascimento", email: "LarissaN@gmail.com",      telefone: "(11)98444-4444", medico: "Dr. Igor Dantas",     tratamentos: 2, adesao: 94,  proximaConsulta: "14/04/2026" },
    { id: 7, nome: "Pedro Silva",        email: "PedroSilva@gmail.com",     telefone: "(11)98555-5555", medico: "Dr. Igor Dantas",     tratamentos: 2, adesao: 85,  proximaConsulta: "11/04/2026" }
  ]
};


// ===== UTILITÁRIOS =====

function corAdesaoMedico(valor) {
  if (valor >= 90) return { cor: "#22c55e" };
  if (valor >= 75) return { cor: "#f59e0b" };
  return { cor: "#ef4444" };
}

function iniciaisMedico(nome) {
  return nome
    .replace(/^(Dr\.|Dra\.)\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map(p => p.charAt(0).toUpperCase())
    .join("");
}


// ===== CARD DO MÉDICO =====

function criarCardMedico(medico) {
  const { cor } = corAdesaoMedico(medico.adesaoMedia);

  const card = document.createElement("div");
  card.classList.add("card-medico");

  card.innerHTML = `
    <div class="medico-topo">
      <div class="medico-avatar">${iniciaisMedico(medico.nome)}</div>
      <div class="medico-info">
        <div class="medico-nome">${medico.nome}</div>
        <div class="medico-especialidade">${medico.especialidade}</div>
      </div>
      <span class="medico-status ${medico.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">
        ${medico.status}
      </span>
    </div>

    <div class="medico-contatos">
      <div class="medico-linha">
        <span class="medico-contato-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          ${medico.email}
        </span>
        <span class="medico-crm">${medico.crm}</span>
      </div>
      <div class="medico-linha">
        <span class="medico-contato-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
          ${medico.telefone}
        </span>
      </div>
      <div class="medico-linha">
        <span class="medico-contato-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Cadastrado em ${medico.cadastro}
        </span>
      </div>
    </div>

    <div class="medico-divider"></div>

    <div class="medico-rodape">
      <div class="medico-stat">
        <div class="medico-stat-label">Pacientes</div>
        <div class="medico-stat-valor">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          ${medico.pacientes}
        </div>
      </div>
      <div class="medico-stat medico-stat-direita">
        <div class="medico-stat-label">Adesão Média</div>
        <div class="medico-adesao-valor" style="color:${cor}">${medico.adesaoMedia}%</div>
      </div>
    </div>

    <button class="btn-ver-pacientes" onclick="verPacientesMedico(${medico.id})">
      Ver pacientes
    </button>
  `;

  return card;
}

function renderizarMedicos(lista) {
  const container = document.querySelector(".cards-container");
  if (!container) return;
  container.style.gridTemplateColumns = "";
  container.innerHTML = "";
  lista.forEach(m => container.appendChild(criarCardMedico(m)));
}


// ===== VER PACIENTES DO MÉDICO =====

function verPacientesMedico(id) {
  const medico    = medicos.find(m => m.id === id);
  const lista     = pacientesPorMedico[id] || [];
  const container = document.querySelector(".cards-container");

  container.style.gridTemplateColumns = "1fr";
  container.innerHTML = "";

  // Botão voltar
  const btnVoltar = document.createElement("button");
  btnVoltar.className = "btn-voltar-medicos";
  btnVoltar.textContent = "← Voltar para médicos";
  btnVoltar.onclick = () => renderizarMedicos(medicos);
  container.appendChild(btnVoltar);

  // Título
  const titulo = document.createElement("div");
  titulo.className = "pacientes-medico-titulo";
  titulo.innerHTML = `
    <h3>Pacientes de ${medico.nome}</h3>
    <p>${medico.especialidade} — ${lista.length} paciente(s)</p>
  `;
  container.appendChild(titulo);

  // Sem pacientes
  if (!lista.length) {
    const vazio = document.createElement("p");
    vazio.style.cssText = "color:#9ca3af;font-size:14px;padding:20px 0;";
    vazio.textContent = "Nenhum paciente encontrado para este médico.";
    container.appendChild(vazio);
    return;
  }

  // Cards dos pacientes
  lista.forEach(paciente => {
    const { cor } = corAdesaoMedico(paciente.adesao);
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="avatar">${paciente.nome.charAt(0)}</div>

      <div class="info-principal">
        <div class="nome">${paciente.nome}</div>
        <div class="contatos">
          <span class="contato-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            ${paciente.email}
          </span>
          <span class="contato-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
            ${paciente.telefone}
          </span>
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
        <div class="consulta-data">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          ${paciente.proximaConsulta}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}


// ===== MODAL — CADASTRAR MÉDICO =====

function criarModalMedico() {
  const modal = document.createElement("div");
  modal.id = "modalMedico";
  modal.innerHTML = `
    <div class="modal-overlay" onclick="fecharModalMedico()"></div>
    <div class="modal-box">
      <h2>Cadastrar Novo Médico</h2>
      <p class="modal-sub">Preencha os dados do médico para cadastrá-lo no sistema.</p>

      <div class="modal-campo">
        <label>Nome completo</label>
        <input type="text" id="medNome" placeholder="Digite o nome do Médico">
      </div>
      <div class="modal-campo">
        <label>Especialidade</label>
        <input type="text" id="medEspecialidade" placeholder="Ex: Cardiologia">
      </div>
      <div class="modal-campo">
        <label>CRM</label>
        <input type="text" id="medCrm" placeholder="exemplo: CRM/SP 123456">
      </div>
      <div class="modal-campo">
        <label>E-mail</label>
        <input type="email" id="medEmail" placeholder="email@exemplo.com">
      </div>
      <div class="modal-campo">
        <label>Telefone</label>
        <input type="text" id="medTelefone" placeholder="(11) 98245-7890">
      </div>

      <div class="modal-acoes">
        <button class="btn-cancelar" onclick="fecharModalMedico()">Cancelar</button>
        <button class="btn-cadastrar" onclick="cadastrarMedico()">Cadastrar Médico</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function abrirModalMedico() {
  criarModalMedico();
  requestAnimationFrame(() => {
    document.getElementById("modalMedico").classList.add("ativo");
  });
}

function fecharModalMedico() {
  const modal = document.getElementById("modalMedico");
  if (!modal) return;
  modal.classList.remove("ativo");
  setTimeout(() => modal.remove(), 250);
}

async function cadastrarMedico() {
  const dados = {
    nome:          document.getElementById("medNome").value.trim(),
    especialidade: document.getElementById("medEspecialidade").value.trim(),
    crm:           document.getElementById("medCrm").value.trim(),
    email:         document.getElementById("medEmail").value.trim(),
    telefone:      document.getElementById("medTelefone").value.trim()
  };

  if (!dados.nome || !dados.especialidade || !dados.crm || !dados.email) {
    alert("Preencha os campos obrigatórios.");
    return;
  }

  try {
    const response = await fetch("/api/medicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      fecharModalMedico();
      renderizarMedicos(medicos);
    } else {
      alert("Erro ao cadastrar médico.");
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}


// ===== INICIALIZA =====
renderizarMedicos(medicos);

const btnAdicionarMedico = document.querySelector(".addMedico .btn");
if (btnAdicionarMedico) {
  btnAdicionarMedico.addEventListener("click", abrirModalMedico);
}