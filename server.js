
var express = require('express');
var request = require('request');
var morgan = require('morgan');  // log requests to the console

var app = express();

app.use(express.static("dist/ai-challenge"));
app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res, next) {
    res.redirect('/');
});


app.listen(8080, '0.0.0.0');
console.log("Cordyn Queue Manager Console Server is Listening on port 8080");
