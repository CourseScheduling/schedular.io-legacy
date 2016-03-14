var express = require('express');
var router = express.Router();

var DB	=	require('../../bin/db.js');
var mongo	=	require('../../bin/mongo.js');





router.use(function(req,res,next){
    if(req.session.loggedIn !== true)
        res.redirect('/');
    else
        next();
    return;
});

router.get('/',function(req,res){
	res.render('main/create',jadeData(req));
});


router.get('/show',function(req,res){
	
	var courses	=	(req.query.c||"").split('|');
	if((courses[0]==""&&courses.length==1)||!req.query.c||!req.query.t)
		return res.redirect('/');
	
	mongo.get(req.session.userData.dbName+'Course').find({title:{$in:courses},term:parseInt(req.query.t),year:req.query.y},function(err,docs){
		if(err) throw err
		var data	=	jadeData(req);
		data.data	=	docs;
		res.render('main/show',data);
	});
});

router.get('/getTeacher',function(req,res){
	res.send('[]');
});






function jadeData(req){
	return {
		firstname:req.session.userData.firstname,
		lastname:req.session.userData.lastname,
		student:req.session.userData.studentNumber,
		username:req.session.userData.username
	 }
}



module.exports = router;

