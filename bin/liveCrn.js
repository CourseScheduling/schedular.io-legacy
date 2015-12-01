var Mem = require('memcached');
//var mem =   new memcached('schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211');
var memServer=new Mem('127.0.0.1:11211');
//Variables for CRN and memcached
var memCRNUpdateKey =   "current_course_data_date";
var CRNPrefix   =   "crn_";

var app =   {
    timeOut:{},
    init:{},
    pushSockets:{}
};

app.init   =   function(){
    
    // Create a global socket object.
    global.sockets          =   {};
    global.fillData         =   {};
    
    global.lastUpdateCRN    =   Date.now();
    var timeOutTime =   {}
    
    // Grab the last update time.
    memServer.get(memCRNUpdateKey,function(e,data){
        //Set the lastUpdate variable
        global.lastUpdateCRN    =   data;
        //Set the timeout function to go off after 10min since last update on memcached side.
        setTimeout(app.timeOut,(60000+Date.now())-data);
    });
};

app.timeOut =   function(){
    memServer.get(memCRNUpdateKey,function(e,data){
        //GRAB ALL CRNS and store in fillData
        
        memcached.getMulti(CRNarray, function (err, data) {
            //Populate the global fillData object with crns and their corresponding data.
            for(var crn in data){
                global.fillData[crn.substr(CRNPrefix.length)]   =   data[crn];
            }
            app.pushSockets();
        });
    });
    setTimeout(app.timeOut,60000);
}

app.pushSockets =   function(){


};





module.exports  =   app;