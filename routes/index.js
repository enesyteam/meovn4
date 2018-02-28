
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