var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var usersController = require('../controller/usersController');
var User = require('../models/user');

/* GET users listing. */
router.get('/', usersController.ensureAuthenticated, usersController.get);

router.get('/pending', usersController.ensureAuthenticated, usersController.pendingApplications);

router.get('/approved', usersController.ensureAuthenticated, usersController.approvedApplications);

router.get('/forapproval', usersController.ensureAuthenticated, usersController.approvalApplications);

router.get('/reviews', usersController.ensureAuthenticated, usersController.reviewApplications);
// We are in users module that why /register will go to users/register
router.get('/register', usersController.registerGet);

router.get('/login', usersController.loginGet);

router.post('/login',
passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
 usersController.loginPost);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
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
}));

router.post('/register', upload.single('profileimage'),usersController.registerPost);
router.get('/download/:id', usersController.ensureAuthenticated, usersController.downloadApplication);
router.get('/approve/:id', usersController.ensureAuthenticated, usersController.approveApplication);
router.get('/reject/:id', usersController.ensureAuthenticated, usersController.rejectApplication);
router.get('/logout', usersController.logoutGet);
router.get('/uploadApplication', usersController.ensureAuthenticated, usersController.loginGet);
router.post('/uploadApplication', usersController.ensureAuthenticated, upload.single('application'), usersController.uploadApplication)
module.exports = router;
