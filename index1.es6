require('dotenv').config();
// Declare Variables:
const express = require('express');
// const movieData = require('./Movie_data/data.json');
const cors = require('cors');
const axios = require('axios').default;
const apiKey = process.env.API_KEY;

// Create app:
const app = express();
app.use(cors());
const PORT = 3000;


//routes

// app.get("/test", handleHomePage);
app.listen(PORT, handleListen);
app.get("/ss", handleHomePage);
app.get("/trending", hendleTrendMovie);
app.get("/searchMovie", handleSearch);

//functions
function hendleTrendMovie(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US?api_key=${apiKey}`;
    console.log("hello");
    axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let recipes = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            });
            res.json(recipes);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")



        });
}

function handleSearch(req, res) {
    // console.log(req.query);
    let movieName = req.query.name; // I chose to call it name
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US${movieName}&apiKey=${apiKey}`;
    axios.get(url)
        .then(result => {
;
            res.json(result.data.results)
        })
        .catch();
    // waiting to get data from 3rd API
    // res.send("Searching for recipes");
}









function handleListen() {
    console.log(`Example app listening on port ${PORT}`);
}


function handleHomePage(req, res) {
    res.send("hello");
}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}