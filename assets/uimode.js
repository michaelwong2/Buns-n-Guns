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

      if(window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE) == null || window.localStorage.getItem("savedentities") == null){
        Game.Message.send("No saved file data");
        return;
      }

      // load game data
      var json_state_data = window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);

      // load entity data
      var entity_data = JSON.parse(window.localStorage.getItem("savedentities"));

      for(var k in entity_data){
        var loadedent = new Game.Entity({id: entity_data[k]._entityID});
        loadedent.loadSavedState(entity_data[k], Game.EntityTemplates[entity_data[k]._name]);

        if(loadedent.attr._name == "Avatar")
          Game.UIMode.gamePlay.attr._avatar = loadedent;

      }

      Game.UIMode.gamePlay.load(state_data._randomSeed);

    }else if(abinding.actionKey == 'PERSISTENCE_SAVE'){
      // console.log(JSON.stringify(Game.getGame()));
      // if(Game.localStorageAvailable()){
      //   window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game.getGame()));
      //   // window.localStorage.setItem();
      //
      //   var storableAttrs = {};
      //
      //   for(var k in Game.DATASTORE.ENTITIES){
      //     var thisent = Game.DATASTORE.ENTITIES[k];
      //     storableAttrs[thisent._entityID] = thisent.attr;
      //   }
      //
      //   window.localStorage.setItem("savedentities", JSON.stringify(storableAttrs));
      //   window.localStorage.setItem("savedmessages", JSON.stringify(Game.Message.attr
      //   ));
      // }
    }else{
      return;
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
    height: 40,
    width: 40,
    moveX: 0,
    moveY: 0
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

  },
  handleInput: function(inputType, inputData){
    var abinding = Game.KeyBinding.getInputBinding(inputType,inputData);

    if(!abinding)
      return false;

    if(abinding.actionKey == 'MOVE_U'){
      this.attr.moveY -= this.attr.speed;
    } else if(abinding.actionKey == 'MOVE_D'){
      this.attr.moveY += this.attr.speed;
    } else if(abinding.actionKey == 'MOVE_R'){
      this.attr.moveX += this.attr.speed;
    } else if(abinding.actionKey == 'MOVE_L'){
      this.attr.moveX -= this.attr.speed;
    } else if(abinding.actionKey == 'PICKUP'){
      console.log('pickup action');
      this.attr._avatar.pickupItem(this.attr._map, this.attr._avatar.getX(), this.attr._avatar.getY());
    }else if(abinding.actionKey == 'PERSISTENCE'){
      Game.switchUIMode(Game.UIMode.persistence);
      return;
    }else {
      return;
    }

    // Game.renderAll();
  },

  setUpNewGame: function () {
    this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);
    this.setUpLevel();
  },

  setUpLevel: function () {
    this.attr._map = Game.mapGen.newMap(this.attr.height, this.attr.width);

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

    for(var i = 0; i < 3; i++){
      var newent = new Game.Entity(Game.EntityTemplates.Cat);
      var newloc = this.attr._map.getWalkableLocation();
      newent.setPos(newloc.x, newloc.y);

      this.attr._map.addEntity(newent);
    }
  },

  load: function(seed){
    this.attr._map = Game.mapGen.loadPreviousMap(seed);

    this.attr.camX = this.attr._avatar.getX();
    this.attr.camY = this.attr._avatar.getY();

  },
  renderAvatar: function(display){
    // var cen = this.attr._map.center(display, this.attr.camX, this.attr.camY, this.attr.height, this.attr.width);
    // this.attr._avatar.draw(display, this.attr._avatar.attr._x, this.attr._avatar.attr._y);

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
