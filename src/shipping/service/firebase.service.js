/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('mShipping')
  .service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter, scope) { 
    var ref = firebase.database().ref();
  var getStatuses = function() {
      return ref.child('statuses').orderByChild('allow_change').equalTo(1).once('value', function(snapshot) {
      });
  }
  // get all members actived
  var getMembers = function() {
      return ref.child('members').orderByChild('status').equalTo(1).once('value', function(snapshot) {
      });
  }

	//authientication
	var createFirebaseUser = function(email, password){
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
	}

  
  /**
  * Convert date from 12315648465 to YYYYMMDD
  * @param  {d}  date in miliseconds
  * @return {string} date YYYYMMDD
  */
  var convertDate = function(d){
      return d.getFullYear() + ("0"+(d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
  }

  
  var getTodayReport = function(){
        var today = new Date();
        var reportDateString = convertDate(today);
        return ref.child('report').child(reportDateString).once('value', function(snapshot) {
        });
    }
  var getNewOrders = function() {
      return ref.child('newOrders').orderByChild('publish_date').limitToLast(100).once('value', function(snapshot) {
          // console.log(snapshot.val());
      });
  }
  var getTodayUsersReport = function(){
        var today = new Date();
        var reportDateString = convertDate(today);

        return ref.child('report').child(reportDateString).child('userReport').once('value', function(snapshot) {
          console.log(snapshot.val());
        });
    }

  var getShippingItems = function() {
        return new Promise(function(resolve, reject) {
          var shippingItems = [];
          let shippingRef = ref.child('shippingItems').limitToLast(100);
          shippingRef.on('child_added', snapshot => {
              shippingItems.push({
                  id: snapshot.val().id,
                  data : snapshot.val().data,
              });
          });
          resolve(shippingItems);
        });
    }

  var getShippingItem = function(id){
    return ref.child('shippingItems').orderByChild('id').equalTo(id).once('value', function(snapshot){
      // console.log(snapshot.val());
      // return snapshot.val()
      
      
    })
  }

  /**
  * Convert date from 12315648465 to YYYYMMDD
  * @param  {d}  date in miliseconds
  * @return {string} date YYYYMMDD
  */
  var convertDate = function(d){
      return d.getFullYear() + ("0"+(d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
  }

  /**
  * Change day report value
  * @param  {date}  date in YYMMDD
  * @param  {statusIdBefor}  status id before changing
  * @param  {statusIdAfter}  status change to
  * @return
  */
  var getNodeNameByStatus = function(statusId){
      var nodeName = '';
      switch(statusId){
          case 1:
              nodeName = 'notCalledCount';
              break;
          case 3:
              nodeName = 'penddingCount';
              break;
          case 5:
              nodeName = 'callLaterCount';
              break;
          case 6:
              nodeName = 'successCount';
              break;
          case 7:
              nodeName = 'cancelCount';
              break;
          case 8:
              nodeName = 'blockedCount';
              break;
          case 9:
              nodeName = 'missedCount';
              break;
          default: break;
      }
      return nodeName;
    }

  /**
  * Add new order to database
  * @param  {orderData}  order data as json object
  * @return {object} response
  */
  var onAddNewOrder = function(orderData){
    return new Promise(function(resolve, reject) {
        var updates = {};
        updates['/newOrders/' + orderData.id] = orderData;
        return firebase.database().ref().update(updates).then(function(){
          // success add new order, we need to update report
          // first we need to check if today report exist, if not we will append new report
          ////////////////////////////////////////////////
          ////////// UPDATE DAY REPORT
          // first weneed to check what day to update report
          var today = new Date();
          var reportDateString = convertDate(today);
          // check if exist today report record
          ref.child('report').orderByChild('date').equalTo(reportDateString).once('value', function(snapshot){
              if(snapshot.val() !== null){
                  // exist => update data
              } else {
                  // not exist => create 
                  ref.child('report').child(reportDateString).transaction(function(){
                      return {
                          calledCount : 0,
                          date : reportDateString,
                          blockedCount : 0, //8
                          callLaterCount : 0, //5
                          cancelCount : 0, // 7
                          penddingCount : 0, //3
                          missedCount : 0, //9
                          notCalledCount : 0, //1 <====== neet to init value here
                          successCount : 0, //6
                          lastSuccessAt: 0,
                          today : 0,// <====== neet to init value here
                      }
                  });
                  // update data
                  // changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter);
              }
              // BEGIN UPDATE REPORT
              var nodeName = getNodeNameByStatus(orderData.status_id);
              // update today report
              ref.child('report').child(reportDateString).child('today').transaction(function(oldValue){
                  return oldValue + 1;
              });
              ref.child('report').child(reportDateString).child(nodeName).transaction(function(oldValue){
                  return oldValue + 1;
              });

              // update user report
              if(orderData.seller_will_call_id){
                ref.child('report').child(reportDateString).child('userReport').child(orderData.seller_will_call_id).child(nodeName).transaction(function(oldValue){
                    return oldValue + 1;
                });
              }
              
          });
          // END UPDATE DAY REPORT
          resolve('Cập nhật thành công!');
        }).catch(function(error){
          reject('Lỗi: ' + error);
        });
    });
  }



	return{
		getMembers : getMembers,
		getTodayReport :        getTodayReport,
    getTodayUsersReport:    getTodayUsersReport,
    getStatuses : getStatuses,
    getNewOrders : getNewOrders,
    onAddNewOrder : onAddNewOrder,
    getShippingItems : getShippingItems,
    getShippingItem : getShippingItem,
	}

}]);

})();