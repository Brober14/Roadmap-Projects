const db = require("./db/dbConfig")

id = 1

console.log(db.getIndex("/articles[]", id))