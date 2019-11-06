
// created an object to save the state of my application after my fetch so I may access my list of movies, if necessary, without having to make another fetch call
let movies = {
    horror: [],
    comedy: [],
    action: []
}

// grabbing the elements that I'll need to manipulate from the DOM. These elements are already on the DOM at page load
let movieContainer = document.querySelector("div.movie-container")
let horrorList = document.getElementById("horror")
let comedyList = document.getElementById("comedy")
let actionList = document.getElementById("action")
let formButton = document.querySelector("button[data-id='add-movie']")
let toolsDiv = document.getElementsByClassName("tools")[0]
let selectTag = toolsDiv.querySelector("select")

// A helper function that takes in a string, that is the genre, and uses that string to return a DOM element
function getGenreContainer(genre) {
    return document.getElementById(`${genre}`)
}
// A helper function that allows me to pass in a string for the genre and make a GET request for all the movies under that genre
function fetchMoviesByGenre(genre) {
    fetch(`http://localhost:4000/${genre}`)
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            //find the key of the applicable genre inside of the movies object defined on line 3 and set it equal to the data response from our fetch
            movies[`${genre}`] = data
            //for each movie object in our api response, call the appendMovie function
            data.forEach(function (movie) {
                // helper function that takes 3 arguments: a movie object, a container that the movie will be appended to, and a string that is the genre of the movie
                appendMovie(movie, /*defined on line 18*/getGenreContainer(`${genre}`), genre)
            })
        })
}

// A function that calls the helper function fetchMoviesByGenre 3 times, passing in a different genre each time the function is called.
function fetchAllMovies() {
    fetchMoviesByGenre("comedy")
    fetchMoviesByGenre("horror")
    fetchMoviesByGenre("action")
}

//defined on line 38
fetchAllMovies()


// function that takes in an id, genre, and a DOM element. Sends a delete reques for the movie and removes the node from the DOM
function deleteMovie(id, genre, node) {
    fetch(`http://localhost:4000/${genre}/${id}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            accepts: "application/json"
        },
    })
    node.remove()
}

//Function that takes in a movie object, genre, and a castMember object. Pessimistically sends a PATCH request to add the castMember to the movie
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

// Takes in a movie object and genre, sends a POST request and pessimistically adds that movie to the DOM
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

// A function that takes in a cast member object and returns an li 
function createCastLi(castMember) {
    let li = document.createElement("li")
    li.innerHTML = `<h5>Name:</h5><p>${castMember.name}</p>
    <h5>Character:</h5><p>${castMember.character}</p>`
    return li
}

//Function that takes in a movie object and a genre and returns an li
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

//Function that takes in a movie object and a genre and returns an li specifically to be used for the movie "show" page
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

//Function that takes in a movie object, a DOM element, and a genre. Creates an li for the movie and adds an event listener to the li 
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
            //defined on line 49
            deleteMovie(e.target.dataset.id, e.target.dataset.genre, e.target.parentNode.parentNode)
        } else if (e.target.tagName === "IMG") {
            let movie = movies[`${e.target.dataset.genre}`].find(function (movie) { return movie.id === parseInt(e.target.dataset.id) })
            movieContainer.innerHTML = ` <div class="tools"><button >Go Back</button></div><ul class="movie-list" style="list-style-type:none;"></ul> `
            movieContainer.querySelector("ul").append(/*defined on line 100*/createShowPageLi(movie, e.target.dataset.genre))
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
                //defined on line 38
                fetchAllMovies()

            })
        }
    })

}


// add eventlistener to the button that is suppose to render a form when it is clicked
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

    //now that the form is added to my DOM I can grab it and add an event listener to it
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
        //defined on line 76
        addMovie(newMovie, submittedForm.genre.value)
        toolsDiv.replaceChild(formButton, div)


    })

    //Beginning of the form refactor. Adds a listener to the button that will add inputs to the form when it is clicked
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

//Adds event listener to the dropdown
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
            //defined on line 38
            fetchAllMovies()
            break;
        case "horror":
            comedyList.style.display = "none"
            actionList.style.display = "none"
            horrorList.innerHTML = ""
            horrorList.style.display = "block"
            //defined on line 23
            fetchMoviesByGenre("horror")
            break;
        case "comedy":
            horrorList.style.display = "none"
            actionList.style.display = "none"
            comedyList.innerHTML = ""
            comedyList.style.display = "block"
            //defined on line 23
            fetchMoviesByGenre("comedy")
            break;
        case "action":
            comedyList.style.display = "none"
            horrorList.style.display = "none"
            actionList.innerHTML = ""
            actionList.style.display = "block"
            //defined on line 23
            fetchMoviesByGenre("action")
            break;
        default:
            break;
    }
})