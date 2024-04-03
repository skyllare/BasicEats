var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('index');
});

router.get('/login', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('login');
});

router.get('/calendar', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('calendar');
});

router.get('/aboutus', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('aboutus');
});

router.get('/recipe-search', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('recipe-search');
});

router.get('/recipe', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('recipe');
});

router.get('/view-user', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('view-user');
});

router.post('/login', async function(req, res, next) {
  //console.log(req.body.username+" - "+req.body.password);
  console.log("login post")
  console.log(req.body.username)
  const user = await User.findUser(req.body.username, req.body.password)
  if(user!== null){
    req.session.user = user
    res.redirect("/")
    console.log("user found")
  }else{
    console.log("user not found")
   // res.redirect("/login");
    res.locals.msg = "fail";
    res.render('login');
  }
});

router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    res.redirect("/?msg=logout")
  }else {
    res.redirect("/")
  }
  
})

module.exports = router;