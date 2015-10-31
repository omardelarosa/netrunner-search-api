var express = require('express')
  , logfmt = require('logfmt')
  , bodyParser = require('body-parser')
  , path = require('path')
  , routes = require('./config/routes');

module.exports.start = function(done){

  // middleware
  var app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/public'));
  app.use(logfmt.requestLogger());

  // bind routes
  routes(app);

  var port = Number(process.env.PORT || 5001);

  var server = app.listen(port, function(){
    console.log('Listening on port ' + port);
    
    if (done) {
      return done(null, app, server);
    }
  });

  server.on('error', function(e){
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use.  Is the server already running?');
    }
    if (done) {
      return done(e);
    }
  });

};


// Run the server if someone runs this file directly
if(path.basename(process.argv[1], '.js') === path.basename(__filename, '.js')) {
  module.exports.start();
}
