var express = require('express');
var router = express.Router();

var shortid	=		require('shortid');
var DB      =   require('../../bin/db');

router.get('/',function(req,res,next){
	res.render('main/build',jadeData(req));
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