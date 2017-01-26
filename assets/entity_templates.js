Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#ff0',
  dir: 0,
  maxHp: 20,
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.InventoryHolder, Game.EntityMixin.HitPoints],
  workattrs:{
    wait:0,
    lim: 1
  },
  work: function(){
  }
};

Game.EntityTemplates.Bun = {
  name: 'Bun',
  chr:'&',
  fg:'#fff',
  maxHp: 30,
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
  maxHp: 10,
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
      this.attr.loopingChars.passive = false;
      this.attr.loopingChars.lim = 50;
    }else{
      this.attr.loopingChars.passive = true;
      this.attr.loopingChars.lim = 10;
    }

    if(this.attr.loopingChars.passive){
      switch(dir){
        case 0: cx -= sp; break;
        case 1: cy -= sp; break;
        case 2: cx += sp; break;
        case 3: cy += sp; break;
      }
    }else{

      if(this.getX() < avatar.getX()){
        cx++;
      }else if(this.getX() > avatar.getX()){
        cx--;
      }

      if(this.getY() < avatar.getY()){
        cy++;
      }else if(this.getY() > avatar.getY()){
        cy--;
      }
    }


    // if the tile in front is out of bounds or not walkable, turn left or right
    if(Game.util.outOfBounds(this.attr._x + cx, this.attr._y + cy, this.getMap().getWidth(), this.getMap().getHeight()) || !this.getMap().getTileGrid()[this.attr._x + cx][this.attr._y + cy].isWalkable()){
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

      Game.Message.send("I took " + this.attr.loopingChars.damage + " damage.");
      entity.takeHits(this.attr.loopingChars.damage);

      return;
    }

    this.attr._x += cx;
    this.attr._y += cy;

  }
};

Game.EntityTemplates.ShooterBunny = {
  name: 'ShooterBunny',
  chr:'$',
  fg:'#fbf',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.HitPoints],
  maxHp: 15,
  workattrs: {
    wait: 0,
    lim: 10,
    passive: true,
    dir: Math.floor(Math.random()*3),
    sdir: 0,
    sp: 1,
    damage: 1
  },
  work: function(){
    //passive
    var dir = this.attr.loopingChars.dir;
    var sp = this.attr.loopingChars.sp;

    var cx = 0;
    var cy = 0;

    var avatar = Game.UIMode.gamePlay.attr._avatar;

    // when to attack
    if(Math.abs(this.getX() - avatar.getX()) < 3 || Math.abs(this.getY() - avatar.getY()) < 3){
      this.attr.loopingChars.passive = false;
      this.attr.loopingChars.lim = 35;
    }else{
      this.attr.loopingChars.passive = true;
      this.attr.loopingChars.lim = 10;
    }

    if(this.attr.loopingChars.passive){
      switch(dir){
        case 0: cx -= sp; break;
        case 1: cy -= sp; break;
        case 2: cx += sp; break;
        case 3: cy += sp; break;
      }
    }else{

      var gx = Math.abs(this.getX() - avatar.getX()) < 3;
      var gy = Math.abs(this.getY() - avatar.getY()) < 3;

      var xoff = 0;
      var yoff = 0;
      var dir = 0;

      var shoot = false;

      // shoot toward avatar
      if(gx){
        if(this.getX() < avatar.getX()){
          cx++;
        }else if(this.getX() > avatar.getX()){
          cx--;
        }else if(this.getX() == avatar.getX()){
          shoot = true;
        }

        if(this.getY() > avatar.getY()){
          dir = 1;
          yoff = -1;
        }else{
          dir = 3;
          yoff = 1;
        }
      }else if(gy){
        if(this.getY() < avatar.getY()){
          cy++;
        }else if(this.getY() > avatar.getY()){
          cy--;
        }else if(this.getY() == avatar.getY()){
          shoot = true;
        }

        if(this.getX() < avatar.getX()){
          dir = 2;
          xoff = 1;
        }else{
          dir = 0;
          xoff = -1;
        }
      }else{
        this.attr.loopingChars.passive = true;
        return;
      }

      if(shoot){
        var bullet = new Game.Entity(Game.EntityTemplates.Bullet);
        bullet.attr.loopingChars.avatarDec = 1;

        bullet.setPos(this.getX() + xoff, this.getY() + yoff);
        bullet.attr.loopingChars.dir = dir;

        this.getMap().addEntity(bullet);
      }
    }

    // if the tile in front is out of bounds or not walkable, turn left or right
    if(Game.util.outOfBounds(this.attr._x + cx, this.attr._y + cy, this.getMap().getWidth(), this.getMap().getHeight()) || !this.getMap().getTileGrid()[this.attr._x + cx][this.attr._y + cy].isWalkable()){
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

      Game.Message.send("I took " + this.attr.loopingChars.damage + " damage.");
      entity.takeHits(this.attr.loopingChars.damage);

      return;
    }

    this.attr._x += cx;
    this.attr._y += cy;

  }
};

Game.EntityTemplates.BomberBunny = {
  name: 'BomberBunny',
  chr:'$',
  fg:'#fc4',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.HitPoints, Game.EntityMixin.explode],
  maxHp: 20,
  workattrs: {
    wait: 0,
    lim: 10,
    passive: true,
    dir: Math.floor(Math.random()*3),
    sp: 1,
    triggered: false,
    radius: 7,
    countdown: 0
  },
  work: function(){

    var dir = this.attr.loopingChars.dir;
    var sp = this.attr.loopingChars.sp;

    var cx = 0;
    var cy = 0;

    var avatar = Game.UIMode.gamePlay.attr._avatar;

    if(this.distanceTo(avatar) < 3){
      this.attr.loopingChars.passive = false;
      this.attr.loopingChars.lim = 50;
      this.attr._fg = '#f00';
    }else{
      this.attr.loopingChars.passive = true;
      this.attr.loopingChars.lim = 10;
      this.attr._fg = '#fc4';
    }

    if(this.attr.loopingChars.passive){
      switch(dir){
        case 0: cx -= sp; break;
        case 1: cy -= sp; break;
        case 2: cx += sp; break;
        case 3: cy += sp; break;
      }
    }else{

      if(this.getX() < avatar.getX()){
        cx++;
      }else if(this.getX() > avatar.getX()){
        cx--;
      }

      if(this.getY() < avatar.getY()){
        cy++;
      }else if(this.getY() > avatar.getY()){
        cy--;
      }

      if(Math.abs(this.getX() - avatar.getX()) < 3 && Math.abs(this.getY() - avatar.getY()) < 3){
        this.attr.loopingChars.triggered = true;
        this.explode(this.getMap(), this.getX(), this.getY());
            this.expire();
        return;
      }

    }


    // if the tile in front is out of bounds or not walkable, turn left or right
    if(Game.util.outOfBounds(this.attr._x + cx, this.attr._y + cy, this.getMap().getWidth(), this.getMap().getHeight()) || !this.getMap().getTileGrid()[this.attr._x + cx][this.attr._y + cy].isWalkable()){
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

      Game.Message.send("I took " + this.attr.loopingChars.damage + " damage.");
      entity.takeHits(this.attr.loopingChars.damage);

      return;
    }

    this.attr._x += cx;
    this.attr._y += cy;

  }
};

Game.EntityTemplates.Bomb = {
  name: 'Bomb',
  chr:'o',
  fg:'#fa0',
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
        this.attr._fg = '#ffa500';
      }else{
        this.attr._fg = '#fff';
      }

      this.attr.loopingChars.count++;
    }
  }
};

Game.EntityTemplates.Bombkin = {
  name: 'Bombkin',
  chr:'O',
  fg:'#aa0',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.pexplode],
  workattrs: {
    wait: 0,
    lim: 20,
    count: 0,
    trigger: 12,
    radius: 5
  },
  work: function(){
    if(this.attr.loopingChars.count >= this.attr.loopingChars.trigger){
      this.pexplode(this.getMap(), this.getX(), this.getY());
      this.expire();
    }else{
      if(this.attr.loopingChars.count % 2 == 0){
        this.attr._fg = '#aa0';
      }else{
        this.attr._fg = '#f00';
      }

      this.attr.loopingChars.count++;
    }
  }
};

Game.EntityTemplates.ChileBomb = {
  name: 'ChileBomb',
  chr:'=',
  fg:'#faa',
  mixins:[Game.EntityMixin.runnable, Game.EntityMixin.explode],
  workattrs: {
    wait: 0,
    lim: 20,
    count: 0,
    trigger: 6,
    radius: 2,
    dir: 0
  },
  work: function(){
    if(this.attr.loopingChars.count >= this.attr.loopingChars.trigger){
      this.dirExplode(this.getMap(), this.getX(), this.getY(), this.attr.loopingChars.dir);
      this.expire();
    }else{
      if(this.attr.loopingChars.count % 2 == 0){
        this.attr._fg = '#faa';
      }else{
        this.attr._fg = '#f00';
      }

      this.attr.loopingChars.count++;
    }
  }
};

Game.EntityTemplates.Bullet = {
  name: 'Bullet',
  chr:'.',
  fg:'#8f8',
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

    var entity = this.getMap().attr._entitiesByLocation[this.attr._x + "," + this.attr._y];

    if(entity != null && Game.DATASTORE.ENTITIES[entity]){

      if(Game.DATASTORE.ENTITIES[entity].hasMixin("HitPoints")){
          if(Game.DATASTORE.ENTITIES[entity].attr._name == "Avatar"){
            Game.DATASTORE.ENTITIES[entity].takeHits(this.attr.loopingChars.avatarDec);
            Game.Message.send("I took " + this.attr.loopingChars.entityDec + " damage.");
          }else{
            Game.DATASTORE.ENTITIES[entity].takeHits(this.attr.loopingChars.entityDec);
            Game.Message.send("I did " + this.attr.loopingChars.entityDec + " damage.");
          }
      }

      this.attr._char = "#";
      this.expire();
      return;
    }

    if(Game.util.outOfBounds(this.attr._x, this.attr._y, this.getMap().getWidth(), this.getMap().getHeight()) || !this.getMap().getTileGrid()[this.attr._x][this.attr._y].isWalkable()){
      // this.getMap().getTileGrid()[this.attr._x][this.attr._y] = Game.Tile.floorTile;
      this.attr._char = "#";
      this.expire();
      return;
    }

    if(this.attr._x <= 2 || this.attr._x >= this.getMap().getWidth() - 2 || this.attr._y <= 2 || this.attr._y >= this.getMap().getHeight() - 2){
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

Game.EntityTemplates.SmokeParticle = {
  name: 'Bomb',
  chr:'#',
  fg:'#fa0',
  mixins:[Game.EntityMixin.runnable],
  workattrs: {
    wait: 0,
    lim: 4,
    state: Math.floor(Math.random()*1),
    dx: 0,
    dy: 0
  },
  work: function(){
    // # * + .
    if(this.attr.loopingChars.state > 2){
      this.expire();
    }else{
      this.attr.loopingChars.state++;

      switch(this.attr.loopingChars.state){
        case 1: this.attr._char = '*'; break;
        case 2: this.attr._char = ','; break;
        case 3: this.attr._char = '.'; break;
      }

      var targetX = this.attr.loopingChars.dx;
      var targetY = this.attr.loopingChars.dy;

      if(this.getX() < targetX){
        this.attr._x++;
      }else{
        this.attr._x--;
      }

      if(this.getY() < targetY){
        this.attr._y++;
      }else{
        this.attr._y--;
      }
    }
  }
}
