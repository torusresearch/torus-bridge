var requestQueue = []
var responseQueue = []
var express = require('express')
var fs = require('fs')
var https = require('https')
var cors = require('cors')
var app = express()
app.use(express.json())
app.use(cors())

// called by dapp
app.post('/dappOutgoing', (req, res) => {
  requestQueue.push(req.body)
  res.send({
    data: 'message received'
  })
})

app.get('/dappIncoming', (req, res) => {
  var data = responseQueue.shift()
  res.send({
    data
  })
})

// called by torus
app.get('/walletIncoming', (req, res) => {
  var data = requestQueue.shift()
  res.send({
    data
  })
})

app.post('/walletOutgoing', (req, res) => {
  responseQueue.push(req.body)
  res.send({
    data: 'message received'
  })
})

// debug
app.get('/state', (req, res) => {
  res.send({
    requestQueue,
    responseQueue
  })
})
if (process.env.HTTPS_ENABLED) {
  var key = fs.readFileSync('ssl/server.key')
  var cert = fs.readFileSync('ssl/server.crt')
  https.createServer({
    key,
    cert
  }, app).listen(443)
} else {
  app.listen(3000)
}