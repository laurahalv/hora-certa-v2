const btnEntrar = document.querySelector('.btnEntrar');
const btnCriarConta = document.querySelector('.btnCriarConta');

btnEntrar.addEventListener('click', () => {
    window.location.href = 'pageLogins.html';
});

btnCriarConta.addEventListener('click', () => {
    window.location.href = 'pageCreateLogins.html';
});

