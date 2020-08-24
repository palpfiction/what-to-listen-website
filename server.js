const express = require('express');
const app = express();
const getAlbum = require('./what-to-listen');

app.use(express.static('public'));
app.use(checkHttps);
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

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    console.log("https, yo")
    return next()
  } else {
    console.log("just http")
    res.redirect('https://' + req.hostname + req.url);
  }
}
