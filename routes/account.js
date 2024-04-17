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
    res.render("account", { user: user });
});

router.get('/myrecipes', async function (req, res, next) {
    const user = req.session.user;
    const recipes = await Recipe.findAll({ where: { username: 'subu' } });
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
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (user !== null) {
        if (password === confirmPassword) {
            try {
                user.password = password;
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

router.get('/admin', function (req, res, next) {
    const user = req.session.user;
    if (req.query.msg) {
        res.locals.msg = req.query.msg
    }
    res.render('admin', { user: user });
});


module.exports = router;