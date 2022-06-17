const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const server = require('http').Server(app);

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
  console.log('/:room', req.params.room);
  res.render('room', { roomId: req.params.room });
});

const PORT = process.env.PORT || 9008;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
