const {JsonDB, Config} = require('node-json-db')
const db = new JsonDB(new Config("./db/database.json", true, true, "/"))
module.exports = db