// breakout.js

export default class Paddle {
  constructor(){
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.x = ((this.width - this.paddleWidth)/2);
    this.direction = 'idle';
  }

  render(ctx){
    
  }

  update(input){
    switch (this.direction){
      case 'right':
        if(this.x < this.width-this.paddleWidth){
          this.x += 7;
        }
        break;
      case 'left':
        if(this.x > 0){
          this.x -= 7;
        }
        break;
      default:
        this.x = 0;
    }
  }
}
