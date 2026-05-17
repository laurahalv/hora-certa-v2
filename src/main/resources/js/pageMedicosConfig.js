const formularioMedico = document.querySelector(".form-DataMedico");
const formularioNotificacao = document.querySelector(".form-notificacao");
const formularioSeguranca = document.querySelector(".form-seguranca");
const logoButton = document.querySelector(".perfil-image");

// =============================================
// ===== DADOS DO MÉDICO (LOCALSTORAGE) ========
// =============================================
const LOGGED_MEDICO_ID = localStorage.getItem("medicoId");
const LOGGED_MEDICO_NOME = localStorage.getItem("medicoNome");
let MEDICO_SENHA_ATUAL = ""; // Armazena a senha para envio posterior

// Redirecionamento ao clicar na foto de perfil
if (logoButton) {
  logoButton.addEventListener("click", function () {
    window.location.href = "pageMedicosHome.html";
  });
}

// ===== CARREGAMENTO INICIAL =====
document.addEventListener("DOMContentLoaded", function () {
  // 1. Atualiza o nome do médico no Header da página
  const txtMedicoNome = document.getElementById("loggedMedicoNome");
  if (txtMedicoNome) {
    txtMedicoNome.textContent = LOGGED_MEDICO_NOME
      ? `Dr(a). ${LOGGED_MEDICO_NOME}`
      : "Médico Responsável";
  }

  // 2. Busca os dados no servidor para preencher os inputs do formulário
  if (LOGGED_MEDICO_ID) {
    buscarDadosFormulario();
  } else {
    console.error("ID do médico não encontrado no localStorage.");
  }
});

// ===== BUSCAR DADOS CADASTRAIS DO BANCO =====
async function buscarDadosFormulario() {
  try {
    const response = await fetch(
      `http://localhost:8080/api/medicos/${LOGGED_MEDICO_ID}`,
    );
    if (!response.ok) throw new Error("Erro ao obter dados do médico");

    const medico = await response.json();

    // Armazena a senha para envio posterior (não exibe ao usuário)
    MEDICO_SENHA_ATUAL = medico.senha || "";

    // Alimenta os campos do formulário de forma segura
    if (formularioMedico) {
      formularioMedico.querySelector("#nome").value = medico.nome || "";
      formularioMedico.querySelector("#especialidade").value =
        medico.especialidade || "";
      formularioMedico.querySelector("#cpf").value = medico.cpf || "";
      formularioMedico.querySelector("#email").value = medico.email || "";
      formularioMedico.querySelector("#telefone").value = medico.telefone || "";
      formularioMedico.querySelector("#endereco").value = medico.endereco || "";
    }
  } catch (err) {
    console.error("Erro ao preencher formulário de configurações:", err);
  }
}

// ===== FUNÇÃO GENÉRICA DE PERSISTÊNCIA =====
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

// ===== SUBMIT: DADOS DO MÉDICO (PUT) =====
formularioMedico.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosMedico = {
    nome: formularioMedico.querySelector("#nome").value.trim(),
    especialidade: formularioMedico
      .querySelector("#especialidade")
      .value.trim(),
    cpf: formularioMedico.querySelector("#cpf").value.trim(),
    email: formularioMedico.querySelector("#email").value.trim(),
    telefone: formularioMedico.querySelector("#telefone").value.trim(),
    endereco: formularioMedico.querySelector("#endereco").value.trim(),
    senha: MEDICO_SENHA_ATUAL, // Inclui a senha para evitar valor nulo
  };

  // Utiliza PUT passando o ID na URL para atualizar o registro correto
  const sucesso = await enviarDados(
    `http://localhost:8080/api/medicos/${LOGGED_MEDICO_ID}`,
    dadosMedico,
    "PUT",
  );

  if (sucesso) {
    // Atualiza o LocalStorage para refletir a alteração nas outras telas imediatamente
    localStorage.setItem("medicoNome", dadosMedico.nome);
    localStorage.setItem("medicoEmail", dadosMedico.email);

    // Atualiza o texto do Header na hora
    const txtMedicoNome = document.getElementById("loggedMedicoNome");
    if (txtMedicoNome) txtMedicoNome.textContent = `Dr(a). ${dadosMedico.nome}`;

    alert("Configurações do médico salvas com sucesso!");
  } else {
    alert("Erro ao salvar os dados cadastrais.");
  }
});

// ===== SUBMIT: NOTIFICAÇÕES =====
formularioNotificacao.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosNotificacao = {
    medicoId: Number(LOGGED_MEDICO_ID),
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

// ===== SUBMIT: SEGURANÇA =====
formularioSeguranca.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dadosSeguranca = {
    medicoId: Number(LOGGED_MEDICO_ID),
    senhaAtual: formularioSeguranca.querySelector("#senha-atual").value,
    novaSenha: formularioSeguranca.querySelector("#nova-senha").value,
    confirmarSenha: formularioSeguranca.querySelector("#confirmar-senha").value,
  };

  if (dadosSeguranca.novaSenha !== dadosSeguranca.confirmarSenha) {
    alert("A nova senha e a confirmação não batem.");
    return;
  }

  const sucesso = await enviarDados(
    "http://localhost:8080/api/seguranca",
    dadosSeguranca,
    "POST",
  );
  if (sucesso) {
    alert("Senha atualizada com sucesso!");
    formularioSeguranca.reset();
  }
});
