var express = require('express');
var router = express.Router();
var historyStatusController = require('../controllers/historyStatusController')

/* GET users listing. */
router.get('/', function(req, res, next) {
	historyStatusController.index(req, res);
});

//Get single user by its id
router.get('/:id', function(req, res, next) {
	historyStatusController.user_detail(req, res);
});

router.post('/create', function(req, res, next) {
	historyStatusController.user_create_post(req, res);
});


module.exports = router;
