
#Snake Game
Este é um simples jogo da cobra implementado em JavaScript, usando HTML5 Canvas para renderização. O jogo tem uma tela de jogo, onde uma cobra se move pela tela, coletando comida para aumentar seu comprimento e pontuação. O jogo termina se a cobra colidir com as bordas da tela ou consigo mesma.

#Como Jogar
Use as teclas de seta para cima, baixo, esquerda e direita para controlar a direção da cobra.
A cobra cresce quando come a comida (quadrado vermelho).
O jogo termina se a cobra colidir com as bordas da tela ou consigo mesma.
Tente obter a pontuação máxima!
Estrutura do Código
O código está organizado em várias funções para facilitar a compreensão:

initializeGame(): Configura o estado inicial do jogo, incluindo a posição inicial da cobra, comida e direção.
generateFoodPosition(): Gera uma posição para a comida que não colide com a cobra.
checkCollision(): Verifica se há colisão com as bordas da tela ou com a própria cobra.
update(): Função principal de atualização do jogo, responsável por mover a cobra, verificar colisões e atualizar a pontuação.
DrawGrid(): Desenha uma grade na tela para uma melhor visualização do espaço.
draw(): Limpa o canvas e desenha a cobra, comida e grade.
gameOver(): Lida com o estado de Game Over, pausando o jogo e exibindo a tela de fim de jogo.
gameWin(): Lida com o estado de Vitória, exibindo uma mensagem de parabéns.
#Pontuação e Recorde
A pontuação atual é exibida na tela, e o recorde máximo é salvo localmente.
O jogo verifica se o jogador atingiu uma pontuação mais alta do que o recorde atual.
#Reiniciando o Jogo
O botão de reinício na tela de Game Over permite reiniciar o jogo após uma derrota.
