let enemies = [];

function spawnBat() {
    const w = window.innerWidth, h = window.innerHeight;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * w; y = -50; } 
    else if (side === 1) { x = Math.random() * w; y = h + 50; } 
    else if (side === 2) { x = -50; y = Math.random() * h; } 
    else { x = w + 50; y = Math.random() * h; } 

    enemies.push({
        x: x, y: y, w: 24, h: 24, speed: 1.5 + Math.random(),
        hp: 3, maxHp: 3, invulFrame: 0,
        wingTimer: Math.random() * 10, kx: 0, ky: 0
    });
}

function initEnemies(quantidade) {
    for (let i = 0; i < quantidade; i++) spawnBat();
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let en = enemies[i];
        if (en.invulFrame > 0) en.invulFrame--;
        en.x += en.kx; en.y += en.ky;
        en.kx *= 0.8; en.ky *= 0.8;

        let dx = (player.x + 32) - (en.x + 12);
        let dy = (player.y + 32) - (en.y + 12);
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 1) {
            en.x += (dx/dist) * en.speed;
            en.y += (dy/dist) * en.speed;
        }
        if (en.hp <= 0) enemies.splice(i, 1);
    }
}

function drawEnemies(ctx) {
    enemies.forEach(en => {
        en.wingTimer += 0.25;
        let wingPos = Math.sin(en.wingTimer) * 10;
        
        ctx.save();
        ctx.translate(en.x + 12, en.y + 12);

        ctx.fillStyle = en.invulFrame > 0 ? "white" : "#1e272e";
        ctx.beginPath(); 
        ctx.ellipse(0, 0, 6, 8, 0, 0, Math.PI * 2); 
        ctx.fill();

        ctx.fillStyle = en.invulFrame > 0 ? "#ddd" : "#2f3542";
        ctx.beginPath(); 
        ctx.moveTo(-4, 0); 
        ctx.quadraticCurveTo(-15, -10 - wingPos, -25, 0 + wingPos); 
        ctx.quadraticCurveTo(-15, 5, -4, 5); 
        ctx.fill();

        ctx.beginPath(); 
        ctx.moveTo(4, 0); 
        ctx.quadraticCurveTo(15, -10 - wingPos, 25, 0 + wingPos); 
        ctx.quadraticCurveTo(15, 5, 4, 5); 
        ctx.fill();

        if (en.hp < en.maxHp) {
            const barW = 20;
            const barH = 4;
            ctx.fillStyle = "black";
            ctx.fillRect(-barW/2, -18, barW, barH);
            ctx.fillStyle = "#ff4757";
            let lifeW = (en.hp / en.maxHp) * barW;
            ctx.fillRect(-barW/2, -18, lifeW, barH);
        }
        ctx.restore();
    });
}