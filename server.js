var google = require('googleapis');
var customsearch = google.customsearch('v1');

// API keys for google custom search
const CX = '010335386721245577896:2b1-dmghx1y';
const API_KEY = 'AIzaSyAxG2VaoKrkV5gztGfUlAZdUCdAH-0NFso';

var request = require('request');
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

app.use('/semantic', express.static(__dirname + '/node_modules/semantic-ui-css'));
app.use('/nprogress', express.static(__dirname + '/node_modules/nprogress'));


app.post('/getURL', function(req, res) {

    // uses body parser to parse the post request
    var cat = req.body.category;
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

        // pick random result fromr returned items, ~~ is shorthand for Math.floor
        var i = ~~(Math.random() * resp.items.length);

        for (var j = 10; j > 0; j--) {
            request(imgURLs[i], function(error, response, body) {
                if (error) {
                    i = (i + 1) % resp.items.length;
                } else if (response.statusCode == 200) {
                    j = -1;
                }
            })
        }

        res.send(imgURLs[i]);
    });
});
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000");
