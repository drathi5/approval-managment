var mongoose = require('mongoose');
var db = mongoose.connection;
var Workflow = require('../models/workflow');
var User = require('../models/user');
var Application = require('../models/application');
var UserApplication = require('../models/userapplication');
async = require("async");
function get(request, response, next){
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
            response.render('welcome', { title: 'Welcome', user:user, workflows:workflows,
                                         userId: userId, workflowsIds: workflowsIds, pendingapplications:result[2],
                                         approvedapplications:result[3],reviewapplications:result[4],
                                     approvalapplications:result[5]});
        }

    })

    //var categories = db.get('categories');

    // again by default db.find() will give 2 parameters err, data
    // you can anything with data
	// workflows.find({},{},function(err, workflow){
	// 	response.render('index',{
 //  			'title': 'Members',
 //  			'workflows': workflow
 //  		});
	// });
}
function ensureAuthenticated(request, response, next){
	if(request.isAuthenticated()){
        console.log(request.body);
		return next();
	}
	response.redirect('/users/login');
}
module.exports = {
    get : get,
    ensureAuthenticated : ensureAuthenticated
}
