// menu.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.faseAtual = "menu";

/* =========================
   PARTÍCULAS DO MENU
========================= */
const menuParticles = [];

function initMenuParticles() {
    menuParticles.length = 0;
    for (let i = 0; i < 60; i++) {
        menuParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

initMenuParticles();

/* =========================
   RENDER MENU
========================= */
function renderMenu() {
    // Céu escuro
    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Névoa
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0,0,0,0.1)");
    gradient.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lua
    ctx.beginPath();
    ctx.arc(180, 140, 55, 0, Math.PI * 2);
    ctx.fillStyle = "#dfe6e9";
    ctx.fill();

    // Chão
    ctx.fillStyle = "#1e5631";
    ctx.fillRect(0, canvas.height - 180, canvas.width, 180);

    // Partículas
    menuParticles.forEach(p => {
        p.y -= p.speed;
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
    });
}

/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMenuParticles();
    if (window.faseAtual === "jogo" && typeof window.createGrass === "function") {
        window.createGrass();
    }
});