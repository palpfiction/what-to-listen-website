
// init project
const express = require('express');
const app = express();
const getAlbum = require('./what-to-listen');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/get-album', async function(req, res) {
  if (!req.query.user) res.status(400).send("username is required");
  const period = req.query.period || "overall";
  const times = req.query.times || 10;
  const result = await getAlbum(req.query.user, period, times);
  
  if (!result || result.status === "error") res.status(500).send( { error: "internal error" });
  if (result.status === "found") res.send( { album: result.result } );
  if (result.status === "notFound") res.send( { } );
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
