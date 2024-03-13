// Filename: user.js

// Initialize express router
const express = require('express');
const userController = require('../Controller/userController');
const globalConst = require('../Constant/constants');

const router = express.Router();

//10100 - Get list of all users - admin only
router.route(globalConst.ROUTES.USER_GET_ALL)
    .get(userController.userlist)

//10200 - Create user
router.route(globalConst.ROUTES.USER_CREATE)
    .post(userController.new);

//10300 - Get own user info
router.route(globalConst.ROUTES.USER_ME)
    .get(userController.me)

//10400 - Logout own self
router.route(globalConst.ROUTES.USER_ME_LOGOUT)
    .post(userController.logout)

//10500 - Logout own self on all devices
router.route(globalConst.ROUTES.USER_ME_LOGOUT_ALL)
    .post(userController.logoutall)

//10600 - Logout all users - admin only
router.route(globalConst.ROUTES.USER_LOGOUT_ALL)
    .post(userController.logoutallUsers)

//10700 - User login
router.route(globalConst.ROUTES.USER_LOGIN)
    .post(userController.login);

//10800 - Get User info - admin only
router.route(globalConst.ROUTES.USER_GET)
    .post(userController.view)

//10900
//Delete user - admin only
router.route(globalConst.ROUTES.USER_DELETE)
    .post(userController.delete);
//Delete own self
router.route(globalConst.ROUTES.USER_ME_DELETE)
    .post(userController.meDelete);

//11000
//Update user info - admin only
router.route(globalConst.ROUTES.USER_UPDATE)
    .post(userController.update);
//Update own info
router.route(globalConst.ROUTES.USER_ME_UPDATE)
    .post(userController.meUpdate);

// Export API routes
module.exports = router;