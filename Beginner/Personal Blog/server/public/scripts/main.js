//Post Handling
function refreshArticles() {
    fetch("/posts", {method: "GET"})
        .then(response => response.json())
        .then(response => {
            document.getElementById("articles").innerHTML = ""
            console.log(response)
            response.forEach(article => {
                document.getElementById("articles").innerHTML += `
                    <div class="article_card">
                        <div class="card_title"> 
                            <h3 class="card_title_text">${article.title}</h3>
                        </div>
                        <div class="card_body">
                            <p class="card_body_text">${article.content}</p>
                        </div>
                        <div class="card_modification_btns">
                            <button type="button" class="card_button" onclick="showArticle('${article.id}')">Show</button>
                            <button type="button" class="card_button hidden" id="edit_btn" onclick="toggleEditWindow('${article.id}')">Edit</button>
                            <button type="button" class="card_button hidden" id="del_btn" onclick="deleteArticle('${article.id}')">Delete</button>
                        </div>
                    </div>
                `
            })
    })
}

//Load Articles
window.addEventListener("load", refreshArticles())

//Show Article
articleInfoWindow = document.querySelector(".article_info_window")

function showArticle(id) {
    fetch(`/post?id=${id}`, {
        method: "GET",
        headers: {"content-type": "application/json"}
    })
        .then(response => response.json())
        .then(response => {
            response = response[0]
            document.querySelector(".article_info_window").innerHTML = `
                <div class="article_info_content_box">
                    <div class="article_info_title_box">
                        <h1 class="article_info_title">${response.title}</h1>
                    </div>
                    <p class="article_info_content">${response.content}</p>
                </div>
            `
        })
    articleInfoWindow.classList.toggle("hidden")
}

window.addEventListener("click", (e) => {
    if(e.target === articleInfoWindow) {
        articleInfoWindow.classList.toggle("hidden")
    }
})

//Login window toggle
const loginBtn = document.getElementById("login_btn")
const loginWindow = document.getElementById("loginWindow")

toggleLoginWindow = function() {
    loginWindow.classList.toggle("hidden")
}

window.addEventListener("click", (e) => {
    if(e.target === loginWindow) {
        loginWindow.classList.toggle("hidden")
    }
})

const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", (e) => {
    e.preventDefault

    const pass = document.getElementById("loginPass")

    fetch("/login", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({pass:pass})
    })
})

function logout() {
    fetch("/logout", {
        method: "POST",
        credentials: "include",
        headers: {"content-type": "application/json"},
    })
        .then(res => {
            if(res.ok) {
                window.location.href = "/"
            }
        })
}