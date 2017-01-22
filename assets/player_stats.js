Game.PlayerStats = {
  attr:{
    _h: 6,
    _w: 15,
    _maxHp: 1,
    _curHp: 1,
    _gun: 'PeaShooter',
    _bomb: 'Melon Bomb',
    _bombCount: 5,
    _keyCount: 0
  },

  // init: function() {
  //   this.attr._maxHp =
  // },

  update: function(attrName,attrData) {
    if (this.attr.hasOwnProperty(attrName)) {
      this.attr[attrName] = attrData;
    }
  },

  render: function(display){
    x = 1;
    y = display._options.height - 2;
    for (var w = 0; w < this.attr._w; w++) {
      for (var h = 0; h < this.attr._h; h++) {
        display.draw(x+w,y-h,'.');
      }
    }

    x++;
    y -= 4;
    display.drawText(x,y, 'HP: ' + this.attr._curHp + '/' + this.attr._maxHp);
    display.drawText(x,y+1, this.attr._gun);
    display.drawText(x,y+2, this.attr._bomb + ": " + this.attr._bombCount);
    display.drawText(x,y+3, "Keys: " + this.attr._keyCount);
  },
  // send: function(msg){
  //   this.set(msg);
  //   this.render(Game.getDisplay("message"));
  // },
  // set: function(msg){
  //   this.attr.messages.push(msg);
  // },
  // clear: function(){
  //   this.attr.messages = [];
  // }
}
