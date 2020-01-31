var messages = {}
var messageQueue = []
var express = require('express')
var app = express()
app.use(express.json())

function randID() {
  return ~~(Math.random() * 1000000)
}


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

app.listen(3000)