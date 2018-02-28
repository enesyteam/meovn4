// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var morgan = require('morgan');
var router = express();
path = require('path');

routes = require('./routes');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);


app.get('/',  routes.index);
app.get('/realtime',  routes.realtime);
app.get('/login',  routes.login);
app.get('/shipping',  routes.shipping);

// var env = process.env.NODE_ENV || 'development';

// // development only
// if (env === 'development') {
//   app.use(express.errorHandler());
// }

// app.use(express.static(path.join(__dirname, 'assets')));
// app.use('/static', express.static('public'))
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use('/src', express.static('src'));
app.use('/', express.static('/'));

app.get('/webhook', function(req, res) {
	console.log(res);
  // if (req.query['hub.verify_token'] === 'anh_hoang_dep_trai_vo_doi') {
  //   res.send(req.query['hub.challenge']);
  // }
  // res.send('Error, wrong validation token');
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});