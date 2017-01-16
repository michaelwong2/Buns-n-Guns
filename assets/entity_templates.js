Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'Avatar',
  chr:'@',
  fg:'#00f',
  mixins:[Game.EntityMixin.WalkerCorporeal, Game.EntityMixin.Chronicle],
};

Game.EntityTemplates.Cat = {
  name: 'Cat',
  chr:'&',
  fg:'#f00',
  mixins:[]
}
