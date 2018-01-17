var express = require('express');
var router = express.Router();

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

module.exports = router;
