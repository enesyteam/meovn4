(function() {
  'use strict';

  angular.module('mFirebase', []);

  angular.module('mFirebase')
        .service('MFirebaseService', ["$http", function($http) {

            /*
            * firebase object
            */
            var firebase = null;

            var set_firebase = function(_firebase){
                if(!_firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                firebase = _firebase;
            }

            /*
            * set current giao hang nhanh token
            */
            var set_ghn_token = function(token){
                if(!firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('settings').update({
                        'ghn_access_token' : token
                    })
                    .then(function(response){
                        resolve('Thiết lập GHN token thành công');
                    })
                    .catch(function(err){
                        reject(err);
                    })
                })
                
            }

            /*
            * get current giao hang nhanh token
            */
            var get_ghn_token = function(){
                if(!firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('settings').child('ghn_access_token').once('value', function(snapshot){
                        resolve(snapshot.val());
                    })
                    .catch(function(err){
                        reject(err);
                    })
                })
            }

            /*
            * set current giao hang nhanh token
            */
            var add_fanpage = function(page_data){
                if(!firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('fanpages').push(page_data)
                    .then(function(response){
                        resolve('Thêm page thành công');
                    })
                    .catch(function(err){
                        reject(err);
                    })
                })
            }

            /*
            * edit a fanpage
            */
            var edit_fanpage = function(page_data){
                console.log(page_data);
                if(!firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('fanpages').orderByChild('id').equalTo(page_data.id).once('value', function(snapshot){
                        if(snapshot.val() !== null){
                          angular.forEach(snapshot.val(), function(value, key){
                              // console.log(key);
                              snapshot.ref.child(key).update(page_data);
                            });
                            resolve('Update Fanpage thành công');
                          } else {
                            reject('Không tìm thấy dữ liệu để update');
                          }
                      });
                })
            }

            /*
            * get all pages
            */
            var get_fanpages = function(){
                if(!firebase){
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    var result = [];
                    firebase.database().ref().child('fanpages').on('child_added', snapshot => {
                        result.push({
                              id: snapshot.val().id,
                              name : snapshot.val().name,
                              access_token: snapshot.val().access_token
                          });
                      });
                    resolve(result);
                })
            }

            return {
                set_firebase : set_firebase,
                set_ghn_token : set_ghn_token,
                get_ghn_token : get_ghn_token,
                get_fanpages : get_fanpages,
                add_fanpage : add_fanpage,
                edit_fanpage : edit_fanpage,
            }

        }]);
}());