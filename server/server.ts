'use strict';

const fs = require('fs');
const path_srv = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const ROOT = path_srv.resolve(__dirname);
const mongoConfig = {
    url: 'mongodb://192.168.99.100:32768',
    database: 'processes-of-bank',
    collection: 'processes'
};

let db;

MongoClient.connect(mongoConfig.url, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error: ', err);
    } else {
        console.log('Connection established to ', mongoConfig.url);
        db = client.db(mongoConfig.database);
    });

app.set('port', process.env.PORT || 3000);
app.use(cookieParser('Electron Service Worker'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("It's my first express http server");
    console.log("It's my first express http server");
});

app.route('/categories')
    .get(function (req, res) {
        let requestBody = req.body;
        let filter = {
            "type":"category"
        };
        db.collection(mongoConfig.collection)
            .find(filter)
            .toArray(function (err, data) {
                if (err) console.log(err);
                res.send(JSON.stringify(data));
            });
    });

app.route('/categories/:category_id')
    .get(function (req, res) {
        let requestBody = req.body;
        let category_id = req.params.category_id;
        let filter = {
            "_id": category_id,
            "type":"category"
        };
        db.collection(mongoConfig.collection)
            .find(filter)
            .toArray(function (err, data) {
                if (err) console.log(err);
                res.status(200).send(JSON.stringify(data));
            });
    });

app.route('/categories/:category_id/segments')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/segments')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/segments/:segment_id')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/segments/:segment_id/groups')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/groups')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/groups/:group_id')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/groups/:group_id/processes')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/processes')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.route('/processes/:process_id')
    .get(function (req, res) {
        res.status(200).send("OK");
    });

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

let options = {
    key: fs.readFileSync('certificates/key.pem'),
    cert: fs.readFileSync('certificates/cert.pem'),
    passphrase: 'Vimsvei'
};
let srv = require('spdy')
    .createServer(options, app)
    .listen(app.get('port'), () => {
        console.log(`Listening on: https://localhost:${srv.address().port}`);
    });

module.exports = app;