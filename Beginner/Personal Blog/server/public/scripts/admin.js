const articleForm = document.getElementById("article_form")
const articleFormWindow = document.getElementById("article_form_window")

window.addEventListener("click", (e) => {
    if(e.target === articleFormWindow) {
        articleFormWindow.classList.toggle("hidden")
    }
})

window.addEventListener("load", (e) => {
    setTimeout(() => {
        const cards = document.querySelectorAll(".article_card")
        
        cards.forEach((card) => {
            card.querySelector("#edit_btn").classList.toggle("hidden")
            card.querySelector("#del_btn").classList.toggle("hidden")
        })
    }, 1000)
})

//Create Article
function toggleCreateWindow() {
    articleForm.setAttribute("action", "/createPost")
    articleForm.setAttribute("method", "POST")
    document.getElementById("article_id").setAttribute("value", "")
    document.getElementById("article_title").setAttribute("value", "")
    document.getElementById("article_content").innerHTML = ""
    articleFormWindow.classList.toggle("hidden")
}



//Editing Post
async function toggleEditWindow(id) {
    
    articleForm.setAttribute("action", "/editPost")
    articleForm.setAttribute("method", "PUT")
    document.getElementById("article_id").setAttribute("value", id)
    fetch(`/post?id=${id}`, {method: "GET"})
        .then(response => response.json())
        .then(response => {
            response = response[0]
            document.getElementById("article_title").setAttribute("value", response.title)
            document.getElementById("article_content").innerHTML = response.content
        })
    articleFormWindow.classList.toggle("hidden")
}

articleForm.addEventListener("submit", (e) => {
    console.log("Triggered event listener")
    e.preventDefault()

    const id = document.getElementById("article_id").value
    const title = document.getElementById("article_title").value
    const content = document.getElementById("article_content").value
    formData = {title, content}
    console.log(formData)
    console.log(articleForm.method)

    
    if (articleForm.method === "post") {
        fetch(`/createPost`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(formData)
        })
            .then(refreshArticles())
        articleFormWindow.classList.toggle("hidden")
        window.location.href = "/"
        return
    } else if (articleForm.method === "get") {
        fetch(`/editPost?id=${id}`, {
            method: "PUT",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(formData)
        })
            .then(refreshArticles())
        articleFormWindow.classList.toggle("hidden")
        window.location.href = "/"
        return
    }
})

//Delete Article
function deleteArticle(id) {
    userConfirm = confirm("Are you sure you want to delete the post")

    if(userConfirm) {
        fetch(`/deletePost?id=${id}`, {method:"DELETE"})
            .then(response => {
                if (response.ok) {
                    refreshArticles()
                    alert("Post successfully deleted")
                } else {
                    alert("Some server error, please try again later")
                }
            })
    }
}