Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());

    if(Game.SavePoint.isSavePoint(targetX, targetY)){
      Game.SavePoint.saveGame();
      return;
    }

    if(Game.Exit.isExit(targetX, targetY)){
      if(Game.Exit.isOpen()){
        Game.mapGen.genNewRandomSeed();
        if(Game.UIMode.gamePlay.getLevel() <= 9){
          Game.UIMode.gamePlay.setUpLevel(Game.UIMode.gamePlay.nextLevel());
        }else if(Game.UIMode.gamePlay.getLevel() == 10){
          Game.UIMode.gamePlay.nextLevel();
          Game.UIMode.gamePlay.finalLevel();
        }else if(Game.UIMode.gamePlay.getLevel() == 11){
          Game.switchUIMode(Game.UIMode.gameWin);
        }
      }else{
        if (this.keyCount() > 0) {
          Game.Exit.unlock(this.keyCount());
          this.resetKeyCount();
        } else {
          Game.Message.send('You need ' + Game.Exit.getLockSize() + ' key(s) to unlock this door.');
        }
        return;
      }
    }

    if (map.getEntity(targetX, targetY) == null && map.getTile(targetX,targetY).isWalkable()) {
      this.setPos(targetX,targetY);

      return true;
    }
    return false;
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0
    }
  },
  trackTurn: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 10,
      curHp: 10
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;

    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;

    if(this.attr._HitPoints_attr.curHp <= 0){
      Game.Message.send("You killed the bunny");

      if(this.attr._name == "ShooterBunny" && Math.floor(Math.random()*100) > 50){
          var carrot = new Game.Item(Game.ItemTemplates.Carrot);
          carrot.setPos(this.getX(), this.getY());
          this.getMap().addItem(carrot);
      }

      this.expire();
    }
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};

Game.EntityMixin.InventoryHolder = {
  META: {
    mixinName: 'InventoryHolder',
    mixinGroup: 'InventoryHolder',
    stateNamespace: '_InventoryHolder_attr',
    stateModel: {
      keyCount: 0
    },
    init: function (template) {
    }
  },

  hasSpace: function () {
    return this.attr._InventoryHolder_attr.spaceAvailable;
  },

  renderInv: function(display) {

  },

  pickupItem: function (map,x,y) {
    var item = map.getItem(x, y);
    if ( item !== null) {
      if (item.attr._name == 'Key') {
        this.attr._InventoryHolder_attr.keyCount++;
        Game.Message.send('You picked up a ' + item.attr._name + '! You now have ' + this.attr._InventoryHolder_attr.keyCount + ' keys.');
      } else {
        if (Game.UIMode.gameInventory.isFull()) {
          Game.Message.send('My bag is full! But my life is still so empty...');
          return;
        } else {
          Game.UIMode.gameInventory.putItem(item);
        }
      }
      map.updateItem(item);
    }
  },

  consume: function(item) {
    switch(item.attr._name) {
      case 'Carrot':
        var newHp = this.attr._HitPoints_attr.curHp + 5;
        if (newHp < this.attr._HitPoints_attr.maxHp) {
          this.attr._HitPoints_attr.curHp = newHp;
        } else {
          this.attr._HitPoints_attr.curHp = this.attr._HitPoints_attr.maxHp;
        }
        Game.PlayerStats.render(Game.getDisplay('main'));
        break;
      default:
    }
  },

  getItem: function (itemId) {
    if (this.attr._InventoryHolder_attr.inventory[itemId]) {
      return Game.DATASTORE.ITEMS[itemId];
    }
    return null;
  },

  keyCount: function () {
    return this.attr._InventoryHolder_attr.keyCount;
  },

  resetKeyCount: function () {
    this.attr._InventoryHolder_attr.keyCount = 0;
    // Game.PlayerStats.update('_keyCount',this.attr._InventoryHolder_attr.keyCount);
  }
};

Game.EntityMixin.runnable = {
  META: {
      mixinName: 'runnable',
      mixinGroup: 'runnable',
      stateNamespace: 'loopingChars',
      stateModel: {
        wait: 0,
        lim: 20,
        count: 0,
        radius: 0,
        trigger: 0
      },

      init: function () {
      }
    },
    doWork: function(){
      if(this.attr.loopingChars.wait >= this.attr.loopingChars.lim){
        this._work();
        this.attr.loopingChars.wait = 0;
      }else{
        this.attr.loopingChars.wait++;
      }

      if(Game.DATASTORE.ENTITIES[this._entityID]){
        this.getMap().updateEntity(this);
      }
    }
};

Game.EntityMixin.explode = {
  META: {
      mixinName: 'explode',
      mixinGroup: 'explode',
      stateNamespace: 'explode_data',
      stateModel: {
      },
      init: function () {
      },
    },
    explode: function(map,ox,oy){
      var tar = map.getTileGrid();

      var rad = this.attr.loopingChars.radius;

      var sx = ox - rad;
      var sy = oy - rad;

      if(sx < 0){
        sx = 0;
      }

      if(sy < 0){
        sy = 0;
      }

      // console.log("starting coords: " + sx + ", " + sy + ", radius: " + rad);

      for(var x = 0; x < rad*2; x++){
        var nx = x + sx;

        if(nx <= 2 || nx >= tar.length-2){
          continue;
        }

        for(var y = 0; y < rad*2 - 3; y++){
          var ny = y + sy;

          if(Game.util.liesOnCorners(x,y,rad*2, rad*2) || ny <= 2 || ny >= tar[x].length-2){
            continue;
          }

          tar[nx][ny] = Game.Tile.floorTile;

          var entid = map.attr._entitiesByLocation[nx + "," + ny];

          if(entid != null && Game.DATASTORE.ENTITIES[entid] && Game.DATASTORE.ENTITIES[entid].hasMixin("HitPoints")){
            Game.DATASTORE.ENTITIES[entid].takeHits(7);
          }

        }
      }

      for(var i = 0; i < 15; i++){
        var particle = new Game.Entity(Game.EntityTemplates.SmokeParticle);
        particle.setPos(ox, oy);
        particle.attr.loopingChars.dx = ox + Math.floor(Math.random()*5) - Math.floor(Math.random()*10);
        particle.attr.loopingChars.dy = oy + Math.floor(Math.random()*5) - Math.floor(Math.random()*10);
        this.getMap().addEntity(particle);
      }
    }
};

Game.EntityMixin.pexplode = {
  META: {
      mixinName: 'pexplode',
      mixinGroup: 'pexplode',
      stateNamespace: 'pexplode_data',
      stateModel: {
      },
      init: function () {
      },
    },
    pexplode: function(map,ox,oy){
      var tar = map.getTileGrid();

      var cenbomb = new Game.Entity(Game.EntityTemplates.Bomb);

      cenbomb.setPos(ox, oy);
      cenbomb.attr.loopingChars.trigger = 0;

      map.addEntity(cenbomb);

      for(var i = 0; i < 5; i++){
        var exbomb = new Game.Entity(Game.EntityTemplates.Bomb);
        exbomb.setPos(Math.ceil(Math.random()*10) - Math.ceil(Math.random()*20) + ox, Math.ceil(Math.random()*8) - Math.ceil(Math.random()*20) + oy);
        exbomb.attr.loopingChars.trigger = 1;

        map.addEntity(exbomb);
      }

    }
};
