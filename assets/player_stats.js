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
    var x = 1;
    var y = display._options.height - 1;
    for (var w = 0; w < display._options.width; w++) {
      display.draw(w,y,' ','#8fbc8f','#8fbc8f');
    }



    // for (var w = 0; w < this.attr._w; w++) {
    //   for (var h = 0; h < this.attr._h; h++) {
    //     display.draw(x+w,y-h,'.');
    //   }
    // }

    // x++;
    // y -= 4;
    // display.drawText(x,y, 'HP: ' + this.avatar.attr._HitPoints_attr.curHp + '/' + this.avatar.attr._HitPoints_attr.maxHp);
    // display.drawText(x,y+1, this.avatar.attr._InventoryHolder_attr.gun);
    // display.drawText(x,y+2, this.avatar.attr._InventoryHolder_attr.bomb);
    // display.drawText(x,y+3, "Keys: " + this.avatar.attr._InventoryHolder_attr.keyCount);

    display.drawText(x,y,'%c{#800000}%b{#8fbc8f}HP: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._HitPoints_attr.curHp + '%c{#800000}%b{#8fbc8f}/' + this.avatar.attr._HitPoints_attr.maxHp);
    display.drawText(x+15,y, '%c{#800000}%b{#8fbc8f}GUN: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._InventoryHolder_attr.gun);
    display.drawText(x+35,y, '%c{#800000}%b{#8fbc8f}BOMB: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._InventoryHolder_attr.bomb);
    display.drawText(x+55,y, '%c{#800000}%b{#8fbc8f}KEYS: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._InventoryHolder_attr.keyCount);
  },
}
