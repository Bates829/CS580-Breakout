// game.js

export default class Game {
  constructor(){
    // Get the canvas
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext('2d');

    //Set paddle values
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleX = (this.canvas.width - this.paddleWidth)/2;
    this.left = false;
    this.right = false;

    //Set ball values
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.x2 = 2;
    this.y2 = -2;
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

    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    // Updates the game at a set interval
    setInterval(this.update, 20);
  }

  handleKeyDown(event){
    event.preventDefault();
    if(event.keyCode === 39 || event.keyCode === 68){
      this.right = true;
    }
    else if(event.keyCode === 37 || event.keyCode === 65){
      this.left = true;
    }
  }

  handleKeyUp(event){
    event.preventDefault();
    if(event.keyCode === 39 || event.keyCode === 68){
      this.right = false;
    }
    else if(event.keyCode === 37 || event.keyCode === 65){
      this.left = false;
    }
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
              //Check score here and add sound
            }
          }
      }
    }
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
    this.detectCollision();
    if(this.x + this.x2 > this.canvas.width-this.ballRadius || this.x + this.x2 < this.ballRadius){
      this.x2 = -this.x2;
    }
    if(this.y + this.y2 < this.ballRadius){
      this.y2 = -this.y2;
    }
    else if(this.y + this.y2 > this.canvas.height-this.ballRadius){
      if(this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth){
          this.y2 = -this.y2;
      }
      else{
        //alert("Game Over");
        //document.location.reload();
      }
    }
    if(this.left && this.paddleX > 0){
      this.paddleX -= 7;
    }
    else if(this.right && this.paddleX < this.canvas.width-this.paddleWidth){
      this.paddleX += 7;
    }
    this.x += this.x2;
    this.y += this.y2;
  }
}
