var feedbackModel = require("../models/feedbackModel");

function atualizarFeedback(req, res){
    var id = req.body.idFeedback
    var txt = req.body.textoFeedback

    feedbackModel.atualizarFeedback(id,txt).then(function (resultado){
        res.status(200).json(resultado)
    }).catch(function (erro){
        console.log(erro)
        console.log("houve um erro ao realizar put:", erro.sqlMessage)
        // resizeBy.status(500).json(erro.sqlMessage)
    })
}

module.exports = {
    atualizarFeedback
}
