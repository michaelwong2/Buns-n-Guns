Game.util = {

  randomString: function (len) {
    var charSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    var res='';
    for (var i=0; i<len; i++) {
        res += charSource[Math.floor(Math.random() * charSource.length-1)];
    }
    // console.log(res);
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
  },

  liesOnCorners: function(x,y,w,h){
    if(x == 0 && y == 0){
      return true;
    }else if(x == 1 && y == 0){
      return true;
    }else if(x == 0 && y == 1){
      return true;
    }else if(x == 0 && y == h-1){
      return true;
    }else if(x == 0 && y == h-2){
      return true;
    }else if(x == 1 && y == h-1){
      return true;
    }else if(x == w-1 && y == 0){
      return true;
    }else if(x == w-2 && y == 0){
      return true;
    }else if(x == w-1 && y == 1){
      return true;
    }else if(x == w-1 && y == h-2){
      return true;
    }else if(x == w-1 && y == h-1){
      return true;
    }else if(x == w-1 && y == h-2){
      return true;
    }else{
      return false;
    }
  },

  outOfBounds(x,y,bx,by){
    return x <= 0 || x >= bx - 1 || y <= 0 || y >= by-1;
  }

};
