const formularioCnpj = document.querySelector('.form-cnpj');
const formularioPerfil = document.querySelector('.form-perfil');
const formularioConfig = document.querySelector('.form-config');

async function enviarDados(url, dados) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const resultado = await response.json();

        console.log('Sucesso:', resultado);

    } catch(error){
        console.error(error);
    }
}

formularioCnpj.addEventListener('submit', async (event)=>{

    event.preventDefault();

    const dadosEmpresa = {
        nome: formularioCnpj.querySelector('#nome').value,
        cnpj: formularioCnpj.querySelector('#cnpj').value,
        endereco: formularioCnpj.querySelector('#endereco').value
    };

    await enviarDados('/api/empresas', dadosEmpresa);

});


formularioPerfil.addEventListener('submit', async (event)=>{

    event.preventDefault();

    const dadosPerfil = {
        nome: formularioPerfil.querySelector('#nome').value,
        email: formularioPerfil.querySelector('#email').value,
        telefone: formularioPerfil.querySelector('#telefone').value
    };

    await enviarDados('/api/perfil', dadosPerfil);

});


formularioConfig.addEventListener('submit', async (event)=>{

    event.preventDefault();

    const dadosConfig = {
        senhaAtual: formularioConfig.querySelector('#senha-atual').value,
        novaSenha: formularioConfig.querySelector('#nova-senha').value,
        confirmarSenha: formularioConfig.querySelector('#confirmar-senha').value
    };

    await enviarDados('/api/configuracao', dadosConfig);

});