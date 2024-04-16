const { MY_API_KEY } = require('./config');
var express = require('express');
const User = require('../models/User');
var router = express.Router();


router.get('/', async function (req, res, next) {
    const user = req.session.user;

    // If user is not logged in, redirect to login page
    if (!user) {
        return res.redirect('/login');
    }

    if (req.query.msg) {
        res.locals.msg = req.query.msg
    }
    res.render('account');
});


router.get('/users', async function(req, res, next) {
    //console.log(req.session.user)
    const users = await User.findAll();
    if(req.query.msg){
      res.locals.msg = req.query.msg
      res.locals.courseid = req.query.courseid
    }
    res.render('courses', { courses })
  });

module.exports = router;