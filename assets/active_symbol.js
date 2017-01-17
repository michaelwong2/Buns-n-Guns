Game.ActiveSymbol = function(template) {
  template = template || {};
  Game.Symbol.call(this, template);
  this.attr._name = template.name || '';

  this._mixins = template.mixins || [];
  this._mixinTracker = {};

  this.loadMixins(this._mixins,template);
};
Game.ActiveSymbol.extend(Game.Symbol);

Game.ActiveSymbol.prototype.hasMixin = function(mixin) {
    if (typeof mixin == 'object') {
      return this._mixinTracker.hasOwnProperty(mixin.META.mixinName);
    } else {
      return this._mixinTracker.hasOwnProperty(mixin);
    }
};

Game.ActiveSymbol.prototype.loadMixins = function(mixinData,template){
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

Game.ActiveSymbol.prototype.getStorable = function(){
  return JSON.stringify(this.attr);
};

Game.ActiveSymbol.prototype.loadSavedState = function(sattr, template){
  this.attr = {};

  for(var i in sattr){
    if(sattr.hasOwnProperty(i))
      this.attr[i] = sattr[i];
  }

  this.loadMixins(template.mixins);
}
