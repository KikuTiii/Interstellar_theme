var express = require("express");
var router = express.Router();

var feedbackController = require("../controllers/feedbackController");


router.post("/atualizarFeedback", function (req, res) {
feedbackController.atualizarFeedback(req, res)
})

module.exports = router