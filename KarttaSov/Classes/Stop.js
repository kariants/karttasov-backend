const express = require('express');
var app = express();

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://karttasovUser:karttasov2018@ds157538.mlab.com:57538/aikatauludb';

app.get("/:num", function (req, res) {
    var number = req.params.num.toUpperCase();
   // console.log(number);
    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var stop = kanta.collection('Stops');

        var data = stop.find({ Stop_Code: { $regex: number + '.*' }  }).toArray(function (err, response) {
            //console.log(response);
            database.close();
            res.send(response);
        });
    });
});


app.get("/", function (req, res) {

    MongoClient.connect(MONGO_URL, (err, database) => {

        var kanta = database.db("aikatauludb");
        var stop = kanta.collection('Stops');

        stop.find().toArray(function (err, response) {
            database.close();
            res.json(response);

        });


    });
});

app.post("/new", function (req, exres) {

    var code = req.body.Stop_Code;
    var name = req.body.Name;
    var desc = req.body.Desc;
    var pos = req.body.Pos;

    //console.log(req.body);

    MongoClient.connect(MONGO_URL, (err, database) => {
        if (err) {
            return console.log(err);
        }
        // Do something with db here, like inserting a record
        var kanta = database.db("aikatauludb");

        var collec = kanta.collection('Stops');

        collec.update(
            { Stop_Code: code},
            {
                Stop_Code: code,
                Name: name,
                Desc: desc,
                Position: pos,
            },
            { upsert: true },
            function (err, res) {
                if (err) {
                    db.close();
                    return console.log(err);
                }
                database.close();
                exres.send(res);
                
            }
        );
    });

        MongoClient.connect(MONGO_URL, (err, database) => {
            if (err) {
                return console.log(err);
            }
            // Do something with db here, like inserting a record
            var kanta = database.db("aikatauludb");

            collec = kanta.collection("Timetables");

            collec.update(
                { Stop_Code: code },
            {
                Stop_Code: code,
                Times :[]
                },
                { upsert: true }
        ),
            function (err, res) {
                if (err) {
                    db.close();
                    return console.log(err);
                }
                database.close();
               

            }
    });
});
app.post("/remove", function (req, exres) {
    var code = req.body.Stop_Code;

    //console.log(req.body);

    MongoClient.connect(MONGO_URL, (err, database) => {
        if (err) {
            return console.log(err);
        }
        // Do something with db here, like inserting a record
        var kanta = database.db("aikatauludb");

        var collec = kanta.collection('Stops');

        collec.remove(
            { Stop_Code: code },
            {
                justOne: true

            }, function (err, res) {
                if (err) {
                    database.close();
                    return console.log(err);
                }

                // Success
                database.close();
                exres.json(res);
            }
        );
        collec = kanta.collection('Timetables');
        collec.remove(
            { Stop_Code: code },
            {
                justOne: true

            }, function (err, res) {
                if (err) {
                    database.close();
                    return console.log(err);
                }

                // Success
                database.close();
               
            }
        );
    });
});
module.exports = app;