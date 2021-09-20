// Filename: user.js

// Initialize express router
const express = require('express');
const router = express.Router();

//10000
const auth = require('../Middleware/auth');

const userController = require('../Controller/userController');

//10100
router.route('/user/getAll')
    // .get( userController.index)
    .get(auth, userController.index)

//10200
router.route('/user/create')
    .post(auth, userController.new);

//10300
router.route('/user/me')
    // .get( userController.me)
    .get(auth, userController.me)

//10400
router.route('/user/me/logout')
    .post(auth, userController.logout)

//10500
router.route('/user/me/logoutall')
    .post(auth, userController.logoutall)

//10600
router.route('/user/logoutallUsers')
    .post(auth, userController.logoutallUsers)

//10700
router.route('/user/login')
    .post(auth, userController.login);

//10800
router.route('/user/get')
    .post(auth, userController.view)

//10900
router.route('/user/delete')
    .post(auth, userController.delete);

//11000
router.route('/user/update')
    .post(auth, userController.update);

// Export API routes
module.exports = router;