var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var friendsRouter = require('./friends');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let response = {
    hello: "world",
    test: true,
    number: 4
  };

  res.send(JSON.stringify(response));
});

router.use('/users', usersRouter);
router.use('/friends', friendsRouter);

module.exports = router;
