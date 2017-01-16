Game.Message = {
  attr:{
    fresh: [],
    stale: [],
    archive: [],
    archiveLimit: 200
  },
  render: function(display){
    display.clear();

    var dispRowMax = display._options.height - 1;
    var dispColMax = display._options.width - 2;
    var dispRow = 0;
    var freshMsgIdx = 0;
    var staleMsgIdx = 0;
    // fresh messages in white
    for (freshMsgIdx = 0; freshMsgIdx < this.attr.fresh.length && dispRow < dispRowMax; freshMsgIdx++) {
      dispRow += display.drawText(1,dispRow,'%c{#fff}%b{#000}'+this.attr.fresh[freshMsgIdx]+'%c{}%b{}',79);
    }
    // stale messages in grey
    for (staleMsgIdx = 0; staleMsgIdx < this.attr.stale.length && dispRow < dispRowMax; staleMsgIdx++) {
      dispRow += display.drawText(1,dispRow,'%c{#aaa}%b{#000}'+this.attr.fresh[staleMsgIdx]+'%c{}%b{}',79);
    }
  },
  age: function(lastStaleMessageIdx){
     if (this.attr.stale.length > 0) {
       this.attr.archive.unshift(this.attr.stale.pop());
     }
     // archive any additional stale messages that didn't get shown
     while (this.attr.stale.length > lastStaleMessageIdx) {
       this.attr.archive.unshift(this.attr.stale.pop());
     }
     // just dump messages that are too old for the archive
     while (this.attr.stale.length > this.attr.archiveLimit) {
       this.attr.archive.pop();
     }
     // move fresh messages to stale messages
     while (this.attr.fresh.length > 0) {
       this.attr.stale.unshift(this.attr.fresh.shift());
     }
  },
  send: function(msg){
    this.set(msg);
    this.render(Game.getDisplay("message"));
  },
  set: function(msg){
    this.attr.fresh.push(msg);
  },
  clear: function(){
    this.attr.fresh = [];
    this.attr.stale = [];
  },
  getArchive: function(){
    return this.attr.archive;
  }
}
