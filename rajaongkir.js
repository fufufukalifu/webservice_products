// server
//dependencies
const express = require('express')
const router = express.Router()
const rajaongkir = require('rajaongkir-node-js')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const request = rajaongkir('api-key', 'starter')

//express
var app = express()
  app.use('/', router)

  router.post('/bebas/:query',urlencodedParser, function(req, res) {
    const {body, headers, path} = req
    const cost = request.post(body, headers, path)
    cost.catch(err => err).
      then(cost => {
      res.write(cost)
      res.end()
    })
  })

  router.post('/bebas/:path/:query',urlencodedParser, function(req, res) {
    const {body, headers, path} = req
    const waybill = request.post(body, headers, path)
    waybill.catch(err => err).
      then(waybill => {
        res.write(waybill)
        res.end()
    })
  })

  router.get('/bebas/:query', function(req, res) {
    const location = request.get(req.url)
    location.catch(err => console.log(err))
      .then(loc => {
        res.write(loc)
        res.end()
    })
  })

  router.get('/bebas/:path/:query', function(req, res) {
    const location = request.get(req.url)
    location.catch(err => console.log(err))
      .then(loc => {
        res.write(loc)
        res.end()
    })
  })

// node server
var server = app.listen(8080, function() {
	console.log("server berjalan di http://localhost:8080")
})