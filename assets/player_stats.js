Game.PlayerStats = {
  avatar: null,
  attr:{
    _h: 6,
    _w: 15
  },

  update: function(avatar) {
    this.avatar = avatar;
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
    display.drawText(x,y, 'HP: ' + this.avatar.attr._HitPoints_attr.curHp + '/' + this.avatar.attr._HitPoints_attr.maxHp);
    display.drawText(x,y+1, this.avatar.attr._InventoryHolder_attr.gun);
    display.drawText(x,y+2, this.avatar.attr._InventoryHolder_attr.bomb + ": " + this.avatar.attr._InventoryHolder_attr.bombCount);
    display.drawText(x,y+3, "Keys: " + this.avatar.attr._InventoryHolder_attr.keyCount);
  },
}
