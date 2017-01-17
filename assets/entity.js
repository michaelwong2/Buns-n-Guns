Game.Entity = function(template){
  template = template || {};

  Game.ActiveSymbol.call(this, template);
    this.attr._x = template.x || 0;
    this.attr._y = template.y || 0;

    this._entityID = template.id || Game.util.randomString(32);

    Game.DATASTORE.ENTITIES[this._entityID] = this;
}
Game.Entity.extend(Game.ActiveSymbol);

Game.Entity.prototype.getX = function(){
  return this.attr._x;
}

Game.Entity.prototype.getY = function(){
  return this.attr._y;
}

Game.Entity.prototype.setPos = function(x,y){
  this.attr._x = x;
  this.attr._y = y;
}
