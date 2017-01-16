Game.Entity = function(template){
  template = template || {};

  Game.Symbol.call(this, template);
    if (! ('attr' in this)) { this.attr = {}; }
    this.attr._name = template.name || '';
    this.attr._x = template.x || 0;
    this.attr._y = template.y || 0;

    this._entityID = template.id || Game.util.randomString(32);

    Game.DATASTORE.ENTITIES[this._entityID] = this;

    this._mixins = template.mixins || [];
    this._mixinTracker = {};

    // console.dir(template);
    // console.dir(template.mixins);
    // console.dir(this._mixins);

    this.loadMixins(this._mixins);

}

Game.Entity.extend(Game.Symbol);

Game.Entity.prototype.getX = function(){
  return this.attr._x;
}

Game.Entity.prototype.getY = function(){
  return this.attr._y;
}

Game.Entity.prototype.setPos = function(x,y){
  this.attr._x = x;
  this.attr._y = y;
}

Game.Entity.prototype.hasMixin = function(checkThis) {
    if (typeof checkThis == 'object') {
      return this._mixinTracker.hasOwnProperty(checkThis.META.mixinName);
    } else {
      return this._mixinTracker.hasOwnProperty(checkThis);
    }
};

Game.Entity.prototype.loadMixins = function(mixinData){
  for (var i = 0; i < mixinData.length; i++) {
    var mixin = mixinData[i];
    console.dir(mixin);
    this._mixinTracker[mixin.META.mixinName] = true;
    this._mixinTracker[mixin.META.mixinGroup] = true;
    for (var mixinProp in mixinProp != 'META' && mixin) {
      if (mixinProp != 'META' && mixin.hasOwnProperty(mixinProp)) {
        this[mixinProp] = mixin[mixinProp];
      }
    }
    if (mixin.META.hasOwnProperty('stateNamespace') && this.attr[mixin.META.stateNamespace] == null) {
      this.attr[mixin.META.stateNamespace] = {};
      for (var mixinStateProp in mixin.META.stateModel) {
        if (mixin.META.stateModel.hasOwnProperty(mixinStateProp)) {
          this.attr[mixin.META.stateNamespace][mixinStateProp] = mixin.META.stateModel[mixinStateProp];
        }
      }
    }
    if (mixin.META.hasOwnProperty('init')) {
      mixin.META.init.call(this,template);
    }
  }
};

Game.Entity.prototype.getStorable = function(){
  return JSON.stringify(this.attr);
};

Game.Entity.prototype.loadSavedState = function(sattr, temp){
  this.attr = {};

  for(var i in sattr){
    if(sattr.hasOwnProperty(i))
      this.attr[i] = sattr[i];
  }

  this.loadMixins(temp.mixins);
}
