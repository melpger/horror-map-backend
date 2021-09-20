// Filename: user.js

// Initialize express router
const express = require('express');
const router = express.Router();

const userController = require('../Controller/userController');

//10100
router.route('/user/getAll')
    .get(userController.index)

//10200
router.route('/user/create')
    .post(userController.new);

//10300
router.route('/user/me')
    .get(userController.me)

//10400
router.route('/user/me/logout')
    .post(userController.logout)

//10500
router.route('/user/me/logoutall')
    .post(userController.logoutall)

//10600
router.route('/user/logoutallUsers')
    .post(userController.logoutallUsers)

//10700
router.route('/user/login')
    .post(userController.login);

//10800
router.route('/user/get')
    .post(userController.view)

//10900
router.route('/user/delete')
    .post(userController.delete);
router.route('/user/me/delete')
    .post(userController.meDelete);

//11000
router.route('/user/update')
    .post(userController.update);
router.route('/user/me/update')
    .post(userController.meUpdate);

// Export API routes
module.exports = router;