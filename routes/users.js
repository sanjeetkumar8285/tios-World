var express = require('express');
var router = express.Router();
let User = require("../models/User")

/* GET users listing. */
router.get('/', function (req, res, next)
{
  res.send('respond with a resource');
});

module.exports = router;



