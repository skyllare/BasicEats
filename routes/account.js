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
    res.render('account', { admin: req.session.user.admin });
});

router.get('/change_password', async function (req, res, next) {
    console.log("test")
    if (req.query.msg) {
        res.locals.msg = req.query.msg;
    }
    res.render('change_password', { admin: req.session.user.admin });
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
                res.render('account', { admin: req.session.user.admin });

            } catch (error) {
                console.error("Error updating password:", error);
                res.locals.msg = "update_error";
                res.render('change_password', { admin: req.session.user.admin });
            }
        } else {
            console.log("Passwords do not match");
            res.locals.msg = "matchfail";
            res.render('change_password', { admin: req.session.user.admin });
        }
    } else {
        console.log("user not found")
        res.locals.msg = "fail";
        res.redirect('/');
    }
});


router.post('/create_recipe', async function(req, res, next) {
//     try {
//       await Course.create(
//         {
//           courseid: req.body.courseid,
//           coursename: req.body.coursename,
//           semester: req.body.semester,
//           coursedesc: req.body.coursedesc,
//           enrollnum: req.body.enrollnum
//         }
//     )
//     res.redirect('/courses?msg=success&courseid='+req.body.courseid)
//     } catch (error) {
//     res.redirect('/courses?msg='+new URLSearchParams(error.toString()).toString()+'&courseid'+req.body.courseid) 
//     }
//   }
});

module.exports = router;