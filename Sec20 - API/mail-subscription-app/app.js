const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.listen(3000, () => console.log('Server running at port 3000'));