carers.org
==========

d3 express twitter sentiment example

$ git clone https://github.com/coderextreme/carers.org

$ cd carers.org/

$ npm install


edit config.js put in

--------------------------------------------------------------------------------
var twitterKeys = {
twitterKey: 'twitter consumer key',
twitterSecret: 'twitter consumer secret',
token: 'token',
secret: 'secret'
}

module.exports = twitterKeys
--------------------------------------------------------------------------------

$ node app.js

visit localhost:8080 and localhost:8080/d3.html
