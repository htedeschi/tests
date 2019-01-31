const PORT = process.env.PORT || 5000

var express = require("express");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});


app.get("/", function (req, res) {
    res.send("Page under construction");
    res.end();
});

app.post("/whatsapp/message/send", function (req, res) {
    var obj = { success: true, request: req.body };

    console.log(obj);

    res.setHeader('Content-Type', 'application/json');
    res.json(obj);
    res.end();
});
