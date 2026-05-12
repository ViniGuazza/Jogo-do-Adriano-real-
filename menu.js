const canvas = document.getElementById('fundo-canvas');
const ctx = canvas.getContext('2d');

let particulas = [];

function ajustarTela() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class FogParticula {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.tamanho = Math.random() * 200 + 100;
        this.velX = Math.random() * 0.5 - 0.25;
        this.opacidade = Math.random() * 0.15;
    }
    atualizar() {
        this.x += this.velX;
        if (this.x > canvas.width + 100) this.x = -100;
    }
    desenhar() {
        ctx.beginPath();
        let g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.tamanho);
        g.addColorStop(0, `rgba(20, 60, 20, ${this.opacidade})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initFundo() {
    ajustarTela();
    particulas = Array.from({length: 45}, () => new FogParticula());
}

function animar() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particulas.forEach(p => { p.atualizar(); p.desenhar(); });
    requestAnimationFrame(animar);
}

window.addEventListener('resize', initFundo);
initFundo();
animar();