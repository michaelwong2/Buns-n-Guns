Game.Item = function(template){
  template = template || {};

  Game.ActiveSymbol.call(this, template);
    this.attr._x = template.x || 0;
    this.attr._y = template.y || 0;

    this.attr.description = template.description || null;
    this.attr.equipment = template.equipment || false;
    this.attr.gun = template.gun || false;

    this._itemID = template.id || Game.util.randomString(32);

    Game.DATASTORE.ITEMS[this._itemID] = this;
}
Game.Item.extend(Game.ActiveSymbol);

Game.Item.prototype.getX = function(){
  return this.attr._x;
}

Game.Item.prototype.getY = function(){
  return this.attr._y;
}

Game.Item.prototype.setPos = function(x,y){
  this.attr._x = x;
  this.attr._y = y;
}

Game.Item.prototype.isEquipment = function(){
  return this.attr.equipment;
}

Game.Item.prototype.isGun = function(){
  return this.attr.gun;
}
