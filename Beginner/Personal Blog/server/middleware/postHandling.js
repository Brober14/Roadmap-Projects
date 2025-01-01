const db = require("../db/dbConfig")
const uuidv4 = require("uuid").v4

createPost = (req, res) => {
    author = "root"
    title = req.body.title
    content = req.body.content

    if (!title || !content) {
        res.status(400).json({error: "Please provide content and author for a post"})
        return
    }

    let article = {
        id: uuidv4(),
        author,
        title,
        content,
        edited: false,
        createdAt: new Date().toLocaleString(),
        editedAt: new Date().toLocaleString(),
    }

    console.log(`${author} has created a post`)
    db.push("/articles[]", article, true)
    res.status(200).json(article)
}

editPost = async (req, res) => {
    postID = req.query.id

    const articles = await db.getData("/articles")

    article = articles.find(article => article.id === postID)

    if(!article) {
        res.status(404).json({error: "Post not found"})
        return
    }

    switch(req.method) {
        case "PUT":
            if(!req.body.content || !req.body.title) {
                res.status(400).json({error: "Please provide new content for the post"})
                break
            }
            article.title = req.body.title
            article.content = req.body.content
            article.edited = true
            article.editedAt = new Date().toLocaleString()
            db.push("/articles", articles, true)
            console.log(">>>Message edited<<<")
            res.status(200).json({message: "Post updated successfully"})
            break
        case "DELETE":
            for (let i = 0; i < articles.length; i++) {
                if (articles[i].id === postID) {
                    db.delete(`/articles[${i}]`)
                    console.log(">>>Post successfully deleted<<<")
                    res.status(200).json({message: "Post deleted successfully"})
                    break
                }
            }
            break
    }
}

getPosts = async (req, res) => {
    const articles = await db.getData("/articles")
    if(!articles) {
        res.status(404).json({error: "No posts found"})
        return
    }

    console.log(">>>Articles requested by client<<<")
    res.status(200).json(articles)
    return
}

getPost = async (req, res) => {
    postID = req.query.id

    const articles = await db.getData("/articles")
    const article = articles.filter(article => postID === article.id)
    if(!article) {
        res.status(404).json({error: "Requested post not found"})
        return
    }

    console.log(">>>Accessed specific article<<<")
    res.status(200).json(article)
}

module.exports = {createPost, editPost, getPosts, getPost}