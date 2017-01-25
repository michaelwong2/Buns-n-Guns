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

    display.drawText(x,y,'%c{#800000}%b{#8fbc8f}HP: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._HitPoints_attr.curHp + '%c{#800000}%b{#8fbc8f}/' + this.avatar.attr._HitPoints_attr.maxHp);
    display.drawText(x+15,y, '%c{#800000}%b{#8fbc8f}GUN: ' + '%c{#800000}%b{#8fbc8f}' + Game.UIMode.gameInventory.attr.gun.attr._name);
    display.drawText(x+35,y, '%c{#800000}%b{#8fbc8f}BOMB: ' + '%c{#800000}%b{#8fbc8f}' + Game.UIMode.gameInventory.attr.bomb.attr._name);
    display.drawText(x+55,y, '%c{#800000}%b{#8fbc8f}KEYS: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._InventoryHolder_attr.keyCount);
  },
}
