// game.js

// Fundo de Grama Otimizado
let grassCanvas = document.createElement("canvas");
let grassCtx = grassCanvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createGrass();
}

function createGrass() {
    grassCanvas.width = canvas.width; 
    grassCanvas.height = canvas.height;
    grassCtx.fillStyle = '#2e7d32'; 
    grassCtx.fillRect(0, 0, grassCanvas.width, grassCanvas.height);
    for (let i = 0; i < 1000; i++) {
        grassCtx.fillStyle = '#388e3c';
        grassCtx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
}

function update() {
    if (window.faseAtual === "jogo") {
        if (typeof updatePlayer === "function") {
            updatePlayer(canvas);
        }
        updateEnemies();      // enemy.js
        handleCombat();       // collision.js

        // CHECAGEM DE MORTE BLINDADA
        if ((window.player && window.player.hp <= 0)) {
            window.faseAtual = "gameover";
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (window.faseAtual === "menu") {
        if (typeof renderMenu === "function") renderMenu();
    } 
    else if (window.faseAtual === "historia") {
        ctx.fillStyle = "#101820";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else if (window.faseAtual === "jogo") {
        ctx.drawImage(grassCanvas, 0, 0);
        drawEnemies(ctx);
        if (typeof drawPlayer === "function") {
            drawPlayer(ctx);
        }
    }
    // --- ADICIONE ESTA PARTE PARA O GAMEOVER ---
    else if (window.faseAtual === "gameover") {
        if (typeof window.renderGameOver === "function") {
            window.renderGameOver(ctx, canvas);
        }
    }
}

function gameLoop() {
    update(); 
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

if (typeof initEnemies === "function") {
    initEnemies(15); 
}

gameLoop();