// game.js

export default class Game {
  constructor(){
    // Get the canvas
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext('2d');

    // Create message to display
    var message = document.createElement('div');
    message.id = 'message';
    message.textContent = '';
    document.body.appendChild(message);

    // Create audio tag for bricks
    var brickSound = document.createElement('audio');
    brickSound.id = 'brickSound';
    brickSound.type = 'audio/wav';
    brickSound.src = 'Explosion.wav';
    document.body.appendChild(brickSound);

    //Create audio tag for ball bouncing
    var bounce = document.createElement('audio');
    bounce.id = 'bounce';
    bounce.src = 'Bounce.wav';
    bounce.type = 'audio/wav';
    document.body.appendChild(bounce);

    //Set paddle values
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleX = (this.canvas.width - this.paddleWidth)/2;
    this.left = false;
    this.right = false;
    this.paused = false;

    //Set ball values
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.x2 = 3;
    this.y2 = -3;
    this.ballRadius = 10;

    //Set brick values
    this.rowCount = 10;
    this.columnCount = 10;
    this.width = 47;
    this.height = 10;
    this.padding = 1;
    this.offsetTop = 25;
    this.offsetLeft = 0.5;

    this.bricks = [];
    for(var i = 0; i < this.columnCount; i++){
      this.bricks[i] = [];
      for(var j = 0; j < this.rowCount; j++){
        this.bricks[i][j] = {x: 0, y: 0, status: 1};
      }
    }

    this.score = 0;
    this.lives = 3;

    // Generates a random color for bricks
    this.cr = 'rgb('+
        Math.floor(Math.random()*256)+ ',' +
        Math.floor(Math.random()*256)+ ',' +
        Math.floor(Math.random()*256)+ ')';

    // Bind the class methods
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.detectCollision = this.detectCollision.bind(this);
    this.update = this.update.bind(this);
    this.renderPaddle = this.renderPaddle.bind(this);
    this.renderBall = this.renderBall.bind(this);
    this.renderBricks = this.renderBricks.bind(this);
    this.displayScore = this.displayScore.bind(this);
    this.displayLives = this.displayLives.bind(this);
    this.gameOver = this.gameOver.bind(this);

    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    //Updates the game at a set interval
    setInterval(this.update, 20);
  }

  //Handles when a key is pressed
  handleKeyDown(event){
    event.preventDefault();
    if(event.keyCode === 39 || event.keyCode === 68){
      this.right = true;
    }
    else if(event.keyCode === 37 || event.keyCode === 65){
      this.left = true;
    }
  }

  //Handles when a key is released
  handleKeyUp(event){
    event.preventDefault();
    if(event.keyCode === 39 || event.keyCode === 68){
      this.right = false;
    }
    else if(event.keyCode === 37 || event.keyCode === 65){
      this.left = false;
    }
  }

  //Creates a game over message
  gameOver(){
    var message = document.getElementById('message');
    if(this.score === this.rowCount * this.columnCount){
      message.textContent = "Congrats! You cleared the board!";
    }
    else message.textContent = "Game Over! Your score was: " + this.score;
  }

  //Collision detection
  detectCollision(){
    for(var i = 0; i < this.columnCount; i++){
      for(var j = 0; j < this.rowCount; j++){
          var b = this.bricks[i][j];
          if(b.status === 1){
            if(this.x > b.x && this.x < b.x + this.width
            && this.y > b.y && this.y < b.y + this.height){
              this.y2 = -this.y2;
              b.status = 0;
              var brickSound = document.getElementById('brickSound');
              brickSound.play();
              this.score++;
              if(this.score === this.rowCount*this.columnCount){
                //Stop ball and display game over message
                this.gameOver()
                this.x2 = 0;
                this.y2 = 0;
                setTimeout(document.location.reload.bind(document.location), 6000);
              }
            }
          }
      }
    }
  }

  // Displays the score on the canvas
  displayScore(){
    this.ctx.font = '18px sans-serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText("Score: " + this.score, 8, 20);
  }

  //Displays the number of lives on the canvas
  displayLives(){
    this.ctx.font = '18px sans-serif';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText("Lives: " + this.lives, this.canvas.width-65, 20);
  }

  // Renders the ball to the canvas
  renderBall(){
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'purple';
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Renders the paddle to the canvas
  renderPaddle(){
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height-this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.closePath();
  }

  // Renders the bricks to the canvas with a random color
  renderBricks(){
    for(var i = 0; i < this.columnCount; i++){
      for(var j = 0; j < this.rowCount; j++){
        if(this.bricks[i][j].status === 1){
          var brickX = (i * (this.width+this.padding))+this.offsetLeft;
          var brickY = (j * (this.height+this.padding))+this.offsetTop;
          this.bricks[i][j].x = brickX;
          this.bricks[i][j].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.width, this.height);
          this.ctx.fillStyle = this.cr;
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  //Updates the game
  update(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderBall();
    this.renderBricks();
    this.renderPaddle();
    this.displayLives();
    this.displayScore();
    this.detectCollision();
    var bounce = document.getElementById('bounce');
    //Check if ball has hit side walls
    if(this.x + this.x2 > this.canvas.width-this.ballRadius || this.x + this.x2 < this.ballRadius){
      this.x2 = -this.x2;
      bounce.play();
    }
    //Check if ball has hit ceiling
    if(this.y + this.y2 < this.ballRadius){
      this.y2 = -this.y2;
      bounce.play();
    }
    //Check if ball has hit paddle
    else if(this.y + this.y2 > this.canvas.height-this.ballRadius){
      if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth){
          this.y2 = -this.y2;
          bounce.play();
      }
      else{
        this.lives--;
        if(!this.lives){
          //Stop ball and display game over message
          this.gameOver();
          this.x2 = 0;
          this.y2 = 0;
          setTimeout(document.location.reload.bind(document.location), 6000);
        }
        else{
          this.x = this.canvas.width / 2;
          this.y = this.canvas.height - 30;
          this.x2 = 3;
          this.y2 = -3;
          this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
        }
      }
    }
    if(this.left && this.paddleX > 0){
      this.paddleX -= 10;
    }
    else if(this.right && this.paddleX < this.canvas.width-this.paddleWidth){
      this.paddleX += 10;
    }
    this.x += this.x2;
    this.y += this.y2;
  }
}
