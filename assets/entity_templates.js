Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#bbc',
  dir: 0,
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
  chr:'o',
  fg:'#bcc',
  mixins:[],
  loopingChars: {
    wait: 0,
    lim: 20,
    count: 0,
    trigger: 10,
    radius: 5,
    explode: function(map, ox, oy){
      var tar = map.getTileGrid();

      var sx = ox - this.radius;
      var sy = oy - this.radius;

      if(sx < 0){
        sx = 0;
      }

      if(sy < 0){
        sy = 0;
      }

      console.log("starting coords: " + sx + ", " + sy + ", radius: " + this.radius);

      for(var x = 0; x < this.radius*2; x++){

        var nx = x + sx;

        if(nx <= 2 || nx >= tar.length-2){
          continue;
        }

        for(var y = 0; y < this.radius*2 - 3; y++){
          var ny = y + sy;

          if(Game.util.liesOnCorners(x,y,this.radius*2, this.radius*2) || ny <= 2 || ny >= tar[x].length-2){
            continue;
          }

          tar[nx][ny] = Game.Tile.floorTile;

          var entid = map.attr._entitiesByLocation[nx + "," + ny];

          if(entid != null && Game.DATASTORE.ENTITIES[entid]){
            Game.DATASTORE.ENTITIES[entid].expire();
          }

        }
      }
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

Game.EntityTemplates.Bullet = {
  name: 'Bullet',
  chr:'.',
  fg:'#aaf',
  mixins:[],
  loopingChars: {
    wait: 0,
    lim: 10,
    dir: 0,
    speed: 1,
    count: 0,
    lifespan: 10
  },
  work: function(){
    var sp = this.loopingChars.speed;

    var cx = 0;
    var cy = 0;

    switch(this.loopingChars.dir){
      case 0: cx -= sp; break;
      case 1: cy -= sp; break;
      case 2: cx += sp; break;
      case 3: cy += sp; break;
    }

    this.attr._x += cx;
    this.attr._y += cy;

    var entity = this.attr.map.attr._entitiesByLocation[this.attr._x + "," + this.attr._y];

    if(entity != null && Game.DATASTORE.ENTITIES[entity]){
      Game.DATASTORE.ENTITIES[entity].expire();
      this.attr._char = "#";
      this.expire();
      return;
    }

    if(!this.attr.map.getTileGrid()[this.attr._x][this.attr._y].isWalkable()){
      // this.attr.map.getTileGrid()[this.attr._x][this.attr._y] = Game.Tile.floorTile;
      this.attr._char = "#";
      this.expire();
      return;
    }

    if(this.attr._x <= 2 || this.attr._x >= this.attr.map.getWidth() - 2 || this.attr._y <= 2 || this.attr._y >= this.attr.map.getHeight() - 2){
      this.attr._char = '*';
      this.expire();
      return;
    }

    if(this.loopingChars.count > this.loopingChars.lifespan){
      this.expire();
      return;
    }else if(this.loopingChars.count == this.loopingChars.lifespan){
      this.attr._char = '*';
    }

    this.loopingChars.count++;
  }
}
