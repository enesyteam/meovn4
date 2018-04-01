(function() {
  'use strict';

  angular.module('mGHN', []);

  angular.module('mGHN')
        .service('MGHNService', ["$http", function($http, MUtilitiesService) {
            // console.log(MUtilitiesService)
            var access_token = null;
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            /*
            * set access token for giao hang nhanh service
            */
            var setAccessToken = function(token){
                access_token = token;
            }

            var addHub = function(address, districtId, contactName, contactPhone){
                var data = {
                    "token": access_token,
                    "Address": address,
                    "ContactName": contactName,
                    "ContactPhone": contactPhone,
                    "DistrictID": districtId,
                    "Email": "",
                    "IsMain": false,
                    "Latitude": 10.0000001,
                    "Longitude": 108.00000032,
                    "PeCode": "",
                    "SMSPhone": ""
                }

                // console.log(data);
                return new Promise(function(resolve, reject) {
                    if(!data.token || data.token.length == 0){
                        reject('Thiếu GHN token');
                    }
                    $http.post('https://console.ghn.vn/api/v1/apiv3/AddHubs', data, config)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                })
            }

            /*
            * get list of hubs
            */
            var getHubs = function(){
                return new Promise(function(resolve, reject) {
                    var data = {
                        "token": access_token
                    }

                    $http.post('https://console.ghn.vn/api/v1/apiv3/GetHubs', data, config)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                })
            }

            /*
            * get list of Distrcts
            */
            var getDistricts = function(){
                return new Promise(function(resolve, reject) {
                    var data = {
                        "token": access_token
                    }

                    $http.post('https://console.ghn.vn/api/v1/apiv3/GetDistricts', data, config)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(err){
                        reject(err);
                        // AlertError('Lỗi kết nối tới hệ thống GHN', 'Thông báo');
                    });
                })
            }

            var cancelOrder = function(orderCode, access_token){
                return new Promise(function(resolve, reject) {
                    var data = {
                        "token": access_token,
                        "OrderCode": orderCode
                    }

                    $http.post('https://console.ghn.vn/api/v1/apiv3/CancelOrder', data, config)
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(err) {
                            console.log(err);
                            if(err.data){
                              reject(err);
                            } else{
                              reject(err);
                              // AlertError('Không thể hủy đơn hàng', err.xhrStatus);
                            }
                        });
                  })
              }

              var getOrderLog = function(orderCode, created_date, access_token) {
                // console.log(access_token);
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                var data = {
                    "token": access_token, //$rootScope.ghnToken,
                    // "OrderCode": orderCode,
                    "FromTime": created_date,
                    // "ToTime" : Date.now(),
                    "Condition": {
                        // "ShippingOrderID": 60393459,
                        // "CurrentStatus": "ReadyToPick",
                        "CustomerID": 187464,
                        "OrderCode": orderCode,
                    },
                    "Skip": 0
                }
                return new Promise(function(resolve, reject){
                    $http.post('https://console.ghn.vn/api/v1/apiv3/GetOrderLogs', data, config)
                    .then(function(data) {
                        resolve(data);
                    })
                     .catch(function(err) {
                        reject(err);
                    });
                })
            }

            return {
                setAccessToken : setAccessToken,
                getHubs : getHubs,
                addHub : addHub,
                getDistricts : getDistricts,
                cancelOrder : cancelOrder,
                getOrderLog : getOrderLog,
            }

        }]);
}());