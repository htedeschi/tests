const PORT = process.env.PORT || 5000

var express = require("express");
var bodyParser = require('body-parser');
var ejs = require('ejs');

// Twilio info
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("views", "views");
app.set("view engine", "ejs");

http.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});

app.get("/", function (req, res) {
    res.send("Page under construction");
    res.end();
});

app.post("/whatsapp/message/send", function (req, res) {

    incoming = req.body.Body;
    answer = findAppropriateAnswer(incoming);

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

app.get("/socket", function (req, res) {
    store = { open: true, time_opens: "10:00 AM", time_closes: "5:00 PM" }
    res.render("socket", store);
    res.end();
});

app.post("/socket", function (req, res) {
    name = req.body.name;
    phone = req.body.phone;
    store_open = req.body.store_open;

    var response = { success: true, name, phone, store_open };

    res.json(response);

    io.emit('new name', response);

    if (store_open) {
        io.emit('store update', store_open);
    }

    res.end();
});


function findAppropriateAnswer(incoming) {
    var listAnswer = [];
    var success = false;

    if (/\bhi\b/gi.test(incoming) || /\bhello\b/gi.test(incoming) || /\bgreetings\b/gi.test(incoming)) {
        listAnswer.push("Hello! How can I help?");
        listAnswer.push("Hi! 😊 What do you need today?", "What's up?");
        success = true;
    }

    if (/\bschedule\b/gi.test(incoming) || /\bcalendar\b/gi.test(incoming) || /\bagenda\b/gi.test(incoming)) {
        listAnswer.push("Sweet! Which day would you like to schedule to?");
        listAnswer.push("Ok! let's take care of that, what day you want to schedule?");
        success = true;
    }

    if (/\bvitali\b/gi.test(incoming)) {
        listAnswer.push("Pibe Chorro!");
        listAnswer.push('La tuya! 🇦🇷');
        success = true;
    }

    if (!success) {
        return "I'm sorry, I could not understand. Here are some things you can say: _schedule appointment_, _cancel appointment_";
    }

    var rand = listAnswer[Math.floor(Math.random() * listAnswer.length)];
    return rand;
}