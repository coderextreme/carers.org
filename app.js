var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function () {
	console.log('express server started on port %s', app.get('port'));
});
