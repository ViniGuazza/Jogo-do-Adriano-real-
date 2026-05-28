// player.js - Versão "LEGENDARY COMBAT PRO"
window.player = {
    x: 400, y: 500, w: 64, h: 64,
    vx: 0, vy: 0, speed: 0.8, maxSpeed: 4.5, friction: 0.82,
    facing: 1, walk: 0,
    attacking: false, attackFrame: 0, hitbox: false,
    combatTiming: { startup: 4, active: 10, recovery: 16 },
    defending: false, defenseReduction: 0.7,
    invulTimer: 0, maxInvul: 60,
    hp: 150, maxHp: 150, regenTimer: 0,
    cloakAngle: 0, cloakTarget: 0, cloakWave: 0,
    screenshake: 0 // NOVO: Controle de tremor de tela
};

window.updatePlayer = function(canvas) {
    const p = window.player;
    const t = window.teclas || {}; 
    let ax = 0, ay = 0;

    if (p.screenshake > 0) p.screenshake -= 0.5;

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
        p.attacking = true; p.attackFrame = 0; p.vx += p.facing * 6; // Dash de ataque
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
    // APLICAR SCREENSHAKE
    if (p.screenshake > 0) {
        ctx.translate((Math.random()-0.5)*p.screenshake, (Math.random()-0.5)*p.screenshake);
    }
    
    ctx.translate(p.x + (isLeft ? p.w : 0), p.y);
    if (isLeft) ctx.scale(-1, 1);

    // 1. SOMBRA
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.ellipse(16*s, 31*s, 12*s, 4*s, 0, 0, Math.PI*2); ctx.fill();

    // 2. CAPA
    ctx.save();
    ctx.translate(12 * s, (12 + bob) * s); ctx.rotate(p.cloakAngle);
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8*s, 0); ctx.lineTo(14*s, 24*s); ctx.lineTo(6*s, 20*s); ctx.lineTo(-8*s, 26*s); ctx.lineTo(-10*s, 12*s); ctx.fill();
    ctx.restore();

    // 3. CORPO
    ctx.fillStyle = "#2c3e50"; 
    let legL = Math.abs(Math.sin(p.walk*2))*6;
    let legR = Math.abs(Math.sin(p.walk*2+Math.PI))*6;
    ctx.fillRect(10*s, (24-legL)*s, 5*s, 6*s); ctx.fillRect(17*s, (24-legR)*s, 5*s, 6*s);
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(9*s, (11+bob)*s, 14*s, 15*s);
    ctx.fillStyle = "#2c3e50"; ctx.fillRect(10*s, (12+bob)*s, 12*s, 6*s);

    // 4. CABEÇA
    ctx.fillStyle = "#1a1a1a"; ctx.fillRect(12*s, (2+bob)*s, 12*s, 10*s);
    ctx.fillStyle = "#000"; ctx.fillRect(14*s, (4+bob)*s, 8*s, 7*s);
    ctx.fillStyle = "#fff"; ctx.shadowBlur = 10; ctx.shadowColor = "cyan";
    ctx.fillRect(17*s, (7+bob)*s, 2*s, 2*s); ctx.fillRect(21*s, (7+bob)*s, 2*s, 2*s);
    ctx.shadowBlur = 0;

    // 5. BRAÇO E EFEITO DE CORTE (SLASH)
    ctx.save();
    ctx.translate(22*s, (16+bob)*s); 
    if(p.attacking) {
        let swing = p.attackFrame / p.combatTiming.recovery;
        ctx.rotate(-0.5 + swing * 3);
        
        // Efeito de Rastro de Luz (Slash)
        if (p.hitbox) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            let slashGrad = ctx.createRadialGradient(20, 0, 0, 20, 0, 40);
            slashGrad.addColorStop(0, "white"); slashGrad.addColorStop(1, "rgba(0,255,255,0)");
            ctx.fillStyle = slashGrad;
            ctx.beginPath();
            ctx.arc(0, 0, 45, -0.8, 0.8);
            ctx.lineTo(0,0); ctx.fill();
            ctx.restore();
        }
    }
    // Espada
    ctx.fillStyle = "#2c1e16"; ctx.fillRect(0, -2*s, 4*s, 4*s);
    ctx.fillStyle = "#ecf0f1"; ctx.fillRect(4*s, -1.5*s, 18*s, 3*s);
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