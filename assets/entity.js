Game.Entity = function(template){
  template = template || {};

  this._entityID = template.id || Game.util.randomString(32);

  // console.log(template.id);
  // console.log(this._entityID);

  if(template.loadTemplateAgain != null){
    template = template.loadTemplateAgain;
  }

  Game.ActiveSymbol.call(this, template);
    this.attr.workattrs = template.workattrs || {};
    this.loadWorkAttributes();

    this.attr._x = template.x || 0;
    this.attr._y = template.y || 0;

    // this.attr.map = null;

    this.attr.dir = template.dir || 0;

    this._work = template.work || null;

    Game.DATASTORE.ENTITIES[this._entityID] = this;

}
Game.Entity.extend(Game.ActiveSymbol);

Game.Entity.prototype.getX = function(){
  return this.attr._x;
}

// Game.Entity.prototype.setMap = function(map){
//   this.attr.map = map;
// }

Game.Entity.prototype.getMap = function(){
  return Game.UIMode.gamePlay.attr._map;
}

Game.Entity.prototype.getY = function(){
  return this.attr._y;
}

Game.Entity.prototype.getID = function() {
  return this._entityID;
}

Game.Entity.prototype.setPos = function(x,y){
  this.attr._x = x;
  this.attr._y = y;
}

Game.Entity.prototype.setDir = function(d){
  this.attr.dir = d;
}

Game.Entity.prototype.doWork = function(){
  if(this._work && this.loopingChars){

  }
}

Game.Entity.prototype.loadWorkAttributes = function(){
  if(this.hasMixin('runnable') && this.attr.workattrs != null){
    for(var k in this.attr.workattrs){
      this.attr.loopingChars[k] = this.attr.workattrs[k];
    }
  }
}

Game.Entity.prototype.distanceTo = function(ent){
  if(ent == null)
    return 100;

  var x = ent.getX();
  var y = ent.getY();

  return Math.sqrt(Math.pow(Math.abs(this.getX() - x), 2), Math.pow(Math.abs(this.getY() - y), 2));
}

Game.Entity.prototype.expire = function(){
  if(this.attr._name == "Avatar"){
    this.attr._char = 'X';
    Game.Message.send("I died :( brb Justin wait for me!");
    Game.stopGameLoop();
    setTimeout(function(){
      Game.switchUIMode(Game.UIMode.gameLose);
    }, 2000);
  }else if(this){
    delete Game.DATASTORE.ENTITIES[this._entityID];
    this.getMap().deleteEntity(this);

  }
}
