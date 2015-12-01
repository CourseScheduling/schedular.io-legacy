var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'schedule.cpfi2ocm03x0.us-west-2.rds.amazonaws.com',
  user     : 'joseph',
  password : 'joseph123',
  database : 'ufv'
});

function jadeData(req){
    return {
            firstname:req.session.userData.firstname,
            lastname:req.session.userData.lastname,
            student:req.session.userData.studentNumber
           }
}

connection.connect();


router.use(function(req,res,next){
    if(req.session.loggedIn !== true)
        res.redirect('/');
    else
        next();
    return;
})

router.get('/get', function(req, res, next) {
    
    
    connection.query('SELECT * FROM instant WHERE ( MATCH (courseName) AGAINST ("?") OR courseCode LIKE CONCAT(?,"%") OR courseName LIKE CONCAT(?,"%") OR  courseCode LIKE CONCAT(?,"%") ) GROUP BY(courseCode) LIMIT 8',[req.query.courseInput, req.query.courseInput, req.query.courseInput, req.query.courseInput.replace(' ','')],function(err, rows, fields) {
        if(err) throw(err);
        res.send(JSON.stringify(rows));
        return;
    });
    
});
router.get('/',function(req,res){
    res.render('main/create',jadeData(req));
})
router.get('/builder',function(req,res){
    res.render('main/builder',jadeData(req));
})

router.get('/show',function(req,res){
    try{
        var courseCodes = JSON.parse(req.query.c);
    }catch(e){
        res.redirect('/s');
    }
    var queryString =   'SELECT time.startTime,time.endTime,time.days,time.instructor,courses.section,courses.subject,courses.code,courses.campus,courses.CRN FROM time INNER JOIN courses ON courses.id=time.courseId WHERE (courses.status="Open" AND (';
    var queryData   =   []; 
    courseCodes.forEach(function(v,i,a){
        queryString+='(courses.subject=? AND courses.code=?) OR';
        queryData.push(v[0],v[1]);
    });
    queryString=queryString.slice(0,-2);
    queryString+='))';
    console.log(queryString);
    connection.query(queryString,queryData,function(err,rows,fields){
        if(err) throw err;
        var jData    =   jadeData(req);
        jData.courseData =   rows;
        console.log(jadeData);
        res.render('main/show',jData);                 
    });
});
router.get('/getTeacher',function(req,res){
    try{
        var teachers = JSON.parse(req.query.teachers);
    }catch(e){
        res.redirect('/s');
    }
    var queryString =   'SELECT * FROM teacher WHERE ';
    var queryData   =   []; 
    teachers.forEach(function(v,i,a){
        queryString+=' teacherName=? OR';
        queryData.push(v);
    });
    queryString=queryString.slice(0,-2);
    
    connection.query(queryString,queryData,function(err,rows,fields){
        if(err) throw(err);
        res.send(rows);           
    });
});

router.get('/fetch',function(req,res){
    try{
        var crns = JSON.parse(req.query.crns);
    }catch(e){
        res.setHeader('FOR-HACKERS','Nice try, you\'re just a script-kiddie Or, you just entered something wrong, whoops.');
        res.send('[]');
        return;
    }
    //Check if every crn is 5 digits long and only contains numbers
    if(!crns.every(function(v){
        return (!isNaN(v)&&v.toString().length==5)
    })){
        res.setHeader('FOR-HACKERS','Nice try, you\'re just a script-kiddie. Or, you just entered something wrong, whoops.');
        res.send('[]');
        return;
    }
    
    
    //Alright, find all the crns... I <3 SQL
    
    var queryString = "SELECT time.startTime,time.endTime,time.days,time.instructor,courses.section,courses.subject,courses.code,courses.campus,courses.CRN FROM time INNER JOIN courses ON courses.id=time.courseId WHERE concat(courses.subject,courses.code) IN (SELECT concat(courses.subject,courses.code) as courseName FROM courses WHERE courses.CRN IN(?))";
    console.log(crns.join(','));
    connection.query(queryString,crns.join(','),function(err,rows,fields){
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
    
    
    
});


module.exports = router;

