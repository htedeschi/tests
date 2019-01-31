const PORT = process.env.PORT || 5000

// var ejs = require("ejs");
// const nodemailer = require("nodemailer");
var express = require("express");
var bodyParser = require('body-parser');

var app = express();
// app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// app.set("views", "views");
// app.set("view engine", "ejs");


app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});


app.get("/", function (req, res) {
    console.log(JSON.stringify({ success: true, request: req, response: res }));
    res.send("Page under construction");
    res.end();
});