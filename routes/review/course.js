var express = require('express');
var router = express.Router();


function jadeData(req){
    return {
            firstname:req.session.userData.firstname,
            lastname:req.session.userData.lastname,
            student:req.session.userData.studentNumber,
            username:req.session.userData.username
           }
}

router.get('/', function(req, res, next) {
    res.render('review/course',jadeData(req));
});


module.exports = router;