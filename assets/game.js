window.onload = function() {
    console.log("starting WSRL - window loaded");
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        // Add the containers to our HTML page
        document.getElementById('main').appendChild(Game.getDisplay('main').getContainer());
        document.getElementById('message').appendChild(Game.getDisplay('message').getContainer());

        Game.switchUIMode(Game.UIMode.gameMenu);

        var bindEventToScreen = function(eventType){
          window.addEventListener(eventType, function(evt){
            Game.eventHandler(eventType, evt);
          });
        };

        bindEventToScreen('keypress');
        bindEventToScreen('keydown');

    }
};

var Game = {

  _PERSISTENCE_NAMESPACE: 'savegame',
  _randomSeed: 0,
  _DISPLAY_SPACING: 1.1,
  _game_started: false,
  _loop: null,
  display: {
    main: {
      w: 73,
      h: 26,
      o: null
    },
    message: {
      w: 73,
      h: 6,
      o: null
    },
  },

  _currUIMode: null,
  DATASTORE: {},

  init: function() {
    this._game = this;

    for(var display_key in this.display){
      this.display[display_key].o = new ROT.Display({width: this.display[display_key].w, height: this.display[display_key].h, spacing: Game._DISPLAY_SPACING});
    }

    this.resetDataStore();

    // console.dir(this.display);
  },

  getGame: function(){
    return this._game;
  },

  resetDataStore: function(){
      this.DATASTORE = {
        MAP: {},
        ENTITIES: {},
        ITEMS: {},
        LEVELS: {}
      };
  },
  eventHandler: function(eventType, evt){
    if(this._currUIMode)
      this._currUIMode.handleInput(eventType, evt);
  },

  getRandomSeed: function(){
    return this._randomSeed;
  },

  setRandomSeed: function(s){
    this._randomSeed = s;
    ROT.RNG.setSeed(this._randomSeed);
    console.log("seed set: " + this._randomSeed);
  },

  toJSON: function(){
    var json = {"_randomSeed":this.getRandomSeed()};
    return json;
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  renderMain: function() {
    this.getDisplay("main").clear();
    this._currUIMode.render(this.getDisplay("main"));
  },

  renderMessage: function() {
    Game.Message.render(this.getDisplay("message"));
  },

  // renderAvatar: function() {
  //   var d = this.display.avatar.o;
  //   d.drawText(5, 0, "avatar");
  // },

  renderAll: function(){
    this.renderMessage();
    this.renderMain();
  },

  switchUIMode: function(newMode){
    // handle exit for old mode
    if(this._currUIMode != null)
      this._currUIMode.exit();
    // set current to new mode
    this._currUIMode = newMode;
    // handle enter for new mode
    this._currUIMode.enter();
    // render everything
    this.renderAll();
  },
  localStorageAvailable: function(){
    try{
      var x = "dad";
      window.localStorage.setItem(x,x);
      window.localStorage.removeItem(x);
      return true;
    }catch(e){
      console.log(e);
      return false;
    }
  },

  initGameLoop: function(){
    Game._running = true;
    Game._loop = setInterval(Game.update, 10);
  },

  update: function(){
    for(var en in Game.DATASTORE.ENTITIES){
      Game.DATASTORE.ENTITIES[en].doWork();
    }

    Game.renderMain();
  },

  stopGameLoop: function(){
    clearInterval(Game._loop);
  }
};
