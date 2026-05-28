// player.js - Versão "EPIC NIGHT HUNTER"
window.player = {
    x: 400, y: 500, w: 64, h: 64,
    vx: 0, vy: 0, speed: 0.8, maxSpeed: 4.5, friction: 0.82,
    facing: 1, walk: 0,
    attacking: false, attackFrame: 0, hitbox: false,
    combatTiming: { startup: 5, active: 12, recovery: 18 },
    defending: false, defenseReduction: 0.7,
    invulTimer: 0, maxInvul: 60,
    hp: 150, maxHp: 150, regenTimer: 0,
    cloakAngle: 0, cloakTarget: 0, cloakWave: 0
};

window.updatePlayer = function(canvas) {
    const p = window.player;
    const t = window.teclas || {}; 
    let ax = 0, ay = 0;

    p.defending = t["clickdireito"] || false;
    if (!p.attacking || p.attackFrame > p.combatTiming.startup) {
        if (t["w"] || t["arrowup"]) ay -= p.speed;
        if (t["s"] || t["arrowdown"]) ay += p.speed;
        if (t["a"] || t["arrowleft"]) { ax -= p.speed; p.facing = -1; }
        if (t["d"] || t["arrowright"]) { ax += p.speed; p.facing = 1; }
    }

    p.vx = (p.vx + ax) * p.friction;
    p.vy = (p.vy + ay) * p.friction;
    let mag = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if(mag > p.maxSpeed) { p.vx = (p.vx/mag)*p.maxSpeed; p.vy = (p.vy/mag)*p.maxSpeed; }

    p.x += p.vx; p.y += p.vy;
    p.cloakTarget = -p.vx * 0.18; 
    p.cloakWave += 0.1;
    p.cloakAngle += (p.cloakTarget + Math.sin(p.cloakWave)*0.1 - p.cloakAngle) * 0.15;

    if (t["clickesquerdo"] && !p.attacking && !p.defending) {
        p.attacking = true; p.attackFrame = 0; p.vx += p.facing * 5;
    }
    if (p.attacking) {
        p.attackFrame++;
        p.hitbox = (p.attackFrame > p.combatTiming.startup && p.attackFrame <= p.combatTiming.active);
        if (p.attackFrame > p.combatTiming.recovery) { p.attacking = false; p.attackFrame = 0; }
    }
    if (p.invulTimer > 0) p.invulTimer--;
    if (Math.abs(p.vx) > 0.2 || Math.abs(p.vy) > 0.2) p.walk += 0.15; else p.walk = 0;
    p.x = Math.max(0, Math.min(canvas.width - p.w, p.x));
    p.y = Math.max(0, Math.min(canvas.height - p.h, p.y));
};

window.drawPlayer = function(ctx) {
    const p = window.player;
    if (p.invulTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) return;
    const isLeft = p.facing === -1;
    const s = 2; const bob = Math.sin(p.walk * 2) * 2;
    ctx.save();
    ctx.translate(p.x + (isLeft ? p.w : 0), p.y);
    if (isLeft) ctx.scale(-1, 1);

    // 1. SOMBRA
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.ellipse(16*s, 31*s, 12*s, 4*s, 0, 0, Math.PI*2); ctx.fill();

    // 2. CAPA ÉPICA (Com gradiente e dobras)
    ctx.save();
    ctx.translate(12 * s, (12 + bob) * s); ctx.rotate(p.cloakAngle);
    let cloakGrad = ctx.createLinearGradient(0, 0, 10*s, 20*s);
    cloakGrad.addColorStop(0, "#1a1a1a"); cloakGrad.addColorStop(1, "#050505");
    ctx.fillStyle = cloakGrad;
    ctx.beginPath(); 
    ctx.moveTo(0, 0); ctx.lineTo(8*s, 0); 
    ctx.lineTo(14*s, 24*s); ctx.lineTo(6*s, 20*s); 
    ctx.lineTo(-8*s, 26*s); ctx.lineTo(-10*s, 12*s); 
    ctx.fill();
    // Dobras de luz na capa
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(2*s, 2*s); ctx.lineTo(8*s, 20*s); ctx.stroke();
    ctx.restore();

    // 3. PERNAS COM ARMADURA
    ctx.fillStyle = "#2c3e50"; 
    let legL = Math.abs(Math.sin(p.walk*2))*6;
    let legR = Math.abs(Math.sin(p.walk*2+Math.PI))*6;
    ctx.fillRect(10*s, (24-legL)*s, 5*s, 6*s); // Perna L
    ctx.fillRect(17*s, (24-legR)*s, 5*s, 6*s); // Perna R

    // 4. CORPO (Túnica e Peitoral)
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(9*s, (11+bob)*s, 14*s, 15*s); // Base
    ctx.fillStyle = "#2c3e50"; ctx.fillRect(10*s, (12+bob)*s, 12*s, 6*s); // Peitoral
    ctx.fillStyle = "#f1c40f"; ctx.fillRect(15*s, (18+bob)*s, 3*s, 3*s); // Fivela de Ouro

    // 5. CABEÇA (Capuz e Máscara)
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(12*s, (2+bob)*s, 12*s, 10*s); // Capuz
    ctx.fillStyle = "#000"; ctx.fillRect(14*s, (4+bob)*s, 8*s, 7*s); // Máscara
    // Olhos Brilhantes
    ctx.fillStyle = "#fff"; 
    ctx.shadowBlur = 10; ctx.shadowColor = "cyan";
    ctx.fillRect(17*s, (7+bob)*s, 2*s, 2*s); ctx.fillRect(21*s, (7+bob)*s, 2*s, 2*s);
    ctx.shadowBlur = 0;

    // 6. BRAÇO E ARMA (Espada de Prata)
    ctx.save();
    ctx.translate(22*s, (16+bob)*s); 
    if(p.attacking) ctx.rotate(p.attackFrame < 6 ? -0.8 : 1.5);
    // Ombreira
    ctx.fillStyle = "#34495e"; ctx.fillRect(-2*s, -4*s, 6*s, 5*s);
    // Punho e Lâmina
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(0, -2*s, 4*s, 4*s);
    let bladeGrad = ctx.createLinearGradient(4*s, 0, 18*s, 0);
    bladeGrad.addColorStop(0, "#bdc3c7"); bladeGrad.addColorStop(1, "#ecf0f1");
    ctx.fillStyle = bladeGrad; ctx.fillRect(4*s, -1.5*s, 16*s, 3*s);
    ctx.restore();

    ctx.restore();
    drawHealthBar(ctx);
};

function drawHealthBar(ctx) {
    const p = window.player;
    const x = p.x, y = p.y - 25;
    const inputHTML = document.getElementById("nome-jogador");
    let nome = (inputHTML && inputHTML.value && inputHTML.value.trim() !== "") ? inputHTML.value : "Herói";
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(x + 10, y, 44, 6);
    ctx.fillStyle = p.hp > 50 ? "#2ecc71" : "#e74c3c"; ctx.fillRect(x + 11, y + 1, (p.hp/p.maxHp)*42, 4);
    ctx.fillStyle = "white"; ctx.font = "bold 10px Georgia"; ctx.textAlign = "center";
    ctx.fillText(nome, x + 32, y - 5);
}