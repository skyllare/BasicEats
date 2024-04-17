const { MY_API_KEY } = require('./config');
var express = require('express');
const User = require('../models/User');
var router = express.Router();


router.get('/', async function (req, res, next) {
    const user = req.session.user;
    console.log(user)

    // If user is not logged in, redirect to login page
    if (!user) {
        return res.redirect('/login');
    }

    if (req.query.msg) {
        res.locals.msg = req.query.msg
    }
    res.render('account');
});

router.get('/change_password', async function (req, res, next) {
    console.log("test")
    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }
    res.render('change_password');
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
                console.log("TESTS")
                console.log(user)
                res.render('account');

            } catch (error) {
                console.error("Error updating password:", error);
                res.locals.msg = "update_error";
                res.render('change_password');
            }
        } else {
            console.log("Passwords do not match");
            res.locals.msg = "matchfail";
            res.render('change_password');
        }
    } else {
        console.log("user not found")
        res.locals.msg = "fail";
        res.redirect('/');
    }
});


module.exports = router;