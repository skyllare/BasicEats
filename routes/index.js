const { MY_API_KEY } = require('./config');

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






router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    res.redirect("/?msg=logout")
  }else {
    res.redirect("/")
  }
  
})

router.get('/search_recipes', async function(req, res) {
  const searchValue = req.query.searchValue;
  console.log(searchValue);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${MY_API_KEY}&query=${searchValue}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // res.send(data);
    res.render('recipe-search', { searchData: data, searchValue: searchValue });
    // console.log(data)
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});


module.exports = router;