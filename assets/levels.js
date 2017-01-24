Game.Levels = {
  attr:{
    width: 15,
    height: 15,
    mob: []
  },

  //map size is arithmetic series*10
  update: function(level) {
    this.attr.width += (level * 10);
    this.attr.height += (level * 10);
    this.attr.mob = this.changeMob(level);
    Game.Exit.changeLockSize(level);
  },

  getWidth: function() {
    return this.attr.width;
  },

  getHeight: function() {
    return this.attr.height;
  },

  getMob: function() {
    return this.attr.mob;
  },

  changeMob(level) {
    var newMob = [];
    switch(level){
      case 1:
        newMob[0] = {name: 'Bun', no: 2};
        newMob[1] = {name: 'MeleeBunny', no: 1};
        break;
      case 2:
        newMob[0] = {name: 'Bun', no: 5};
        newMob[1] = {name: 'MeleeBunny', no: 2};
        break;
      case 3:
        break;
      default:
    }
    return newMob;
  }
}
