const express = require('express');

var app = express();

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://karttasovUser:karttasov2018@ds157538.mlab.com:57538/aikatauludb';

app.get("/:Stop_Code", function (req, res) {

    var number = req.params.Stop_Code;
    //console.log(number);
    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var collec = kanta.collection('Timetables');

        collec.find({ Stop_Code: { $regex: number+'.*' } }).toArray(function (err, response) {
            //console.log(response);
            database.close();
            res.send(response);
        });
    });
});

app.get("/", function (req, res) {

    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var collec = kanta.collection('Timetables');

        collec.find().toArray(function (err, response) {
            database.close();
            res.send(response);

        });


    });
});
app.post("/update", function (req, exres) {
    var stop = req.body.Stop_Code;
    var time = req.body.Time;

    console.log(req.body);

    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var collec = kanta.collection('Timetables');

        collec.update(
            { Stop_Code: stop },
            { $addToSet: { Times: time } }

        ,function (err, res) {
            if (err) {
                database.close();
                return console.log(err);
            }

            // Success
            database.close();
            exres.send(res);
        }
        )
});
});
module.exports = app;