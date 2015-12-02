var Mem = require('memcached');
//var mem =   new memcached('schedular.luawsd.cfg.usw2.cache.amazonaws.com:11211');
var memServer=new Mem('127.0.0.1:11211');
//Variables for CRN and memcached
var CRN_UPDATE_KEY  =   "courseDataDate";
var CRN_PREFIX   =   "crn_";
var CRN_ARRAY    =   [];

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
    memServer.get(CRN_UPDATE_KEY,function(e,data){
        //Set the lastUpdate variable
        global.lastUpdateCRN    =   parseInt(Date.now()/1000)-parseInt(data.substr(1));
        //Set the timeout function to go off after 10min since last update on memcached side.
        setTimeout(app.timeOut,(60000+Date.now())-data);
    });
};

app.timeOut =   function(){
    memServer.get(CRN_UPDATE_KEY,function(e,data){
        //GRAB ALL CRNS and store in fillData
        
        memServer.getMulti(CRN_ARRAY, function (err, data) {
            //Populate the global fillData object with crns and their corresponding data.
            for(var crn in data){
                global.fillData[crn.substr(CRN_PREFIX.length)]   =   data[crn];
            }
            app.pushSockets();
        });
    });
    //Do this again in 10 minutes
    setTimeout(app.timeOut,60000);
};

app.pushSockets =   function(){
    // Go through all the sockets
    for(var socketId in global.sockets){
        // Make an array for CRN data
        crnData =   [];
        global.sockets[socketId].crns.forEach(function(crn,index,array){
            //push all the necessary crn data to the array
            crnJSON.push(crn);
        });
        //Push that data to the socket
        global.sockets[socketId].socket.emit(courseData,crnJSON);
    }

};





module.exports  =   app;