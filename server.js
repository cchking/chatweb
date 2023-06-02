const express = require('express')
const app = express()
// const port = Math.floor(Math.random() * (3000 - 6001) + 6001)
const port = 8080
const Gun = require('gun')

app.use(Gun.serve)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = app.listen(port, () => {
  console.log(`Gun server running on port ${port}🔥`)
})

Gun({ web: server })