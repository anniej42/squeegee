const googleImages = require('google-images');
var client = googleImages('010335386721245577896:2b1-dmghx1y', 'AIzaSyAxG2VaoKrkV5gztGfUlAZdUCdAH-0NFso');
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser')
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(__dirname + '/public'));
app.enable('view cache');

// app.get('/getURL', function(req, res) {
//       console.log("starting");
//       client.search('Steve Angello', {
//         size: 'large'
//       }).then(function (images) {
//          var i = Math.floor(Math.random() * 10);
//          var url = images[i].url;
//          res.send(url);
//       });
// });


app.post('/getURL', function(req, res) {
    var cat = req.body.category;
      client.search(cat, {
        size: 'extra large'
      }).then(function (images) {
         var i = Math.floor(Math.random() * 10);
         var url = images[i].url;
         res.send(url);
      });
});
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000");
