var express = require('express');
var router = express.Router();

router.use(function(req,res,next){
    //console.log(req.session);
    if(req.session.loggedIn == true)
        res.redirect('/s');
    else
        res.send('{comment:"Hah, nice try, this will only work if you are logged in."}');
    return;
})

router.get('/', function(req, res, next) {
    res.render('home');
});
router.get('/contact',function(req,res,next){
    res.render('contact');
});


module.exports = router;