Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#bbc',
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.InventoryHolder],
};

Game.EntityTemplates.Cat = {
  name: 'Cat',
  chr:'&',
  fg:'#f00',
  mixins:[],
  loopingChars: {
    wait: 0,
    lim: 100
  },
  work: function(){
    //this.attr._x++;
  }
}

Game.EntityTemplates.Dog = {
  name: 'Dog',
  chr:'$',
  fg:'#f00',
  mixins:[]
}

Game.EntityTemplates.Bomb = {
  name: 'Bomb',
  chr:'=',
  fg:'#bcc',
  mixins:[],
  loopingChars: {
    wait: 0,
    lim: 100,
    count: 0,
    trigger: 10,
    radius: 10,
    explode: function(map, ox, oy){
      //
      // var xStart = camX-Math.round(dispW/2);
      // var yStart = camY-Math.round(dispH/2);
      //
      // var tar = map.getTileGrid();
      //
      // var sx = ox - this.radius;
      // var sy = oy - this.radius;
      //
      // for(var x = sx; x < this.radius*2; x++){
      //   if(x <= 0 || x >= tar.length)
      //     continue;
      //
      //   for(var y = sy; y < this.radius*2; y++){
      //
      //     if(y <= 0 || y >= tar[x].length)
      //       continue;
      //
      //     tar[x][y] = Game.Tile.floorTile;
      //   }
      // }
    }
  },
  work: function(){
    if(this.loopingChars.count >= this.loopingChars.trigger){
      this.loopingChars.explode(this.getMap(), this.getX(), this.getY());
      this.expire();
    }else{
      if(this.loopingChars.count % 2 == 0){
        this.attr._fg = '#f00';
      }else{
        this.attr._fg = '#fff';
      }

      this.loopingChars.count++;
    }
  }
}
