var Mem = require('memcached');
//var mem =   new memcached('schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211');
var memServer=new Mem('127.0.0.1:11211');
var memCRNUpdateKey =   "CRN_UPDATE_KEY";

var app =   {
    timeOut:{},
    start:{}
};

app.init   =   function(){
    
    // Create a global socket object.
    global.sockets          =   {};
    global.fillData         =   {};
    
    global.lastUpdateCRN    =   Date.now();
    var timeOutTime =   {}
    
    // Grab the last update time.
    memServer.get(memCRNUpdateKey,function(e,data){
        global.lastUpdateCRN    =   data;
    });
};

app.timeOut =   function(){
    memServer.get(memCRNUpdateKey,function(e,data){
        if(data
    });
}





module.exports  =   app;