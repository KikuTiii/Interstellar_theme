var database = require("../database/config")

function rank() {
    var query = `SELECT * FROM stats ORDER BY acertos limit 3`;
    console.log("Executando a instrução SQL: \n" + query);

    return database.executar(query);
} 

module.exports = {
    rank
}