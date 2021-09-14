// Filename: api.js

// Initialize express router
const express   = require('express');
const router    = express.Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'success',
        message: 'Welcome to Horror Map API!'
    });
});

const userController = require('../Controller/userController');

router.route('/user')
    .get    (userController.index)
    .post   (userController.new);

router.route('/user/:user_id')
    .get    (userController.view)
    .delete (userController.delete);



const horrorController = require('../Controller/horrorController');

router.route('/horror')
    .get    (horrorController.index)
    .post   (horrorController.new);

router.route('/horror/:horror_id')
    .get    (horrorController.view)
    .delete (horrorController.delete);


// Export API routes
module.exports = router;
