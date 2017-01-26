Game.ItemTemplates = {};

Game.ItemTemplates.Key = {
  name: 'Key',
  chr:'Y',
  fg:'#ffd700',
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
  description: 'Shoots peas for 5 damage. Peas hurt.',
  equipment: true,
  gun: true,
  mixins:[]
};

Game.ItemTemplates.PotatoPistol = {
  name: 'PotatoPistol',
  chr:'P',
  fg:'#ffaa 00',
  description: 'Potatoes deal 15 damage. MERCILESSLY.',
  equipment: true,
  gun: true,
  mixins:[]
};

Game.ItemTemplates.MelonBomb = {
  name: 'MelonBomb',
  chr:'M',
  fg:'#ff6347',
  description: 'Melon seed shrapnels deal 7 damage!',
  equipment: true,
  mixins:[]
};

Game.ItemTemplates.Bombkin = {
  name: 'Bombkin',
  chr:'O',
  fg:'#ff6347',
  description: 'Pumpkin explodes into more pumpkins, dealing 7 damage each!',
  equipment: true,
  mixins:[]
};

Game.ItemTemplates.ChiliBomb = {
  name: 'ChiliBomb',
  chr:'C',
  fg:'#f805a2',
  description: 'Quantum-tunneling chili that digs tunnels! Deals 2 damage.',
  equipment: true,
  mixins:[]
};

Game.ItemTemplates.Cucumberer = {
  name: 'Cucumberer',
  chr:'C',
  fg:'#006400',
  description: 'Cucumber bullets deal 8 damage. Also good as detox mask.',
  equipment: true,
  gun: true,
  mixins:[]
};
