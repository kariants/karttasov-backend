const express = require('express');

var app = express();

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://karttasovUser:karttasov2018@ds157538.mlab.com:57538/aikatauludb';


app.get("/:num", function (req, res) {
    var number = req.params.num.toUpperCase();

    //console.log(number);
    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var collec = kanta.collection('Routes');

        collec.find({ Line_Code: { $regex: number + '.*' } }).toArray(function (err, response) {
            //console.log(response);
            database.close();
            res.send(response);
        });
    });

});
app.get("/", function (req, res) {

    MongoClient.connect(MONGO_URL, (err, database) => {
        var kanta = database.db("aikatauludb");
        var collec = kanta.collection('Routes');

        collec.find().toArray(function (err, response) {
            database.close();
            res.send(response);

        });
    });
});


app.post("/new", function (req, exres) {

    var agency = req.body.Agency;
    var line_num = req.body.Line_Code;
    var desc = req.body.Description;
    var stop_code = req.body.Stop_Code;

    //console.log(req.body);

    MongoClient.connect(MONGO_URL, (error, database) => {
        if (error) {
            return console.log(error);
        }
        // Do something with db here, like inserting a record

        var kanta = database.db("aikatauludb");

        var collec = kanta.collection('Routes');

        collec.update(
            {Line_Code: line_num},
            {
                Agency: agency,
                Line_Code: line_num,
                Desc: desc,
                Stop_Code: stop_code
            },
            { upsert: true },
            function (err, res) {
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
app.post("/remove", function (req, exres) {
    var line_num = req.body.Line_Code;

    MongoClient.connect(MONGO_URL, (error, database) => {
        if (error) {
            return console.log(error);
        }
        // Do something with db here, like inserting a record

        var kanta = database.db("aikatauludb");

        var collec = kanta.collection('Routes');

        collec.remove(
            { Line_Code: line_num },
            {
                justOne: true
            }, function (err, res) {
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