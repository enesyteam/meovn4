/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('mRealtime')
  .service('firebaseService', ["$filter", function ($filter, scope) { 

	var ref = firebase.database().ref();

	var endTime = new Date(); // today
        var startTime = new Date(); // yesterday

    startTime.setDate(startTime.getDate() - 4); // get 4 recent days
    endTime.setDate(endTime.getDate());
    startTime = startTime.getTime();
    endTime = endTime.getTime();

    var getOrders = function() {
        return ref.child('orders').orderByChild('created_at').startAt(startTime).endAt(endTime).limitToLast(100).once('value', function(snapshot) {
        });
    }
    // v4
    var getNewOrders = function() {
        return ref.child('newOrders').orderByChild('publish_date').limitToLast(100).once('value', function(snapshot) {
            // console.log(snapshot.val());
        });
    }
    var getSources = function() {
        return ref.child('sources').orderByChild('active').equalTo(1).once('value', function(snapshot) {
        });
    }
    var getPacks = function() {
        return ref.child('packs').orderByChild('active').equalTo(1).once('value', function(snapshot) {
        });
    }

    return {
    	getOrders : getOrders,
    	getSources : getSources,
    	getPacks : getPacks,
        getNewOrders : getNewOrders,
    }

}])
})();
