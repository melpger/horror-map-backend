// Filename: horror.js

// Initialize express router
const express = require('express');
const router = express.Router();

const horrorController = require('../Controller/horrorController');

router.route('/horror')
    .get(horrorController.index)
    .post(horrorController.new);

router.route('/horror/:horror_id')
    .get(horrorController.view)
    .delete(horrorController.delete);

// Export API routes
module.exports = router;