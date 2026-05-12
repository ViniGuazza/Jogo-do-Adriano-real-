let nomePersonagem = "Herói"; // Variável global para o jogo

const frases = [
    "A noite caiu sobre a cidade... uma escuridão densa e assombrada.",
    "Onde deveria haver vida, agora há apenas o silêncio dos becos vazios.",
    "NPCs corrompidos despertaram: Morcegos, Bruxas, Zumbis e outros estranhos saíram das sombras.",
    "Você é o único que pode purificar essas ruas e salvar o que restou.",
    "Diga-nos, bravo guerreiro... qual é o seu nome?"
];

let indiceFrase = 0;

function iniciarJogo() {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('tela-historia').style.display = 'flex';
    proximaFrase();
}

function proximaFrase() {
    const txt = document.getElementById('texto-narracao');
    const containerNome = document.getElementById('container-nome');
    const btn = document.getElementById('btn-historia');
    const inputNome = document.getElementById('nome-jogador');

    if (indiceFrase < frases.length) {
        txt.innerText = frases[indiceFrase];
        
        // Se for a última frase, mostra o campo de nome
        if (indiceFrase === frases.length - 1) {
            containerNome.style.display = "block";
            btn.innerText = "CONFIRMAR E LUTAR";
        }
        
        indiceFrase++;
    } else {
        // Salva o nome e começa o jogo
        if (inputNome.value.trim() !== "") {
            nomePersonagem = inputNome.value;
        }
        
        começarAventura();
    }
}

function começarAventura() {
    document.getElementById('tela-historia').style.display = 'none';
    alert("Boa sorte, " + nomePersonagem + ". A invasão começou!");
    // Aqui você chama a função que inicia o loop do seu jogo real
}