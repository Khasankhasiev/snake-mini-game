class SnakeGame {
    constructor() {
      this.canvas = document.getElementById("gameCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.cellSize = 50;
      this.numCells = 10;
      this.snake = [{x: 1, y: 0}, {x: 0, y: 0}];
      this.food = {x: 5, y: 5};
      this.direction = "right";
      this.score = 0;
      this.record = localStorage.getItem("record") || 0;
      this.gameInterval = null;
      this.speed = 1;
    }
  
    drawGame() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.ctx.fillStyle = "black";
      for (let i = 0; i < this.numCells; i++) {
        for (let j = 0; j < this.numCells; j++) {
          this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        }
      }
  
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.food.x * this.cellSize, this.food.y * this.cellSize, this.cellSize, this.cellSize);
  
      this.ctx.fillStyle = "green";
      for (let i = 0; i < this.snake.length; i++) {
        this.ctx.fillRect(this.snake[i].x * this.cellSize, this.snake[i].y * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  
    updateGame() {
      let head = {x: this.snake[0].x, y: this.snake[0].y};
      if (this.direction == "right") {
        head.x++;
      } else if (this.direction == "left") {
        head.x--;
      } else if (this.direction == "up") {
        head.y--;
      } else if (this.direction == "down") {
        head.y++;
      }
      this.snake.unshift(head);
      this.snake.pop();
  
      if (head.x < 0 || head.x >= this.numCells || head.y < 0 || head.y >= this.numCells) {
        this.endGame();
        return;
      }
  
      if (head.x == this.food.x && head.y == this.food.y) {
        this.score++;
        document.getElementById("score").innerHTML = this.score;
        let tail = {x: this.snake[this.snake.length - 1].x, y: this.snake[this.snake.length - 1].y};
        this.snake.push(tail);
        this.generateFood();
        if (this.score % 5 == 0) {
          this.increaseSpeed();
        }
      }
  
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x == this.snake[i].x && head.y == this.snake[i].y) {
          this.endGame();
          return;
        }
      }
  
      if (this.score > this.record) {
        this.record = this.score;
        localStorage.setItem("record", this.record);
        document.getElementById("record").innerHTML = this.record;
      }
    }
  
    generateFood() {
      let x = Math.floor(Math.random() * this.numCells);
      let y = Math.floor(Math.random() * this.numCells);
      this.food = {x: x, y: y};
    }
  
    increaseSpeed() {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => {this.gameLoop()}, 500 / this.speed);
      this.speed++;
    }
  
    handleKeyDown(event) {
      if (event.keyCode == 37 && this.direction != "right") {
        this.direction = "left";
      } else if (event.keyCode == 38 && this.direction != "down") {
        this.direction = "up";
      } else if (event.keyCode == 39 && this.direction != "left") {
        this.direction = "right";
      } else if (event.keyCode == 40 && this.direction != "up") {
        this.direction = "down";
      }
    }
  
    startGame() {
        this.canvas.addEventListener("click", () => {
          this.generateFood();
          this.gameInterval = setInterval(() => {this.gameLoop()}, 500 / this.speed);
          document.getElementById("record").innerHTML = this.record;
        });
      }
  
    endGame() {
      clearInterval(this.gameInterval);
      alert("Game over! Your score is " + this.score);
      document.getElementById("restartButton").style.display = "block";
    }
  
    restartGame() {
      location.reload();
    }
  
    gameLoop() {
      this.updateGame();
      this.drawGame();
    }
  }
  
  const game = new SnakeGame();
  
  document.addEventListener("keydown", (event) => {game.handleKeyDown(event)});
  
  game.startGame();