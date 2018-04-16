var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var multer = require('multer');
var crypto = require('crypto');
var s = require('multer');
var uuid = unique_id();
var js2xmlparser = require("js2xmlparser");


var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webservice_commerce',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


http.listen(3100, '0.0.0.0',function(){
    console.log("Connected & Listen to port 3100");
    console.log(connection);
    app.use('/image', express.static(path.join(__dirname, 'image')));
});

connection.connect(function (err) {
    if (!err){
        console.log("Database terkoneksi");
    } else {
        console.log("Database tidak terhubung");
    }
})

function unique_id() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

app.get('/',function(req,res){
    data["Data"] = "Hello skripsi!";
    res.send(js2xmlparser.parse("person", data));
});

// GET ALL PRODUCTS
app.get('/get_products',function (req,res) {
    var data = {
    };
    connection.query("SELECT * FROM products", function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.send(js2xmlparser.parse("products", data));
        } else{
            data["products"] = 'no-produtcs';
            res.send(js2xmlparser.parse("products", data));
        }
    })
});