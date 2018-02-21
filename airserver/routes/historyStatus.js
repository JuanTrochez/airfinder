var express = require('express');
var router = express.Router();
var historyStatusController = require('../controllers/historyStatusController')

/* GET history status listing. */
router.get('/', function(req, res, next) {
	historyStatusController.index(req, res);
});

//Get single history status by its id
router.get('/:id', function(req, res, next) {
	historyStatusController.history_status_detail(req, res);
});

router.post('/create', function(req, res, next) {
	historyStatusController.historyStatus_create_post(req, res);
});

router.post('/create/multiple', function(req, res, next) {
	historyStatusController.historyStatus_create_multiple_post(req, res);
});


module.exports = router;
