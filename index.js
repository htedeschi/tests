const PORT = process.env.PORT || 5000

var express = require("express");
var bodyParser = require('body-parser');

// Twilio info
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

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
    client.messages
        .create({
            body: `Hello there! You sent:"${req.body.Body}"`,
            from: 'whatsapp:+14155238886',
            to: req.body.From
        })
        .then(message => console.log(message.sid))
        .done();

    res.setHeader('Content-Type', 'text/xml');
    res.status(200);
    res.end();
});
