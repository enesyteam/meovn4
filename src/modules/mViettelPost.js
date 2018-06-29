(function() {
  'use strict';

  angular.module('mViettel', []);

  angular.module('mViettel')
        .service('MVIETTELService', ["$http", function($http) {
            var config = {
                headers: {
                    'Content-Type': 'Application/json;'
                }
            }

            /*
            * get access token
            */
            var get_access_token = function(data){
                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/getToken', data)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            /*
            * get list of viettel provinces
            */
            var get_viettel_provinces = function(){
              return new Promise(function(resolve, reject) {
                $http.get('/viettelAPI/getProvinces').
                  then(function onSuccess(provinces_data) {
                    // console.log(provinces_data.data)
                    resolve(provinces_data.data);
                  })
                  .catch(function(err){
                    reject('Lỗi xảy ra khi lấy dữ liệu Tỉnh từ Viettel Post: ' + err.statusText)
                  })
                  .finally(function(){

                  })
              })
            }

            /*
            * get list of viettel districs
            */
            var get_viettel_districs = function(){
              return new Promise(function(resolve, reject) {
                $http.get('/viettelAPI/getDistrics').
                  then(function onSuccess(districs_data) {
                    // console.log(districs_data.data)
                    resolve(districs_data.data);
                  })
                  .catch(function(err){
                    reject('Lỗi xảy ra khi lấy dữ liệu Quận/Huyện: ' + err.statusText)
                  })
              })
            }

            /*
            * get list of viettel wards
            */
            var get_viettel_wards = function(){
              return new Promise(function(resolve, reject) {
                $http.get('/viettelAPI/getWards').
                  then(function onSuccess(wards_data) {
                    // console.log(wards_data.data)
                    resolve(wards_data.data);
                  })
                  .catch(function(err){
                    reject('Lỗi xảy ra khi lấy dữ liệu Phường/Xã: ' + err.statusText);
                  })
              })
            }

            /*
            * Get a list of available services
            */
            var get_services = function(data){
                var config = {
                        headers: {
                            'Content-Type': 'Application/json;'
                        }
                      }

                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/getServices', data, config)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            /*
            * Get a list of additional services
            */
            var get_extra_services = function(){
              return new Promise(function(resolve, reject) {
                $http.get('/viettelAPI/getExtraServices').
                  then(function onSuccess(extra_services_data) {
                    resolve(extra_services_data.data);
                  })
                  .catch(function(err){
                    reject('Lỗi xảy ra khi lấy dữ liệu Phường/Xã: ' + err.statusText);
                  })
              })
            }

            /*
            * Get a list of available services
            */
            var get_hubs = function(data){
                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/getHubs', data)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            /*
            * Caculate express price
            */
            var calculate_shipping_fee = function(data){
                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/calculateShippingFee', data)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            /*
            * Create Order item
            */
            var create_order = function(data){
                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/createOrder', data)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            /*
            * Cancel Order item
            */
            var cancel_order = function(data){
                return new Promise(function(resolve, reject){
                    $http.post('/viettelAPI/cancelOrder', data)
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                })
            }

            return {
              get_access_token: get_access_token,
              get_viettel_provinces: get_viettel_provinces,
              get_viettel_districs: get_viettel_districs,
              get_viettel_wards: get_viettel_wards,
              get_services: get_services,
              get_extra_services: get_extra_services,
              get_hubs: get_hubs,
              calculate_shipping_fee: calculate_shipping_fee,
              create_order: create_order,
              cancel_order: cancel_order,
            }

        }]);
}());