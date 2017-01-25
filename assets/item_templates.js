Game.ItemTemplates = {};

Game.ItemTemplates.Key = {
  name: 'Key',
  chr:'Y',
  fg:'#dcdcdc',
  mixins:[]
};

Game.ItemTemplates.Carrot = {
  name: 'Carrot',
  chr:'V',
  fg:'#ff8c00',
  description: 'Tasty orange thing that heals 5 HP. Nom nom.',
  mixins:[]
};

Game.ItemTemplates.PeaShooter = {
  name: 'PeaShooter',
  chr:'P',
  fg:'#3cb371',
  description: 'Shoots peas for 5 damages. Peas hurt.',
  equipment: true,
  gun: true,
  mixins:[]
};

Game.ItemTemplates.PotatoPistol = {
  name: 'PotatoPistol',
  chr:'P',
  fg:'#3cb371',
  description: 'Shoots peas for damage. Peas hurt.',
  equipment: true,
  gun: true,
  mixins:[]
};

Game.ItemTemplates.MelonBomb = {
  name: 'MelonBomb',
  chr:'M',
  fg:'#ff6347',
  description: 'Melon seed shrapnels! More juicy than deadly tbh.',
  equipment: true,
  mixins:[]
};

Game.ItemTemplates.Bombkin = {
  name: 'Bombkin',
  chr:'O',
  fg:'#ff6347',
  description: 'Melon seed shrapnels! More juicy than deadly tbh.',
  equipment: true,
  mixins:[]
};

Game.ItemTemplates.Cucumberer = {
  name: 'Cucumberer',
  chr:'C',
  fg:'#006400',
  description: 'Cucumbers hit harder than peas. Also good as detox mask.',
  equipment: true,
  gun: true,
  mixins:[]
};
