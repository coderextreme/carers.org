var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(express.static(path.join(__dirname, '.')));

http.createServer(app).listen(app.get('port'), function () {
	console.log('express server started visit http://localhost:%s/', app.get('port'));
});

module.exports = app;
