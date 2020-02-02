function randID() {
  return ~~(Math.random() * 1000000)
}

module.exports = {
  randID
}