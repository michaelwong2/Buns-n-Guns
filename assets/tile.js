Game.Tile = function(properties){
  if(!properties){properties = {}}
  if(!('attr' in this)){this.attr = {}}

  Game.Symbol.call(this, properties);
  this.attr._name = properties.name || Game.UIMode.DEFAULT_COLOR_BG;
  this.attr._walkable = properties.walkable || false;
  this.attr._empty = properties.empty || false;

};

Game.Tile.extend(Game.Symbol);

Game.Tile.prototype.getName = function(){
  return this.attr._name;
}

Game.Tile.prototype.isWalkable = function(){
  return this.attr._walkable;
}

Game.Tile.prototype.isEmpty = function(){
  return this.attr._empty;
}

//----------------------

Game.Tile.nullTile = new Game.Tile({name:'nullTile'});
Game.Tile.floorTile = new Game.Tile({name:'floorTile', chr: ' ', walkable:true, empty:true});
Game.Tile.wallTile = new Game.Tile({name:'wallTile',  chr: '?'});
Game.Tile.smokeTile = new Game.Tile({name:'smokeTile',  chr: '*'});
