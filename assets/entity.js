Game.Entity = function(template){
  template = template || {};

  Game.ActiveSymbol.call(this, template);
    this.attr._x = template.x || 0;
    this.attr._y = template.y || 0;

    this.attr.map = null;

    this._entityID = template.id || Game.util.randomString(32);

    this._work = template.work || null;
    this.loopingChars = template.loopingChars || {};

    Game.DATASTORE.ENTITIES[this._entityID] = this;

}
Game.Entity.extend(Game.ActiveSymbol);

Game.Entity.prototype.getX = function(){
  return this.attr._x;
}

Game.Entity.prototype.setMap = function(map){
  this.attr.map = map;
}

Game.Entity.prototype.getMap = function(){
  return this.attr.map;
}

Game.Entity.prototype.getY = function(){
  return this.attr._y;
}

Game.Entity.prototype.setPos = function(x,y){
  this.attr._x = x;
  this.attr._y = y;
}

Game.Entity.prototype.doWork = function(){
  if(this._work && this.loopingChars){
    if(this.loopingChars.wait >= this.loopingChars.lim){
      this._work();
      this.loopingChars.wait = 0;
    }else{
      this.loopingChars.wait++;
    }
    this.getMap().updateEntity(this);
  }
}

Game.Entity.prototype.expire = function(){
  this.getMap().deleteEntity(this);
  delete Game.DATASTORE.ENTITIES[this._entityID];
}
