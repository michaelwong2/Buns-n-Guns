Game.Message = {
  attr:{
    messages: []
  },
  render: function(display){
    display.clear();
    display.drawText(1,1, ":)");
  },
  send: function(msg){
    this.set(msg);
    this.render(Game.getDisplay("message"));
  },
  set: function(msg){
    this.attr.messages.shift(msg);
  },
  clear: function(){
    this.attr.messages = [];
  }
}
