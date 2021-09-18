// Filename: horror.js

// Initialize express router
const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');

const horrorController = require('../Controller/horrorController');

router.route('/horror')
    .get(auth, horrorController.index)
    .post(auth, horrorController.new);

router.route('/horror/:horror_id')
    .get(auth, horrorController.view)
    .delete(auth, horrorController.delete);


// Export API routes
module.exports = router;