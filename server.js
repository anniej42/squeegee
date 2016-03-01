var google = require('googleapis');
var customsearch = google.customsearch('v1');
const CX = '010335386721245577896:2b1-dmghx1y';
const API_KEY = 'AIzaSyAxG2VaoKrkV5gztGfUlAZdUCdAH-0NFso';
var request = require('request');
// const googleImages = require('google-images');
// var client = googleImages('010335386721245577896:2b1-dmghx1y', 'AIzaSyAxG2VaoKrkV5gztGfUlAZdUCdAH-0NFso');
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.enable('view cache');


app.post('/getURL', function(req, res) {
    var cat = req.body.category;
    // console.log(cat);
    //   client.search(cat, {
    //     size: 'extra large'
    //   }).then(function (images) {
    //     console.log("then")
    //      var i = Math.floor(Math.random() * 10);
    //      var url = images[i].url;
    //      res.send(url);
    //   });
    customsearch.cse.list({ cx: CX, q: cat, auth: API_KEY, searchType: "image", fileType: "png, jpg", imgSize: "xlarge", safe: "medium", }, function(err, resp) {
        if (err) {
            console.log('An error occured', err);
            return;
        }
        // Got the response from custom search
        var imgURLs = [];
        for (var i = 0; i < resp.items.length; i++) {
            imgURLs.push(resp.items[i].link);
        }
        var i = ~~(Math.random() * 10);
        for (var j = 0; j < 10; j++) {
            request(imgURLs[i], function(error, response, body) {
                if (error) {
                    i = (i + 1) % 10;
                } else if (response.statusCode == 200) {
                    break;
                }
            })
        }

        res.send(imgURLs[i]);


        // console.log('Result: ' + resp.searchInformation.formattedTotalResults);
        // if (resp.items && resp.items.length > 0) {
        //     console.log('First result name is ' + resp.items[0].title);
        // }
    });
});
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000");
