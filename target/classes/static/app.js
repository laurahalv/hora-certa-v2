const API_BASE = "http://localhost:8080/api";

// Estado global
const state = {
  clinicas: [],
  medicos: [],
  pacientes: [],
  remedios: [],
  prescricoes: [],
  consumo: [],
};

// ===== FUNÇÕES GERAIS =====
async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, defaultOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Erro ${response.status}`);
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error("API Error:", error);
    showMensagem(error.message, "erro");
    throw error;
  }
}

function showMensagem(texto, tipo = "sucesso") {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;
  mensagem.className = `mensagem show ${tipo}`;
  setTimeout(() => {
    mensagem.classList.remove("show");
  }, 4000);
}

function inicializarAbas() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;
      mudarAbaPara(tabName);
    });
  });
}

function mudarAbaPara(tabName) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabName).classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
}

// ===== CLÍNICAS =====
async function carregarClinicas() {
  try {
    state.clinicas = await fetchAPI("/clinicas");
    renderClinicas();
    atualizarSelectClinicas();
  } catch (error) {
    console.error("Erro ao carregar clínicas:", error);
  }
}

function renderClinicas() {
  const lista = document.getElementById("listaClinicas");
  lista.innerHTML =
    state.clinicas.length === 0
      ? '<div class="empty-state"><h3>Nenhuma clínica cadastrada</h3></div>'
      : state.clinicas
          .map(
            (clinica) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${clinica.nome}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarClinica(${clinica.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarClinica(${clinica.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">CNPJ:</span>
                        <span>${clinica.cnpj || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Endereço:</span>
                        <span>${clinica.endereco || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Email:</span>
                        <span>${clinica.email || "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarClinica(e) {
  e.preventDefault();
  const id = document.getElementById("clinicaId").value;
  const dados = {
    nome: document.getElementById("clinicaNome").value,
    email: document.getElementById("clinicaEmail").value,
    cnpj: document.getElementById("clinicaCnpj").value,
    endereco: document.getElementById("clinicaEndereco").value,
  };

  try {
    if (id) {
      await fetchAPI(`/clinicas/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Clínica atualizada com sucesso!");
    } else {
      await fetchAPI("/clinicas", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Clínica adicionada com sucesso! Senha gerada automaticamente.");
    }
    document.getElementById("formClinica").reset();
    document.getElementById("clinicaId").value = "";
    carregarClinicas();
  } catch (error) {
    console.error("Erro ao salvar clínica:", error);
  }
}

async function editarClinica(id) {
  const clinica = state.clinicas.find((c) => c.id === id);
  if (clinica) {
    document.getElementById("clinicaId").value = clinica.id;
    document.getElementById("clinicaNome").value = clinica.nome;
    document.getElementById("clinicaEmail").value = clinica.email;
    document.getElementById("clinicaCnpj").value = clinica.cnpj;
    document.getElementById("clinicaEndereco").value = clinica.endereco;
    window.scrollTo(0, 0);
  }
}

async function deletarClinica(id) {
  if (confirm("Tem certeza que deseja deletar esta clínica?")) {
    try {
      await fetchAPI(`/clinicas/${id}`, { method: "DELETE" });
      showMensagem("Clínica deletada com sucesso!");
      carregarClinicas();
    } catch (error) {
      console.error("Erro ao deletar clínica:", error);
    }
  }
}

function atualizarSelectClinicas() {
  const select = document.getElementById("medicoClinica");
  select.innerHTML =
    '<option value="">Selecione Clínica</option>' +
    state.clinicas
      .map((c) => `<option value="${c.id}">${c.nome}</option>`)
      .join("");
}

// ===== MÉDICOS =====
async function carregarMedicos() {
  try {
    state.medicos = await fetchAPI("/medicos");
    renderMedicos();
    atualizarSelectMedicos();
  } catch (error) {
    console.error("Erro ao carregar médicos:", error);
  }
}

function renderMedicos() {
  const lista = document.getElementById("listaMedicos");
  lista.innerHTML =
    state.medicos.length === 0
      ? '<div class="empty-state"><h3>Nenhum médico cadastrado</h3></div>'
      : state.medicos
          .map(
            (medico) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${medico.nome}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarMedico(${medico.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarMedico(${medico.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Email:</span>
                        <span>${medico.email || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">CRM:</span>
                        <span>${medico.crm || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Especialidade:</span>
                        <span><span class="badge badge-info">${medico.especialidade || "N/A"}</span></span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Clínica:</span>
                        <span>${medico.clinicaNome || "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarMedico(e) {
  e.preventDefault();
  const id = document.getElementById("medicoId").value;
  const dados = {
    nome: document.getElementById("medicoNome").value,
    email: document.getElementById("medicoEmail").value,
    crm: document.getElementById("medicoCrm").value,
    especialidade: document.getElementById("medicoEspecialidade").value,
    clinicaId: parseInt(document.getElementById("medicoClinica").value),
  };

  try {
    if (id) {
      await fetchAPI(`/medicos/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Médico atualizado com sucesso!");
    } else {
      await fetchAPI("/medicos", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Médico adicionado com sucesso! Senha gerada automaticamente.");
    }
    document.getElementById("formMedico").reset();
    document.getElementById("medicoId").value = "";
    carregarMedicos();
  } catch (error) {
    console.error("Erro ao salvar médico:", error);
  }
}

async function editarMedico(id) {
  const medico = state.medicos.find((m) => m.id === id);
  if (medico) {
    document.getElementById("medicoId").value = medico.id;
    document.getElementById("medicoNome").value = medico.nome;
    document.getElementById("medicoEmail").value = medico.email;
    document.getElementById("medicoCrm").value = medico.crm;
    document.getElementById("medicoEspecialidade").value = medico.especialidade;
    document.getElementById("medicoClinica").value = medico.clinicaId;
    window.scrollTo(0, 0);
  }
}

async function deletarMedico(id) {
  if (confirm("Tem certeza que deseja deletar este médico?")) {
    try {
      await fetchAPI(`/medicos/${id}`, { method: "DELETE" });
      showMensagem("Médico deletado com sucesso!");
      carregarMedicos();
    } catch (error) {
      console.error("Erro ao deletar médico:", error);
    }
  }
}

function atualizarSelectMedicos() {
  const select = document.getElementById("prescricaoMedico");
  select.innerHTML =
    '<option value="">Selecione Médico</option>' +
    state.medicos
      .map((m) => `<option value="${m.id}">${m.nome}</option>`)
      .join("");
}

// ===== PACIENTES =====
async function carregarPacientes() {
  try {
    state.pacientes = await fetchAPI("/pacientes");
    renderPacientes();
    atualizarSelectPacientes();
    atualizarSelectClinicasPacientes();
  } catch (error) {
    console.error("Erro ao carregar pacientes:", error);
  }
}

function renderPacientes() {
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML =
    state.pacientes.length === 0
      ? '<div class="empty-state"><h3>Nenhum paciente cadastrado</h3></div>'
      : state.pacientes
          .map(
            (paciente) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${paciente.nome}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarPaciente(${paciente.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarPaciente(${paciente.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Email:</span>
                        <span>${paciente.email || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">CPF:</span>
                        <span>${paciente.cpf || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Telefone:</span>
                        <span>${paciente.telefone || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Data de Nascimento:</span>
                        <span>${paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString("pt-BR") : "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarPaciente(e) {
  e.preventDefault();
  const id = document.getElementById("pacienteId").value;
  const dados = {
    nome: document.getElementById("pacienteNome").value,
    email: document.getElementById("pacienteEmail").value,
    cpf: document.getElementById("pacienteCpf").value,
    telefonePrimario: document.getElementById("pacienteTelefonePrimario").value,
    telefone: document.getElementById("pacienteTelefone").value,
    clinicaId: parseInt(document.getElementById("pacienteClinica").value),
  };

  try {
    if (id) {
      await fetchAPI(`/pacientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Paciente atualizado com sucesso!");
    } else {
      await fetchAPI("/pacientes", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Paciente adicionado com sucesso! Senha gerada automaticamente.");
    }
    document.getElementById("formPaciente").reset();
    document.getElementById("pacienteId").value = "";
    carregarPacientes();
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
  }
}

async function editarPaciente(id) {
  const paciente = state.pacientes.find((p) => p.id === id);
  if (paciente) {
    document.getElementById("pacienteId").value = paciente.id;
    document.getElementById("pacienteNome").value = paciente.nome;
    document.getElementById("pacienteEmail").value = paciente.email;
    document.getElementById("pacienteCpf").value = paciente.cpf;
    document.getElementById("pacienteTelefonePrimario").value = paciente.telefonePrimario;
    document.getElementById("pacienteTelefone").value = paciente.telefone;
    document.getElementById("pacienteClinica").value = paciente.clinicaId;
    document.getElementById("pacienteDataNascimento").value =
      paciente.dataNascimento?.split("T")[0];
    window.scrollTo(0, 0);
  }
}

async function deletarPaciente(id) {
  if (confirm("Tem certeza que deseja deletar este paciente?")) {
    try {
      await fetchAPI(`/pacientes/${id}`, { method: "DELETE" });
      showMensagem("Paciente deletado com sucesso!");
      carregarPacientes();
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
    }
  }
}

function atualizarSelectPacientes() {
  const select = document.getElementById("prescricaoPaciente");
  select.innerHTML =
    '<option value="">Selecione Paciente</option>' +
    state.pacientes
      .map((p) => `<option value="${p.id}">${p.nome}</option>`)
      .join("");
}

// ===== REMÉDIOS =====
async function carregarRemedios() {
  try {
    state.remedios = await fetchAPI("/remedios");
    renderRemedios();
    atualizarSelectRemedios();
  } catch (error) {
    console.error("Erro ao carregar remédios:", error);
  }
}

function renderRemedios() {
  const lista = document.getElementById("listaRemedios");
  lista.innerHTML =
    state.remedios.length === 0
      ? '<div class="empty-state"><h3>Nenhum remédio cadastrado</h3></div>'
      : state.remedios
          .map(
            (remedio) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${remedio.nome}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarRemedio(${remedio.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarRemedio(${remedio.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Princípio Ativo:</span>
                        <span>${remedio.principioAtivo || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Dosagem:</span>
                        <span>${remedio.dosagem || "N/A"} mg</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Descrição:</span>
                        <span>${remedio.descricao || "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarRemedio(e) {
  e.preventDefault();
  const id = document.getElementById("remedioId").value;
  const dados = {
    nome: document.getElementById("remedioNome").value,
    principioAtivo: document.getElementById("remedioPrincipioAtivo").value,
    dosagem: parseFloat(document.getElementById("remedioDosagem").value),
    descricao: document.getElementById("remedioDescricao").value,
  };

  try {
    if (id) {
      await fetchAPI(`/remedios/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Remédio atualizado com sucesso!");
    } else {
      await fetchAPI("/remedios", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Remédio adicionado com sucesso!");
    }
    document.getElementById("formRemedio").reset();
    document.getElementById("remedioId").value = "";
    carregarRemedios();
  } catch (error) {
    console.error("Erro ao salvar remédio:", error);
  }
}

async function editarRemedio(id) {
  const remedio = state.remedios.find((r) => r.id === id);
  if (remedio) {
    document.getElementById("remedioId").value = remedio.id;
    document.getElementById("remedioNome").value = remedio.nome;
    document.getElementById("remedioPrincipioAtivo").value =
      remedio.principioAtivo;
    document.getElementById("remedioDosagem").value = remedio.dosagem;
    document.getElementById("remedioDescricao").value = remedio.descricao;
    window.scrollTo(0, 0);
  }
}

async function deletarRemedio(id) {
  if (confirm("Tem certeza que deseja deletar este remédio?")) {
    try {
      await fetchAPI(`/remedios/${id}`, { method: "DELETE" });
      showMensagem("Remédio deletado com sucesso!");
      carregarRemedios();
    } catch (error) {
      console.error("Erro ao deletar remédio:", error);
    }
  }
}

function atualizarSelectRemedios() {
  const select = document.getElementById("prescricaoRemedio");
  select.innerHTML =
    '<option value="">Selecione Remédio</option>' +
    state.remedios
      .map((r) => `<option value="${r.id}">${r.nome}</option>`)
      .join("");
}

// ===== PRESCRIÇÕES =====
async function carregarPrescricoes() {
  try {
    state.prescricoes = await fetchAPI("/prescricoes");
    renderPrescricoes();
    atualizarSelectPrescricoes();
  } catch (error) {
    console.error("Erro ao carregar prescrições:", error);
  }
}

function renderPrescricoes() {
  const lista = document.getElementById("listaPrescricoes");
  lista.innerHTML =
    state.prescricoes.length === 0
      ? '<div class="empty-state"><h3>Nenhuma prescrição cadastrada</h3></div>'
      : state.prescricoes
          .map(
            (prescricao) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${prescricao.nomeRemedio || "Prescrição"}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarPrescricao(${prescricao.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarPrescricao(${prescricao.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Dosagem:</span>
                        <span>${prescricao.dosagem || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Frequência:</span>
                        <span>${prescricao.frequencia || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Paciente:</span>
                        <span>${prescricao.pacienteNome || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Médico:</span>
                        <span>${prescricao.medicoNome || "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Status:</span>
                        <span><span class="badge ${getStatusBadgeClass(prescricao.status)}">${prescricao.status || "N/A"}</span></span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Início:</span>
                        <span>${prescricao.dataInicio ? new Date(prescricao.dataInicio).toLocaleDateString("pt-BR") : "N/A"}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Término:</span>
                        <span>${prescricao.dataTermino ? new Date(prescricao.dataTermino).toLocaleDateString("pt-BR") : "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarPrescricao(e) {
  e.preventDefault();
  const id = document.getElementById("prescricaoId").value;
  const remedioId = parseInt(
    document.getElementById("prescricaoRemedio").value,
  );
  const remedioSelecionado = state.remedios.find((r) => r.id === remedioId);

  const dados = {
    nomeRemedio: remedioSelecionado?.nome || "",
    remedioId: remedioId,
    dosagem: document.getElementById("prescricaoDosagem").value,
    frequencia: document.getElementById("prescricaoFrequencia").value,
    dataInicio: document.getElementById("prescricaoDataInicio").value,
    dataTermino: document.getElementById("prescricaoDataTermino").value,
    descricao: document.getElementById("prescricaoDescricao").value,
    medicoId: parseInt(document.getElementById("prescricaoMedico").value),
    pacienteId: parseInt(document.getElementById("prescricaoPaciente").value),
  };

  try {
    if (id) {
      await fetchAPI(`/prescricoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Prescrição atualizada com sucesso!");
    } else {
      await fetchAPI("/prescricoes", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Prescrição adicionada com sucesso!");
    }
    document.getElementById("formPrescricao").reset();
    document.getElementById("prescricaoId").value = "";
    carregarPrescricoes();
  } catch (error) {
    console.error("Erro ao salvar prescrição:", error);
  }
}

async function editarPrescricao(id) {
  const prescricao = state.prescricoes.find((p) => p.id === id);
  if (prescricao) {
    document.getElementById("prescricaoId").value = prescricao.id;
    document.getElementById("prescricaoDosagem").value = prescricao.dosagem;
    document.getElementById("prescricaoFrequencia").value =
      prescricao.frequencia;
    document.getElementById("prescricaoDataInicio").value =
      prescricao.dataInicio;
    document.getElementById("prescricaoDataTermino").value =
      prescricao.dataTermino;
    document.getElementById("prescricaoDescricao").value = prescricao.descricao;
    document.getElementById("prescricaoMedico").value = prescricao.medicoId;
    document.getElementById("prescricaoPaciente").value = prescricao.pacienteId;
    window.scrollTo(0, 0);
  }
}

async function deletarPrescricao(id) {
  if (confirm("Tem certeza que deseja deletar esta prescrição?")) {
    try {
      await fetchAPI(`/prescricoes/${id}`, { method: "DELETE" });
      showMensagem("Prescrição deletada com sucesso!");
      carregarPrescricoes();
    } catch (error) {
      console.error("Erro ao deletar prescrição:", error);
    }
  }
}

function atualizarSelectPrescricoes() {
  const select = document.getElementById("consumoPrescricao");
  select.innerHTML =
    '<option value="">Selecione Prescrição</option>' +
    state.prescricoes
      .map(
        (p) =>
          `<option value="${p.id}">${p.nomeRemedio} - ${p.pacienteNome}</option>`,
      )
      .join("");
}

// ===== REGISTRO DE CONSUMO =====
async function carregarConsumo() {
  try {
    state.consumo = await fetchAPI("/registro-consumo");
    renderConsumo();
  } catch (error) {
    console.error("Erro ao carregar registro de consumo:", error);
  }
}

function renderConsumo() {
  const lista = document.getElementById("listaConsumo");
  lista.innerHTML =
    state.consumo.length === 0
      ? '<div class="empty-state"><h3>Nenhum registro de consumo</h3></div>'
      : state.consumo
          .map(
            (consumo) => `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Consumo #${consumo.id}</div>
                    <div class="card-actions">
                        <button class="btn btn-edit" onclick="editarConsumo(${consumo.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarConsumo(${consumo.id})">Deletar</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="card-label">Data/Hora:</span>
                        <span>${new Date(consumo.dataHora).toLocaleString("pt-BR")}</span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Status:</span>
                        <span><span class="badge ${getConsumoStatusClass(consumo.status)}">${consumo.status || "N/A"}</span></span>
                    </div>
                    <div class="card-field">
                        <span class="card-label">Observações:</span>
                        <span>${consumo.observacoes || "N/A"}</span>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
}

async function salvarConsumo(e) {
  e.preventDefault();
  const id = document.getElementById("consumoId").value;
  const dados = {
    prescricaoId: parseInt(document.getElementById("consumoPrescricao").value),
    dataHora: document.getElementById("consumoDataHora").value,
    status: document.getElementById("consumoStatus").value,
    observacoes: document.getElementById("consumoObservacoes").value,
  };

  try {
    if (id) {
      await fetchAPI(`/registro-consumo/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
      });
      showMensagem("Registro de consumo atualizado com sucesso!");
    } else {
      await fetchAPI("/registro-consumo", {
        method: "POST",
        body: JSON.stringify(dados),
      });
      showMensagem("Registro de consumo adicionado com sucesso!");
    }
    document.getElementById("formConsumo").reset();
    document.getElementById("consumoId").value = "";
    carregarConsumo();
  } catch (error) {
    console.error("Erro ao salvar registro de consumo:", error);
  }
}

async function editarConsumo(id) {
  const consumo = state.consumo.find((c) => c.id === id);
  if (consumo) {
    document.getElementById("consumoId").value = consumo.id;
    document.getElementById("consumoPrescricao").value = consumo.prescricaoId;
    document.getElementById("consumoDataHora").value = consumo.dataHora;
    document.getElementById("consumoStatus").value = consumo.status;
    document.getElementById("consumoObservacoes").value = consumo.observacoes;
    window.scrollTo(0, 0);
  }
}

async function deletarConsumo(id) {
  if (confirm("Tem certeza que deseja deletar este registro?")) {
    try {
      await fetchAPI(`/registro-consumo/${id}`, { method: "DELETE" });
      showMensagem("Registro deletado com sucesso!");
      carregarConsumo();
    } catch (error) {
      console.error("Erro ao deletar registro:", error);
    }
  }
}

// ===== FUNÇÕES AUXILIARES =====
function getStatusBadgeClass(status) {
  const statusMap = {
    ATIVA: "badge-success",
    PAUSADA: "badge-warning",
    FINALIZADA: "badge-danger",
  };
  return statusMap[status] || "badge-info";
}

function getConsumoStatusClass(status) {
  const statusMap = {
    TOMADO: "badge-success",
    PERDIDO: "badge-danger",
    ADIADO: "badge-warning",
  };
  return statusMap[status] || "badge-info";
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", async () => {
  inicializarAbas();

  document
    .getElementById("formClinica")
    .addEventListener("submit", salvarClinica);
  document
    .getElementById("formMedico")
    .addEventListener("submit", salvarMedico);
  document
    .getElementById("formPaciente")
    .addEventListener("submit", salvarPaciente);
  document
    .getElementById("formRemedio")
    .addEventListener("submit", salvarRemedio);
  document
    .getElementById("formPrescricao")
    .addEventListener("submit", salvarPrescricao);
  document
    .getElementById("formConsumo")
    .addEventListener("submit", salvarConsumo);

  await Promise.all([
    carregarClinicas(),
    carregarMedicos(),
    carregarPacientes(),
    carregarRemedios(),
    carregarPrescricoes(),
    carregarConsumo(),
  ]);
});
