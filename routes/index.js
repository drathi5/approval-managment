var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var indexController = require('../controller/indexController');
var User = require('../models/user');
// var adminController = require('../controller/adminController');
/* GET home page. */
router.get('/', indexController.ensureAuthenticated, indexController.get);
// router.get('/admin', adminController.get);

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
//   /*
//   callback function (done). The callback function takes as it's second parameter
//   the identifying information (user.id, but if you're using mongoDB this may be user._id)
//   required to recover the account from the database.This will be called on every
//   authenticated request and stores the identifying information in the session data
//   */
// });
//
// passport.deserializeUser(function(id, done) {
//     /*
//     passport.deserializeUser() is provided a function that also takes two parameters,
//     the identifying information (id) and again a callback function (done).
//     The identifying information is what was serialized to the session data in the previous request (user.id).
//     The callback function here requires the user profile as it's second parameter, or any error in raised in retrieving
//     the profile as it's first parameter. The User.findById() function is a lookup function for the user profile in the database.
//     In this example User object is an instance of a mongoose model which has the findById() function.
//     */
//   User.getUserById(id, function(err, user) {
//     done(err, user);
//   });
// });
module.exports = router;
