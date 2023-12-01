var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");


router.post("/atualizar", function (req, res) {
quizController.atualizar(req, res)
})

module.exports = router