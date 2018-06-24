const rajaongkir = require('rajaongkir-node-js')
// masukan api-key tipe akun
const request = rajaongkir('38bbe5b097bf93c6a63656f53c136afa', 'starter')

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
    // console.log("Connected & Listen to port 3100");
    // console.log(connection);
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
    var data = {};
    data["Data"] = "Hello skripsi!";
    res.json(data);

});

// GET ALL PRODUCTS
app.get('/get_products/:limit',function (req,res) {
    var limit = req.params.limit;
    var data = {
    };
    connection.query("SELECT * FROM product limit "+limit, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-produtcs';
            res.json(data);

        }
    })
});

// GET product discount
// alamat dikunjungi
// '/get_products_discount/free_sale/:limit'
// '/get_products_discount/end_year/:limit'
// '/get_products_discount/get_one/:limit'
// '/get_products_discount/event/:limit'

app.get('/get_products_discount/:discount/:limit',function (req,res) {
    var limit = req.params.limit;
    var event = req.params.discount;
    str_q = "SELECT * FROM product where "+event+" = 1 limit "+limit;

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-produtcs';
            res.json(data);

        }
    })
});
// # get single produk #
app.get('/get_product_detail/:id',function (req,res) {
    var id = req.params.id;
    str_q = "SELECT * FROM product where id = "+id;

    var data = {};
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-produtcs';
            res.json(data);
        }
    })
});


// # get single produk #
app.get('/search_product_by_name/:keyword',function (req,res) {
    var keyword = req.params.keyword;
    str_q = "SELECT * FROM product WHERE name LIKE '"+keyword+"%'";

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-produtcs';
            res.json(data);
        }
    })
});

// # get product favorite #
app.get('/get_products_favorite/',function (req,res) {
    var keyword = req.params.keyword;
    str_q = "SELECT * FROM product order by sold desc limit 4";

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-produtcs';
            res.json(data);
        }
    })
});



// # get chart that never been checkouted #
app.get('/get_charts/',function (req,res) {
    var keyword = req.params.keyword;
    str_q = "select * from chart c inner join product p on p.id = c.product_id where c.checkout = 0";

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["products"] = rows;
            res.json(data);

        } else{
            data["products"] = 'no-charts';
            res.json(data);
        }
    })
});

// # get total chart that must be paid
app.get('/get_total_chart/',function (req,res) {
    var keyword = req.params.keyword;
    str_q = "select sum(amount * price) total_charted from chart c inner join product p on p.id = c.product_id where c.checkout = 0";

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data["total_chart"] = rows;
            res.json(data);

        } else{
            data["total_chart"] = 'no-charts';
            res.json(data);
        }
    })
});

// # get total chart that must be paid
app.get('/get_bank_list/',function (req,res) {
    var keyword = req.params.keyword;
    str_q = "select * from bank";

    var data = {};
    console.log(str_q);
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data = rows;
            res.json(data);

        } else{
            data = 'no-charts';
            res.json(data);
        }
    })
});

// # get bank detail #
app.get('/get_bank_detail/:id',function (req,res) {
    var id = req.params.id;
    str_q = "SELECT * FROM bank where id = "+id;

    var data = {};
    connection.query(str_q, function (err, rows, fields) {

        if (rows.length !=0){
            data = rows;
            res.json(data);

        } else{
            data = 'no-bank';
            res.json(data);
        }
    })
});

app.get('/insert_to_chart/:id/:number/',function (req,res) {
    var id = req.params.id;
    var number = req.params.number;
    var data ={
        "error":true,
    };

    var x = connection.query("UPDATE product SET stok = stok - ?, sold = sold + ? WHERE product.id = ?"
        ,[number, number, id],function(err,rows,fields){
            if(!!err){
                data["error"] = true;
            }else{
                data["error"] = false;
                data["message"] = "Chart berhasil disimpan";
            }
            res.json(data);
        });

    var x = connection.query("INSERT INTO chart(product_id,amount, checkout) VALUES (?,?,?) ",[id , number,0],function(err,rows,fields){});


});

app.get('/update_chart',function (req,res) {
    var id = req.params.id;
    var number = req.params.number;
    var data ={
        "error":true,
    };

    var x = connection.query("UPDATE chart SET checkout =  ? WHERE chart.checkout = ?"
        ,[1, 0],function(err,rows,fields){
            console.log(err);
            if(!!err){
                data["error"] = true;
            }else{
                data["error"] = false;
                data["message"] = "Chart berhasil diupdate";
            }
            res.json(data);
        });
});

// 
app.get('/get_provinces/',function (req,res) {
 var Request = require("request");

 var http = require("https");

 var options = {
  "method": "GET",
  "hostname": "api.rajaongkir.com",
  "port": null,
  "path": "/starter/province",
  "headers": {
    "key": "38bbe5b097bf93c6a63656f53c136afa"
}
};
var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
});

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
});
});





req.end();
res.json(1);
console.log('ini');
console.log(res);

});     