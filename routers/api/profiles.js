const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/Profile');

// $router GET api/users/lcurrent
// @desc 返回current user
// @access private
router.get('/test', (req, res) => {
	res.json('works');
});

module.exports = router;
