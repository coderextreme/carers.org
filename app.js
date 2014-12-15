var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

var port = 8080;
app.listen(port);
console.log('http server started on port %s', port);
