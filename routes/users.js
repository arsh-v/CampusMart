const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/user');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    // .get(users.renderlogin)
    .get(passport.authenticate('microsoft', { prompt: 'select_account',failureRedirect: '/login' }),function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/campgrounds/62b9897f44eb5cb09ac42bba');
      })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;