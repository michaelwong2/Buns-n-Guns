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
        newMob[0] = {name: 'Bun', no: 0};
        newMob[1] = {name: 'MeleeBunny', no: 0};
        newMob[2] = {name: 'ShooterBunny', no: 0};
        break;
      case 2:
        newMob[0] = {name: 'Bun', no: 0};
        newMob[1] = {name: 'MeleeBunny', no: 2};
        newMob[2] = {name: 'ShooterBunny', no: 3};
        break;
      case 3:
        newMob[0] = {name: 'Bun', no: 0};
        newMob[1] = {name: 'MeleeBunny', no: 2};
        newMob[2] = {name: 'ShooterBunny', no: 3};
        break;
      case 4:
        newMob[0] = {name: 'Bun', no: 0};
        newMob[1] = {name: 'MeleeBunny', no: 8};
        newMob[2] = {name: 'ShooterBunny', no: 6};
        break;
      case 5:
        newMob[0] = {name: 'Bun', no: 0};
        newMob[1] = {name: 'MeleeBunny', no: 15};
        newMob[2] = {name: 'ShooterBunny', no: 8};
        break;
      default:
    }
    return newMob;
  }
}
