var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var usersController = require('../controller/usersController');
var User = require('../models/user');
var adminController = require('../controller/adminController');

// we are in admin route , so / will go to admin/
router.get('/', adminController.ensureAuthenticated,adminController.get);
router.get('/register', adminController.ensureAuthenticated, adminController.workflowRegister);
router.get('/edit', adminController.ensureAuthenticated, adminController.workflowEdit);
router.get('/delete', adminController.ensureAuthenticated, adminController.workflowDelete);
router.post('/register', adminController.ensureAuthenticated, adminController.workflowPostRegister)
passport.serializeUser(function(user, done) {
  done(null, user.id);
  console.log(id);
});
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
     console.log(id);
    done(err, user);
  });
});
/*passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));*/
module.exports = router;
