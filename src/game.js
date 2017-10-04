// game.js
import Paddle from './paddle';
import Bricks from './bricks';

export default class Game {
  constructor(){
    this.paddle = new Paddle();
    this.bricks = new Bricks();
    this.input = {
      direction: 'idle'
    }
    //Create the canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 320;
    this.ctx = this.canvas.getContext('2d');

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.x2 = 2;
    this.y2 = -2;
    this.ballRadius = 10;
    this.paddleX = (this.canvas.width - this.paddle.paddleWidth)/2;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.loop = this.loop.bind(this);
    this.render = this.render.bind(this);
    this.detectCollision = this.detectCollision.bind(this);
    this.update = this.update.bind(this);
    this.renderPaddle = this.renderPaddle.bind(this);

    setInterval(this.loop, 10);
  }

  gameOver(){

  }

  handleKeyDown(event){
    event.preventDefault();
    switch(event.key){
      case 'ArrowLeft':
        this.input.direction = 'left';
        break;
      case 'ArrowRight':
        this.input.direction = 'right';
        break;
      default:
        this.input.direction = 'idle';
    }
  }

  //Collision detection
  detectCollision(){
    for(var i = 0; i < this.bricks.columnCount; i++){
      for(var j = 0; j < this.bricks.rowCount; j++){
          var b = this.bricks.bricks[i][j];
          if(b.status === 1){
            if(this.x > b.x && this.x < b.x + this.bricks.width
            && this.y > b.y && this.y < b.y + this.bricks.height){
              this.y2 = -this.y2;
              b.status = 0;
            }
          }
      }
    }
  }

  //Update game
  update(){
    //Update ball
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
      if(this.x > this.paddleX && this.x < this.paddleX + this.paddle.paddleWidth){
          this.y2 = -this.y2;
      }
      else{
        //alert("Game Over");
        //document.location.reload();
      }
    }
    this.x += this.x2;
    this.y += this.y2;

    //Update paddle
    if(this.paddle.x > 0 && this.paddle.x < this.canvas.width-this.paddle.paddleWidth){
      this.paddle.update(this.input);
    }
  }

  // Draws canvas
  render(){
    this.ctx.fillStyle = "#ccc";
    this.ctx.fillRect(0, 0, 480, 320);
  }

  renderBall(){
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue';
    this.ctx.fillStroke = 'blue';
    this.ctx.Stroke = '10';
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderPaddle(){
    this.ctx.beginPath();
    this.ctx.rect(this.paddleX, this.canvas.height-this.paddle.paddleHeight, this.paddle.paddleWidth, this.paddle.paddleHeight);
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderBricks(){
    for(var i = 0; i < this.bricks.columnCount; i++){
      for(var j = 0; j < this.bricks.rowCount; j++){
        if(this.bricks.bricks[i][j].status === 1){
          var brickX = (i * (this.bricks.width+this.bricks.padding))+this.bricks.offsetLeft;
          var brickY = (j * (this.bricks.height+this.bricks.padding))+this.bricks.offsetTop;
          this.bricks.bricks[i][j].x = brickX;
          this.bricks.bricks[i][j].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.bricks.width, this.bricks.height);
          this.ctx.fillStyle = "blue";
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  loop(){
    this.render();
    this.update();
  }
}
