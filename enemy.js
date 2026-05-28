// enemy.js - Versão "INSTANT COMBAT" - NO DELAY DAMAGE
window.enemies = [];
window.currentWave = 1; 

function spawnEnemy(type) {
    const w = canvas.width, h = canvas.height;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * w; y = -50; } 
    else if (side === 1) { x = Math.random() * w; y = h + 50; } 
    else if (side === 2) { x = -50; y = Math.random() * h; } 
    else { x = w + 50; y = Math.random() * h; } 

    if (type === "zumbi") {
        window.enemies.push({
            type: "zumbi", x: x, y: y, 
            w: 70, h: 100,
            speed: 0.5 + Math.random() * 0.3,
            hp: 20, maxHp: 20,
            invulFrame: 0, kx: 0, ky: 0, 
            walkCycle: Math.random() * 6,
            swayOffset: Math.random() * 10,
            stumbleTimer: 0,
            skinColor: `hsl(${80 + Math.random()*20}, 20%, 30%)`,
            shirtColor: `hsl(${Math.random()*360}, 20%, 25%)`
        });
    } else {
        window.enemies.push({
            type: "morcego", x: x, y: y, w: 40, h: 40, 
            speed: 2.2, hp: 3, maxHp: 3,
            invulFrame: 0, kx: 0, ky: 0, 
            wingTimer: Math.random() * 10, phase: Math.random() * 6
        });
    }
}

window.initEnemies = function(q) { 
    window.enemies = []; window.currentWave = 1;
    for (let i=0; i<q; i++) spawnEnemy("morcego"); 
};

function checkCollisionAt(x, y, w, h) {
    if (typeof OBSTACULOS === "undefined") return false;
    const bx = x + 15, by = y + h * 0.8, bw = w - 30, bh = h * 0.2;
    for (let i = 0; i < OBSTACULOS.length; i++) {
        let obs = OBSTACULOS[i];
        if (bx < obs.x + obs.w && bx + bw > obs.x && by < obs.y + obs.h && by + bh > obs.y) return true;
    }
    return false;
}

window.updateEnemies = function() {
    if (!window.player || window.faseAtual !== "jogo") return;
    
    // Spawner de hordas
    if (window.enemies.length === 0 && window.currentWave === 1) {
        window.currentWave = 2;
        for(let i=0; i<8; i++) spawnEnemy("zumbi");
    }
    
    const px = window.player.x + 32, py = window.player.y + 32;
    
    for (let i = window.enemies.length - 1; i >= 0; i--) {
        let en = window.enemies[i];
        if (en.invulFrame > 0) en.invulFrame--;
        
        en.x += en.kx; en.y += en.ky; 
        en.kx *= 0.8; en.ky *= 0.8;
        
        let dx = px - (en.x + en.w/2);
        let dy = py - (en.y + en.h/2);
        let dist2 = dx*dx + dy*dy;
        
        if (dist2 > 16) { // Distância mínima para movimento
            let dist = Math.sqrt(dist2);
            if (en.type === "morcego") {
                en.phase += 0.05;
                en.x += ((dx + Math.cos(en.phase)*1.5) / dist) * en.speed;
                en.y += ((dy + Math.sin(en.phase)*1.5) / dist) * en.speed;
            } else {
                let currentSpeed = en.speed;
                if (en.stumbleTimer > 0) {
                    currentSpeed *= 0.2; en.stumbleTimer--;
                } else if (Math.random() < 0.003) {
                    en.stumbleTimer = 30;
                }

                let moveX = (dx / dist) * currentSpeed;
                let moveY = (dy / dist) * currentSpeed;
                
                if (!checkCollisionAt(en.x + moveX, en.y, en.w, en.h)) en.x += moveX;
                if (!checkCollisionAt(en.x, en.y + moveY, en.w, en.h)) en.y += moveY;

                en.walkCycle += 0.06;
            }
        }
        
        // Chamada de combate IMEDIATA dentro do update para evitar delay de frames
        checkIndividualCombat(en, px, py);

        if (en.hp <= 0) window.enemies.splice(i, 1);
    }
};

// Nova função interna para processar combate INSTANTANEAMENTE por inimigo
function checkIndividualCombat(en, px, py) {
    const p = window.player;
    let ex = en.x + en.w/2, ey = en.y + en.h/2;
    let dx = ex - px, dy = ey - py;
    let dist2 = dx*dx + dy*dy;
    
    // DANO NO PLAYER: Se encostar, o dano é imediato
    if (dist2 < 2304 && p.invulTimer === 0) { // 48 pixels de distância (um pouco mais generoso)
        p.hp -= en.type === "zumbi" ? 12 : 10;
        p.invulTimer = 60;
        let dist = Math.sqrt(dist2) || 1;
        p.vx = (dx/dist) * -8; p.vy = (dy/dist) * -8;
        p.screenshake = 5;
    }
    
    // DANO NO INIMIGO: Se o player estiver atacando
    if (p.hitbox && en.invulFrame === 0) {
        let reach = p.facing === 1 ? (dx > 0 && dx < 85) : (dx < 0 && dx > -85);
        if (reach && Math.abs(dy) < 55) {
            en.hp -= 1; en.invulFrame = 15;
            en.kx = p.facing * (en.type === "zumbi" ? 6 : 12);
            p.screenshake = 3;
            if (en.type === "zumbi" && Math.random() > 0.6) en.stumbleTimer = 30;
        }
    }
}

// Mantendo a função global para compatibilidade, mas agora ela apenas chama o update se necessário
window.handleCombat = function() {
    // A lógica real agora roda dentro do updateEnemies para ser instantânea
};

window.drawEnemy = function(ctx, en) {
    let isNearLight = false;
    if (typeof ENTIDADES !== "undefined") {
        for(let i=0; i<ENTIDADES.length; i++) {
            if (ENTIDADES[i].type === "tocha") {
                let d2 = Math.pow(en.x-ENTIDADES[i].x, 2) + Math.pow(en.y-ENTIDADES[i].y, 2);
                if (d2 < 14400) { isNearLight = true; break; }
            }
        }
    }

    ctx.save();
    ctx.translate(en.x + en.w/2, en.y + en.h/2);
    
    if (window.player.x + 32 < en.x + en.w/2) ctx.scale(-1, 1);

    if (en.type === "zumbi") {
        const walk = Math.sin(en.walkCycle);
        const bob = Math.abs(walk) * 5;
        const lean = 0.15 + (walk * 0.1);

        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(-15, en.h/2 - 5, 30, 4);

        if (en.invulFrame > 0) {
            ctx.fillStyle = "#fff";
        } else {
            ctx.fillStyle = isNearLight ? "#5a7a5a" : "#2a3a2a";
        }

        // Perna Trás
        ctx.save();
        ctx.translate(-6, 15); ctx.rotate(Math.sin(en.walkCycle + Math.PI) * 0.4);
        ctx.fillStyle = "#222"; ctx.fillRect(-4, 0, 8, 20);
        ctx.restore();

        // Tronco + Cabeça
        ctx.save();
        ctx.rotate(lean);
        ctx.translate(0, -bob);
        ctx.fillStyle = en.shirtColor; ctx.fillRect(-14, -30, 28, 40);
        ctx.fillStyle = en.shirtColor; ctx.fillRect(5, -25, 15, 8); // Braço
        ctx.fillStyle = en.skinColor; ctx.fillRect(20, -25, 10, 8); // Mão
        ctx.fillStyle = en.skinColor; ctx.fillRect(-10, -45, 20, 22); // Cabeça
        ctx.fillStyle = "#000"; ctx.fillRect(2, -38, 3, 3); ctx.fillRect(-6, -38, 3, 3);
        ctx.fillStyle = en.invulFrame > 0 ? "#fff" : "#ff0"; ctx.fillRect(3, -37, 1.5, 1.5);
        ctx.restore();

        // Perna Frente
        ctx.save();
        ctx.translate(6, 15); ctx.rotate(Math.sin(en.walkCycle) * 0.4);
        ctx.fillStyle = "#222"; ctx.fillRect(-4, 0, 8, 20);
        ctx.restore();

    } else {
        en.wingTimer += 0.25;
        let wing = Math.sin(en.wingTimer) * 12;
        ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(0, 30, 15, 5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = en.invulFrame > 0 ? "#fff" : "#1a1a1a";
        ctx.beginPath(); ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ff4757"; ctx.fillRect(-3, -3, 2, 2); ctx.fillRect(1, -3, 2, 2);
        ctx.fillStyle = en.invulFrame > 0 ? "#ccc" : "#2f3542";
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.bezierCurveTo(-15, -15-wing, -30, -5+wing, -35, 10+wing); ctx.bezierCurveTo(-20, 5, -15, 15, -6, 5); ctx.fill();
        ctx.beginPath(); ctx.moveTo(6, 0); ctx.bezierCurveTo(15, -15-wing, 30, -5+wing, 35, 10+wing); ctx.bezierCurveTo(20, 5, 15, 15, 6, 5); ctx.fill();
    }

    if (en.hp < en.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(-15, -en.h/2 - 20, 30, 3);
        ctx.fillStyle = "#f00"; ctx.fillRect(-15, -en.h/2 - 20, 30 * (en.hp/en.maxHp), 3);
    }
    ctx.restore();
};