var express = require('express');
var router = express.Router();

var DB      =   require('../bin/db');
var fs	=	require('fs');

router.use(function(req,res,next){
    if(req.session.loggedIn == true)
			next();
    else
			res.send('{comment:"Hah, nice try, this will only work if you are logged in."}');
    
	return;
})


router.get('/course', function(req, res, next) {
	req.query.q	=	req.query.q.toLowerCase();
	if(req.query.q.match(/\d/g)!==null)
		req.query.q=req.query.q.replace(/\s/,'');
	var sql	=	'SELECT &DB.course_instant.name,&DB.course_instant.code FROM &DB.course_instant WHERE &DB.course_instant.code LIKE CONCAT(?,"%") LIMIT 5'.replace(/\&DB/g,req.session.userData.dbName);
	DB.query(sql,[req.query.q],function(e,r,v){
		if(e) throw e;
		res.send(JSON.stringify(r));
	});
});


module.exports = router;