var path = require('path');
var express = require('express');
var router = express.Router();
var request = require('request');
const axios = require('axios');

// router.post('/getToken', (req, res, next) => {
	
//   if (req.method == 'POST')   {
//         req.on('data', function (data) {
//             request.post(
// 			    'https://api.viettelpost.vn/api/user/Login',
// 			    { json: JSON.parse(data) },
// 			    function (error, response, body) {
// 			        if (!error && response.statusCode == 200) {
// 			            // console.log(body)
// 			            res.send(body);
// 			            next();
// 			        }
// 			        else{
// 			        	res.send(error);
// 			        	next();
// 			        }
// 			    }
// 			);
//         });
//     }
//     else{
//     	res.send(req);
//     	next();
//     }
// })


router.get('/getProvinces', (req, res, next) => {
	request.get(
	    'https://api.viettelpost.vn/api/setting/listallprovince',
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	            res.send(body);
	        }
	    }
	);
})

router.get('/getDistrics', (req, res, next) => {
	request.get(
	    'https://api.viettelpost.vn/api/setting/listalldistrict',
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	            res.send(body);
	        }
	    }
	);
})

router.get('/getWards', (req, res, next) => {
	request.get(
	    'https://api.viettelpost.vn/api/setting/listallwards',
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	            res.send(body);
	        }
	    }
	);
})

router.post('/getServices', (req, res, next) => {
	
  if (req.method == 'POST')   {
        req.on('data', function (data) {
            request.post(
			    'https://api.viettelpost.vn/api/setting/listService',
			    { json: JSON.parse(data) },
			    function (error, response, body) {
			        if (!error && response.statusCode == 200) {
			            // console.log(body)
			            res.send(body);
			        }
			    }
			);
        });
    }
})

router.get('/getExtraServices', (req, res, next) => {
	request.get(
	    'https://api.viettelpost.vn/api/setting/listServiceExtra',
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            // console.log(body)
	            res.send(body);
	        }
	    }
	);
})

// router.post('/getHubs', (req, res, next) => {
// 	// console.log(req.body.Token);
//   	request.post({
// 	    url: 'https://api.viettelpost.vn/api/setting/listInventory',
// 	    headers: {
// 	        "content-type": "application/json",
// 	        "Token": req.body.Token
// 	    },
// 	}, function (error, response, body){
// 	    if (!error && response.statusCode == 200) {
// 	            // console.log(body)
// 	            res.send(body);
// 	        }
// 	});
// })

// router.post('/calculateShippingFee', (req, res, next) => {
// 	// console.log(req.body.data);
//   	request.post({
// 	    url: 'https://api.viettelpost.vn/api/tmdt/getPrice',
// 	    headers: {
// 	        "content-type": "application/json",
// 	        "Token": req.body.token
// 	    },
// 	    json: req.body.data
// 	}, function (error, response, body){
// 	    if (!error && response.statusCode == 200) {
// 	            // console.log(body)
// 	            res.send(body);
// 	        }
// 	});
// })

// router.post('/createOrder', (req, res, next) => {
// 	// console.log(req.body.data);
//   	request.post({
// 	    url: 'https://api.viettelpost.vn/api/tmdt/InsertOrder',
// 	    headers: {
// 	        "content-type": "application/json",
// 	        "Token": req.body.token
// 	    },
// 	    json: req.body.data
// 	}, function (error, response, body){
// 	    if (!error && response.statusCode == 200) {
// 	            // console.log(body)
// 	            res.send(body);
// 	        }
// 	});
// })

// router.post('/cancelOrder', (req, res, next) => {
// 	// console.log(req.body.data);
//   	request.post({
// 	    url: 'https://api.viettelpost.vn/api/tmdt/UpdateOrder',
// 	    headers: {
// 	        "content-type": "application/json",
// 	        "Token": req.body.token
// 	    },
// 	    json: req.body.data
// 	}, function (error, response, body){
// 	    if (!error && response.statusCode == 200) {
// 	            // console.log(body)
// 	            res.send(body);
// 	        }
// 	});
// })


module.exports = router;
