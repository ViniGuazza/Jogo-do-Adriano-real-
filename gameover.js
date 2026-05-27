window.renderGameOver = function(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.95)"; // Quase preto para dar um ar de luto
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título dramático
    ctx.fillStyle = "#c0392b"; // Vermelho sangue escuro
    ctx.font = "bold 60px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("A LUZ SE APAGOU", canvas.width / 2, canvas.height / 2 - 100);

    // Narrativa focada na perda
    const inputHTML = document.getElementById("nome-jogador");
    let nome = (inputHTML && inputHTML.value) ? inputHTML.value : "O Herói";
    
    ctx.fillStyle = "#dcdde1";
    ctx.font = "22px Georgia";
    ctx.fillText(nome + ", sua jornada termina aqui.", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText("Sem o seu escudo, as muralhas da vila finalmente cederam.", canvas.width / 2, canvas.height / 2 + 5);
    ctx.fillText("O vilarejo que você jurou proteger foi tomado pela escuridão.", canvas.width / 2, canvas.height / 2 + 40);

    // Instrução
    ctx.fillStyle = "#7f8c8d";
    ctx.font = "italic 18px Arial";
    ctx.fillText("Clique no botão F5 para jogar novamente", canvas.width / 2, canvas.height / 2 + 100);
};