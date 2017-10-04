

export default class Bricks {
  //Possibly allow amount of bricks in game.js
  constructor(){
    this.rowCount = 5;
    this.columnCount = 10;
    this.width = 30;
    this.height = 10;
    this.padding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;

    this.bricks = [];
    for(var i = 0; i < this.columnCount; i++){
      this.bricks[i] = [];
      for(var j = 0; j < this.rowCount; j++){
        this.bricks[i][j] = {x: 0, y: 0, status: 1};
      }
    }
  }
}
