var express =   require('express');
var router  =   express.Router();

var crypto  =   require('crypto');
var mysql   =   require('mysql');

var DB      =   require('../../bin/db.js');


var CORE    =   {
    validate:{},
    user:{},
    session:{}
}

/*
    Validate, anything that involves validating inputs    
*/

CORE.validate   =   function(username,password,cb){
    var searchSQL   =   'SELECT userId,password FROM userlogin WHERE(username=?)';   
    DB.query(searchSQL,[username],function(err,result){
        //return if user does not exist 
        if(result.length==0)
            return cb&&cb(false,'BAD_USERNAME');
        //get the hash of the inputted password
        var hash    =   crypto.createHash('sha512').update(result[0].password.slice(0,10)+p).digest('base64');
        //compare the newhash to the dbhash
        if(hash===result[0].password.substr(10)){
            result[0].username = username;
            cb&&cb(true,result[0]);
        }else{
            cb&&cb(false,'WRONG_PASSWORD');
        }

    });
}

/*
    Session, anything involving adding stuff and taking stuff away from sessions
*/

CORE.session = {
    addData:function(req,data,cb){
        req.session.userData    =   data;
        req.session.loggedIn    =   true;
        req.session.save(function(e){
            cb&&cb();
        });
    }
}

router.post('/',function(req,res,next){
    req.body.u  =   req.body.u.toLowerCase();
    CORE.validate(req.body.u,req.body.p,function(good,reason){
        if(!good){
            res.send([reason]);
            return;
        }
        
        UserMod.grabUser(reason,function(data){
            SessionMod.addData(req,data,function(){
                res.send(['SUCCESS']);
            });
        });
    });
});




module.exports  =   router;
