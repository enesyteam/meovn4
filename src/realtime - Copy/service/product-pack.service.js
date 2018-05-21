/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function() {
    'use strict';

    angular.module('mRealtime')
      .service('ProductPackService', ["$http", "firebaseService", function($http, scope, firebaseService) {
        // console.log(firebaseService);
        var ref = firebase.database().ref();

        var Product = {
          id : null,
          name : 'Product Name',
          size : 10,
          pack : null,
          number : 1,
        }

        var Pack = {
          length : 10,
          width : 10,
          height : 10,
          weight : 100,
        }

        

        return {
            Product: Product,
            Pack : Pack
        }
      }])
})();