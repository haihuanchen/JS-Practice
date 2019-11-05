
let movieContainer = document.querySelector("div.movie-container")
let horrorList = document.getElementById("horror")
let comedyList = document.getElementById("comedy")
let actionList = document.getElementById("action")
let formButton = document.querySelector("button[data-id='add-movie']")
let toolsDiv = document.getElementsByClassName("tools")[0]
let selectTag = toolsDiv.querySelector("select")

function fetchMoviesByGenre(genre) {
    fetch(`http://localhost:4000/${genre}`)
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            data.forEach(function (movie) { appendMovie(movie, getGenreContainer(`${genre}`), genre) })
        })
}

function getGenreContainer(genre) {
    return document.getElementById(`${genre}`)
}

function fetchAllMovies() {
    fetchMoviesByGenre("comedy")
    fetchMoviesByGenre("horror")
    fetchMoviesByGenre("action")
}

fetchAllMovies()

function createCastLi(cast) {
    let li = document.createElement("li")
    li.innerHTML = `<h5>Name:</h5><p>${cast.name}</p>
    <h5>Character:</h5><p>${cast.character}</p>`
    return li
}

function deleteMovie(id, genre, node) {
    console.log(genre)
    fetch(`http://localhost:4000/${genre}/${id}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            accepts: "application/json"
        },
    })
    node.remove()
}

function createMovieLi(movie, genre) {
    let li = document.createElement("li")
    li.innerHTML = `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <h5>Duration in Hours: ${movie["duration-in-hours"]}</h5>
            <img data-id=${movie.id} data-genre=${genre} src=${movie.cover}/>
            <button>View Cast</button>
            <button data-id=${movie.id} data-genre=${genre}>Delete</button>
        </div>
        <br/>
    `
    return li
}

function updateMovie(movie, genre, castMember) {

    fetch(`http://localhost:4000/${genre}/${movie.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            accepts: "application/json"
        },
        body: JSON.stringify({ cast: [...movie.cast, castMember] })
    })
        .then(function (res) { return res.json() })
        .then(function (res) { console.log(res) })
}



function createShowPageLi(movie, genre) {
    let li = document.createElement("li")
    li.innerHTML = `
        <div class="movie-card">
            <h3>${movie.title}</h3>
            <h5>Duration in Hours: ${movie["duration-in-hours"]}</h5>
            <img data-id=${movie.id} data-genre=${genre} src=${movie.cover}/>
            <button data-id=${movie.id} data-genre=${genre}>Add Cast Member</button>
        </div>
        <br/>
    `
    li.querySelector("button").addEventListener("click", function (e) {
        let button = e.target
        let form = document.createElement("form")
        form.dataset.genre = genre
        form.dataset.id = movie.id
        form.innerHTML = `

        <input type="text" placeholder="cast member name" name="cast-name" />
        <input type="text" placeholder="cast member character" name="cast-char" />

        <input type="submit" value="submit"/>
    `
        e.target.parentNode.replaceChild(form, button)

        form.addEventListener("submit", function (e) {
            e.preventDefault()
            console.log("stuff")
            let castMember = { name: e.target["cast-name"].value, character: e.target["cast-char"].value }
            updateMovie(movie, e.target.dataset.genre, castMember)
            button.innerText = "Add Another Cast Member"
            e.target.parentNode.replaceChild(button, form)

        })

    })
    return li
}

function appendMovie(movie, container, genre) {
    let li = createMovieLi(movie, genre)
    container.append(li)
    li.addEventListener("click", function (e) {
        if (e.target.innerText === "View Cast") {
            let castUL = document.createElement("ul")
            castUL.style = "list-style-type:none;"
            movie.cast.forEach(function (cast) {
                let li = createCastLi(cast)
                castUL.append(li)
            })
            e.target.parentNode.append(castUL)
            e.target.innerText = "Hide Cast"

        } else if (e.target.innerText === "Hide Cast") {
            e.target.parentNode.querySelector("ul").remove()
            e.target.innerText = "View Cast"
        } else if (e.target.innerText === "Delete") {
            console.log(e.target.dataset)
            deleteMovie(e.target.dataset.id, e.target.dataset.genre, e.target.parentNode.parentNode)
        } else if (e.target.tagName === "IMG") {
            let movie = movies[`${e.target.dataset.genre}`].find(function (movie) { return movie.id === parseInt(e.target.dataset.id) })
            movieContainer.innerHTML = ` <div class="tools"><button >Go Back</button></div><ul class="movie-list" style="list-style-type:none;"></ul> `
            movieContainer.querySelector("ul").append(createShowPageLi(movie, e.target.dataset.genre))
            movieContainer.querySelector("button").addEventListener("click", function (e) {
                movieContainer.innerHTML = `
                <div class="tools">
                    <button data-id="add-movie">Add Movie</button>
                    <select name="genre-dropdown">
                        <option value="all" default>All Movies</option>
                        <option value="horror">Horror</option>
                        <option value="comedy">Comedy</option>
                        <option value="action">Action</option>
                    </select>
                </div>
                <br />
                <ul class="movie-list" style="list-style-type:none;" id="horror">
                    <h2>Horror Movies:</h2>
                </ul>
                <ul class="movie-list" style="list-style-type:none;" id="comedy">
                    <h2>Comedy Movies:</h2>
                </ul>
                <ul class="movie-list" style="list-style-type:none;" id="action">
                    <h2>Action Movies:</h2>

                </ul>`
                fetchAllMovies()

            })
        }
    })

}


function addMovie(movie, genre) {
    fetch(`http://localhost:4000/${genre}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accepts: "application/json"
        },
        body: JSON.stringify(movie)
    })
        .then(function (res) { return res.json() })
        .then(function (movie) { appendMovie(movie, getGenreContainer(`${genre}`)) })
}

formButton.addEventListener("click", function (e) {
    let additionalInput = 0
    let div = document.createElement("div")
    let form = document.createElement("form")
    form.innerHTML = `
        <input type="text" placeholder="title" name="title"/>
        <input type="number" name="duration" step="0.5" min="0" placeholder="duration in hours" />
        <input type="text" placeholder="cover" name="cover"/>
        <input type="text" placeholder="cast member name" name="cast-name" />
        <input type="text" placeholder="cast member character" name="cast-char"  />
        <select name="genre">
        <option value="" disabled selected>Select Genre</option>
        <option value="comedy">Comedy</option>
        <option value="horror">Horror</option>
        <option value="action">Action</option>
        </select>
        <input type="submit" value="submit"/>
        `
    let button = document.createElement("button")
    button.dataset.id = "add"
    button.innerText = "Additional Cast Member"
    div.append(form, button)
    toolsDiv.replaceChild(div, formButton)

    form.addEventListener("submit", function (e) {
        e.preventDefault()
        console.log(e.target.querySelectorAll("input[data-type='member name']"))
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
        addMovie(newMovie, submittedForm.genre.value)
        toolsDiv.replaceChild(formButton, div)


    })

    div.addEventListener("click", function (e) {
        if (e.target.dataset.id === "add") {
            console.log("stuff")
            let div = document.createElement("div")
            div.innerHTML = `
            <input type="text" placeholder="cast member name" name="cast-name" />
        <input type="text" placeholder="cast member character" name="cast-char" />
            `
            form.querySelector("select").insertAdjacentElement("beforebegin", div)
        }
    })
})

selectTag.addEventListener("change", function (e) {
    console.log(e.target.value)
    switch (e.target.value) {
        case "all":
            comedyList.style.display = "block"
            horrorList.style.display = "block"
            actionList.style.display = "block"
            comedyList.innerHTML = ""
            horrorList.innerHTML = ""
            actionList.innerHTML = ""
            fetchAllMovies()
            break;
        case "horror":
            comedyList.style.display = "none"
            actionList.style.display = "none"
            horrorList.innerHTML = ""
            horrorList.style.display = "block"
            fetchMoviesByGenre("horror")
            break;
        case "comedy":
            horrorList.style.display = "none"
            actionList.style.display = "none"
            comedyList.innerHTML = ""
            comedyList.style.display = "block"
            fetchMoviesByGenre("comedy")
            break;
        case "action":
            comedyList.style.display = "none"
            horrorList.style.display = "none"
            actionList.innerHTML = ""
            actionList.style.display = "block"
            fetchMoviesByGenre("action")
            break;
        default:
            break;
    }
})