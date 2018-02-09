var express = require('express');
var router = express.Router();
var userController = require('../controllers/usersController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  userController.index(req, res);
});


//Get single user by it's id
router.get('/:id', function(req, res, next) {
	userController.user_detail(req, res);
});

router.post('/create', function(req, res, next) {
	userController.user_create_post(req, res);
});

module.exports = router;
