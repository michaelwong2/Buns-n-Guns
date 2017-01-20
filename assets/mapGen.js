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
  newMap: function(h, w){
    if(this._currSeed == null){
        this.genNewRandomSeed();
    }

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

    tileArray = Game.Exit.putExit(tileArray);
    Game.Exit.lock();
    
    return new Game.Map(tileArray);
  },
  loadPreviousMap: function(seed){
    this.setSeed(seed);
    var oldmap = this.newMap();

    for(var k in Game.DATASTORE.ENTITIES){
      oldmap.addEntity(Game.DATASTORE.ENTITIES[k]);
    }

    return oldmap;
  },
}
