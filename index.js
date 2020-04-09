document.addEventListener('DOMContentLoaded', () =>{
    const horror = document.getElementById('horror')
    const comedy = document.getElementById('comedy')
    const action = document.getElementById('action')
    const baseUrl = 'http://localhost:4000'
    const tools = document.querySelector('.tools')
    tools.addEventListener('change', (e) => {
        if (e.target.name === 'genre-dropdown'){
            if (e.target.value === 'horror') {
                clearMovies()
                fetchMovies('horror', horror)
            }
            if (e.target.value === 'comedy') {
                clearMovies()
                fetchMovies('comedy', comedy)
            }
            if (e.target.value === 'action') {
                clearMovies()
                fetchMovies('action', action)
            }
            if (e.target.value === 'all') {
                clearMovies()
                fetchMovies('horror', horror)
                fetchMovies('comedy', comedy)
                fetchMovies('action', action)
            }
        }
    })
    document.addEventListener('click', (e) => {
        if (e.target.dataset.id === 'add-movie') {
            createForm()
        }
        else if (e.target.className === 'del-btn'){
            let genre = e.target.parentNode.parentNode.id
            let id = e.target.dataset.id
            e.target.parentNode.remove()
            fetch(`${baseUrl}/${genre}/${id}`,{
                method: 'DELETE'
            })
                .then( res => res.json())
                .then(console.log('movie has been deleted'))
        }
    })

    tools.addEventListener('submit', (e) => {
        e.preventDefault()
        title = e.target.title.value
        duration = e.target.duration.value
        cover = e.target.cover.value
        cast = e.target.cast.value
        genre = e.target.dropdown.value

        fetch(`${baseUrl}/${genre}`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              'title': title,
              'duration-in-hours': duration,
              'cover': cover,
              'cast': cast,
            })
        })
    })
    function createForm() {
        form = document.createElement('form')
        form.innerHTML = `
            <label for="title">Title:</label><br>
            <input type="text" id="title" name="title" value=""><br>
            <label for="duration">Hours:</label><br>
            <input type="number" id="duration" name="duration" value=""><br>
            <label for="cover">Cover:</label><br>
            <input type="text" id="cover" name="cover" value=""><br>
            <label for="cast">Cast Member:</label><br>
            <input type="text" id="cast" name="cast" value=""><br><br>
            <select name="dropdown">
                <option value="horror">Horror</option>
                <option value="comedy">Comedy</option>
                <option value="action">Action</option>
            </select>
            <input type="submit" value="Submit">
        `
        tools.append(form)
    }
    function fetchMovies(genre, parentNode) {
        fetch(`${baseUrl}/${genre}`)
            .then(response => response.json())
            .then(movies => {
                renderMovie(movies, parentNode)
            })
    }
    function renderMovie(movies, parentNode) {
        movies.forEach(movie => {
            li = document.createElement('li')
            li.setAttribute('class', 'movie-card')
            li.innerHTML = `
                <h5> Title: ${movie.title} </h5>
                <p> Duration-in-hours: ${movie['duration-in-hours']}</p>
                <img src="${movie.cover}">
                <button class='del-btn' data-id=${movie.id}> Delete</button>
            `
            parentNode.appendChild(li)
        })
    }
    function clearMovies() {
        horror.innerHTML = ''
        action.innerHTML = ''
        comedy.innerHTML = ''
    }
    fetchMovies('horror', horror)
    fetchMovies('comedy', comedy)
    fetchMovies('action', action)
})