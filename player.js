// player.js

// Usamos window.player para que outros arquivos (como game.js) enxerguem o boneco
window.player = {
    x: 100, y: 100, w: 64, h: 64,
    vx: 0, vy: 0, speed: 1.2, maxSpeed: 4.5, friction: 0.85,
    facing: 1, walk: 0,
    attacking: false, attackFrame: 0, hitbox: false,
    defending: false, invulTimer: 0,
    hp: 100, maxHp: 100, regenTimer: 0 
};

window.updatePlayer = function(canvas) {
    let ax = 0, ay = 0;
    
    // AQUI ESTÁ O SEGREDO: Usamos window.teclas (que vem do input.js)
    const t = window.teclas || {}; 

    if (t["w"] || t["arrowup"]) ay -= window.player.speed;
    if (t["s"] || t["arrowdown"]) ay += window.player.speed;
    if (t["a"] || t["arrowleft"]) { ax -= window.player.speed; window.player.facing = -1; }
    if (t["d"] || t["arrowright"]) { ax += window.player.speed; window.player.facing = 1; }

    window.player.defending = t["clickdireito"];
    if (t["clickesquerdo"] && !window.player.attacking && !window.player.defending) {
        window.player.attacking = true;
        window.player.attackFrame = 0;
    }

    if (window.player.invulTimer > 0) window.player.invulTimer--;

    let currentFriction = window.player.defending ? 0.7 : window.player.friction;
    window.player.vx = (window.player.vx + ax) * currentFriction;
    window.player.vy = (window.player.vy + ay) * currentFriction;

    window.player.x += window.player.vx;
    window.player.y += window.player.vy;

    if (Math.abs(window.player.vx) > 0.3 || Math.abs(window.player.vy) > 0.3) window.player.walk += 0.25;
    else window.player.walk = 0;

    if (window.player.attacking) {
        window.player.attackFrame++;
        window.player.hitbox = (window.player.attackFrame > 4 && window.player.attackFrame < 11);
        if (window.player.attackFrame > 18) { window.player.attacking = false; window.player.hitbox = false; }
    }

    window.player.x = Math.max(0, Math.min(canvas.width - window.player.w, window.player.x));
    window.player.y = Math.max(0, Math.min(canvas.height - window.player.h, window.player.y));
}

window.drawPlayer = function(ctx) {
    if (window.player.invulTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) return;
    const p = window.player;
    const isLeft = p.facing === -1;
    const bob = Math.sin(p.walk) * 5; 
    const legSwing = Math.cos(p.walk) * 6;

    ctx.save();
    ctx.translate(p.x + (isLeft ? p.w : 0), p.y);
    if (isLeft) ctx.scale(-1, 1);

    ctx.fillStyle = "rgba(0,0,0,0.2)"; // Sombra
    ctx.beginPath(); ctx.ellipse(32, 60, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#922b21"; ctx.fillRect(10, 22 + (bob*0.5), 14, 28); // Capa
    ctx.fillStyle = "#2c3e50"; ctx.fillRect(18, 44 + legSwing, 10, 16); // Pernas
    ctx.fillRect(36, 44 - legSwing, 10, 16);
    ctx.fillStyle = "#7f8c8d"; ctx.fillRect(14, 18 + bob, 36, 28); // Corpo
    ctx.fillStyle = "#bdc3c7"; ctx.fillRect(20, -2 + bob, 24, 22); // Cabeça

    if (p.defending) {
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(35, 15 + bob, 24, 32); 
    } else {
        ctx.fillStyle = "#5d4037";
        ctx.fillRect(-6, 22 + bob, 18, 24);
        ctx.save(); ctx.translate(48, 32 + bob);
        ctx.rotate(p.attacking ? -1.8 + (p.attackFrame * 0.25) : 0.6);
        ctx.fillStyle = "#f39c12"; ctx.fillRect(2, -8, 3, 16); 
        ctx.fillStyle = "#ecf0f1"; ctx.fillRect(5, -3, 38, 6); ctx.restore();
    }
    ctx.restore();
    drawHealthBar(ctx);
}

function drawHealthBar(ctx) {
    const x = window.player.x, y = window.player.y - 20;
    
    // Tenta pegar o nome do seu input HTML, se não achar, põe "Herói"
    const inputHTML = document.getElementById("nome-jogador");
    let nomeDoHeroi = (inputHTML && inputHTML.value) ? inputHTML.value : "Herói";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(nomeDoHeroi, x + 32, y - 8);

    ctx.fillStyle = "#222"; ctx.fillRect(x, y, 64, 8);
    const hpPercent = Math.max(0, window.player.hp / window.player.maxHp);
    ctx.fillStyle = hpPercent > 0.4 ? "#2ecc71" : "#e74c3c";
    ctx.fillRect(x + 1, y + 1, 62 * hpPercent, 6);
}