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
  mixins:[Game.EntityMixin.runnable],
  workattrs: {
    wait: 0,
    lim: 10,
    passive: true,
    dir: Math.floor(Math.random()*3),
    sp: 1
  },
  work: function(){
    //passive

    var dir = this.attr.loopingChars.dir;
    var sp = this.attr.loopingChars.sp;

    if(this.attr.loopingChars.passive){

        var cx = 0;
        var cy = 0;

        switch(dir){
          case 0: cx -= sp; break;
          case 1: cy -= sp; break;
          case 2: cx += sp; break;
          case 3: cy += sp; break;
        }

        if(Game.util.outOfBounds(this.attr._x + cx, this.attr._y + cy, this.getMap().getWidth(), this.getMap().getHeight()) || !this.attr.map.getTileGrid()[this.attr._x + cx][this.attr._y + cy].isWalkable()){
          dir += Math.floor(Math.random()*100) > 50 ? 1 : -1;

          if(dir == 4)
            dir = 0;
          else if(dir == -1)
            dir = 3;

          this.attr.loopingChars.dir = dir;

          return;
        }
        this.attr._x += cx;
        this.attr._y += cy;
    }else{
      
    }
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
    lifespan: 10
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
      Game.DATASTORE.ENTITIES[entity].expire();
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
