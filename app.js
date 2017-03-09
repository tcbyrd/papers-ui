var express = require('express')
var config = require('./config/config')
var makePdf = require('./bin/makepdf')
var app = express();

makePdf()

module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
