document.addEventListener("DOMContentLoaded", function () {
  // Verificar se a clínica está logada
  const isClinicaLogada = localStorage.getItem("isClinicaLogada");
  const clinicaId = localStorage.getItem("clinicaId");

  if (!isClinicaLogada || !clinicaId) {
    alert("Você precisa estar logado como clínica para acessar o dashboard");
    window.location.href = "./pageLoginClinica.html";
    return;
  }

  loadDashboardData();

  // Adicionar funcionalidade do botão logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("clinicaId");
      localStorage.removeItem("clinicaNome");
      localStorage.removeItem("clinicaEmail");
      localStorage.removeItem("isClinicaLogada");
      alert("Você foi desconectado");
      window.location.href = "../pageLogins.html";
    });
  }
});

function loadDashboardData() {
  const clinicaId = localStorage.getItem("clinicaId");

  if (!clinicaId) {
    console.error("Clínica não identificada");
    return;
  }

  fetch(`http://localhost:8080/api/clinicas/${clinicaId}/dashboard`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("total-pacientes").textContent =
        data.totalPacientes;
      document.getElementById("total-medicos").textContent = data.totalMedicos;
      document.getElementById("total-convites").textContent =
        data.totalConvites;
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do dashboard:", error);
    });
}
