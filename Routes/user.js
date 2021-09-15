// Filename: user.js

// Initialize express router
const express   = require('express');
const router    = express.Router();
const auth = require('../Middleware/auth');

const userController = require('../Controller/userController');

router.route('/user')
    .get    (auth, userController.index)
    .post   (userController.new);

router.route('/user/login')
    .post   (userController.login);

router.route('/user/:user_id')
    .get    (auth, userController.view)
    .delete (auth, userController.delete);

// Export API routes
module.exports = router;
