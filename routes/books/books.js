var express = require('express');
var router = express.Router();

var mongo	=	require('../../bin/mongo');

router.use(function(req,res,next){
    //console.log(req.session);
    if(req.session.loggedIn !== true)
        res.redirect('/');
    else
        next();
    return;
});



router.get('/', function(req, res, next) {
	var courses	=	(req.query.c||"").split('|');
	if((courses[0]==""&&courses.length==1)||!req.query.c||!req.query.t)
		return res.redirect('/');
	
	mongo.get(req.session.userData.dbName+'Course').find({title:{$in:courses},term:parseInt(req.query.t),year:req.query.y},function(err,docs){
		var data	=	jadeData(req);
		data.data	=	docs;
		res.render('books/index',{data:data});
	});
	
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