# JS-Practice

## Focus

- Full-scale DOM manipulation
- Fetch Requests
- Problem Solving in JavaScript

## Preface

You have a `db.json` with a list of movies that can be found at `http://localhost:4000/horror`, `http://localhost:4000/comedy`, and `http://localhost:4000/action`. Run your `db.json` and complete the deliverables below

## Deliverables

- have an index page that lists of the movie cards (an `li` with class `movie-card`) for every movie in the database
- have 1 button and 1 dropdown at the top of the index page
    - the dropdown menu should have options for: `all movies`, `comedy`, `action`, and `horror`
    - when one is selected, the page should show only the movies of that genre (or all movies if `all movies` is clicked)
    - the button should have innerText `add movie` which renders a form that allows a User to enter the `title`, `duration-in-hours`, `cover`, and at least one `cast` member and *optimistically* add that movie to the database

- Each movie card (an `li` with class `movie-card`) should show the following:
    - `title`
    - `duration-in-hours`
    - `cover`
    - button with innerText `view cast`
        - When this button is clicked, a list of the cast members should display with the names of the characters they play
    - button that allows a User to *optimistically* delete a movie from the database

- When a User clicks on a movie cover the page should:
    - display only the movie card for the movie that was clicked
    - display a button with innerText `go back`, that, when clicked, will render the index page again
    - display a button with innerText `add cast member` that allows a User to *optimistically* add a cast member to the movie

## BONUS

- refactor your app so that the changes to your DOM happens *pessimistically*
- refactor your `add movie` form to have a button with innerText `additional cast`, that, when clicked, adds additional input(s) for a User to create the movie with multiple cast members if necessary
