var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// mongoose.connect('mongodb://localhost/approval');
//mongoose.connect('mongodb://drathi5:abc123@ds047166.mlab.com:47166/swea17');

var db = mongoose.connection;

// User Schema
var WorkflowSchema = mongoose.Schema({
	workflowname: {
		type: String,
		index: true
	},
    totallevels: {
        type: Number,
        index: true
    },
	levels: [],
    userIDS: []
});

var Workflow = module.exports = mongoose.model('Workflow', WorkflowSchema);

module.exports.getWorkflowById = function(id, callback){
	Workflow.findById(id, callback);
    // id is out mongo object ID
}

module.exports.getWorkflowByWorkflowname = function(workflowname, callback){
	var query = {workflowname: workflowname};
	Workflow.findOne(query, callback);
}
module.exports.createWorkflow = function(newWorkflow, callback){
   		newWorkflow.save(callback);
}

module.exports.getAllWorkflow = function(callback){
    Workflow.find({}, callback);
}
