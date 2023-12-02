var express = require("express");
var router = express.Router();

var rankController = require("../controllers/rankController");

router.get("/rankModel", function (req, res) {
    rankController.rank(req, res);
  }); 

module.exports = router;