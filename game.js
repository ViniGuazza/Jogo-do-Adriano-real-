// game.js - Versão "DETAILED ARCHITECTURE"
const OBSTACULOS = [];
const ENTIDADES = []; 
const MORCEGOS_FUNDO = [];
let skyCanvas = document.createElement("canvas");
let roadCanvas = document.createElement("canvas");

// Teclas Globais
window.teclas = {};
window.addEventListener('keydown', (e) => window.teclas[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => window.teclas[e.key.toLowerCase()] = false);
window.addEventListener('mousedown', (e) => {
    if (e.button === 0) window.teclas["clickesquerdo"] = true;
    if (e.button === 2) window.teclas["clickdireito"] = true;
});
window.addEventListener('mouseup', (e) => {
    if (e.button === 0) window.teclas["clickesquerdo"] = false;
    if (e.button === 2) window.teclas["clickdireito"] = false;
});
window.addEventListener('contextmenu', (e) => e.preventDefault());

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
    skyGrad.addColorStop(0, "#02040a"); skyGrad.addColorStop(0.6, "#0a0f1e"); skyGrad.addColorStop(1, "#0d1425");
    sctx.fillStyle = skyGrad; sctx.fillRect(0,0,canvas.width,canvas.height);
    
    roadCanvas.width = canvas.width; roadCanvas.height = canvas.height;
    let rctx = roadCanvas.getContext("2d");
    rctx.fillStyle = "#0a1505"; rctx.fillRect(0,0,canvas.width,canvas.height); 
    rctx.strokeStyle = "#2c1e16"; rctx.lineWidth = 180;
    rctx.lineCap = "round"; rctx.beginPath(); rctx.moveTo(-100, canvas.height*0.7);
    rctx.bezierCurveTo(canvas.width/3, canvas.height*0.5, canvas.width*0.6, canvas.height*0.9, canvas.width+100, canvas.height*0.7);
    rctx.stroke();

    const layout = [
        {type: "arvore", x: 150, y: 20}, {type: "arvore", x: 400, y: -10}, 
        {type: "arvore", x: 700, y: 10}, {type: "arvore", x: 1000, y: -20},
        {type: "comercio", x: 500, y: 140, w: 300, h: 240},
        {type: "fonte", x: 950, y: 520, r: 75},
        {type: "casa", x: 200, y: 200, w: 220, h: 200},
        {type: "casa", x: 1100, y: 220, w: 220, h: 200},
        {type: "tocha", x: 450, y: 480}, {type: "tocha", x: 880, y: 420},
        {type: "placa", x: 350, y: 550, text: "Vila Xtranha"},
        {type: "placa", x: 800, y: 480, text: "Fonte Real"},
        {type: "arvore", x: 100, y: 480}, {type: "arvore", x: 1300, y: 500}
    ];

    layout.forEach(obj => {
        ENTIDADES.push(obj);
        if(obj.type === "casa") OBSTACULOS.push({x: obj.x, y: obj.y + 60, w: obj.w, h: obj.h - 60});
        else if(obj.type === "comercio") OBSTACULOS.push({x: obj.x, y: obj.y + 80, w: obj.w, h: obj.h - 80});
        else if(obj.type === "fonte") OBSTACULOS.push({x: obj.x - obj.r, y: obj.y - obj.r/2, w: obj.r*2, h: obj.r});
        else if(obj.type === "arvore") OBSTACULOS.push({x: obj.x+35, y: obj.y+140, w: 25, h: 20});
        else if(obj.type === "tocha") OBSTACULOS.push({x: obj.x-5, y: obj.y, w: 10, h: 10});
        else if(obj.type === "placa") OBSTACULOS.push({x: obj.x, y: obj.y, w: 45, h: 30});
    });
}

function drawLuzRealista(ctx, x, y, r, color, intensity = 1.0) {
    if (!isFinite(x) || !isFinite(y) || !isFinite(r)) return;
    ctx.save();
    const flicker = Math.sin(Date.now() * 0.01) * 5 + (Math.random() * 2);
    let radius = Math.max(1, r + flicker);
    let g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color.replace("1.0", intensity));
    g.addColorStop(0.5, color.replace("1.0", intensity * 0.3));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}

function drawFumaca(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "rgba(120, 120, 120, 0.15)";
    for(let i=0; i<3; i++) {
        let t = (Date.now() * 0.03 + i * 20) % 60;
        let drift = Math.sin(Date.now()*0.002 + i)*15;
        ctx.beginPath(); ctx.arc(x + drift, y - t, 6 + i*4, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
}

function drawPorta(ctx, x, y, w, h) {
    ctx.fillStyle = "#3e2723"; ctx.fillRect(x, y, w, h); // Fundo da porta
    ctx.strokeStyle = "#2c1e16"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); // Moldura
    // Detalhes de tábuas
    for(let i=1; i<3; i++) {
        ctx.beginPath(); ctx.moveTo(x + (w/3)*i, y); ctx.lineTo(x + (w/3)*i, y+h); ctx.stroke();
    }
    // Maçaneta
    ctx.fillStyle = "#f1c40f"; ctx.beginPath(); ctx.arc(x + w*0.8, y + h*0.5, 3, 0, Math.PI*2); ctx.fill();
}

function drawJanelaRealista(ctx, x, y, w, h) {
    ctx.fillStyle = "#2c3e50"; ctx.fillRect(x-2, y-2, w+4, h+4); // Moldura externa
    ctx.fillStyle = "rgba(255, 165, 0, 0.3)"; ctx.fillRect(x, y, w, h); // Brilho interno
    ctx.strokeStyle = "#34495e"; ctx.lineWidth = 2;
    // Grades da janela
    ctx.beginPath(); ctx.moveTo(x + w/2, y); ctx.lineTo(x + w/2, y+h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h/2); ctx.lineTo(x+w, y + h/2); ctx.stroke();
    // Reflexo no vidro
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+w, y); ctx.lineTo(x, y+h); ctx.fill();
}

function drawTochaRealista(ctx, t) {
    ctx.fillStyle = "#1e272e"; ctx.fillRect(t.x-4, t.y, 8, 45);
    ctx.fillStyle = "#2f3542"; ctx.fillRect(t.x-6, t.y, 12, 6);
    drawLuzRealista(ctx, t.x, t.y-8, 100, "rgba(255, 120, 0, 1.0)", 0.5);
    const flicker = Math.sin(Date.now() * 0.02) * 2;
    ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(t.x, t.y-8+flicker, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffa502"; ctx.beginPath(); ctx.arc(t.x, t.y-8+flicker, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(t.x, t.y-8+flicker, 2, 0, Math.PI*2); ctx.fill();
}

function drawLanternaRealista(ctx, x, y) {
    ctx.fillStyle = "#2f3542"; ctx.fillRect(x-6, y-12, 12, 15);
    ctx.fillStyle = "#1e272e"; ctx.fillRect(x-8, y-15, 16, 4);
    drawLuzRealista(ctx, x, y-5, 80, "rgba(255, 200, 50, 1.0)", 0.4);
    ctx.fillStyle = "#f1c40f"; ctx.fillRect(x-4, y-10, 8, 10);
}

function drawFonteRealista(ctx, f) {
    ctx.save();
    ctx.fillStyle = "#4a5568"; ctx.beginPath(); ctx.ellipse(f.x, f.y, f.r, f.r/2, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "#2d3748"; ctx.lineWidth = 6; ctx.stroke();
    let waterGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r-12);
    waterGrad.addColorStop(0, "#1d3557"); waterGrad.addColorStop(1, "#457b9d");
    ctx.fillStyle = waterGrad; ctx.beginPath(); ctx.ellipse(f.x, f.y-5, f.r-12, f.r/2-6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#718093"; ctx.fillRect(f.x-12, f.y-50, 24, 50);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    const time = Date.now() * 0.0025;
    for(let i=0; i<12; i++) {
        let t = (time + i*0.5) % 1;
        let angle = (i/12) * Math.PI * 2;
        let arcX = Math.cos(angle) * (t * 50);
        let arcY = -45 - (Math.sin(t * Math.PI) * 40);
        ctx.beginPath(); ctx.arc(f.x + arcX, f.y + arcY, 3 - t*2, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
}

function drawComercioRealista(ctx, c) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(c.x + c.w/2, c.y + c.h, c.w/1.1, 20, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#4a5568"; ctx.fillRect(c.x, c.y+60, c.w, c.h-60);
    ctx.fillStyle = "#1a252f"; ctx.beginPath(); ctx.moveTo(c.x-30, c.y+65); ctx.lineTo(c.x+c.w/2, c.y-60); ctx.lineTo(c.x+c.w+30, c.y+65); ctx.fill();
    
    // PORTA E JANELAS DO COMÉRCIO
    drawPorta(ctx, c.x + c.w/2 - 25, c.y + c.h - 70, 50, 70);
    drawJanelaRealista(ctx, c.x + 40, c.y + 100, 45, 45);
    drawJanelaRealista(ctx, c.x + c.w - 85, c.y + 100, 45, 45);

    drawLanternaRealista(ctx, c.x+c.w-30, c.y+c.h-70);
    ctx.fillStyle = "#2d3748"; ctx.fillRect(c.x+c.w-60, c.y-40, 35, 90);
    drawFumaca(ctx, c.x+c.w-42, c.y-40);
    ctx.restore();
}

function drawCasaFixed(ctx, c) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(c.x + c.w/2, c.y + c.h, c.w/1.4, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#4a5568"; ctx.fillRect(c.x, c.y+c.h/2, c.w, c.h/2);
    ctx.fillStyle = "#f7f1e3"; ctx.fillRect(c.x, c.y+40, c.w, c.h/2-40);
    ctx.fillStyle = "#1a252f"; ctx.beginPath(); ctx.moveTo(c.x-30, c.y+45); ctx.lineTo(c.x+c.w/2, c.y-60); ctx.lineTo(c.x+c.w+30, c.y+45); ctx.fill();
    
    // PORTA E JANELA DA CASA
    drawPorta(ctx, c.x + c.w/2 - 20, c.y + c.h - 60, 40, 60);
    drawJanelaRealista(ctx, c.x + 30, c.y + 60, 35, 35);

    drawLanternaRealista(ctx, c.x+30, c.y+c.h-40);
    ctx.fillStyle = "#2d3748"; ctx.fillRect(c.x+20, c.y-40, 25, 70);
    drawFumaca(ctx, c.x+32, c.y-40);
    ctx.restore();
}

function drawArvoreLegendary(ctx, a) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(a.x+47, a.y+165, 40, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(a.x+38, a.y+100, 22, 70);
    ctx.fillStyle = "#0a1505"; ctx.beginPath(); ctx.arc(a.x+45, a.y+65, 60, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}

function drawPlaca(ctx, p) {
    ctx.fillStyle = "#3e2723"; ctx.fillRect(p.x+18, p.y, 4, 30);
    ctx.fillStyle = "#5d4037"; ctx.fillRect(p.x, p.y-20, 45, 25);
    ctx.fillStyle = "white"; ctx.font = "bold 9px Arial"; ctx.fillText(p.text, p.x+4, p.y-5);
}

function checkObstacleCollision(p) {
    if (!p) return;
    const pBox = { x: p.x + p.w * 0.2, y: p.y + p.h * 0.75, w: p.w * 0.6, h: p.h * 0.25 };
    OBSTACULOS.forEach(obs => {
        if (pBox.x < obs.x + obs.w && pBox.x + pBox.w > obs.x && pBox.y < obs.y + obs.h && pBox.y + pBox.h > obs.y) {
            const dx1 = obs.x + obs.w - pBox.x, dx2 = pBox.x + pBox.w - obs.x;
            const dy1 = obs.y + obs.h - pBox.y, dy2 = pBox.y + pBox.h - obs.y;
            const min = Math.min(dx1, dx2, dy1, dy2);
            if (min === dx1) p.x += dx1; else if (min === dx2) p.x -= dx2;
            else if (min === dy1) p.y += dy1; else if (min === dy2) p.y -= dy2;
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
                if (o.type === "casa" || o.type === "comercio" || o.type === "player") return o.y + o.h;
                if (o.type === "fonte") return o.y + 20;
                if (o.type === "arvore") return o.y + 170;
                if (o.type === "tocha") return o.y + 45;
                if (o.type === "placa") return o.y + 30;
                if (o.type === "enemy") return o.y + 50; 
                return o.y + (o.h || 0);
            };
            return getBaseY(a) - getBaseY(b);
        });
        todos.forEach(obj => {
            if (obj.type === "casa") drawCasaFixed(ctx, obj);
            else if (obj.type === "comercio") drawComercioRealista(ctx, obj);
            else if (obj.type === "fonte") drawFonteRealista(ctx, obj);
            else if (obj.type === "arvore") drawArvoreLegendary(ctx, obj);
            else if (obj.type === "tocha") drawTochaRealista(ctx, obj);
            else if (obj.type === "placa") drawPlaca(ctx, obj);
            else if (obj.type === "cerca") { ctx.fillStyle="#3d2b1f"; ctx.fillRect(obj.x, obj.y, obj.w, 30); }
            else if (obj.type === "player") { if (typeof drawPlayer === "function") drawPlayer(ctx); }
            else { if (typeof drawEnemy === "function") drawEnemy(ctx, obj); }
        });
        ctx.fillStyle = "rgba(2, 5, 15, 0.45)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
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