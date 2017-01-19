Game.Exit = {
  attr: {
    sx: 0,
    sy: 0,
    height: 2,
    width: 3,
    displayable: [['/', '\\'],['%', '%'],['\\','/']],
    open: false,
    lockSize: 2
  },

  isOpen: function(){
    return this.attr.open;
  },

  open: function(){
    this.attr.open = true;
    this.attr.displayable[1][0] = ' ';
    this.attr.displayable[1][1] = ' ';
  },

  lock: function () {
    this.attr.open = false;
    this.attr.displayable[1][0] = '%';
    this.attr.displayable[1][1] = '%';
    this.attr.lockSize = 2;
  },

  unlock: function(keyCount) {
    if(this.attr.lockSize > 0){
      this.attr.lockSize -= keyCount;
      Game.Message.send("You used " + keyCount + " key(s) on the door. The door requires " + this.attr.lockSize + " more keys to open.");
      if(this.attr.lockSize === 0){
        this.open();
        Game.Message.send("The door has been unlocked!");
      }
    }
  },

  putExit: function(tileArray){
    var X = tileArray.length - 1;
    var Y = Math.floor(Math.random()*tileArray[0].length);

    wallFound = false;
    while(!wallFound && X > 0){
      console.log(X);

      if(tileArray[X][Y].isWalkable()){
        wallFound = true;
        X++;
      }else{
        X--;
      }
    }

    this.attr.sx = X;

    if(X > 2 && X < tileArray.length - 1 && Y < tileArray[X].length-1 && !tileArray[X][Y+1].isWalkable() && tileArray[X-1][Y+1].isWalkable()){
      this.attr.sy = Y+1;
    }else if(X > 2 && X < tileArray.length - 1 && Y > 0 && !tileArray[X][Y-1].isWalkable() && tileArray[X-1][Y-1].isWalkable()){
      this.attr.sy = Y-1;
    }else{
      return this.putExit(tileArray);
    }

    return tileArray;

  },

  isExit: function(x,y){
    return x >= this.attr.sx && x < this.attr.sx + this.attr.width && y < this.attr.sy + this.attr.height && y >= this.attr.sy;
  },

  render: function(display,x,y, xStart, yStart){
    var nx = x+xStart - this.attr.sx;
    var ny = y+yStart - this.attr.sy;

    display.draw(x,y, this.attr.displayable[nx][ny], '#F0F');
  }
}
