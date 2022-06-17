const express = require('express')
const app = express()
const server = require('http').Server(app)

const PORT = process.env.PORT || 9008
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})