const formularioCnpj = document.querySelector(".form-cnpj");
const formularioPerfil = document.querySelector(".form-perfil");
const formularioSeguranca = document.querySelector(".form-seguranca");

// ===== CARREGAR DADOS DA CLÍNICA =====
document.addEventListener("DOMContentLoaded", function () {
  carregarDadosClinica();
});

function carregarDadosClinica() {
  const clinicaId = localStorage.getItem("clinicaId");

  if (!clinicaId) {
    console.error("Clínica não identificada");
    return;
  }

  fetch(`http://localhost:8080/api/clinicas/${clinicaId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Preencher formulário de configurações da clínica
      formularioCnpj.querySelector("#nome").value = data.nome || "";
      formularioCnpj.querySelector("#cnpj").value = data.cnpj || "";
      formularioCnpj.querySelector("#endereco").value = data.endereco || "";

      // Preencher formulário de perfil
      formularioPerfil.querySelector("#nome").value = data.nome || "";
      formularioPerfil.querySelector("#email").value = data.email || "";
    })
    .catch((error) => {
      console.error("Erro ao carregar dados da clínica:", error);
    });
}

// ===== ENVIAR DADOS =====
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
    alert("Dados salvos com sucesso!");
    return true;
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar dados: " + error.message);
    return false;
  }
}

// ===== FORMULÁRIO CNPJ =====
formularioCnpj.addEventListener("submit", async (event) => {
  event.preventDefault();

  const clinicaId = localStorage.getItem("clinicaId");

  const dadosEmpresa = {
    nome: formularioCnpj.querySelector("#nome").value,
    cnpj: formularioCnpj.querySelector("#cnpj").value,
    endereco: formularioCnpj.querySelector("#endereco").value,
  };

  await enviarDados(
    `http://localhost:8080/api/clinicas/${clinicaId}`,
    dadosEmpresa,
    "PATCH",
  );
});

// ===== FORMULÁRIO PERFIL =====
formularioPerfil.addEventListener("submit", async (event) => {
  event.preventDefault();

  const clinicaId = localStorage.getItem("clinicaId");

  const dadosPerfil = {
    nome: formularioPerfil.querySelector("#nome").value,
    email: formularioPerfil.querySelector("#email").value,
  };

  await enviarDados(
    `http://localhost:8080/api/clinicas/${clinicaId}`,
    dadosPerfil,
    "PATCH",
  );
});

// ===== FORMULÁRIO SEGURANÇA =====
formularioSeguranca.addEventListener("submit", async (event) => {
  event.preventDefault();

  const novaSenha = formularioSeguranca.querySelector("#nova-senha").value;
  const confirmarSenha =
    formularioSeguranca.querySelector("#confirmar-senha").value;

  if (novaSenha !== confirmarSenha) {
    alert("As senhas não correspondem");
    return;
  }

  const clinicaId = localStorage.getItem("clinicaId");

  const dadosSenha = {
    senha: novaSenha,
  };

  await enviarDados(
    `http://localhost:8080/api/clinicas/${clinicaId}`,
    dadosSenha,
    "PATCH",
  );

  // Limpar campos
  formularioSeguranca.querySelector("#senha-atual").value = "";
  formularioSeguranca.querySelector("#nova-senha").value = "";
  formularioSeguranca.querySelector("#confirmar-senha").value = "";
});
