var express =   require('express');
var router  =   express.Router();

var crypto  =   require('crypto');
var mysql   =   require('mysql');

var DB      =   require('../../bin/db.js');

var Login;



router.post('/',function(req,res,next){
    //convert username to lowercase
    req.body.u  =   req.body.u.toLowerCase();
    Login.validate(req.body.u,req.body.p,function(good,data){
        //If the function called the callback with a false first parameter tell the user the reason.
        if(!good){
            res.send([data]);
            return;   
        }
        
        //Get the userdata
        Login.getUser(data.userId,function(data){
            //add username to the data
						console.log(data);
            data.username   = req.body.u;
            Login.setUser(req,data,function(){
                res.send('["SUCCESS"]');
            });
        }); 
    });
});



var Login    =   (function(){
    /*
        Validate, anything that involves validating inputs    
    */
    function validate(username,password,cb){
			
        var searchSQL   =   'SELECT userId,active,password FROM user.userlogin WHERE(username=?)';   
        DB.query(searchSQL,[username],function(err,result){
					if(err) throw err;
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
    function getUser(userId,cb){
				//Gotta love joins
        var searchSQL   =   'SELECT terms.term,terms.year,uni.dbName,user.* FROM general.university_terms terms JOIN general.university uni JOIN user.user user ON uni.id=terms.universityId=user.universityId WHERE user.id=?'
        DB.query(searchSQL,userId,function(err,results){
					if(err) throw err;
            cb&&cb(results[0]);
        });
    }
    function setSession(req,data,cb){
        req.session.userData    =   data;
        req.session.loggedIn    =   true;
        req.session.save(function(e){
            cb&&cb();
        });
    }
    return {
        validate:validate,
        getUser:getUser,
        setUser:setSession
    }
})();




module.exports  =   router;
