// Filename: user.js

// Initialize express router
const express   = require('express');
const router    = express.Router();

const userController = require('../Controller/userController');

router.route('/user')
    .get    (userController.index)
    .post   (userController.new);

router.route('/user/login')
    .post   (userController.login);

router.route('/user/:user_id')
    .get    (userController.view)
    .delete (userController.delete);

// Export API routes
module.exports = router;
