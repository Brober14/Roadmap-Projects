const router = require("express").Router()
const path = require("path")
const adminAuth = require("../middleware/adminAuth.js")
const {createPost, editPost, getPosts, getPost} = require("../middleware/postHandling.js")
const uuidv4 = require("uuid").v4

const sessions = {}
//main Page load
router.get("/", (req, res) => {
    time = new Date().getTime()
    cookies = req.headers.cookie?.split(";")
    sessionCookie = cookies.filter(val => val.split?.("=")[0].trim() == "session")[0]
    sessionId = sessionCookie?.split("=")[1]
    userSession = sessions[sessionId]
    if(!userSession) {
        res.sendFile(path.join(__dirname, "../view/main.html"))
        return
    }
    if (time < userSession.expireAt) {
        res.sendFile(path.join(__dirname, "../view/admin.html"))
    } else {
        console.log("Session Expired")
        res.redirect("/logout")
    }
    
})

//Authorization
router.post("/login", adminAuth, (req, res) => {
    time = new Date().getTime()
    sessionId = uuidv4()
    sessions[sessionId] = {
        'user' : 'admin',
        'expireAt' : (time + (30 * 60 * 1000))
    }
    res.set('Set-Cookie', `session=${sessionId}`)
    res.redirect('/')
})

router.post("/logout", (req, res) => {
    console.log("logout called")
    cookies = req.headers.cookie?.split(";")
    sessionCookie = cookies.filter(val => val.split?.("=")[0].trim() == "session")[0]
    sessionId = sessionCookie?.split("=")[1]

    delete sessions[sessionId]
    res.clearCookie("session")
    res.status(200).send()
})


//Post Handling
router.get("/posts", getPosts)
router.get("/post", getPost)
router.post("/createPost", createPost)
router.put("/editPost", editPost)
router.delete("/deletePost", editPost)

module.exports = router