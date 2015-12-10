var express =   require('express');
var router  =   express.Router();

var crypto  =   require('crypto');
var mysql   =   require('mysql');

var DB      =   require('../../bin/db.js');


var CORE    =   {
    validate:{},
    user:{
        getUser:{}
    },
    session:{}
}

/*
    Validate, anything that involves validating inputs    
*/

CORE.validate   =   (function(CORE){
    
    return function(username,password,cb){
        var searchSQL   =   'SELECT userId,active,password FROM userlogin WHERE(username=?)';   
        DB.query(searchSQL,[username],function(err,result){
            //return if user does not exist 
            if(result.length==0)
                return cb&&cb(false,'BAD_USERNAME');
            //get the hash of the inputted password
            var hash    =   crypto.createHash('sha512').update(result[0].password.slice(0,10)+password).digest('base64');
            //compare the newhash to the dbhash
            if(hash===result[0].password.substr(10)){

                //See how active the account is.             
                switch(result[0].active){
                    case -1:
                    case 0:
                        cb&&cb(false,'ACTIVATION_NEEDED |'+username);
                    break;
                    case 1:
                        result[0].username = username;
                        cb&&cb(true,result[0]);
                    break;
                }

            }else{
                cb&&cb(false,'WRONG_PASSWORD');
            }

        });
    }
})(CORE);

/*

    User, anything with retrieving user info
    
*/

CORE.user.getUser   =   (function(CORE){
    return function(userId,cb){
        var searchSQL   =   'SELECT id,studentNumber,firstname,lastname,title,accountType FROM user WHERE id=?'
        DB.query(searchSQL,userId,function(err,results){
            cb&&cb(results);
        });
    }
})(CORE);


/*
    Session, anything involving adding stuff and taking stuff away from sessions
*/



CORE.session = (function(CORE){
    return {
        set:function(req,data,cb){
            req.session.userData    =   data;
            req.session.loggedIn    =   true;
            req.session.save(function(e){
                cb&&cb();
            });
        }
    }
})(CORE);

/*
    Routes, now here comes the main part of our program
*/


router.post('/',function(req,res,next){
    //convert username to lowercase
    req.body.u  =   req.body.u.toLowerCase();
    CORE.validate(req.body.u,req.body.p,function(good,data){
        //If the function called the callback with a false first parameter tell the user the reason.
        if(!good){
            res.send([data]);
            return;   
        }
        
        //Get the userdata
        CORE.user.getUser(data.userId,function(data){
            //add username to the data
            data.username   = req.body.u;
            CORE.session.set(req,data,function(){
                res.send('["SUCCESS"]');
            });
        }); 
    });
});




module.exports  =   router;
