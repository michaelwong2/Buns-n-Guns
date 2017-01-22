Game.PlayerStats = {
  avatar: null,
  attr:{
    _h: 6,
    _w: 15,
    // _maxHp: 1,
    // _curHp: 1,
    // _gun: 'PeaShooter',
    // _bomb: 'Melon Bomb',
    // _bombCount: 5,
    // _keyCount: 0
  },

  update: function(avatar) {
    this.avatar = avatar;
  },

  // update: function(attrName,attrData) {
  //   if (this.attr.hasOwnProperty(attrName)) {
  //     this.attr[attrName] = attrData;
  //   }
  // },

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
    display.drawText(x,y, 'HP: ' + this.avatar.attr._HitPoints_attr.curHp + '/' + this.avatar.attr._HitPoints_attr.maxHp);
    display.drawText(x,y+1, this.avatar.attr._InventoryHolder_attr.gun);
    display.drawText(x,y+2, this.avatar.attr._InventoryHolder_attr.bomb + ": " + this.avatar.attr._InventoryHolder_attr.bombCount);
    display.drawText(x,y+3, "Keys: " + this.avatar.attr._InventoryHolder_attr.keyCount);
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
