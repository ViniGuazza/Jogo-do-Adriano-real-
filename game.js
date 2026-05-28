// game.js - Versão "TOTAL PHYSICAL WORLD"
const OBSTACULOS = [];
const ENTIDADES = []; 
const MORCEGOS_FUNDO = [];
let skyCanvas = document.createElement("canvas");
let roadCanvas = document.createElement("canvas");

if (window.faseAtual === undefined) window.faseAtual = "menu";

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createWorld();
}

function createWorld() {
    ENTIDADES.length = 0; OBSTACULOS.length = 0; MORCEGOS_FUNDO.length = 0;
    skyCanvas.width = canvas.width; skyCanvas.height = canvas.height;
    let sctx = skyCanvas.getContext("2d");
    let skyGrad = sctx.createLinearGradient(0,0,0,canvas.height);
    skyGrad.addColorStop(0, "#050813"); skyGrad.addColorStop(0.6, "#1a1a2e"); skyGrad.addColorStop(1, "#16213e");
    sctx.fillStyle = skyGrad; sctx.fillRect(0,0,canvas.width,canvas.height);
    roadCanvas.width = canvas.width; roadCanvas.height = canvas.height;
    let rctx = roadCanvas.getContext("2d");
    rctx.fillStyle = "#14260b"; rctx.fillRect(0,0,canvas.width,canvas.height); 
    rctx.strokeStyle = "#3e2723"; rctx.lineWidth = 160;
    rctx.lineCap = "round"; rctx.beginPath(); rctx.moveTo(-100, canvas.height*0.7);
    rctx.bezierCurveTo(canvas.width/3, canvas.height*0.5, canvas.width*0.6, canvas.height*0.9, canvas.width+100, canvas.height*0.7);
    rctx.stroke();

    const layout = [
        {type: "casa", x: 150, y: 150, w: 260, h: 240},
        {type: "casa", x: 750, y: 120, w: 300, h: 280},
        {type: "arvore", x: 80, y: 400}, {type: "arvore", x: 500, y: 520},
        {type: "cerca", x: 420, y: 480, w: 140}, {type: "cerca", x: 900, y: 480, w: 140}
    ];
    layout.forEach(obj => {
        ENTIDADES.push(obj);
        if(obj.type === "casa") {
            // BLOQUEIO FÍSICO DA CASA (Paredes)
            OBSTACULOS.push({x: obj.x, y: obj.y + 40, w: obj.w, h: obj.h - 40});
        }
        else if(obj.type === "arvore") OBSTACULOS.push({x: obj.x+35, y: obj.y+140, w: 25, h: 20});
        else if(obj.type === "cerca") OBSTACULOS.push({x: obj.x, y: obj.y, w: obj.w, h: 30});
    });
}

function drawCasaLegendary(ctx, c) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(c.x + c.w/2, c.y + c.h, c.w/1.4, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#4a5568"; ctx.fillRect(c.x, c.y+c.h/2, c.w, c.h/2);
    ctx.fillStyle = "#f7f1e3"; ctx.fillRect(c.x, c.y+40, c.w, c.h/2-40);
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(c.x, c.y+40, 15, c.h/2); ctx.fillRect(c.x+c.w-15, c.y+40, 15, c.h/2);
    ctx.fillStyle = "#1a252f"; ctx.beginPath(); ctx.moveTo(c.x-30, c.y+45); ctx.lineTo(c.x+c.w/2, c.y-60); ctx.lineTo(c.x+c.w+30, c.y+45); ctx.fill();
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(c.x+40, c.y+65, 50, 50);
    ctx.fillStyle = "#e67e22"; ctx.fillRect(c.x+45, c.y+70, 40, 40);
    ctx.fillStyle = "#3d2b1f"; ctx.fillRect(c.x+c.w-80, c.y+c.h-85, 55, 85);
    ctx.fillStyle = "#d4af37"; ctx.beginPath(); ctx.arc(c.x+c.w-35, c.y+c.h-42, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}

function drawArvoreLegendary(ctx, a) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(a.x+47, a.y+165, 40, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(a.x+38, a.y+100, 22, 70);
    ctx.fillStyle = "#14260b"; ctx.beginPath(); ctx.arc(a.x+45, a.y+65, 60, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}

function drawCerca(ctx, c) {
    ctx.fillStyle = "#3d2b1f";
    for(let i=0; i<c.w; i+=20) ctx.fillRect(c.x+i, c.y, 8, 35);
    ctx.fillRect(c.x-5, c.y+10, c.w+10, 5);
}

function checkObstacleCollision(p) {
    if (!p) return;
    const pBox = { x: p.x + p.w * 0.2, y: p.y + p.h * 0.75, w: p.w * 0.6, h: p.h * 0.25 };
    OBSTACULOS.forEach(obs => {
        if (pBox.x < obs.x + obs.w && pBox.x + pBox.w > obs.x && pBox.y < obs.y + obs.h && pBox.y + pBox.h > obs.y) {
            const ox = Math.min(pBox.x + pBox.w - obs.x, obs.x + obs.w - pBox.x);
            const oy = Math.min(pBox.y + pBox.h - obs.y, obs.y + obs.h - pBox.y);
            if (ox < oy) p.x = (pBox.x + pBox.w/2 < obs.x + obs.w/2) ? obs.x - p.w*0.8 : obs.x + obs.w - p.w*0.2;
            else p.y = (pBox.y + pBox.h/2 < obs.y + obs.h/2) ? obs.y - p.h : obs.y + obs.h - p.h*0.75;
        }
    });
}

function update() {
    if (window.faseAtual === "jogo") {
        if (typeof updatePlayer === "function") { updatePlayer(canvas); checkObstacleCollision(window.player); }
        if (typeof updateEnemies === "function") updateEnemies();
        if (typeof handleCombat === "function") handleCombat();
        if (window.player && window.player.hp <= 0) { window.player.hp = 0; window.faseAtual = "gameover"; }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (window.faseAtual === "jogo") {
        ctx.drawImage(skyCanvas, 0, 0); ctx.drawImage(roadCanvas, 0, 0);
        
        const todos = [...ENTIDADES, {type: "player", ...window.player}, ...(window.enemies || [])];
        todos.sort((a, b) => {
            const getBaseY = (o) => {
                if (o.type === "casa") return o.y + o.h;
                if (o.type === "player") return o.y + o.h;
                if (o.type === "arvore") return o.y + 170;
                // MORCEGOS: Sorting rigoroso pela base da sombra
                if (o.type === "enemy") return o.y + 50; 
                return o.y + (o.h || 0);
            };
            return getBaseY(a) - getBaseY(b);
        });

        todos.forEach(obj => {
            if (obj.type === "casa") drawCasaLegendary(ctx, obj);
            else if (obj.type === "arvore") drawArvoreLegendary(ctx, obj);
            else if (obj.type === "cerca") drawCerca(ctx, obj);
            else if (obj.type === "player") { if (typeof drawPlayer === "function") drawPlayer(ctx); }
            else { if (typeof drawEnemy === "function") drawEnemy(ctx, obj); }
        });

        ctx.fillStyle = "rgba(5, 10, 25, 0.5)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (window.faseAtual === "menu") {
        if (typeof renderMenu === "function") renderMenu();
    } else if (window.faseAtual === "gameover") {
        if (typeof window.renderGameOver === "function") window.renderGameOver(ctx, canvas);
    }
}

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
if (typeof initEnemies === "function") initEnemies(10);
gameLoop();