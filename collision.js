function handleCombat() {
    // Regeneração do Player
    if (player.hp < player.maxHp) {
        player.regenTimer++;
        if (player.regenTimer >= 60) {
            player.hp += 1;
            player.regenTimer = 0;
        }
    }

    enemies.forEach(en => {
        let dx = (en.x + 12) - (player.x + 32);
        let dy = (en.y + 12) - (player.y + 32);
        let dist = Math.sqrt(dx*dx + dy*dy);

        // Inimigo batendo no Player
        if (dist < 40 && player.invulTimer === 0) {
            let isFacing = (player.facing === 1 && dx > 0) || (player.facing === -1 && dx < 0);
            if (player.defending && isFacing) {
                en.kx = player.facing * 15; // Bloqueio empurra o inimigo
            } else {
                player.hp -= 10;
                player.invulTimer = 60;
                player.vx = (dx/dist) * -10; // Coice no player
            }
        }

        // Player batendo no Inimigo (Hitbox)
        if (player.hitbox && en.invulFrame === 0) {
            let tx = player.facing === 1 ? player.x + 30 : player.x - 10;
            if (checkCollision(tx, player.y + 10, 40, 40, en.x, en.y, en.w, en.h)) {
                en.hp -= 1;
                en.invulFrame = 15;
                en.kx = player.facing * 20; // Empurrão da espada
            }
        }
    });
}

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}