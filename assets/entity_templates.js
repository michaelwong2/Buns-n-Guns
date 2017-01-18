Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#bbc',
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle, Game.EntityMixin.InventoryHolder],
};

Game.EntityTemplates.Cat = {
  name: 'Cat',
  chr:'&',
  fg:'#f00',
  mixins:[]
}

Game.EntityTemplates.Dog = {
  name: 'Dog',
  chr:'$',
  fg:'#f00',
  mixins:[]
}
