var express = require("express"),
    logfmt = require("logfmt"),
    ColorThief = require("color-thief"),
    http = require("http");

var colorThiefColors = function(image) {
    var colorThief = new ColorThief(),
        numberOfColors = 3,
        quality = 3;
    return colorThief.getPalette(image, numberOfColors, quality);
};

var findColors = function(image, res) {
    res.set('Access-Control-Allow-Origin', '*')
    res.send({
        colors: colorThiefColors(image)
    });
};

var runServer = function() {
    var app = express();

    app.use(logfmt.requestLogger());

    app.get('/img/*', function(req, res) {
        http.get(req.params[0], function(httpRes) {
            var data = [];
            httpRes.on('data', function(chunk) {
                data.push(chunk);
            });
            httpRes.on('end', function() {
                data = Buffer.concat(data);
                findColors(data, res);
            });
        }).on('error', function(e) {
            console.log("Error: " + e.message);
        });
    });

    var port = Number(process.env.PORT || 5000);
    app.listen(port, function() {
        console.log("Listening on " + port);
    });
};

exports.runServer = runServer;
