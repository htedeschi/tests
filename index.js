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
    res.render("socket");
    res.end();
});

app.post("/socket", function (req, res) {
    name = req.body.name;
    email = req.body.email;
    phone = req.body.phone;
    age = req.body.age;
    isAPerson = req.body.isAPerson;

    var response = { success: true, name, email, phone, age, isAPerson };
    res.json(response);
    io.emit('post received', response);
    res.end();
});


var clients = [];

io.on('connection', function (socket) {
    console.log("Client connected!", socket.id);
    clients.push({ client_id: clients.length, socket_id: socket.id });
    console.log("clients var: ", clients);
    io.emit("user connected", socket.id);

    socket.on('disconnect', function () {
        console.log("Client disconnected!", socket.id);
        clients.splice(clients.findIndex(item => item.socket_id === socket.id), 1)
        console.log("clients var: ", clients);
        io.emit("user disconnected", socket.id);
    });
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