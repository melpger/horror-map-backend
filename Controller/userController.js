// userController.js`

// Import user model
User = require('../Model/userModel');
const globalConst = require('../Constant/constants');

// Handle user index actions
exports.index = async function (req, res, next) {
    try {
        await User.find({}).then(function (users) {
            if (null==users || ''==users || !users) {
                const error = new Error();
                error.code = 10102;
                error.suberror_msg = 'User List is Empty.'
                throw error;
            }
            res.status(200).send({
                status: 1,
                user: users
            });
        })
    } catch (error) {
        res.status(400).send({
            status: 0,
            code: error.code??10101,
            error: 'User List Retrieval Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR,
        });
    }
};

// Return logged in user
exports.me = function (req, res, next) {
    try {
        res.status(200).send({
            status: 1,
            user: req.user
        });
    } catch(error) {
        res.status(400).send({
            status: 0,
            code: error.code??10301,
            error: 'User Profile Retrieval Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR,
        });
    }
}

// Logout user token
exports.logout = async function (req, res, next) {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).send({
            status: 1,
            logout: 1,
            message: 'Succesfully logged out.'
        });
    } catch (error) {
        res.status(500).send({
            status: 0,
            code: 10401,
            error: 'Logout Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR,
            details: error
        });
    }
}

// Logout user all token
exports.logoutall = async function (req, res, next) {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.status(200).send({
            status: 1,
            logout: 1,
            message: 'Succesfully logged out on all devices.'
        });
    } catch (error) {
        res.status(500).send({
            status: 0,
            code: 10501,
            error: 'Logout Failed.',
            suberror_msg: 'Logging out on all devices failed. Please try again.',
            details: error
        });
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
            res.status(200).send({
                status: 1,
                logout: 1,
                message: 'Successfully logged out all users.',
                loggedout_count: user.modifiedCount,
                match_count: user.matchedCount
            });
        });
    } catch (error) {
        res.status(500).send({
            status: 0,
            code: 10601,
            error: 'Logout Failed.',
            suberror_msg: 'Failed to logout all users. Please try again.',
            // details: error
        });
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
            password: req.body.password,
            isAdmin: false
        });

        const isEmailUnique = await User.isEmailUnique(newUserDbDocument.email);
        if (isEmailUnique) {
            const user = await newUserDbDocument.save();
            const token = await user.generateAuthToken();
            res.status(201).send({
                status: 1,
                user: user,
                token: token
            });
        } else {
            const error = new Error();
            error.code = 10202;
            error.suberror_msg = 'Email Address is already in use.';
            throw error;
        }
    } catch (error) {
        res.status(400).send({
            status: 0,
            code: error.code??10201,
            error_msg: 'User Creation Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR,
        });
    }
};

// Handle view user info
exports.view = async function (req, res, next) {
    try {
        await User.findOne({
            _id: req.body.id
        }).then(function (user) {
            if (null==user || ''==user || !user) {
                const error = new Error();
                error.code = 10802;
                error.suberror_msg = 'User does not Exist.';
                throw error;
            }
            res.status(200).send({
                status: 1,
                user: user,
            });
        });
    } catch (error) {
        res.status(400).send({
            status: 0,
            code: error.code??10801,
            error_msg: 'User Info Retrieval Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR
        });
    }
};

// Handle update user info
exports.update = async function (req, res, next) {
    try {
        await User.findOneAndUpdate({
            _id: req.body.id
        }, req.body).then(function (user) {
            if (null==user || ''==user || !user) {
                const error = new Error();
                error.code = 11002;
                error.suberror_msg = 'User ID not Exist.';
                throw error;
            }
            User.findOne({
                _id: req.body.id
            }).then(function (user) {
                if (null==user || ''==user || !user) {
                    const error = new Error();
                    error.code = 11003;
                    error.suberror_msg = 'User ID not Exist.';
                    throw error;
                }
                res.status(200).send({
                    status: 1,
                    user: user,
                });
            });
        });
    } catch(error) {
        res.status(400).send({
            status: 0,
            code: error.code??11001,
            error_msg: 'User Update Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR
        });
    }
};

// Handle delete user info
exports.delete = async function (req, res, next) {
    try {
        await User.findOneAndDelete({
            _id: req.body.id
        }).then(function (user) {
            if (null==user || ''==user || !user) {
                const error = new Error();
                error.code = 10902;
                error.suberror_msg = 'User ID does not exist.'
                throw error;
            }
            res.status(200).send({
                status: 1,
                deleted: 1,
                email: user.email
            });
        });
    } catch (error) {
        res.status(400).send({
            status: 0,
            code: error.code??10901,
            error_msg: 'User Deletion Failed.',
            suberror_msg: error.suberror_msg??globalConst.EXCEPTION_ERROR
        });
    }
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
            const error = new Error();
            error.code = 10702;
            error.httpcode = 401;
            error.suberror_msg = 'Check authentication credentials.';
            throw error;
        }

        const token = await user.generateAuthToken();

        res.status(200).send({
            status: 1,
            user: user,
            token: token
        });
    } catch (error) {
        console.log(error)
        res.status(error.httpcode??400).send({
            status: 0,
            code: error.code??10701,
            error_msg: 'Login Failed.',
            suberror_msg: error.suberror_msg ?? globalConst.EXCEPTION_ERROR,
        });
    }
};