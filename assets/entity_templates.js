Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#00f',
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.InventoryHolder],
};

Game.EntityTemplates.Cat = {
  name: 'Cat',
  chr:'&',
  fg:'#f00',
  mixins:[],
  loopingChars: {
    wait: 0,
    lim: 100
  },
  work: function(){
    // this.attr._x++;
  }
}

Game.EntityTemplates.Dog = {
  name: 'Dog',
  chr:'$',
  fg:'#f00',
  mixins:[]
}
