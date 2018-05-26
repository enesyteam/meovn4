// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var morgan = require('morgan');
var router = express();
var path = require('path');

var cors = require('cors');


const PORT = process.env.PORT || 5000

routes = require('./routes');

var app = express();


app.use(logger('dev'));

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
  extended: true
}));
var server = http.createServer(app);


app.get('/',  routes.navigation);
app.get('/admin',  routes.index);
app.get('/sale',  routes.realtime);
app.get('/login',  routes.login);
app.get('/shipping',  routes.shipping);
app.get('/ship',  routes.ship);
app.get('/telesale',  routes.sale);
app.get('/printing',  routes.printing);
app.get('/tracking',  routes.orderManager);
app.get('/permissions',  routes.permissions);
app.get('/versions',  routes.versions);

// var env = process.env.NODE_ENV || 'development';

// // development only
// if (env === 'development') {
//   app.use(express.errorHandler());
// }

// app.use(cors());

// app.use(express.static(path.join(__dirname, 'assets')));
// app.use('/static', express.static('public'))
app.use('/assets', express.static('assets'));
app.use('/.well-known', express.static('.well-known'));
app.use('/node_modules', express.static('node_modules'));
app.use('/src', express.static('src'));
// app.use('/', express.static('/'));

app.get('/webhook', function(req, res) {
	// console.log(res);
  if (req.query['hub.verify_token'] === 'meovn') {
    res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong validation token');
  res.send(req);
});

app.post('/printService', function(req, res) {
	console.log(req);
	setTimeout(function(){

        res.send(JSON.stringify({
            firstName: req.body.Email,
            lastName: req.body.lastName
        }));

    }, 1000)
});

app.post('/printing#/PrintMultiInvoice', function(req, res) {
  console.log(req);
  setTimeout(function(){

        res.send({
          'id' : '3qư43'
        });

    }, 1000)
});

app.get('/terms', function(req, res) {
  res.send('Terms page');
});

app.get('/privacy', function(req, res) {
  res.send('Privacy page');
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));

// development mode
  // server.listen(app.get('port'), app.get('ip'), function() {
  //   console.log("Meo server listening at %s:%d ", app.get('ip'), app.get('port'));
  // });
// productione mode
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));