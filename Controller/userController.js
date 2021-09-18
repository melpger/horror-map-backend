// userController.js`

// Import horror model
User = require('../Model/userModel');

// Handle user index actions
exports.index = function (req, res, next) {
    User.find({}).then(function (users) {
        res.send(users);
    }).catch(next);
};

// Return logged in user
exports.me = function (req, res, next) {
    res.send(req.user);
}

// Logout user token
exports.logout = async function (req, res, next) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

// Logout user all token
exports.logoutall = async function (req, res, next) {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
}

// Logout all User Tokens
exports.logoutallUsers = async function (req, res, next) {
    try {
        User.updateMany({}, {
            $set: {
                tokens: []
            }
        }).then(function (user) {
            // console.log(user);
            // req.user.save;
            res.send(user);
        });

    } catch (error) {
        res.status(500).send(error);
    }
}

// Handle create user info
exports.new = async function (req, res, next) {
    // User.create(req.body).then(function(user){
    //     res.send(user);
    // }).catch(next);
    try {
        // Might delete this since the one using the api should be the one responsible for hashing
        const newUserDbDocument = new User({
            email: req.body.email,
            password: req.body.password
        });

        const isEmailUnique = await User.isEmailUnique(newUserDbDocument.email);
        if (isEmailUnique) {
            const user = await newUserDbDocument.save();
            const token = await user.generateAuthToken();
            res.status(201).send({
                user,
                token
            });
        } else {
            res.status(400).send({
                "error": "Email Address is already in use."
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

// Handle view user info
exports.view = function (req, res, next) {
    User.findOne({
        _id: req.body.id
    }).then(function (user) {
        res.send(user);
    });
};

// Handle update user info
exports.update = function (req, res, next) {
    User.findOneAndUpdate({
        _id: req.params.id
    }, req.body).then(function (user) {
        User.findOne({
            _id: req.params.id
        }).then(function (user) {
            res.send(user);
        });
    });
};

// Handle delete user info
exports.delete = function (req, res, next) {
    User.findOneAndDelete({
        _id: req.body.id
    }).then(function (user) {
        res.send({
            "_id": user._id,
            "email": user.email,
            "message": "deleted"
        });
    });
};

//Handle user login
exports.login = async function (req, res, next) {
    //Login a registered user
    try {
        const {
            email,
            password
        } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({
                error: 'Login failed! Check authentication credentials'
            });
        }
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    } catch (error) {
        res.status(400).send(error);
    }
};