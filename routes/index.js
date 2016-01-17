var express = require('express');
var router = express.Router();

router.use(function(req,res,next){
    //console.log(req.session);
    if(req.session.loggedIn == true)
        res.redirect('/s');
    else
        next();
    
    return;
})

router.get('/', function(req, res, next) {
    res.render('home');
});
router.get('/contact',function(req,res,next){
    res.render('contact');
});
router.get('/invite',function(req,res,next){
    res.render('invite');
});


module.exports = router;