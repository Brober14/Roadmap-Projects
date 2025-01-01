const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const routing = require("./routes/routes.js")


//Load env file
require('dotenv').config()

//Server init
const app = express()
const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use('/', routing)

//Running server
app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`)
}) 