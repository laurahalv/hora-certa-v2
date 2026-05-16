const container = document.querySelector('.observacoes-container');

function criarCard(texto, data, hora) {

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
    
        <div class="card-conteudo">

            <div class="card-icone">
                📋
            </div>

            <div class="card-texto">
                ${texto}
            </div>

        </div>

        <div class="card-inferior">

            <span>📅 ${data}</span>
            <span>🕒 ${hora}</span>

        </div>

    `;

    container.appendChild(card);
}


criarCard(
    'Senti tontura após tomar a medicação da manhã',
    '18/04/2026',
    '09:30'
);

criarCard(
    'Dor de cabeça após almoço',
    '19/04/2026',
    '14:20'
);