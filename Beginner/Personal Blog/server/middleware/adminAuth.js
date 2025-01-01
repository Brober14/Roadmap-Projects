const bcrypt = require("bcrypt")
require("dotenv").config()

module.exports = async (req, res, next) => {
    if(await bcrypt.compare(req.body.pass, process.env.rootHashPass)) {
        next()
    } else {
        res.status(403).send()
    }
}