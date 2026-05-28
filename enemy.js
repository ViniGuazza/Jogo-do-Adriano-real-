// enemy.js - Versão "PHYSICAL BATS"
window.enemies = [];

function spawnBat() {
    const w = canvas.width, h = canvas.height;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * w; y = -50; } 
    else if (side === 1) { x = Math.random() * w; y = h + 50; } 
    else if (side === 2) { x = -50; y = Math.random() * h; } 
    else { x = w + 50; y = Math.random() * h; } 

    window.enemies.push({
        type: "enemy", x: x, y: y, w: 40, h: 40, 
        speed: 1.5 + Math.random() * 0.5,
        hp: 3, maxHp: 3, invulFrame: 0,
        wingTimer: Math.random() * 10, kx: 0, ky: 0, phase: Math.random() * 6
    });
}

window.initEnemies = function(q) { window.enemies = []; for (let i=0; i<q; i++) spawnBat(); };

// FUNÇÃO DE COLISÃO PARA INIMIGOS
function checkEnemyObstacles(en) {
    if (typeof OBSTACULOS === "undefined") return;
    // Caixa de colisão baseada na sombra/corpo central
    const eBox = { x: en.x + 10, y: en.y + 10, w: 20, h: 20 };
    OBSTACULOS.forEach(obs => {
        if (eBox.x < obs.x + obs.w && eBox.x + eBox.w > obs.x && eBox.y < obs.y + obs.h && eBox.y + eBox.h > obs.y) {
            const ox = Math.min(eBox.x + eBox.w - obs.x, obs.x + obs.w - eBox.x);
            const oy = Math.min(eBox.y + eBox.h - obs.y, obs.y + obs.h - eBox.y);
            if (ox < oy) en.x += (eBox.x + eBox.w/2 < obs.x + obs.w/2) ? -ox : ox;
            else en.y += (eBox.y + eBox.h/2 < obs.y + obs.h/2) ? -oy : oy;
        }
    });
}

window.updateEnemies = function() {
    if (!window.player || window.faseAtual !== "jogo") return;
    for (let i = window.enemies.length - 1; i >= 0; i--) {
        let en = window.enemies[i];
        if (en.invulFrame > 0) en.invulFrame--;
        
        en.x += en.kx; en.y += en.ky; 
        en.kx *= 0.85; en.ky *= 0.85;

        let dx = (window.player.x + 32) - (en.x + 20);
        let dy = (window.player.y + 32) - (en.y + 20);
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 5) {
            en.phase += 0.05;
            en.x += (dx/dist) * en.speed + Math.cos(en.phase)*0.5;
            en.y += (dy/dist) * en.speed + Math.sin(en.phase)*0.5;
        }
        
        // APLICAR COLISÃO COM OBSTÁCULOS
        checkEnemyObstacles(en);
        
        if (en.hp <= 0) { window.enemies.splice(i, 1); }
    }
};

window.drawEnemy = function(ctx, en) {
    en.wingTimer += 0.25;
    let wing = Math.sin(en.wingTimer) * 12;
    ctx.save();
    ctx.translate(en.x + 20, en.y + 20);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(0, 30, 15, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = en.invulFrame > 0 ? "#fff" : "#1a1a1a";
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff4757"; ctx.fillRect(-3, -3, 2, 2); ctx.fillRect(1, -3, 2, 2);
    ctx.fillStyle = en.invulFrame > 0 ? "#ccc" : "#2f3542";
    ctx.beginPath(); ctx.moveTo(-6, 0); ctx.bezierCurveTo(-15, -15-wing, -30, -5+wing, -35, 10+wing); ctx.bezierCurveTo(-20, 5, -15, 15, -6, 5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.bezierCurveTo(15, -15-wing, 30, -5+wing, 35, 10+wing); ctx.bezierCurveTo(20, 5, 15, 15, 6, 5); ctx.fill();
    if (en.hp < en.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(-15, -25, 30, 4);
        ctx.fillStyle = "#ff4757"; ctx.fillRect(-15, -25, (en.hp/en.maxHp)*30, 4);
    }
    ctx.restore();
};