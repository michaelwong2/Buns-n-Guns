Game.Map = function(tilesGrid){
  this.attr = {
    _tiles: tilesGrid,
    _width: tilesGrid.length,
    _height: tilesGrid[0].length,
    _entitiesByLocation: {},
    _locationsByEntity: {},
    _itemsByLocation: {},
    _locationsByItem: {}
  };
};

Game.Map.prototype.getWidth = function () {
  return this.attr._width;
};

Game.Map.prototype.getHeight = function () {
  return this.attr._height;
};

Game.Map.prototype.getTile = function (x,y) {
  if ((x < 0) || (x >= this.attr._width) || (y<0) || (y >= this.attr._height)) {
    return Game.Tile.nullTile;
  }
  return this.attr._tiles[x][y] || Game.Tile.nullTile;
};

Game.Map.prototype.getTileGrid = function(){
  return this.attr._tiles;
}

Game.Map.prototype.setTile = function(x,y, tile){
  if ((x < 0) || (x >= this.attr._width) || (y<0) || (y >= this.attr._height)) {
    return;
  }

  this.attr._tiles[x][y] = tile;
}

Game.Map.prototype.getWalkableLocation = function(){
  var nx = Math.floor(Math.random()*this.attr._width);
  var ny = Math.floor(Math.random()*this.attr._height);

  if(this.getTile(nx,ny).isWalkable()){
    return {x: nx, y: ny};
  }else{
    return this.getWalkableLocation();
  }
}

Game.Map.prototype.addEntity = function(entity){
    this.attr._entitiesByLocation[entity.getX() + "," + entity.getY()] = entity._entityID;
    this.attr._locationsByEntity[entity._entityID] = entity.getX() + "," + entity.getY();
}

Game.Map.prototype.getEntity = function(x,y){
    var id = this.attr._entitiesByLocation[x + "," + y];
    return id != null ? Game.DATASTORE.ENTITIES[id] : null;
}

Game.Map.prototype.updateEntity = function(entity){
  var oldloc = this.attr._locationsByEntity[entity._entityID];
  delete this.attr._entitiesByLocation[oldloc];

  this.attr._locationsByEntity[entity._entityID] = entity.getX() + "," + entity.getY();
  this.attr._entitiesByLocation[entity.getX() + "," + entity.getY()] = entity._entityID;
}

Game.Map.prototype.addItem = function(item){
    this.attr._itemsByLocation[item.getX() + "," + item.getY()] = item._itemID;
    this.attr._locationsByItem[item._itemID] = item.getX() + "," + item.getY();
}

Game.Map.prototype.getItem = function(x,y){
    var id = this.attr._itemsByLocation[x + "," + y];
    return id != null ? Game.DATASTORE.ITEMS[id] : null;
}

Game.Map.prototype.updateItem = function(item){
  var oldloc = this.attr._locationsByItem[item._itemID];
  delete this.attr._itemsByLocation[oldloc];

  this.attr._locationsByItem[item._itemID] = item.getX() + "," + item.getY();
  this.attr._itemsByLocation[item.getX() + "," + item.getY()] = item._itemID;
}

Game.Map.prototype.renderOn = function (display,camX,camY) {

  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX-Math.round(dispW/2);
  var yStart = camY-Math.round(dispH/2);

  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      // Fetch the glyph for the tile and render it to the screen - sub in wall tiles for nullTiles / out-of-bounds
      var tile = this.getTile(x+xStart, y+yStart);
      if (tile.getName() == 'nullTile') {
        tile = Game.Tile.wallTile;
      }

      var ent = this.getEntity(x + xStart,y + yStart);

      if(ent == null){
        tile.draw(display,x,y);
      } else {
        ent.draw(display,x,y);
      }

      var item = this.getItem(x + xStart,y + yStart);

      if(item == null){
        tile.draw(display,x,y);
      } else {
        item.draw(display,x,y);
      }
    }
  }
};
