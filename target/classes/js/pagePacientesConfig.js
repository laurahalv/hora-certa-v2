const formularioPaciente = document.querySelector(".form-DataPaciente");
const formularioNotificacao = document.querySelector(".form-notificacao");
const formularioSeguranca = document.querySelector(".form-seguranca");

// =============================================
// ===== DADOS DO PACIENTE (LOCALSTORAGE) ======
// =============================================
const LOGGED_PACIENTE_ID = localStorage.getItem("pacienteId");
const LOGGED_PACIENTE_NOME = localStorage.getItem("pacienteNome");
let PACIENTE_SENHA_ATUAL = ""; // Armazena a senha para envio posterior

// ===== CARREGAMENTO INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  // Atualiza o Header da página
  const txtPacienteNome = document.getElementById("loggedPacienteNome");
  if (txtPacienteNome && LOGGED_PACIENTE_NOME) {
    txtPacienteNome.textContent = LOGGED_PACIENTE_NOME;
  }

  // Busca os dados cadastrais salvos no banco para preencher o formulário
  if (LOGGED_PACIENTE_ID) {
    buscarDadosPaciente();
  } else {
    console.error("ID do paciente ausente no localStorage.");
  }
});

// ===== FETCH (GET): BUSCAR DADOS DO PACIENTE =====
async function buscarDadosPaciente() {
  try {
    const response = await fetch(
      `http://localhost:8080/api/pacientes/${LOGGED_PACIENTE_ID}`,
    );
    if (!response.ok) throw new Error("Erro ao obter dados cadastrais");

    const paciente = await response.json();

    // Armazena a senha para envio posterior (não exibe ao usuário)
    PACIENTE_SENHA_ATUAL = paciente.senha || "";

    if (formularioPaciente) {
      formularioPaciente.querySelector("#nome").value = paciente.nome || "";
      formularioPaciente.querySelector("#cpf").value = paciente.cpf || "";
      formularioPaciente.querySelector("#email").value = paciente.email || "";
      formularioPaciente.querySelector("#telefone").value =
        paciente.telefone || "";
      formularioPaciente.querySelector("#endereco").value =
        paciente.endereco || "";
    }
  } catch (err) {
    console.error("Falha ao alimentar formulário do paciente:", err);
  }
}

// ===== FUNÇÃO GLOBAL DE ENVIO (FETCH POST/PUT) =====
async function enviarDados(url, dados, metodo = "POST") {
  try {
    const response = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error("Erro na requisição: " + response.status);
    }

    // Evita quebra se o endpoint retornar 204 No Content
    const resposta =
      response.status !== 204 ? await response.json().catch(() => ({})) : {};
    console.log("Resposta do servidor:", resposta);
    return true;
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    alert("Erro ao salvar dados: " + error.message);
    return false;
  }
}

// ===== EVENTO SUBMIT: ATUALIZAR DADOS CADASTRAIS (PUT) =====
formularioPaciente.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosPaciente = {
    nome: formularioPaciente.querySelector("#nome").value.trim(),
    cpf: formularioPaciente.querySelector("#cpf").value.trim(),
    email: formularioPaciente.querySelector("#email").value.trim(),
    telefone: formularioPaciente.querySelector("#telefone").value.trim(),
    endereco: formularioPaciente.querySelector("#endereco").value.trim(),
    senha: PACIENTE_SENHA_ATUAL, // Inclui a senha para evitar valor nulo
  };

  // Dispara um PUT apontando para o endpoint REST correto
  const sucesso = await enviarDados(
    `http://localhost:8080/api/pacientes/${LOGGED_PACIENTE_ID}`,
    dadosPaciente,
    "PUT",
  );

  if (sucesso) {
    // Sincroniza o localStorage local para manter os headers das outras páginas atualizados
    localStorage.setItem("pacienteNome", dadosPaciente.nome);
    localStorage.setItem("pacienteEmail", dadosPaciente.email);

    const txtPacienteNome = document.getElementById("loggedPacienteNome");
    if (txtPacienteNome) txtPacienteNome.textContent = dadosPaciente.nome;

    alert("Seus dados cadastrais foram atualizados!");
  } else {
    alert("Não foi possível atualizar os dados.");
  }
});

// ===== EVENTO SUBMIT: NOTIFICAÇÕES (POST) =====
formularioNotificacao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosNotificacao = {
    pacienteId: Number(LOGGED_PACIENTE_ID),
    notificacaoEmail:
      formularioNotificacao.querySelector("#notificacao-email").checked,
    notificacaoPush:
      formularioNotificacao.querySelector("#notificacao-push").checked,
    lembreteAntecipado: formularioNotificacao.querySelector(
      "#lembrete-antecipado",
    ).checked,
  };

  const sucesso = await enviarDados(
    "http://localhost:8080/api/notificacoes",
    dadosNotificacao,
    "POST",
  );
  if (sucesso) alert("Preferências de notificação salvas!");
});

// ===== EVENTO SUBMIT: SEGURANÇA (POST) =====
formularioSeguranca.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosSeguranca = {
    pacienteId: Number(LOGGED_PACIENTE_ID),
    senhaAtual: formularioSeguranca.querySelector("#senha-atual").value,
    novaSenha: formularioSeguranca.querySelector("#nova-senha").value,
    confirmarSenha: formularioSeguranca.querySelector("#confirmar-senha").value,
  };

  if (dadosSeguranca.novaSenha !== dadosSeguranca.confirmarSenha) {
    alert("A nova senha e a confirmação digitadas não conferem.");
    return;
  }

  const sucesso = await enviarDados(
    "http://localhost:8080/api/seguranca",
    dadosSeguranca,
    "POST",
  );
  if (sucesso) {
    alert("Sua senha foi alterada com sucesso!");
    formularioSeguranca.reset();
  }
});
