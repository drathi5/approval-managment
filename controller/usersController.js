var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Application = require('../models/application');
var UserApplication = require('../models/userapplication');
var Workflow = require('../models/workflow');
var mongoose = require('mongoose');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var db = mongoose.connection;
async = require("async");
function get(request, response, next){
    response.render('welcome', { title: 'Members' });
}
function registerGet(request, response, next){
    if(request.isAuthenticated()){
		response.redirect('/');
	}
    else{
        response.render('register',{title:'Register'});
    }
}
function ensureAuthenticated(request, response, next){
	if(request.isAuthenticated()){
		return next();
	}
	response.redirect('/users/login');
}
function registerPost(request, response, next){
    console.log(request.body);
    var name = request.body.name;
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;
    var password2 = request.body.password2;
    var usernameFlag = false;
    var emailFlag = false;
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        User.getUserByEmail(email, callback);
    })
    asyncTasks.push(function(callback){
        User.getUserByUsername(username, callback);
    })
    request.checkBody('name','Name field is required').notEmpty();
    request.checkBody('email','Email field is required').notEmpty();
    request.checkBody('email','Email is not valid').isEmail();
    request.checkBody('username','Username field is required').notEmpty();
    request.checkBody('password','Password field is required').notEmpty();
    request.checkBody('password2','Passwords do not match').equals(request.body.password);
    var errors = request.validationErrors();

    async.parallel(asyncTasks, function(err, result){
        // All tasks are done now
        if(err)
            throw err;
        else
        {
            if(result[0])
                emailFlag = true;
            if(result[1])
                usernameFlag = true;
        }
        if(errors || emailFlag || usernameFlag)
        {
           if(emailFlag){
               request.flash('error', 'Email already in use');
               response.render('register',{'email': 'email already in use'});
           }
           else if(usernameFlag){
               request.flash('error', 'Username already in use');
               response.render('register',{'username': 'username already in use'});
           }
           else
           {
               response.render('register', { errors: errors });
           }
        }
        else
        {
               var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
              });

              User.createUser(newUser, function(err, user){
                if(err) throw err;
                // console.log(user);
              });

              request.flash('success', 'You are now registered and can login');

              response.location('/');
              response.redirect('/');
         }
    });

}
function loginGet(request, response, next){
    if(request.isAuthenticated()){
		response.redirect('/');
	}
    else{
        response.render('login', {title:'Login'});
    }
}
function loginPost(request, response, next){
     request.flash('success', 'You are now logged in');
     response.redirect('/');
}
function logoutGet(request, response, next){
    request.logout();
    // req.flash() to give output to screen
    request.flash('success', 'You are now logged out');
    response.redirect('/users/login');
}
function reviewApplications(request, response, next){
    var id = request.session.passport.user;
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        User.getUserById(id, callback);
    })
    asyncTasks.push(function(callback){
        Workflow.getAllWorkflow(callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Pending', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Approved', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Rejected', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsForUserId(id, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else {
            var user = result[0]['name'];
            var userId = id;
            var workflows = [];
            var workflowsIds = [];
            var applications = [];
            for(var i=0;i<result[1].length;i++)
            {
                workflows.push(result[1][i]['workflowname']);
                workflowsIds.push(result[1][i]['_id']);
            }
            //console.log(result[2]);
            response.render('reviewapplications', { title: 'Welcome', user:user, workflows:workflows,
                                                     userId: userId, workflowsIds: workflowsIds, pendingapplications:result[2],
                                                     approvedapplications:result[3],reviewapplications:result[4],
                                                 approvalapplications:result[5]});
        }

    })
}
function pendingApplications(request, response, next){
    var id = request.session.passport.user;
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        User.getUserById(id, callback);
    })
    asyncTasks.push(function(callback){
        Workflow.getAllWorkflow(callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Pending', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Approved', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Rejected', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsForUserId(id, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else {
            var user = result[0]['name'];
            var userId = id;
            var workflows = [];
            var workflowsIds = [];
            for(var i=0;i<result[1].length;i++)
            {
                workflows.push(result[1][i]['workflowname']);
                workflowsIds.push(result[1][i]['_id']);
            }
            //console.log(result[2]);
            response.render('pendingapplications', { title: 'Welcome', user:user, workflows:workflows,
                                                     userId: userId, workflowsIds: workflowsIds, pendingapplications:result[2],
                                                     approvedapplications:result[3],reviewapplications:result[4],
                                                   approvalapplications:result[5]});
        }

    })
}
function approvedApplications(request, response, next){
    var id = request.session.passport.user;
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        User.getUserById(id, callback);
    })
    asyncTasks.push(function(callback){
        Workflow.getAllWorkflow(callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Pending', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Approved', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Rejected', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsForUserId(id, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else {
            var user = result[0]['name'];
            var userId = id;
            var workflows = [];
            var workflowsIds = [];
            for(var i=0;i<result[1].length;i++)
            {
                workflows.push(result[1][i]['workflowname']);
                workflowsIds.push(result[1][i]['_id']);
            }
            //console.log(result[2]);
            response.render('approvedapplications', { title: 'Welcome', user:user, workflows:workflows,
                                                     userId: userId, workflowsIds: workflowsIds, pendingapplications:result[2],
                                                     approvedapplications:result[3],reviewapplications:result[4],
                                                     approvalapplications:result[5]});
        }

    })
}
function approvalApplications(request, response, next){

    var id = request.session.passport.user;
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        User.getUserById(id, callback);
    })
    asyncTasks.push(function(callback){
        Workflow.getAllWorkflow(callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Pending', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Approved', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsByUserId(id, 'Rejected', callback);
    })
    asyncTasks.push(function(callback){
        Application.getApplicationsForUserId(id, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else {
            var user = result[0]['name'];
            var userId = id;
            var workflows = [];
            var workflowsIds = [];
            for(var i=0;i<result[1].length;i++)
            {
                workflows.push(result[1][i]['workflowname']);
                workflowsIds.push(result[1][i]['_id']);
            }
            //console.log(result[2]);
            response.render('applicationforapproval', { title: 'Welcome', user:user, workflows:workflows,
                                                     userId: userId, workflowsIds: workflowsIds, pendingapplications:result[2],
                                                     approvedapplications:result[3],reviewapplications:result[4],
                                                     approvalapplications:result[5]});
        }

    })
}
function uploadApplication(request, response, next){
    if(request.file){
       var application = request.file.filename;
       var userId = request.body.fuserid;
       var workflowId = request.body.fworkflowid;
       var asyncTasks = [];
       asyncTasks.push(function(callback){
           User.getUserById(userId, callback);
       })
       asyncTasks.push(function(callback){
           Workflow.getWorkflowById(workflowId, callback);
       })
       async.parallel(asyncTasks, function(err, result){
           // all tasks are done now
           if(err)
               throw err;
           else {
               var levels = [];
               var userIDS = [];
               var workflowname = "";
               result.forEach(function(data){
                   levels = data.levels;
                   userIDS = data.userIDS;
                   workflowname = data.workflowname;
               });
               var newApplication = new Application({
                uploadId: application,
                userId: userId,
                username: result[0].name,
                workflowId: workflowId,
                currentLevel: 0,
                totalLevels: levels.length,
                status: "Pending",
                currentUserId : userIDS[0],
                levels: levels,
                userIDS: userIDS,
                workflowname: workflowname
              });
              var appID;
              Application.createApplication(newApplication, function(err, data){
                if(err) throw err;
                else{
                    appID = data._id;
                }
              });
                var userApplication = new UserApplication({
                  workflowId : workflowId,
                  applicationId : appID,
                	status: "Pending",
                  currentLevel : 0,
                  userId : userIDS[0]
                });
                UserApplication.createUserApplication(userApplication, function(err, data){
                  if(err) throw err;
                });
              request.flash('success', 'file uploaded');
              response.redirect('/');

           }
       })

    }
    else {
       console.log('No File Uploaded...');
       request.flash('error', 'no file uploaded');
       response.redirect('/');
    }

}
function downloadApplication(request, response, next){
  var file = __dirname + '/../uploads/' + request.params.id;
  console.log(file);
  //response.download(file, 'download.txt');
  response.download(file);
}
function approveApplication(request, response, next){
    var applicationId = request.params.id;
    console.log(applicationId);
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        Application.getApplicationById(applicationId, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else{
            var userId = result[0].userId;
            var currentLevel = result[0].currentLevel + 1;
            var currentUserId = result[0][currentLevel - 1];
            var status = 'Pending';
            if(currentLevel == result[0].totalLevels)
            {
                status = 'Approved';
            }
            else
            {
                currentUserId = result[0].userIDS[currentLevel];
                console.log(currentUserId);
                console.log(result[0])
            }
            var query = {'_id':applicationId};
            Application.update(query, {'currentLevel':currentLevel, 'status':status,
                                       'currentUserId': currentUserId},{ multi: false },
                                        function(err, data){
                                            if(err){throw err;}
                                            else{
                                                request.flash('success', 'Application approved from your end');
                                            response.redirect('/users/forapproval');}
                                        });
        }
    });
}
function rejectApplication(request, response, next){
    var applicationId = request.params.id;
    console.log(applicationId);
    var asyncTasks = [];
    asyncTasks.push(function(callback){
        Application.getApplicationById(applicationId, callback);
    })
    async.parallel(asyncTasks, function(err, result){
        // all tasks are done now
        if(err)
            throw err;
        else{
            var asyncTasks2 = [];
            var query = {'_id':applicationId};
            Application.update(query, {'status':'Rejected'},{ multi: false },
                               function(err, data){
                                   if(err){
                                       throw err;
                                   }
                                   else{
                                       request.flash('success', 'Application rejected from your end');
                                       response.redirect('/users/forapproval');
                                   }
                               });
    }
    });
}
module.exports = {
    get : get,
    registerGet : registerGet,
    registerPost : registerPost,
    loginGet : loginGet,
    loginPost : loginPost,
    logoutGet : logoutGet,
    ensureAuthenticated : ensureAuthenticated,
    pendingApplications : pendingApplications,
    approvedApplications : approvedApplications,
    approvalApplications : approvalApplications,
    reviewApplications : reviewApplications,
    uploadApplication : uploadApplication,
    downloadApplication: downloadApplication,
    approveApplication: approveApplication,
    rejectApplication : rejectApplication
}
