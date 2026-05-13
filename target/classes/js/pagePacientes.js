// ===== DADOS DOS PACIENTES (virão do banco via fetch/API) =====
const pacientes = [
  {
    nome: "Laura Alves",
    email: "LauraAlves@gmail.com",
    telefone: "(11)98111-1111",
    medico: "Dr. Marcelo Rossi",
    tratamentos: 2,
    adesao: 100,
    proximaConsulta: "09/04/2026"
  },
  {
    nome: "Luiz Oliveira",
    email: "LuizOliveira@gmail.com",
    telefone: "(11)98222-2222",
    medico: "Dr. Bruno Lins",
    tratamentos: 3,
    adesao: 88,
    proximaConsulta: "04/04/2026"
  },
  {
    nome: "Natalia Fogaça",
    email: "NataliaFogaca@gmail.com",
    telefone: "(11)98333-3333",
    medico: "Dr. Rafalaelly Abreu",
    tratamentos: 1,
    adesao: 76,
    proximaConsulta: "27/03/2026"
  }
];

// ===== COR DA BARRA DE ADESÃO =====
function corAdesao(valor) {
  if (valor >= 90) return "#22c55e";
  if (valor >= 75) return "#f59e0b";
  return "#ef4444";
}

// ===== INICIAL DO NOME PARA O AVATAR =====
function inicialNome(nome) {
  return nome.charAt(0).toUpperCase();
}

// ===== CRIA UM CARD =====
function criarCard(paciente) {
  const cor = corAdesao(paciente.adesao);

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
        <div class="adesao-bar" style="width:${paciente.adesao}%; background:${cor};"></div>
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

// ===== RENDERIZA TODOS OS CARDS =====
function renderizarPacientes(lista) {
  const container = document.querySelector(".cards-container");
  container.innerHTML = ""; // limpa antes de renderizar

  lista.forEach(paciente => {
    const card = criarCard(paciente);
    container.appendChild(card);
  });
}

// ===== CHAMADA À API (substitua pela sua rota real) =====
// async function carregarPacientes() {
//   try {
//     const response = await fetch("/api/pacientes");
//     const data = await response.json();
//     if(data){
//         renderizarPacientes(data);
//     } else{ renderizarPacientes(pacientes); }
//   } catch (error) {
//     console.error("Erro ao carregar pacientes:", error);
//   }
// }

// ===== BOTÃO VER DETALHES =====
function verDetalhes(id) {
  window.location.href = `/paciente/${id}`;
}

// ===== INICIA =====
renderizarPacientes(pacientes);