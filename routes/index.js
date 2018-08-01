var path = require('path');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
  // console.log(res);
};

exports.realtime = function (req, res) {
	res.render('realtime');
};

exports.login = function (req, res) {
	res.render('login');
};

exports.shipping = function (req, res) {
	res.render('shipping');
};

exports.printing = function (req, res) {
	res.render('printing');
};


exports.ship = function (req, res) {
	res.sendFile(path.join(__dirname, '../src/ship/index.html'));
};

exports.sale = function (req, res) {
	res.sendFile(path.join(__dirname, '../src/sale/index.html'));
};

exports.search = function (req, res) {
	res.sendFile(path.join(__dirname, '../src/search/index.html'));
};

exports.facebookLogin = function (req, res) {
	res.sendFile(path.join(__dirname, '../src/login/index.html'));
};

exports.orderManager = function (req, res) {
	res.render('orderManager');
};

exports.permissions = function (req, res) {
	res.render('permissions');
};

exports.navigation = function (req, res) {
	// res.render('navigation');
	res.sendFile(path.join(__dirname, '../src/navigation/index.html'));
};

exports.versions = function (req, res) {
	res.render('versions');
};