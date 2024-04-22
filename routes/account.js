const { MY_API_KEY } = require('./config');
var express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
var router = express.Router();


router.get('/', async function (req, res, next) {
    const user = req.session.user;
    console.log(user)

    // If user is not logged in, redirect to login page
    if (!user) {
        return res.redirect('/login');
    }

    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }

    const recipes = await Recipe.findAll({ where: { username: user.username } });
    const count = recipes.length;
    user.recipe_count = count;

    res.render("account", { user: user });
});

router.get('/myrecipes', async function (req, res, next) {
    const user = req.session.user;
    const recipes = await Recipe.findAll({ where: { username: user.username } });
    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }

    res.render("myrecipes", { user: user, recipes: recipes });
});


router.get('/change_password', async function (req, res, next) {
    const user = req.session.user;
    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }
    res.render("change_password", { user: user });
});

router.post('/change_password', async function (req, res, next) {
    const user = req.session.user;
    const new_password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (user !== null) {
        if (new_password === confirmPassword) {
            try {
                const findUser= await User.findOne({
                    where: {
                      username: user.username
                    }
                  });
                findUser.password= new_password;
                await findUser.save(); 
                user.password = new_password;
                console.log("Password changed successfully");
                res.locals.msg = "password_success";
                console.log(user)
                res.render("account", { user: user });

            } catch (error) {
                console.error("Error updating password:", error);
                res.locals.msg = "update_error";
                res.render("change_password", { user: user });
            }
        } else {
            console.log("Passwords do not match");
            res.locals.msg = "matchfail";
            res.render("change_password", { user: user });
        }
    } else {
        console.log("user not found")
        res.locals.msg = "fail";
        res.redirect('/');
    }
});

router.get('/saved-recipes', function (req, res, next) {
    const user = req.session.user;
    if (req.query.msg) {
        res.locals.msg = req.query.msg
    }
    res.render('saved-recipes', { user: user });
});

router.get('/admin', async function (req, res, next) {
    const user = req.session.user;
    const recipes = await Recipe.findAll();
    if (req.query.msg) {
        res.locals.msg = req.query.msg
    }

    console.log(user)

    // If user is not logged in, redirect to login page
    if (!user || user.admin == false) {
        return res.redirect('/login');
    }

    res.render('admin', { user: user, recipes:recipes });
});

router.post('/create', async function (req, res, next) {
    const user = req.session.user;
    try {
      await Recipe.create(
        {
          username: user.username,
          recipename: req.body.recipename,
          ingredients: req.body.ingredients,
          recipedesc: req.body.recipedesc,
          instructions: req.body.instructions,
          time: req.body.minutes,
          servings: req.body.servings
        }
      )
    //   user.recipe_count = user.recipe_count + 1;
        const recipes = await Recipe.findAll({ where: { username: user.username } });
      res.locals.msg = "addrecipe_success";
      res.render('myrecipes', {user: user, recipes: recipes} );
      console.log("recipe added");

    } catch (error) {
      const recipes = await Recipe.findAll({ where: { username: user.username } });
      console.log("recipe could not be added");
      res.locals.msg = "addrecipe_fail";
      res.render('myrecipes', {user: user, recipes: recipes} );
    }
  });

  
module.exports = router;