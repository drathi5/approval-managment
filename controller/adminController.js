var mongoose = require('mongoose');
var db = mongoose.connection;
var Workflow = require('../models/workflow');
var User = require('../models/user');
function get(request, response, next){
    response.render('admin', { title: 'Admin Area' });
}
function ensureAuthenticated(request, response, next){
	if(request.isAuthenticated()){
        if(request.user.username == 'drathi5')
		      return next();
        else{
             response.render('noacess',{title:'Sorry'});
        }
	}
	response.redirect('/users/login');
}
function workflowEdit(request, response, next){
    response.render('workflowedit', { title: 'Workflow Edit' });
}
function workflowRegister(request, response, next){
    response.render('workflowregister', {title: 'Workflow Register'})
}
function workflowPostRegister(request, response, next){
    var name = request.body.workflowname;
    var levels = request.body.totallevels;
    var array_level = request.body['arr[]'];
    // console.log(request.body);
    // console.log(name, levels, array_level);
    for(i=0;i<array_level.length;i++)
    {
        if(array_level[i])
        {
            for(j=i+1;j<array_level.length;j++)
            {
                if(array_level[i]==array_level[j])
                    delete array_level[j];
            }
        }
    }
    var corrected = [];
    for(i=0;i<array_level.length;i++)
    {
        if(array_level[i])
            corrected.push(array_level[i]);
    }
    levels = corrected.length;
    if(levels)
    {
        var asyncTasks = [];
        switch(levels)
        {
            case 9:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[8], callback);
                })
            case 8:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[7], callback);
                })
            case 7:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[6], callback);
                })
            case 6:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[5], callback);
                })
            case 5:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[4], callback);
                })
            case 4:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[3], callback);
                })
            case 3:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[2], callback);
                })
            case 2:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[1], callback);
                })
            case 1:
                asyncTasks.push(function(callback){
                        User.getUserByUsername(corrected[0], callback);
                })

        }
        async.parallel(asyncTasks, function(err, result){
            // All tasks are done now
            if(err)
                throw err;
            else{
                    var userIDS = [];
                    result.forEach(function(data){
                        userIDS.push(data._id);
                    })
                    userIDS.reverse();
                    var newWorkflow = new Workflow({
                                        workflowname: name,
                                        totallevels: levels,
                                        levels: corrected,
                                        userIDS: userIDS
                                    })
                    Workflow.createWorkflow(newWorkflow, function(err, workflow){
                      if(err) throw err;
                     console.log(workflow);
                    });
                    request.flash('success', 'Workflow added');
                    response.render('workflowregister', {title: 'Workflow Register'});
            }
        });
    }
    else {
        request.flash('error', 'Workflow not added');
        response.render('workflowregister', {title: 'Workflow Register'});
    }

}
function workflowDelete(request, response, next){
    response.render('workflowdelete', {title: 'Workflow Delete'})
}
module.exports = {
    get : get,
    workflowEdit : workflowEdit,
    workflowRegister : workflowRegister,
    workflowPostRegister : workflowPostRegister,
    workflowDelete : workflowDelete,
    ensureAuthenticated : ensureAuthenticated
}
