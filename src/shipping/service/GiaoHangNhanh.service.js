/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function() {
    'use strict';

    angular.module('mShipping')
        .service('GiaoHangNhanhService', ["$http", function($http) {
          var token = "5a0baf851070b03e4d16f4cb";
          var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          }

          /*
          * tracking an order by order code
          */
          var trackingOrder = function(orderCode) {
              return new Promise(function(resolve, reject) {
                var data = {
                    "token": token,
                    "OrderCode": orderCode
                }

                $http.post('https://console.ghn.vn/api/v1/apiv3/OrderInfo', data, config)
                    .then(function(response) {
                        resolve(response);
                    });
              })
          }

          var cancelOrder = function(orderCode){
            return new Promise(function(resolve, reject) {
                var data = {
                    "token": token,
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

          /*
          * get all available hubs from giao hang nhanh
          */
          var getAllHubs = function(){
            var data = {
                "token": token
            }
            return new Promise(function(resolve, reject) {
              $http.post('https://console.ghn.vn/api/v1/apiv3/GetHubs', data, config)
                .then(function(data) {
                  resolve(data.data.data);
                })
                .catch(function(err) {
                  reject(err);
                });
            });

            
          }


          return {
            trackingOrder : trackingOrder,
            cancelOrder : cancelOrder,
            getAllHubs : getAllHubs,
          }
      }])
})();