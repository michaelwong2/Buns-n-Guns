Game.SavePoint = {
  attr: {
    _x: 0,
    _y: 0
  },

  isSavePoint: function(x,y){
    return x === this.attr._x && y === this.attr._y;
  },

  saveGame: function() {
    console.log(JSON.stringify(Game.getGame()));
    if(Game.localStorageAvailable()){
      //window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game.getGame()));
      // window.localStorage.setItem();
      window.localStorage.setItem('randomSeed',JSON.stringify(Game.getRandomSeed()));

      //save map & locations of exit and savepoint
      window.localStorage.setItem('savedmap',JSON.stringify(Game.DATASTORE.MAP));
      window.localStorage.setItem('savePointLocation',JSON.stringify(this.attr));
      window.localStorage.setItem('exitLocation',JSON.stringify(Game.Exit.getLocation()));

      //save entities
      var storableEntities = {};
      for(var k in Game.DATASTORE.ENTITIES){
        var thisEnt = Game.DATASTORE.ENTITIES[k];
        storableEntities[thisEnt._entityID] = thisEnt.attr;
      }
      window.localStorage.setItem("savedentities", JSON.stringify(storableEntities));

      //save items
      var storableItems = {};
      for(var k in Game.DATASTORE.ITEMS){
        var thisItem = Game.DATASTORE.ITEMS[k];
        storableItems[thisItem._itemID] = thisItem.attr;
      }
      window.localStorage.setItem("saveditems", JSON.stringify(storableItems));

      window.localStorage.setItem("savedmessages", JSON.stringify(Game.Message.attr
      ));
    }
  },

  putSavePoint: function(tileArray){
    var X = Math.floor(Math.random()*tileArray.length);
    var Y = Math.floor(Math.random()*tileArray[0].length);

    if (tileArray[X][Y].isWalkable()) {
      this.attr._x = X;
      this.attr._y = Y;
    } else {
      this.putSavePoint(tileArray);
    }
  },

  render: function(display,x,y){
    display.draw(x,y, 'S', '#F0F');
  }
}
