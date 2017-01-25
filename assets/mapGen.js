Game.mapGen = {
  _currSeed: null,

  setSeed: function(s){
    this._currSeed = s;
    ROT.RNG.setSeed(this._currSeed);
  },

  getSeed: function(){
    return this._currSeed;
  },

  genNewRandomSeed: function(){
     this.setSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
  },

  createMap: function(h,w) {
    if(this._currSeed == null){
        this.genNewRandomSeed();
    }
    console.log("Map seed:");
    console.log(this._currSeed);

    var generator = new ROT.Map.Cellular(h, w);
    generator.randomize(0.5);

    for(var i = 0; i < 10; i++){
      generator.create();
    }

    var tileArray = Game.util.init2DArray(h,w,Game.Tile.nullTile);

    generator.create(function(x,y,val){
      if(val === 0){
        tileArray[x][y] = Game.Tile.wallTile;
      }else{
        tileArray[x][y] = Game.Tile.floorTile;
      }
    });

    return tileArray;
  },

  newMap: function(h, w){
    var tileArray = this.createMap(h,w);

    tileArray = Game.Exit.putExit(tileArray);
    Game.SavePoint.putSavePoint(tileArray);
    Game.Exit.lock();

    var map = new Game.Map(tileArray);
    return map;

  },

  finalMap: function(){
    var h = 60;
    var w = 60;

    if(this._currSeed == null){
        this.genNewRandomSeed();
    }

    var generator = new ROT.Map.Cellular(h, w);
    generator.randomize(0.5);

    for(var i = 0; i < 50; i++){
      generator.create();
    }

    var tileArray = Game.util.init2DArray(h,w,Game.Tile.nullTile);

    generator.create(function(x,y,val){
      if(val === 0){
        tileArray[x][y] = Game.Tile.wallTile;
      }else{
        tileArray[x][y] = Game.Tile.floorTile;
      }
    });

    tileArray = Game.Exit.putExit(tileArray);
    Game.SavePoint.putSavePoint(tileArray);
    Game.Exit.lock();

    var map = new Game.Map(tileArray);
    return map;
  },

  loadPreviousMap: function(seed,map_data,exit,savepoint,x,y){
    this.setSeed(seed);
    var oldmap = new Game.Map(this.createMap(x,y));
    Game.Exit.updateExit(exit);
    Game.Exit.lock();
    Game.SavePoint.updateSavePoint(savepoint);

    for (var i in map_data) {
      if (map_data.hasOwnProperty(i))
        oldmap.attr[i] = map_data[i];
    }

    // console.log(oldmap.attr._locationsByEntity);

    for(var k in oldmap.attr._locationsByEntity){
      if(oldmap.attr._locationsByEntity.hasOwnProperty(k) && Game.DATASTORE.ENTITIES[k]){
        Game.DATASTORE.ENTITIES[k].setMap(oldmap);
      }
    }


    // for(var k in Game.DATASTORE.ITEMS){
    //   oldmap.addItem(Game.DATASTORE.ITEMS[k]);
    // }

    return oldmap;
  },
}
