Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#bbc',
  dir: 0,
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.InventoryHolder, Game.EntityMixin.HitPoints],
  workattrs:{
    wait:0,
    lim: 1
  },
  work: function(){
  }
};

Game.EntityTemplates.Cat = {
  name: 'Cat',
  chr:'&',
  fg:'#fff',
  mixins:[],
  workattrs: {
    wait: 0,
    lim: 100
  },
  work: function(){
    //this.attr._x++;
  }
};

Game.EntityTemplates.MeleeBunny = {
  name: 'MeleeBunny',
  chr:'$',
  fg:'#0f0',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.HitPoints],
  workattrs: {
    wait: 0,
    lim: 10,
    passive: true,
    dir: Math.floor(Math.random()*3),
    sp: 1,
    damage: 1
  },
  work: function(){
    //passive
    var dir = this.attr.loopingChars.dir;
    var sp = this.attr.loopingChars.sp;

    var cx = 0;
    var cy = 0;

    var rx = 0;
    var ry = 0;

    var avatar = Game.UIMode.gamePlay.attr._avatar;

    if(this.distanceTo(avatar) < 3){
      this.attr._fg = "#f00";
      this.attr.loopingChars.passive = false;
    }else{
      this.attr._fg = "#0f0";
      this.attr.loopingChars.passive = true;
    }

    if(this.attr.loopingChars.passive){
      switch(dir){
        case 0: cx -= sp; break;
        case 1: cy -= sp; break;
        case 2: cx += sp; break;
        case 3: cy += sp; break;
      }
    }else{
      // var astar = new ROT.Path.AStar(this.getX(), this.getY(), this.getMap().pointTraversable);
      // astar.compute(avatar.getX(), avatar.getY(), function(x, y) {
      // });

      // if(astar == null){
        this.attr.loopingChars.passive = true;
        return;
      // }
      //
      // rx += this.getX() - astar._todo[0].x;
      // ry += this.getY() - astar._todo[0].y;

    }


    // if the tile in front is out of bounds or not walkable, turn left or right
    if(Game.util.outOfBounds(this.attr._x + cx, this.attr._y + cy, this.getMap().getWidth(), this.getMap().getHeight()) || !this.attr.map.getTileGrid()[this.attr._x + cx][this.attr._y + cy].isWalkable()){
      dir += Math.floor(Math.random()*100) > 50 ? 1 : -1;

      if(dir == 4)
        dir = 0;
      else if(dir == -1)
        dir = 3;

      this.attr.loopingChars.dir = dir;

      return;
    }

    var entity = this.getMap().getEntity(this.attr._x + cx, this.attr._y + cy);

    if(entity != null && entity.attr._name == "Avatar"){

      Game.Message.send("You took " + this.attr.loopingChars.damage + " damage");
      entity.takeHits(this.attr.loopingChars.damage);

      return;
    }

    this.attr._x += this.attr.loopingChars.passive ? cx : rx;
    this.attr._y += this.attr.loopingChars.passive ? cy : rx;

  }
};

Game.EntityTemplates.Bomb = {
  name: 'Bomb',
  chr:'o',
  fg:'#bcc',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.explode],
  workattrs: {
    wait: 0,
    lim: 20,
    count: 0,
    trigger: 10,
    radius: 5,
  },
  work: function(){
    if(this.attr.loopingChars.count >= this.attr.loopingChars.trigger){
      this.explode(this.getMap(), this.getX(), this.getY());
      this.expire();
    }else{
      if(this.attr.loopingChars.count % 2 == 0){
        this.attr._fg = '#f00';
      }else{
        this.attr._fg = '#fff';
      }

      this.attr.loopingChars.count++;
    }
  }
}

Game.EntityTemplates.Bullet = {
  name: 'Bullet',
  chr:'.',
  fg:'#aaf',
  mixins:[Game.EntityMixin.runnable],
  workattrs: {
    wait: 0,
    lim: 10,
    dir: 0,
    speed: 1,
    count: 0,
    lifespan: 10,
    avatarDec: 0,
    entityDec: 0
  },
  work: function(){
    var sp = this.attr.loopingChars.speed;

    var cx = 0;
    var cy = 0;

    switch(this.attr.loopingChars.dir){
      case 0: cx -= sp; break;
      case 1: cy -= sp; break;
      case 2: cx += sp; break;
      case 3: cy += sp; break;
    }

    this.attr._x += cx;
    this.attr._y += cy;

    var entity = this.attr.map.attr._entitiesByLocation[this.attr._x + "," + this.attr._y];

    if(entity != null && Game.DATASTORE.ENTITIES[entity]){

      if(Game.DATASTORE.ENTITIES[entity].hasMixin("HitPoints")){
          if(Game.DATASTORE.ENTITIES[entity].attr._name == "Avatar"){
            Game.DATASTORE.ENTITIES[entity].takeHits(this.attr.loopingChars.avatarDec);
            Game.Message.send("You took " + this.attr.loopingChars.entityDec + " damage");
          }else{
            Game.DATASTORE.ENTITIES[entity].takeHits(this.attr.loopingChars.entityDec);
            Game.Message.send("You did " + this.attr.loopingChars.entityDec + " damage");
          }
      }

      this.attr._char = "#";
      this.expire();
      return;
    }

    if(Game.util.outOfBounds(this.attr._x, this.attr._y, this.getMap().getWidth(), this.getMap().getHeight()) || !this.attr.map.getTileGrid()[this.attr._x][this.attr._y].isWalkable()){
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

    if(this.attr.loopingChars.count > this.attr.loopingChars.lifespan){
      this.expire();
      return;
    }else if(this.attr.loopingChars.count == this.attr.loopingChars.lifespan){
      this.attr._char = '*';
    }

    this.attr.loopingChars.count++;
  }
};
