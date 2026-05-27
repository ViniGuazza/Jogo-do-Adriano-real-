// Cria o objeto global de comandos
window.teclas = {};

// Captura as teclas pressionadas
window.addEventListener("keydown", (e) => {
    window.teclas[e.key.toLowerCase()] = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault(); // Evita a barra de rolagem do navegador
    }
});

// Captura quando solta as teclas
window.addEventListener("keyup", (e) => {
    window.teclas[e.key.toLowerCase()] = false;
});

// Captura cliques do mouse
window.addEventListener("mousedown", (e) => {
    if (e.button === 0) window.teclas["clickesquerdo"] = true;
    if (e.button === 2) window.teclas["clickdireito"] = true;
});

window.addEventListener("mouseup", (e) => {
    if (e.button === 0) window.teclas["clickesquerdo"] = false;
    if (e.button === 2) window.teclas["clickdireito"] = false;
});

window.addEventListener("contextmenu", (e) => e.preventDefault());