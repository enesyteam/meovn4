/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function() {
    'use strict';

    angular.module('mPrinting')
      .factory('PrintService', ["$http", function($http, scope) {
        // console.log(firebaseService);
        // var ref = firebase.database().ref();

        var selectedOrders = [];

        var addOrderToPrint = function(order){
          if(order.selected == true){
            selectedOrders.push(order);
          }
        }

        var getOrdersToPrint = function(){
          console.log(selectedOrders);
          return selectedOrders;
        }

        

        return {
            selectedOrders: selectedOrders,
            addOrderToPrint : addOrderToPrint,
            getOrdersToPrint : getOrdersToPrint,
        }
      }])
})();