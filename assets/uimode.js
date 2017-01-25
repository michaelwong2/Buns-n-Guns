Game.UIMode = {
  DEFAULT_FG: '#fff',
  DEFAULT_BG: '#000'
};

Game.UIMode.gameMenu = {
  enter: function(){
    console.log("entered menu");
     Game.KeyBinding.setKeyBinding('menu');
  },
  exit: function(){
    console.log("exited menu");
  },
  render: function(display){


    display.drawText(10,6,"New   [n]");
    display.drawText(10,7,"Load  [l]");

  },
  handleInput: function(inputType, inputData){

    var abinding = Game.KeyBinding.getInputBinding(inputType,inputData);

    if(!abinding)
      return false;

    if(abinding.actionKey == 'PERSISTENCE_NEW'){
        Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
        Game.UIMode.gamePlay.attr._avatar = null;
        Game.UIMode.gamePlay.setUpNewGame();

    }else if(abinding.actionKey == 'PERSISTENCE_LOAD'){

      if(window.localStorage.getItem('mapSeed') == null || window.localStorage.getItem("savedentities") == null){
        Game.Message.send("No saved file data");
        return;
      }

      // load game data
      // var json_state_data = window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE);
      // var state_data = JSON.parse(json_state_data);

      //get mapSeed
      var mapSeed = JSON.parse(window.localStorage.getItem('mapSeed'));
      console.log(mapSeed);

      //load map
      var map_data = JSON.parse(window.localStorage.getItem('savedmap'));
      var savePointLocation = JSON.parse(window.localStorage.getItem('savePointLocation'));
      var exitLocation = JSON.parse(window.localStorage.getItem('exitLocation'));
      var level = JSON.parse(window.localStorage.getItem('level'));

      // load entity data
      var entity_data = JSON.parse(window.localStorage.getItem("savedentities"));

      for(var k in entity_data){
        var loadedEnt = new Game.Entity({id: k, loadTemplateAgain: Game.EntityTemplates[entity_data[k]._name]});
        loadedEnt.loadSavedState(entity_data[k], Game.EntityTemplates[entity_data[k]._name]);

        if(loadedEnt.attr._name == "Avatar"){
          loadedEnt.attr._InventoryHolder_attr = entity_data[k]._InventoryHolder_attr;
          Game.UIMode.gamePlay.attr._avatar = loadedEnt;
        }
      }
      //console.log(Game.DATASTORE.ENTITIES);

      // load item data
      var item_data = JSON.parse(window.localStorage.getItem("saveditems"));

      for(var k in item_data){
        var loadedItem = new Game.Item({id: k});
        loadedItem.loadSavedState(item_data[k], Game.ItemTemplates[item_data[k]._name]);
      }

      Game.UIMode.gamePlay.load(mapSeed,map_data,exitLocation,savePointLocation,level);
    }

    Game.switchUIMode(Game.UIMode.gamePlay);
  }
};

Game.UIMode.gamePlay = {
  attr:{
    _map: null,
    camX: null,
    camY: null,
    speed: 1,
    height: 30,
    width: 30,
    moveX: 0,
    moveY: 0,
    level: 1
  },
  enter: function(){
    console.log("entered gamePlay");
    Game._game_started = true;
    Game.KeyBinding.setKeyBinding('arrows');
    Game.initGameLoop();
  },
  exit: function(){
    console.log("exited gamePlay");
    Game.stopGameLoop();
  },
  render: function(display){
    this.attr._map.renderOn(display, this.attr.camX, this.attr.camY);
    this.renderAvatar(display);
    Game.PlayerStats.update(this.attr._avatar);
    Game.PlayerStats.render(display);

  },
  handleInput: function(inputType, inputData){
    var abinding = Game.KeyBinding.getInputBinding(inputType,inputData);

    if(!abinding)
      return false;

    if(abinding.actionKey == 'MOVE_U'){
      this.attr.moveY -= this.attr.speed;
      this.attr._avatar.setDir(1);
    } else if(abinding.actionKey == 'MOVE_D'){
      this.attr.moveY += this.attr.speed;
      this.attr._avatar.setDir(3);
    } else if(abinding.actionKey == 'MOVE_R'){
      this.attr.moveX += this.attr.speed;
      this.attr._avatar.setDir(2);
    } else if(abinding.actionKey == 'MOVE_L'){
      this.attr.moveX -= this.attr.speed;
      this.attr._avatar.setDir(0);
    } else if(abinding.actionKey == 'PICKUP'){
      console.log('pickup action');
      this.attr._avatar.pickupItem(this.attr._map, this.attr._avatar.getX(), this.attr._avatar.getY());
    }else if(abinding.actionKey == 'PERSISTENCE'){
      Game.switchUIMode(Game.UIMode.gameMenu);
      return;
    }else if(abinding.actionKey == 'SHOOT'){
      var bullet = new Game.Entity(Game.EntityTemplates.Bullet);
      bullet.attr.loopingChars.entityDec = 5;

      var xoff = 0;
      var yoff = 0;

      switch(this.attr._avatar.attr.dir){
        case 0: xoff = -1; break;
        case 1: yoff = -1; break;
        case 2: xoff = 1; break;
        case 3: yoff = 1; break;
      }

      bullet.setPos(this.attr._avatar.getX() + xoff, this.attr._avatar.getY() + yoff);
      bullet.attr.loopingChars.dir = this.attr._avatar.attr.dir;

      this.attr._map.addEntity(bullet);
    }else if(abinding.actionKey == 'BOMB'){
      var bomb = new Game.Entity(Game.EntityTemplates.Bomb);

      var xoff = 0;
      var yoff = 0;

      switch(this.attr._avatar.attr.dir){
        case 0: xoff = -1; break;
        case 1: yoff = -1; break;
        case 2: xoff = 1; break;
        case 3: yoff = 1; break;
      }

      bomb.setPos(this.attr._avatar.getX() + xoff, this.attr._avatar.getY() + yoff);

      this.attr._map.addEntity(bomb);
    }else{
      return;
    }

    // Game.renderAll();
  },

  nextLevel: function() {
    return ++this.attr.level;
  },

  getLevel: function() {
    return this.attr.level;
  },

  setUpNewGame: function () {
    this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);
    localStorage.clear();
    this.setUpLevel(this.attr.level);
  },

  setUpLevel: function (level) {
    Game.Levels.update(level);
    Game.resetDataStore();
    Game.DATASTORE.ENTITIES[this.attr._avatar.getID()] = this.attr._avatar;

    var map = Game.mapGen.newMap(Game.Levels.getHeight(), Game.Levels.getWidth());
    this.attr._map = map;
    console.log(map);
    console.log("Map before populating:");
    console.log(this.attr._map);

    var Loc = this.attr._map.getWalkableLocation();
    this.attr._avatar.setPos(Loc.x,Loc.y);
    this.attr.camX = Loc.x;
    this.attr.camY = Loc.y;
    this.attr._map.addEntity(this.attr._avatar);

    for(var k = 0; k < 10; k++){
      var newItem = new Game.Item(Game.ItemTemplates.Key);
      var newloc = this.attr._map.getWalkableLocation();
      newItem.setPos(newloc.x, newloc.y);

      this.attr._map.addItem(newItem);
    }

    var mob = Game.Levels.getMob();
    var entType = null;

    for(var i = 0; i < mob.length;i++) {
      entType = mob[i];
      for(var pop = 0; pop < entType.no; pop++) {
        newEnt = new Game.Entity(Game.EntityTemplates[entType.name]);
        var newloc = this.attr._map.getWalkableLocation();
        newEnt.setPos(newloc.x, newloc.y);

        this.attr._map.addEntity(newEnt);
      }
    }

  },

  load: function(seed,map_data,exit,savepoint,level){
    this.attr.level = level;
    console.log('level: ' + level);
    Game.Levels.update(level);
    this.attr._map = Game.mapGen.loadPreviousMap(seed, map_data, exit, savepoint, Game.Levels.getHeight(), Game.Levels.getWidth());

    this.attr.camX = this.attr._avatar.getX();
    this.attr.camY = this.attr._avatar.getY();

  },
  renderAvatar: function(display){
    this.attr._avatar.tryWalk(this.attr._map, this.attr.moveX, this.attr.moveY);

    this.moveCamera(this.attr._avatar.getX(), this.attr._avatar.getY());

    this.attr._map.updateEntity(this.attr._avatar);

    this.attr.moveX = 0;
    this.attr.moveY = 0;

  },
  moveCamera: function(x,y){
    this.attr.camX = x;
    this.attr.camY = y;
  }
};

Game.UIMode.gameWin = {
  enter: function(){
    console.log("entered gameWin");
  },
  exit: function(){
    console.log("exited gameWin");
  },
  render: function(display){
    console.log("rendered gameWin");
    display.drawText(5,5,"You win!");
  },
  handleInput: function(inputType, inputData){
    console.log("input for gameWin");
  }
};


Game.UIMode.gameLose = {
  enter: function(){
    console.log("entered gameLose");
  },
  exit: function(){
    console.log("exited gameLose");
  },
  render: function(display){
    console.log("rendered gameLose");
    display.drawText(5,5,"You lose!");
  },
  handleInput: function(inputType, inputData){
    console.log("input for gameLose");
  }
};
