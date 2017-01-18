Game.Message = {
  attr:{
    messages: [],
  },
  render: function(display){

    if(this.attr.messages.length == 0)
      return;

    display.clear();
    display.drawText(1,1, this.attr.messages[this.attr.messages.length-1]);
  },
  send: function(msg){
    this.set(msg);
    this.render(Game.getDisplay("message"));
  },
  set: function(msg){
    this.attr.messages.push(msg);
  },
  clear: function(){
    this.attr.messages = [];
  }
}
