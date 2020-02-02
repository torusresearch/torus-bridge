var messages = {}
var messageQueue = []
var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()
app.use(express.json())
var {
  randID
} = require('./utils')

// called by dapp
app.post('/request', (req, res) => {
  var id = randID()
  messages[id] = {
    id,
    input: req.body,
  }
  messageQueue.push(messages[id])
  res.send(messages[id])
})

app.get('/response', (req, res) => {
  var id = req.query.id
  if (messages[id]) {
    res.send(messages[id])
  } else {
    res.status(400).send(`could not find id ${id}`)
  }
})

// called by torus
app.get('/process', (req, res) => {
  var message = messageQueue.shift()
  res.send(message)
})

app.post('/processed', (req, res) => {
  var id = req.body.id
  if (messages[id]) {
    messages[id].output = req.body
    res.send(messages[id])
  } else {
    res.status(400).send(`could not find id ${id}`)
  }
})

// debug
app.get('/state', (req, res) => {
  res.send({
    messages,
    messageQueue
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