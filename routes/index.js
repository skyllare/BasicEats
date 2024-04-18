const { MY_API_KEY } = require('./config');

var express = require('express');
const User = require('../models/User');
const Saved_Recipe = require('../models/Saved_Recipe');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render("index", { msg: undefined })
});

router.get('/login', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render('login');
});

router.get('/signup', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render('signup');
});



router.get('/aboutus', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render('aboutus');
});

router.get('/recipe-search', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render('recipe-search');
});

router.get('/recipe', function (req, res, next) {
  if (req.query.msg) {
    res.locals.msg = req.query.msg
  }
  res.render('recipe');
});

router.post('/login', async function (req, res, next) {
  //console.log(req.body.username+" - "+req.body.password);
  console.log("login post")
  console.log(req.body.username)
  const user = await User.findUser(req.body.username, req.body.password)
  if (user !== null) {
    req.session.user = {
      username: user.username,
      password: user.password,
      admin: user.admin,
      recipe_count: user.recipe_count,
    };

    res.locals.msg = "login_success";
    res.render("index", { msg: res.locals.msg })
    console.log("user = " + req.session.user)
    console.log("user found")
  } else {
    console.log("user not found")
    res.locals.msg = "fail";
    res.render('login');
  }
});

router.post('/create', async function (req, res, next) {
  try {
    await User.create(
      {
        username: req.body.username,
        password: req.body.password,
        admin: false,
        recipe_count: 0
      }
    )
    res.locals.msg = "signup_success";
    res.render('login');
    console.log("user created");
  } catch (error) {
    console.log("user could not be created");
    // res.redirect("/login");
    res.locals.msg = "signup_fail";
    res.render('signup');
  }
});


router.get('/logout', function (req, res, next) {
  if (req.session.user) {
    req.session.destroy()
    res.redirect("/?msg=logout")
  } else {
    res.redirect("/")
  }
})

router.get('/search_recipes', async function (req, res) {
  const searchValue = req.query.searchValue;
  console.log(searchValue);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${MY_API_KEY}&query=${searchValue}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    // res.send(data);
    res.render('recipe-search', { searchData: data, searchValue: searchValue });
    // console.log(data)
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});

router.get('/recipe_by_id', async function (req, res) {
  const ID = req.query.ID;
  console.log(ID);
  const url = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=${MY_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    // res.send(data);
    res.render('recipe', { data: data });
    // 
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});

router.get('/recipe_by_meal_type', async function (req, res) {
  const meal = req.query.type_button;
  console.log(meal);
  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${MY_API_KEY}&type=${meal}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    // res.send(data);
    res.render('recipe-search', { searchData: data, searchValue: meal });
    // 
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});

router.post('/id_to_database', async function (req, res) {
  const ID = req.body.recipe_save;
  if (req.session.user)  {
    const username = req.session.user.username
    try {
      await Saved_Recipe.create(
        {
          recipeid: ID,
          username: username
        }
      )
      res.locals.msg = "saved_success";
      res.render("index", { msg: res.locals.msg })
      console.log("recipe saved");
    } catch (error) {
      console.log("recipe could not be saved");
    }
  }
  else{
    res.locals.msg = "saved_no_success";
      res.render("index", { msg: res.locals.msg })
  }
});

router.get('/saved_recipes', async function (req, res) {
  try {
    const recipes = await Saved_Recipe.getAllRecipes()
    res.render('saved-recipes', { recipes: recipes});
    // console.log(data)
  } catch (err) {
    res.status(500).send("Error fetching data from API");
  }
});

module.exports = router;