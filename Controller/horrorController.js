// horrorController.js`

// Import horror model
Horror = require('../Model/horrorModel');

// Handle index actions
exports.index = function (req, res, next) {
    Horror.find({}).then(function(horrors){
        res.send(horrors);
    }).catch(next);
};

// Handle create horror
exports.new = function (req, res, next) {
    Horror.create(req.body).then(function(horror){
        res.send(horror);
    }).catch(next);
};

// Handle view horror info
exports.view = function (req, res, next) {
    Horror.findOne({_id: req.params.id}).then(function(horror){
        res.send(horror);
    });
};

// Handle update horror info
exports.update = function (req, res, next) {
    Horror.findOneAndUpdate({_id: req.params.id},req.body).then(function(horror){
        Horror.findOne({_id: req.params.id}).then(function(horror){
            res.send(horror);
        });
    });
};

// Handle delete horror
exports.delete = function (req, res, next) {
    Horror.findOneAndDelete({_id: req.params.id}).then(function(horror){
        res.send(horror);
    });
};
