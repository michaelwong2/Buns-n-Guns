Game.PlayerStats = {
  avatar: null,
  level: 1,
  attr:{
    _h: 6,
    _w: 15
  },

  update: function(avatar,level) {
    this.avatar = avatar;
    this.level = level;
  },

  render: function(display){
    var x = 1;
    var y = display._options.height - 1;
    for (var w = 0; w < display._options.width; w++) {
      display.draw(w,y,' ','#8fbc8f','#8fbc8f');
    }

    display.drawText(0,0,'%c{#800000}%b{#8fbc8f}Press [p] to pause');

    switch(this.level) {
      case 1:
        display.drawText(40,0,'%c{#800000}%b{#8fbc8f}1ST FLUFFY LEVEL OF BUNNY HELL <3');
        break;
      case 2:
        display.drawText(40,0,'%c{#800000}%b{#8fbc8f}2ND FLUFFY LEVEL OF BUNNY HELL <3');
        break;
      case 3:
        display.drawText(40,0,'%c{#800000}%b{#8fbc8f}3RD FLUFFY LEVEL OF BUNNY HELL <3');
        break;
      case 4: case 5: case 6: case 7: case 8: case 9: case 10:
        display.drawText(40,0,'%c{#800000}%b{#8fbc8f}' + this.level + 'TH FLUFFY LEVEL OF BUNNY HELL <3');
        break;
      default:
    }

    display.drawText(x,y,'%c{#800000}%b{#8fbc8f}HP: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._HitPoints_attr.curHp + '%c{#800000}%b{#8fbc8f}/' + this.avatar.attr._HitPoints_attr.maxHp);
    display.drawText(x+15,y, '%c{#800000}%b{#8fbc8f}GUN: ' + '%c{#800000}%b{#8fbc8f}' + Game.UIMode.gameInventory.attr.gun.attr._name);
    display.drawText(x+35,y, '%c{#800000}%b{#8fbc8f}BOMB: ' + '%c{#800000}%b{#8fbc8f}' + Game.UIMode.gameInventory.attr.bomb.attr._name);
    display.drawText(x+55,y, '%c{#800000}%b{#8fbc8f}KEYS: ' + '%c{#800000}%b{#8fbc8f}' + this.avatar.attr._InventoryHolder_attr.keyCount);
  },
}
