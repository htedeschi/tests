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

    incoming = req.body.Body;
    answer = findAppropriateAnswer(incoming);

    if (answer === undefined || answer.length == 0)
        answer = "I'm sorry, I could not understand. Here are some things you can say: ```schedule```, ```cancel appointment```";

    client.messages
        .create({
            body: `${answer}`,
            from: 'whatsapp:+14155238886',
            to: req.body.From
        })
        .then(message => console.log(message.sid))
        .done();

    // console.log(answer, incoming);

    res.setHeader('Content-Type', 'text/xml');
    res.status(200);
    res.end();
});


function findAppropriateAnswer(incoming) {
    var listAnswer = [];

    if (/\bhi\b/g.test(incoming) || /\bhello\b/g.test(incoming) || /\bgreetings\b/g.test(incoming)) {
        listAnswer.push("Hello! How can I help?");
        listAnswer.push("Hi! 😊 What do you need today?", "What's up?");
    }

    if (/\bschedule\b/g.test(incoming) || /\bcalendar\b/g.test(incoming) || /\bagenda\b/g.test(incoming)) {
        listAnswer.push("Sweet! Which day would you like to schedule to?");
        listAnswer.push("Ok! let's take care of that, what day you want to schedule?");
    }

    var rand = listAnswer[Math.floor(Math.random() * listAnswer.length)];
    return rand;
}