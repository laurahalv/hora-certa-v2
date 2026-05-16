const formularioMedico = document.querySelector('.form-DataMedico');
const formularioNotificacao = document.querySelector('.form-notificacao');
const formularioSeguranca = document.querySelector('.form-seguranca');
const logoButton = document.querySelector('.perfil-image');

logoButton.addEventListener('click', function() {
    window.location.href = 'pageMedicosHome.html';
});

async function enviarDados(url,dados) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        const resposta = await response.json();
        console.log('Resposta do servidor:', resposta);
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}

formularioMedico.addEventListener('submit',  async function(event) {
    event.preventDefault();

    const dadosMedico = {
        nome: formularioMedico.querySelector('#nome').value,
        especialidade: formularioMedico.querySelector('#especialidade').value,
        cpf: formularioMedico.querySelector('#cpf').value,
        email: formularioMedico.querySelector('#email').value,
        telefone: formularioMedico.querySelector('#telefone').value,
        endereco: formularioMedico.querySelector('#endereco').value
    }

    await enviarDados('/api/medicos', dadosMedico);

});

formularioNotificacao.addEventListener('submit', async function(event) {
    event.preventDefault();

    const dadosNotificacao = {
        notificacaoEmail: formularioNotificacao.querySelector('#notificacao-email').checked,
        notificacaoPush: formularioNotificacao.querySelector('#notificacao-push').checked,
        lembreteAntecipado: formularioNotificacao.querySelector('#lembrete-antecipado').checked
    }

    await enviarDados('/api/notificacoes', dadosNotificacao);

});

formularioSeguranca.addEventListener('submit',  async function(event) {
    event.preventDefault();

    const dadosSeguranca = {
        senhaAtual: formularioSeguranca.querySelector('#senha-atual').value,
        novaSenha: formularioSeguranca.querySelector('#nova-senha').value,
        confirmarSenha: formularioSeguranca.querySelector('#confirmar-senha').value
    }

    await enviarDados('/api/seguranca', dadosSeguranca);
});
