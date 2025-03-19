// userController.js`

// Import user model
User = require('../Model/userModel');
const globalConst = require('../Constant/constants');
const util = require('../Util/util');

// Get list of all users
exports.userlist = async function (req, res, next) {
    try {
        await User.find({}).then(function (users) {
            if (util.isEmpty(users)|| !users) {
                const error = new Error();
                error.code = globalConst.ERROR.ERROR_CODE.EMPTY_USER_LIST;
                error.suberror_msg = globalConst.ERROR.SUB_ERROR.EMPTY_USER_LIST;
                throw error;
            }
            res.status(200).send({
                status: globalConst.STATUS.OK,
                user: users
            });
            next();
        })
    } catch (error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??globalConst.ERROR.ERROR_CODE.USER_LIST_RETRIEVAL_EXCEPTION_ERROR,
            error: globalConst.ERROR.MAIN_ERROR.USER_LIST_RETRIEVAL_EXCEPTION_ERROR,
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
        });
    }
};

// Return logged in user
exports.me = function (req, res, next) {
    try {
        res.status(200).send({
            status: globalConst.STATUS.OK,
            user: req.user
        });
        next();
    } catch(error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??globalConst.ERROR.ERROR_CODE.USER_INFO_RETRIEVAL_EXCEPTION_ERROR,
            error: globalConst.ERROR.MAIN_ERROR.USER_INFO_RETRIEVAL_EXCEPTION_ERROR,
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
        });
    }
}

// Logout user token
exports.logout = async function (req, res, next) {
    try {
        //normally during logout, it is enough to delete the access token from the client side
        //as added measure, generated access token has the same creation date with a refresh token
        //so we need to delete the corresponding refresh token too
        const tokenCreationDate = new Date(req.tokenCreationDate);
        req.user.refreshTokens = req.user.refreshTokens.filter((refreshTokens) => {
            return refreshTokens.creationDate.toString() != tokenCreationDate.toString()
        })

        await req.user.save()
        res.status(200).send({
            status: globalConst.STATUS.OK,
            logout: 1,
            message: 'Succesfully logged out.'
        });
        next();
    } catch (error) {
        res.status(500).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??globalConst.ERROR.ERROR_CODE.USER_LOGOUT_EXCEPTION_ERROR,
            error: globalConst.ERROR.MAIN_ERROR.USER_LOGOUT_EXCEPTION_ERROR,
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
            details: error
        });
    }
}

// Logout user all token
exports.logoutall = async function (req, res, next) {
    try {
        //remove all existing refresh tokens
        req.user.refreshTokens.splice(0, req.user.refreshTokens.length)
        await req.user.save()

        res.status(200).send({
            status: globalConst.STATUS.OK,
            logout: 1,
            message: 'Succesfully logged out on all devices.'
        });
        next();
    } catch (error) {
        res.status(500).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??globalConst.ERROR.ERROR_CODE.USER_LOGOUT_ALL_EXCEPTION_ERROR,
            error: globalConst.ERROR.MAIN_ERROR.USER_LOGOUT_ALL_EXCEPTION_ERROR,
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
                refreshTokens: []
            }
        }).then(function (user) {
            res.status(200).send({
                status: globalConst.STATUS.OK,
                logout: 1,
                message: 'Successfully logged out all users.',
                loggedout_count: user.modifiedCount,
                match_count: user.matchedCount
            });
        });
        next();
    } catch (error) {
        res.status(500).send({
            status: globalConst.STATUS.FAIL,
            code: 10601,
            error: 'Logout Failed.',
            suberror_msg: 'Failed to logout all users. Please try again.',
            // details: error
        });
    }
}

// Handle create user info
exports.new = async function (req, res, next) {
    try {
        const newUserDbDocument = new User({
            email: req.body.email,
            password: req.body.password,
            isAdmin: false
        });

        const isEmailUnique = await User.isEmailUnique(newUserDbDocument.email);
        if (isEmailUnique) {
            const user = await newUserDbDocument.save();
            let userAgent = req.header(globalConst.HEADER.USER_AGENT);
            const token = await user.generateAuthToken(userAgent);
            res.status(201).send({
                status: globalConst.STATUS.OK,
                user: user,
                token: token
            });
            next();
        } else {
            const error = new Error();
            error.code = 10202;
            error.suberror_msg = 'Email Address is already in use.';
            throw error;
        }
    } catch (error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??10201,
            error_msg: 'User Creation Failed.',
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
            details: error
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
                status: globalConst.STATUS.OK,
                user: user,
            });
            next();
        });
    } catch (error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??10801,
            error_msg: 'User Info Retrieval Failed.',
            suberror_msg: error.suberror_msg??globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR
        });
    }
};

// Handle update user info
exports.meUpdate = async function (req, res, next) {
    req.body.id = req.user._id.toString();
    await updateUser(req, res, next);
}

exports.update = async function (req, res, next) {
    await updateUser(req, res, next);
};

async function updateUser(req, res, next) {
    try {
        if (null == req.body.id || '' == req.body.id || !req.body.id) {
            const error = new Error();
            error.code = 11002;
            error.suberror_msg = 'User ID missing.';
            throw error;
        }
        
        const isEmailUnique = await User.isEmailUnique(req.body.email);
        if (!isEmailUnique) {
            const error = new Error();
            error.code = 11003;
            error.suberror_msg = 'Email Address is already in use.';
            throw error;
        }

        await User.findOneAndUpdate({
            _id: req.body.id
        }, req.body).then(function (user) {
            if (null == user || '' == user || !user) {
                const error = new Error();
                error.code = 11004;
                error.suberror_msg = 'User ID not Exist.';
                throw error;
            }
            User.findOne({
                _id: req.body.id
            }).then(function (user) {
                if (null == user || '' == user || !user) {
                    const error = new Error();
                    error.code = 11005;
                    error.suberror_msg = 'User ID not Exist.';
                    throw error;
                }
                res.status(200).send({
                    status: globalConst.STATUS.OK,
                    user: user,
                });
                next();
            });
        });
    } catch (error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code ?? 11001,
            error_msg: 'User Update Failed.',
            suberror_msg: error.suberror_msg ?? globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
            // details: error
        });
    }
}

exports.meDelete = async function (req, res, next) {
    req.body = req.user
    await deleteUser(req, res, next);
}

// Handle delete user info
exports.delete = async function (req, res, next) {
    await deleteUser(req, res, next);
};

async function deleteUser(req, res, next) {
    try {
        await User.findOneAndDelete({
            _id: req.body.id
        }).then(function (user) {
            if (null == user || '' == user || !user) {
                const error = new Error();
                error.code = 10902;
                error.suberror_msg = 'User ID does not exist.';
                throw error;
            }
            res.status(200).send({
                status: globalConst.STATUS.OK,
                deleted: 1,
                email: user.email
            });
            next();
        });
    } catch (error) {
        res.status(400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code ?? 10901,
            error_msg: 'User Deletion Failed.',
            suberror_msg: error.suberror_msg ?? globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR
        });
    }
}

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

        let userAgent = req.header(globalConst.HEADER.USER_AGENT);
        const token = await user.generateAuthToken(userAgent);
        
        res.status(200).send({
            status: globalConst.STATUS.OK,
            user: user,
            token: token
        });
        next();
    } catch (error) {
        res.status(error.httpcode??400).send({
            status: globalConst.STATUS.FAIL,
            code: error.code??10701,
            error_msg: 'Login Failed.',
            suberror_msg: error.suberror_msg ?? globalConst.ERROR.SUB_ERROR.EXCEPTION_ERROR,
        });
    }
};
