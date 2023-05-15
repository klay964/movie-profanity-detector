const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.route('/').get(videoController.getVideo);

module.exports = router;
