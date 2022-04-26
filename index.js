const express = require('express');
const res = require('express/lib/response');
const movieData = require("./data.json");
const app = express();
const port = 3000;


app.get("/test", handleHomePage);
function handleHomePage(req,res){
    res.send("tesing");
}

app.get("/favorite", handleFavoritePage)
function handleFavoritePage(req, res) {
    res.send("Welcome to Favorite Page");
}


app.listen(port, handleListen);
app.get("/home", handleMovie);
function handleListen() {
    console.log(`Example app listening on port ${port}`);
}

function Movie(title, poster_path, overview) {
    this.title = title;
    this.timeposter_path = poster_path;
    this.overview = overview;
}


function handleMovie(req, res) {
    let newMovie = new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(newMovie);
}



app.use(function(req,res,text){
    res.status(404);
    res.type('text/plain');
    res.send('Not Found');
});

app.get('/',(req,res)=>res.send('500 error'))
app.use(function(err,req,res,text){
    res.type('text/plain');
    res.status(500);
    res.send('internal server error 500');
});