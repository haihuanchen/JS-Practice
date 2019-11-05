let movies = {
    horror: [],
    comedy: [],
    action: []
}
let horrorList = document.getElementById("horror")
let comedyList = document.getElementById("comedy")
let actionList = document.getElementById("action")
let formButton = document.querySelector("button[data-id='add-movie']")
let toolsDiv = document.getElementsByClassName("tools")[0]


function fetchHorror() {
    fetch("http://localhost:4000/horror")
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            movies.horror = resp.horror
            movies.comedy = resp.comedy
            movies.action = resp.action
            movies.horror.forEach(function (movie) { appendMovie(movie, horrorList) })
            movies.comedy.forEach(function (movie) { appendMovie(movie, comedyList) })
            movies.action.forEach(function (movie) { appendMovie(movie, actionList) })
        })
}
function fetchComedy() {
    fetch("http://localhost:4000/comedy")
        .then(function (resp) { return resp.json() })
        .then(function (comedy) {
            movies.comedy = comedy
            movies.comedy.forEach(function (movie) { appendMovie(movie, comedyList) })
        })
}
function fetchAction() {
    fetch("http://localhost:4000/action")
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            movies.horror = resp.horror
            movies.comedy = resp.comedy
            movies.action = resp.action
            movies.horror.forEach(function (movie) { appendMovie(movie, horrorList) })
            movies.comedy.forEach(function (movie) { appendMovie(movie, comedyList) })
            movies.action.forEach(function (movie) { appendMovie(movie, actionList) })
        })
}



function fetchMovies() {
    fetch("http://localhost:4000/movies")
        .then(function (resp) { return resp.json() })
        .then(function (resp) {
            movies.horror = resp.horror
            movies.comedy = resp.comedy
            movies.action = resp.action
            movies.horror.forEach(function (movie) { appendMovie(movie, horrorList) })
            movies.comedy.forEach(function (movie) { appendMovie(movie, comedyList) })
            movies.action.forEach(function (movie) { appendMovie(movie, actionList) })
        })
}
fetchMovies()

function appendMovie(movie, container) {
    let li = document.createElement("li")
    li.innerHTML = `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <h5>Duration in Hours: ${movie["duration-in-hours"]}</h5>
            <img src=${movie.cover}/>
            <button>View Cast</button>
        </div>
        <br/>
    `
    container.append(li)
}

formButton.addEventListener("click", function (e) {
    let form = document.createElement("form")
    form.innerHTML = `
        <input type="text" placeholder="title" name="title"/>
        <input type="number" name="duration" step="0.5" min="0" placeholder="duration in hours" />
        <input type="text" placeholder="cover" name="cover"/>
        <input type="text" placeholder="cast member name" name="cast-name" />
        <input type="text" placeholder="cast member character" name="cast-char" />
        <input type="submit" value="submit"/>
    `
    toolsDiv.replaceChild(form, formButton)

    form.addEventListener("submit", function (e) {
        e.preventDefault()
        let submittedForm = e.target
        let newMovie = {
            title: `${submittedForm.title.value}`,
            "duration-in-hours": `${submittedForm.duration.value}`,
            cover: `${submittedForm.cover.value}`,
            cast: [
                {
                    name: `${submittedForm["cast-name"]}`,
                    character: `${submittedForm["cast-char"]}`
                }
            ]
        }
        toolsDiv.replaceChild(formButton, form)
    })
})