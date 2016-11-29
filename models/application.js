var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
// mongoose.connect('mongodb://localhost/approval');
//mongoose.connect('mongodb://drathi5:abc123@ds047166.mlab.com:47166/swea17');
var User = require('./user');
var db = mongoose.connection;

// User Schema
var applicationSchema = mongoose.Schema({
	workflowId : String,
    uploadId : String,
	levels: [],
    userIDS: [],
    username : String,
    userId : String,
    status : String,
    currentLevel : Number,
    totalLevels : Number,
    currentUserId : String,
    workflowname : String
});

var Application = module.exports = mongoose.model('applications', applicationSchema);

module.exports.getApplicationById = function(id, callback){
	Application.findById(id, callback);
    // id is out mongo object ID
}

module.exports.getApplicationsByUserId = function(userID, status,callback){
    var query = {userId:userID, status:status};
    Application.find(query, callback);
    // id is out mongo object ID
}

module.exports.getApplicationsForUserId = function(userID, callback){
    var query = {currentUserId:userID, status:'Pending'};
    Application.find(query, callback);
    // id is out mongo object ID
}

module.exports.createApplication = function(newApplication, callback){
   		newApplication.save(callback);
}
