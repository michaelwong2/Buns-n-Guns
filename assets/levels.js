Game.Levels = {
  attr:{
    width: 0,
    height: 0,
    mob: []
  },

  //map size is arithmetic series*10
  update: function(level) {
    this.attr.width = 15 + (level * 10);
    this.attr.height = 15 + (level * 10);
    console.log('map dimension:');
    console.log(this.attr.width + this.attr.height);
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
        break;
      default:
    }
    return newMob;
  }
}
