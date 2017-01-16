Game.util = {

  randomString: function (len) {
    var charSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    var res='';
    for (var i=0; i<len; i++) {
        res += charSource.random();
    }
    return res;
  },

  init2DArray: function(x, y, initv){
    var array = [];

    for(var i = 0; i < x; i++){
      array[i] = [];
      for(var j = 0; j < y; j++){
        array[i][j] = initv;
      }
    }

    return array;
  },
  ID_SEQUENCE: 0,
  uniqueId: function() {
     Game.util.ID_SEQUENCE++;
     return Date.now()+'-'+Game.util.ID_SEQUENCE+'-'+Game.util.randomString(24);
  }

};
