(function() {
  'use strict';

  angular.module('mGHN', []);

  angular.module('mGHN')
        .service('MGHNService', ["$http", function($http) {
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

            return {
                setAccessToken : setAccessToken,
                getHubs : getHubs
            }

        }]);
}());