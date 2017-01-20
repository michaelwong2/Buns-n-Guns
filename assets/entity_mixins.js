Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());

    if(Game.Exit.isExit(targetX, targetY)){
      if(Game.Exit.isOpen()){
        Game.UIMode.gamePlay.setUpLevel();

      }else{
        if (this.keyCount() > 0) {
          Game.Exit.unlock(this.keyCount());
          this.resetKeyCount();
        }
        return;
      }
    }

    if (map.getEntity(targetX, targetY) == null && map.getTile(targetX,targetY).isWalkable()) {
      this.setPos(targetX,targetY);
      if (this.hasMixin('Chronicle')) { // NOTE: this is sub-optimal because it couple this mixin to the Chronicle one (i.e. this needs to know the Chronicle function to call) - the event system will solve this issue
        this.trackTurn();
      }

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
      maxHp: 1,
      curHp: 1
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
      items: {},
      keys: {},
      keyCount: 0,
      spaceAvailable: true
    },
    init: function (template) {
      this.attr._InventoryHolder_attr.items = template.items || {};
      this.attr._InventoryHolder_attr.keys = template.keys || {};
      this.attr._InventoryHolder_attr.keyCount = template.keyCount || 0;
      this.attr._InventoryHolder_attr.spaceAvailable = template.spaceAvailable || true;
    }
  },

  hasSpace: function () {
    return this.attr._InventoryHolder_attr.spaceAvailable;
  },

  pickupItem: function (map,x,y) {
    var item = map.getItem(x, y);
    if ( item !== null) {
      if (item.attr._name == 'key') {
        this.attr._InventoryHolder_attr.keys[item._itemID] = item;
        this.attr._InventoryHolder_attr.keyCount++;
        Game.Message.send('You picked up a ' + item.attr._name + '! You now have ' + this.attr._InventoryHolder_attr.keyCount + ' keys.');
      } else {
        this.attr._InventoryHolder_attr.items[item._itemID] = item;
      }
      map.updateItem(item);
    }
    ;
  },

  getItem: function (itemId) {
    if (this.attr._InventoryHolder_attr.items[itemId]) {
      return Game.DATASTORE.ITEMS[itemId];
    }
    return null;
  },

  dropItem: function (itemId) {
    // var index = this.attr._InventoryHolder_attr.items.indexOf(itemId);
    // this.attr._InventoryHolder_attr.items.splice(index,1);
  },

  keyCount: function () {
    return this.attr._InventoryHolder_attr.keyCount;
  },

  resetKeyCount: function () {
    this.attr._InventoryHolder_attr.keyCount = 0;
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
      this.getMap().updateEntity(this);
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

      console.log("starting coords: " + sx + ", " + sy + ", radius: " + rad);

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

          if(entid != null && Game.DATASTORE.ENTITIES[entid]){
            Game.DATASTORE.ENTITIES[entid].expire();
          }

        }
      }
    }
};
