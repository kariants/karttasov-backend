const express = require('express');
const routes = require('./Classes/Routes');
const timeTab = require("./Classes/TimeTables");
const stops = require('./Classes/Stop');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/build"));
app.get('/', function (req, res) {
    res.sendFile(__dirname +'/build/index.html');
});

app.use("/routes", routes);
app.use("/stops", stops);
app.use("/timetables", timeTab);
app.listen(8080);
console.log("server running port 8080");