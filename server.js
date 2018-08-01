// # SimpleServer
// A simple chat bot server
// import facebookAuth from './facebook';

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

var viettelAPI = require('./routes/viettelAPI');


var app = express();

// facebookAuth( app );
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
app.get('/tim-kiem',  routes.search);
app.get('/printing',  routes.printing);
app.get('/tracking',  routes.orderManager);
app.get('/permissions',  routes.permissions);
app.get('/versions',  routes.versions);
app.get('/facebookLogin',  routes.facebookLogin);


app.use('/viettelAPI', viettelAPI);

app.post('/viettelAPI/getToken', (req, res, next) => {
  var clientServerOptions = {
      uri: 'https://api.viettelpost.vn/api/user/Login',
      body: JSON.stringify(req.body),
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
  }
  request(clientServerOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        res.send(body);
      }
      else{
        res.send(error);
      }
  });
})

app.post('/viettelAPI/getHubs', (req, res, next) => {
  var clientServerOptions = {
      uri: 'https://api.viettelpost.vn/api/setting/listInventory',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "Token": req.body.Token
      }
  }
  request(clientServerOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        res.send(body);
      }
      else{
        res.send(error);
      }
  });
})

app.post('/viettelAPI/calculateShippingFee', (req, res, next) => {
  // console.log( req.body);
  console.log( req.body);
  var clientServerOptions = {
      uri: 'https://api.viettelpost.vn/api/tmdt/getPrice',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "Token": req.body.Token
      },
      body: JSON.stringify(req.body.data)
  }
  request(clientServerOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        res.send(body);
      }
      else{
        res.send(error);
      }
  });
})

app.post('/viettelAPI/createOrder', (req, res, next) => {
  
  var clientServerOptions = {
      uri: 'https://api.viettelpost.vn/api/tmdt/InsertOrder',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "Token": req.body.token
      },
      body: JSON.stringify(req.body.data)
  }
  request(clientServerOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        res.send(body);
      }
      else{
        res.send(error);
      }
  });
})

app.post('/viettelAPI/cancelOrder', (req, res, next) => {
  // console.log( req.body);
  var clientServerOptions = {
      uri: 'https://api.viettelpost.vn/api/tmdt/UpdateOrder',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "Token": req.body.token
      },
      body: JSON.stringify(req.body.data)
  }
  request(clientServerOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        res.send(body);
      }
      else{
        res.send(error);
      }
  });
})

// router.post('/getHubs', (req, res, next) => {
//   // console.log(req.body.Token);
//     request.post({
//       url: 'https://api.viettelpost.vn/api/setting/listInventory',
//       headers: {
//           "content-type": "application/json",
//           "Token": req.body.Token
//       },
//   }, function (error, response, body){
//       if (!error && response.statusCode == 200) {
//               // console.log(body)
//               res.send(body);
//           }
//   });
// })




// router.post('/viettel-api/getToken', function(req, res) {
//   console.log('aâ');
//      request(options, function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//               // Print out the response body
//               console.log(body)
//           }
//       }) 
// });

// app.get('/viettel-api',  routes.viettelAPI);

// var post_options = {
//       host: 'closure-compiler.appspot.com',
//       port: '80',
//       path: '/compile',
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(post_data)
//       }
//   };

// var env = process.env.NODE_ENV || 'development';

// // development only
// if (env === 'development') {
//   app.use(express.errorHandler());
// }

// app.use(cors());

// app.use(express.static(path.join(__dirname, 'assets')));
// app.use('/static', express.static('public'))
app.use('/assets', express.static('assets'));
// app.use('/.well-known', express.static('.well-known'));
app.use('/node_modules', express.static('node_modules'));
app.use('/src', express.static('src'));
// app.use('/', express.static('/'));
app.use('/.well-known/acme-challenge/gx5GvW0PmeakR8yp8WAhiynFB6UI11ByQ3GYbcqSFWA', function(req, res){
  res.send('gx5GvW0PmeakR8yp8WAhiynFB6UI11ByQ3GYbcqSFWA.SBLbOilz-zrV-eombMwRGxSBH8mQqDcb7KUWINz-1JQ')
});
app.use('/.well-known/acme-challenge/EuV09eZen43ChXDglnaYwQ8yDPTV-H8cOhxIWXYV6Js', function(req, res){
  res.send('EuV09eZen43ChXDglnaYwQ8yDPTV-H8cOhxIWXYV6Js.SBLbOilz-zrV-eombMwRGxSBH8mQqDcb7KUWINz-1JQ')
});
app.use('/aecfc0c614dc.html', function(req, res){
  res.send('d08a576e9328')
});

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