Game.SavePoint = {
  attr: {
    _x: 0,
    _y: 0
  },

  isSavePoint: function(x,y){
    return x === this.attr._x && y === this.attr._y;
  },

  putSavePoint: function(tileArray){
    var X = Math.floor(Math.random()*tileArray.length);
    var Y = Math.floor(Math.random()*tileArray[0].length);

    if (tileArray[X][Y].isWalkable()) {
      this.attr._x = X;
      this.attr._y = Y;
    } else {
      this.putSavePoint(tileArray);
    }
  },

  render: function(display,x,y){
    display.draw(x,y, 'S', '#F0F');
  }
}
