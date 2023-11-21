// Obtendo o elemento canvas do HTML
const canvas = document.getElementById("gameCanvas");

// Obtendo o contexto de renderização 2D do canvas
const context = canvas.getContext("2d");

// Obtendo elementos HTML relacionados ao jogo
const gameOverScreen = document.getElementById("game-over");
const restartbtn = document.getElementById("restart-button");

// Definindo tamanhos de grade e elementos do jogo
const GRID_SIZE = 20;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;

// Declarando variáveis para a cobra, comida, direções e contadores
let snake, food, dx, dy, blinkCounter;

// Variável para controlar o estado de pausa do jogo
let gamePaused = false;

// Variáveis para pontuação atual e pontuação máxima (obtida do armazenamento local)
let score = 0;
let highScore = localStorage.getItem("highscore") || 0;

// Obtendo elementos HTML para exibir pontuações
let currentScoreEle = document.getElementById("current-score");
let highScoreEle = document.getElementById("high-score");

// Função para configurar o estado inicial do jogo
function initializeGame() {
  // Inicializando os segmentos da cobra
  snake = [
    {
      x: Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE,
      y: Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE,
    },
    {
      x: (Math.floor(canvas.width / 2 / GRID_SIZE) + 1) * GRID_SIZE,
      y: Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE,
    },
  ];

  // Inicializando a posição e direção inicial da comida
  food = {
    ...generateFoodPosition(),
    dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
    dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
  };

  // Inicializando a direção inicial da cobra
  dx = 0;
  dy = -GRID_SIZE;

  // Inicializando contadores e pontuação
  blinkCounter = 0;
  score = 0;

  // Atualizando a pontuação exibida no HTML
  currentScoreEle.textContent = score;
  highScoreEle.textContent = highScore;
}

// Inicializando o estado do jogo
initializeGame();

// Lidando com entradas de teclado para o movimento da cobra
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -GRID_SIZE;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = GRID_SIZE;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -GRID_SIZE;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = GRID_SIZE;
        dy = 0;
      }
      break;
  }
});

// Função para gerar uma posição de comida que não colide com a cobra
function generateFoodPosition() {
  while (true) {
    let newFoodPosition = {
      x: Math.floor((Math.random() * canvas.width) / GRID_SIZE) * GRID_SIZE,
      y: Math.floor((Math.random() * canvas.height) / GRID_SIZE) * GRID_SIZE,
    };

    // Verificando se a nova posição da comida colide com alguma parte da cobra
    let collisionWithSnake = false;
    for (let segments of snake) {
      if (
        segments.x === newFoodPosition.x &&
        segments.y === newFoodPosition.y
      ) {
        collisionWithSnake = true;
        break;
      }
    }

    // Retornando a posição se não houver colisão
    if (!collisionWithSnake) {
      return newFoodPosition;
    }
  }
}

// Função para verificar se há colisão com a parede ou com a própria cobra
function checkCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height
  ) {
    return true; // Colisão com parede
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // Colisão com a própria cobra
    }
  }

  return false;
}

// Função principal de atualização do jogo
function update() {
  if (gamePaused) return; // Se o jogo estiver pausado, sai da função

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); // Adiciona a nova posição da cabeça à cobra

  if (checkCollision()) {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreEle.textContent = highScore;
    }
    gameOver(); // Se houver colisão, encerra o jogo
    return;
  }

  // Verifica se a cobra está comendo a comida
  if (head.x == food.x && head.y == food.y) {
    score++; // Incrementa a pontuação
    currentScoreEle.textContent = score; // Atualiza a pontuação exibida
    food = {
      ...generateFoodPosition(), // Gera uma nova posição para a comida
      dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
      dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
    };

    // Verifica a condição de vitória (cobra preenche a tela inteira)
    if (
      snake.length ===
      (canvas.width / GRID_SIZE) * (canvas.height / GRID_SIZE)
    ) {
      gameWin();
      return;
    }
  } else {
    snake.pop(); // Remove o último segmento da cauda da cobra
  }

  // Atualiza a posição da comida
  if (blinkCounter % 4 === 0) {
    food.x += food.dx;
    food.y += food.dy;

    // Trata a colisão da comida com a parede
    if (food.x < 0) {
      food.dx = -food.dx;
      food.x = 0;
    }
    if (food.x > canvas.width) {
      food.dx = -food.dx;
      food.x = canvas.width - GRID_SIZE;
    }
    if (food.y < 0) {
      food.dy = -food.dy;
      food.y = 0;
    }
    if (food.y > canvas.height) {
      food.dy = -food.dy;
      food.y = canvas.height - GRID_SIZE;
    }
  }

  blinkCounter++;
  draw(); // Desenha os objetos do jogo
}

// Função para desenhar a grade do jogo
function DrawGrid() {
  context.strokeStyle = "#AAA";
  for (let i = 0; i < canvas.width; i += GRID_SIZE) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, canvas.height);
    context.stroke();
  }
  for (let j = 0; j < canvas.height; j += GRID_SIZE) {
    context.beginPath();
    context.moveTo(0, j);
    context.lineTo(canvas.width, j);
    context.stroke();
  }
}

// Função para desenhar os objetos do jogo
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  DrawGrid(); // Desenha a grade do jogo

  // Desenha cada segmento da cobra
  for (const segment of snake) {
    context.fillStyle = "green";
    context.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
  }

  // Desenha a comida
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, FOOD_SIZE, FOOD_SIZE);
}

// Função para lidar com o estado de Game Over
function gameOver() {
  gamePaused = true; // Pausa o jogo
  gameOverScreen.style.display = "flex"; // Exibe a tela de Game Over
}

// Função para lidar com o estado de Vitória
function gameWin() {
  gamePaused = true; // Pausa o jogo
  alert("Congratulations!, You won!"); // Exibe um alerta de vitória
  initializeGame(); // Reinicia o jogo
}

// Evento de clique no botão de reinício
restartbtn.addEventListener("click", function () {
  gameOverScreen.style.display = "none"; // Esconde a tela de Game Over
  gamePaused = false; // Despausa o jogo
  initializeGame(); // Reinicia o jogo
  update(); // Chama a função de atualização
});

// Chama a função de atualização a cada 100ms
setInterval(update, 100);

// Pausa o jogo quando a janela perde o foco
window.addEventListener("blur", function () {
  gamePaused = true;
});

// Despausa o jogo quando a janela recupera o foco
window.addEventListener("focus", function () {
  gamePaused = false;
  update();
});