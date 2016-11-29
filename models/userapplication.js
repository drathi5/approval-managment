var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');
// mongoose.connect('mongodb://localhost/approval');
//mongoose.connect('mongodb://drathi5:abc123@ds047166.mlab.com:47166/swea17');
//var User = require('user')
var db = mongoose.connection;

// User Schema
var userapplicationSchema = mongoose.Schema({
	workflowId : String,
    applicationId : String,
	status: String,
    currentLevel : Number,
    userId : String
});

var userApplication = module.exports = mongoose.model('userapplications', userapplicationSchema);

module.exports.getUserApplicationById = function(id, callback){
	userApplication.findById(id, callback);
    // id is out mongo object ID
}

module.exports.createUserApplication = function(newUserApplication, callback){
   		newUserApplication.save(callback);
}

module.exports.getApplicationByUserId = function(id, status, callback){
    var query = {};
    query['userId'] = id ;
    query['status'] = status;
	userApplication.find(query, callback);
    // id is out mongo object ID
}
