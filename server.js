// Declare Variables:

require('dotenv').config();
const url = "postgres://saleh:12345@localhost:5432/movies" // connect js with databases
const PORT = 3000;
const express = require('express');
const movieData = require("./data.json");
const cors = require('cors');
const axios = require('axios').default;
const apiKey = process.env.API_KEY;
console.log(apiKey);
const {
    Client
} = require('pg')
// const client = new Client(url)
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
 });

 
const app = express();
app.use(express.json());
app.use(cors());
//routes 

//task11
app.get("/", handleMovie);
app.get("/favorite", handleFavoritePage)
//task 12
app.get("/trending", hendleTrendMovie);
app.get("/search", handleSearch);


app.post("/addMovie", handleAddMovie);
app.get("/getAllMovie", handleGetAllMovie)

// app.get("/", handleHomePage);




app.get("/getMoviev1", handleGetMoviev1);
app.delete("/deleteMoviev1/:movieId", handleDeleteMoViev1)
app.put("/updateMovie", handleUpdateMovie)
app.get("*",notFoundHandler);
//function for task 14



//      http://localhost:3000/getMoviev1?movieId=test
function handleGetMoviev1(req, res) {
    const {
        movieId
    } = req.query;
    let sql = 'select * from movie WHERE id = $1;'
    let value = [movieId];
    client.query(sql, value).then((result) => {
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    })
}

//      http://localhost:3000/deleteMoviev1?movieId=test
function handleDeleteMoViev1(req, res) {
    const {
        movieId
    } = req.params;
    let sql = 'delete from movie WHERE id = $1;'
    let value = [movieId];
    client.query(sql, value).then((result =>
        res.send("movie deleted")
    )).catch((err =>
        handleError(err, req, res)
    ))
}

//      http://localhost:3000/updateMovie?movieId=test
function handleUpdateMovie(req, res) {
    const {
        movieId
    } = req.query;
    const {
        id,title,
        release_date,
        poster_path,
        overview
    } = req.body;
    let sql = `UPDATE movie SET id=$1,title=$2,release_date=$3,poster_path=$4,overview=$5 WHERE id=$6 RETURNING *;`;
    let value = [id, title,
        release_date,
        poster_path,
        overview ,movieId
    ]
    client.query(sql, value).then((result => {
        res.send(result.rows)
    }))
}

//functions for task 11,12,13
//      http://localhost:3000/getAllMovie
function handleGetAllMovie(req, res) {
    let sql = 'select * from movie;'
    client.query(sql).then((result) => {
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    })
}

function handleAddMovie(req, res) {
    const {
        id,
        title,
        release_date,
        poster_path,
        overview
    } = req.body;
    let sql = 'INSERT INTO movie(id,title,release_date,poster_path,overview) VALUES($1,$2,$3,$4,$5);';
    let values = [id, title, release_date, poster_path, overview];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows);
    }).catch()
}

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})

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

function handleSearch(req, res) {
    let movieName = req.query.name;
    console.log(apiKey);
    let url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`
    axios.get(url)
        .then(result => {
            console.log("run");
            res.json(result.data.results)
        })
        .catch((err => {
            handleError(err, req, res);
        }));
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
    let newMovie = new Movie1(movieData.title, movieData.poster_path, movieData.overview);
    res.json(newMovie);
}
function notFoundHandler(req,res) {
    res.status(404).send("page not found")
}
function handleError(error, req, res) {
    res.status(500).send(error)
}

