var database = require("../database/config")

function atualizar(id, acertos, erros){
    var query = `INSERT INTO stats (acertos, erros, fkusuario) VALUES '${acertos}', '${erros}', '${id}';`

    return database.executar(query)
}

module.exports = {
    atualizar
}