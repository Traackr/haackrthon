
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , middleware = require('./middleware')
  , http = require('http')
  , path = require('path')
  , Endpoint = require('express-endpoint')
//  , connectStatsd = require('connect-statsd')
  , hostname = require('os').hostname();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//  app.use(connectStatsd({prefix: 'haackrthon.'+hostname}));
  app.use(middleware.accessLogger());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(Endpoint.static());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(Endpoint.errorHandler());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/docs', routes.docs);

routes.endpoints.forEach(function(endpoint) {
  endpoint.mount(app, ['get', 'post', 'delete', 'put']);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

exports = module.exports = app;
