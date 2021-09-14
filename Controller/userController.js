// userController.js`

// Import horror model
User = require('../Model/userModel');

// Handle user index actions
exports.index = function (req, res, next) {
    User.find({}).then(function(users){
        res.send(users);
    }).catch(next);
};

// Handle create user info
exports.new = function (req, res, next) {
    // User.create(req.body).then(function(user){
    //     res.send(user);
    // }).catch(next);

    // Might delete this since the one using the api should be the one responsible for hashing
    const newUserDbDocument = new User({
        email: req.body.email,
        password: req.body.password
    });
    newUserDbDocument.save().then(function(user){
        res.send(user);
    }).catch(next);
};

// Handle view user info
exports.view = function (req, res, next) {
    User.findOne({_id: req.params.id}).then(function(user){
        res.send(user);
    });
};

// Handle update user info
exports.update = function (req, res, next) {
    User.findOneAndUpdate({_id: req.params.id},req.body).then(function(user){
        User.findOne({_id: req.params.id}).then(function(user){
            res.send(user);
        });
    });
};

// Handle delete user info
exports.delete = function (req, res, next) {
    User.findOneAndDelete({_id: req.params.id}).then(function(user){
        res.send(user);
    });
};
