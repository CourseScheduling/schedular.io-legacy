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
	var sql	=	'SELECT course.&UNI_course_instant.name,course.&UNI_course_instant.code,course.&UNI_course_instant.tags FROM course.&UNI_course_instant WHERE course.&UNI_course_instant.code LIKE CONCAT(?,"%") OR MATCH(course.&UNI_course_instant.tags) AGAINST(?) LIMIT 50'.replace(/\&UNI/g,req.session.userData.dbName);
	console.log(sql);
	DB.query(sql,[req.query.q,req.query.q],function(e,r,v){
		if(e) throw e;
		console.log(r.length);
		res.send(JSON.stringify(r));
	});
});

router.get('/instructors',function(req,res,next){
	try{
		req.query.names	=	JSON.parse(req.query.names);
	}catch(e){
		return res.send('[]');
	}
	
	var sql	=	('SELECT course.&UNI_teacher_rating.teacherName,course.&UNI_teacher_rating.rating,course.&UNI_teacher_rating.votes FROM course.&UNI_teacher_rating WHERE course.&UNI_teacher_rating.teacherName IN ('+(',?'.repeat(req.query.names.length).substr(1))+')').replace(/\&UNI/g,req.session.userData.dbName);
	console.log(sql);
	
	DB.query(sql,req.query.names,function(e,r){
		if(e) throw e;
		console.log(r.length);
		res.send(JSON.stringify(r));
	});
});

module.exports = router;