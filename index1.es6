require('dotenv').config();
// Declare Variables:
const express = require('express');
const movieData = require("./data.json");
const cors = require('cors');
const axios = require('axios').default;
const apiKey = process.env.API_KEY;


const app = express();
app.use(cors());
const PORT = 3000;


//routes
app.listen(PORT, handleListen);
app.get("/favorite", handleFavoritePage)
app.get("/test", handleHomePage);
app.get("/home", handleMovie);
app.get("/trending", hendleTrendMovie);
app.get("/searchMovieOne", handleSearchOne);
app.get("/searchMovieTwo", handleSearchTwo);
app.use(handleError);
//functions
function hendleTrendMovie(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US?api_key=${apiKey}`;
    console.log("hello");
    axios.get(url)
        .then(result => {
            let recipes = result.data.results.map(movie => {
                return new Movie(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            });
            res.json(recipes);
        })
        .catch((err) => {
            handleError(err, req, res);



        });
}
function handleSearchOne(req, res) {
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US${movieName}&apiKey=${apiKey}`;
    axios.get(url)
        .then(result => {
            res.json(result.data.results)
        })
        .catch((err=>{
            handleError(err, req, res);
        }));
}
function handleSearchTwo(req, res) {
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2${movieName}&apiKey=${apiKey}`;
    axios.get(url)
        .then(result => {

            res.json(result.data.results)
        })
        .catch((err=>{
            handleError(err, req, res);
        }));
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
function handleFavoritePage(req, res) {
    res.send("Welcome to Favorite Page");
}
function Movie1(title, poster_path, overview) {
    this.title = title;
    this.timeposter_path = poster_path;
    this.overview = overview;
}
function handleMovie(req, res) {
    let newMovie = new Movie1(movieData.title,movieData.poster_path,movieData.overview);
    res.json(newMovie);
}
function handleError(error, req, res) {
    res.status(500).send(error)
}