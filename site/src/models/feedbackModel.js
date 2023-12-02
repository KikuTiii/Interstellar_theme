var database = require("../database/config")

function atualizarFeedback(id, txt){
    var query = `INSERT INTO feedback (fkUsuario, textoFeedback) VALUES ('${id}', '${txt}');`

    return database.executar(query)
}

module.exports = {
    atualizarFeedback
}