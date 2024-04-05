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

router.get('/signup', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('signup');
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

router.get('/view-users', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('view-users');
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

router.post('/create', async function(req, res, next) {
  try {
    await User.create(
      {
        username: req.body.username,
        password: req.body.password
      }
  )
  res.redirect("/");
  console.log("user created");
  } catch (error) {
    console.log("user could not be created");
    // res.redirect("/login");
    res.locals.msg = "fail";
    res.render('signup');  
  }
});

// router.post('/create', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const newComment = await User.create({ username, password });
//     res.redirect("/")
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    res.redirect("/?msg=logout")
  }else {
    res.redirect("/")
  }
  
})

module.exports = router;