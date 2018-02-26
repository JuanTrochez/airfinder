var express = require('express');
var router = express.Router();
var userController = require('../controllers/usersController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  userController.index(req, res);
});

//Get single user by its id
router.get('/:id', function(req, res, next) {
	userController.user_detail(req, res);
});

router.post('/create', function(req, res, next) {
	userController.user_create_post(req, res);
});

router.post('/login', function(req, res, next) {
	userController.user_login_post(req, res);
});

router.get('/contact/:userId', function(req, res, next) {
	userController.user_contact_get(req,res);
});

router.post('/search', function(req, res, next) {
	userController.user_search(req, res);
});

router.post('/search/custom', function(req, res, next) {
	userController.user_search_by_criteria(req, res);
});


module.exports = router;
