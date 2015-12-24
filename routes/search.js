var express = require('express');
var router = express.Router();

var connection = require('../bin/db.js');

function jadeData(req){
    return {
            firstname:req.session.userData.firstname,
            lastname:req.session.userData.lastname,
            student:req.session.userData.studentNumber,
            username:req.session.userData.username
           }
}


router.use(function(req,res,next){
    if(req.session.loggedIn !== true)
        res.redirect('/');
    else
        next();
    return;
})


router.get('/get', function(req, res, next) {
    
    
    connection.query('SELECT * FROM instant WHERE ( MATCH (courseName) AGAINST ("?") OR courseCode LIKE CONCAT(?,"%") OR courseName LIKE CONCAT(?,"%") OR  courseCode LIKE CONCAT(?,"%") ) GROUP BY(courseCode) LIMIT 5',[req.query.courseInput, req.query.courseInput, req.query.courseInput, req.query.courseInput.replace(' ','')],function(err, rows, fields) {
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
    if(courseCodes.length>15){
        res.redirect('/s');
        return;
    }
    var queryString =   'SELECT time.startTime,time.endTime,time.days,time.instructor,courses.section,courses.subject,courses.code,courses.campus,courses.CRN FROM time INNER JOIN courses ON courses.id=time.courseId WHERE (courses.status="Open" AND (';
    var queryData   =   []; 
    courseCodes.forEach(function(v,i,a){
        queryString+='(courses.subject=? AND courses.code=?) OR';
        queryData.push(v[0],v[1]);
    });
    queryString=queryString.slice(0,-2);
    queryString+='))';
    connection.query(queryString,queryData,function(err,rows,fields){
        if(err) throw err;
        var jData    =   jadeData(req);
        jData.courseData =   rows;
        /* 
        
            Okay, this section is important.
            Here we're going to update the user session to include an array of all the CRNs he may need, we're going to add him to the socket list with the CRN array and then we'll push all necessary data to him
            
        */
        var crnMap  =   {};
        var crnArray    =   [];
        var crnData    =   [];
        rows.forEach(function(v,i,a){
            crnMap[v.CRN]   =   1;
        });
        for(var crn in crnMap){
            crnData.push([crn,fillData[crn]]);
            crnArray.push(crn);
        }
        req.io.on('connection',function(socket){
            global.sockets[socket.id]   =   {
                socket:socket,
                crns:crnArray
            };
            socket.emit('crnData',crnData);
            socket.on('disconnect',function(){
                delete global.sockets[socket.id];
            });
        });
        
        
        /* Important section ends here */
        
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
    
    if(crns.length>15){
        res.send('');
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
    var questionMarks   =   Array(crns.length+1).join("?,").slice(0,-1);
    var queryString = "SELECT time.startTime,time.endTime,time.days,time.instructor,courses.section,courses.subject,courses.code,courses.campus,courses.CRN FROM time INNER JOIN courses ON courses.id=time.courseId WHERE concat(courses.subject,courses.code) IN (SELECT concat(courses.subject,courses.code) as courseName FROM courses WHERE courses.CRN IN("+questionMarks+"))";
    connection.query(queryString,crns,function(err,rows,fields){
        if (err) throw err;
        res.send(rows);
    });
    
    
    
});


module.exports = router;

