// historia.js
window.nomePersonagem = "Herói";
let indiceFrase = 0;

const frases = [
    "A noite caiu sobre a cidade... uma escuridão densa e assombrada.",
    "Onde deveria haver vida, agora há apenas o silêncio dos becos vazios.",
    "NPCs corrompidos despertaram: Morcegos, Bruxas, Zumbis e outros estranhos saíram das sombras.",
    "Você é o único que pode purificar essas ruas e salvar o que restou.",
    "Diga-nos, bravo guerreiro... qual é o seu nome?"
];

function iniciarJogo() {
    window.faseAtual = "historia";
    document.getElementById("menu-principal").style.display = "none";
    document.getElementById("tela-historia").style.display = "flex";
    proximaFrase();
}

function proximaFrase() {
    const txt = document.getElementById("texto-narracao");
    const containerNome = document.getElementById("container-nome");
    const btn = document.getElementById("btn-historia");
    const inputNome = document.getElementById("nome-jogador");

    if (indiceFrase < frases.length) {
        txt.innerText = frases[indiceFrase];
        if (indiceFrase === frases.length - 1) {
            containerNome.style.display = "block";
            btn.innerText = "COMEÇAR";
        }
        indiceFrase++;
    } else {
        if (inputNome && inputNome.value.trim() !== "") {
            window.nomePersonagem = inputNome.value;
        }
        setTimeout(() => {
            comecarAventura();
        }, 50);
    }
}

function comecarAventura() {
    document.getElementById("tela-historia").style.display = "none";
    window.faseAtual = "jogo";
    
    // Cria o mapa de grama
    if (typeof window.createGrass === "function") {
        window.createGrass();
    }
    
    // Reinicia os status do seu herói
    if (window.player) {
        window.player.x = 100;
        window.player.y = 100;
        window.player.hp = window.player.maxHp;
        window.player.vx = 0;
        window.player.vy = 0;
        window.player.attacking = false;
        window.player.defending = false;
        window.player.invulTimer = 0;
    }
    
    // Spawna os morcegos
    if (typeof initEnemies === "function") {
        initEnemies(15);
    }
}