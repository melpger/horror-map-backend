// Filename: user.js

// Initialize express router
const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');

const userController = require('../Controller/userController');

router.route('/user')
    .get(auth, userController.index)

router.route('/user/create')
    .post(userController.new);

router.route('/user/me')
    .get(auth, userController.me)

router.route('/user/me/logout')
    .post(auth, userController.logout)

router.route('/user/me/logoutall')
    .post(auth, userController.logoutall)

router.route('/user/logoutallUsers')
    .post(auth, userController.logoutallUsers)

router.route('/user/login')
    .post(userController.login);

router.route('/user/get')
    .post(auth, userController.view)

router.route('/user/delete')
    .post(auth, userController.delete);

// Export API routes
module.exports = router;