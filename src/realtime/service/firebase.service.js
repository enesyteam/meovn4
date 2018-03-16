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
    var getStatuses = function() {
        return ref.child('statuses').orderByChild('allow_change').equalTo(1).once('value', function(snapshot) {
        });
    }
    var getAllMembers = function(){
        return ref.child('members').orderByChild('status').equalTo(1).once('value', function(snapshot) {
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

    /**
    * Change day report value
    * @param  {date}  date in YYMMDD
    * @param  {statusIdBefor}  status id before changing
    * @param  {statusIdAfter}  status change to
    * @return
    */
    var changeReportByStatus = function(date, statusIdBefor, statusIdAfter, user){
        var nodeNameBefore = '';
        switch(statusIdBefor){
            case 1:
                nodeNameBefore = 'notCalledCount';
                break;
            case 3:
                nodeNameBefore = 'penddingCount';
                break;
            case 5:
                nodeNameBefore = 'callLaterCount';
                break;
            case 6:
                nodeNameBefore = 'successCount';
                break;
            case 7:
                nodeNameBefore = 'cancelCount';
                break;
            case 8:
                nodeNameBefore = 'blockedCount';
                break;
            case 9:
                nodeNameBefore = 'missedCount';
                break;
            default: break;
        }

        var nodeNameAfter = '';
        switch(statusIdAfter){
            case 1:
                nodeNameAfter = 'notCalledCount';
                break;
            case 3:
                nodeNameAfter = 'penddingCount';
                break;
            case 5:
                nodeNameAfter = 'callLaterCount';
                break;
            case 6:
                nodeNameAfter = 'successCount';
                break;
            case 7:
                nodeNameAfter = 'cancelCount';
                break;
            case 8:
                nodeNameAfter = 'blockedCount';
                break;
            case 9:
                nodeNameAfter = 'missedCount';
                break;
            default: break;
        }
        // increase nodeNameAfter
        ref.child('report').child(date).child(nodeNameAfter).transaction(function(oldValue){
            return oldValue + 1;
        });

        // decrease nodeNameBefore
        ref.child('report').child(date).child(nodeNameBefore).transaction(function(oldValue){
            return oldValue - 1;
        });

        // UPDATE USER REPORT
        // increase nodeNameAfter
        ref.child('report').child(date).child('userReport').child(user.id).child(nodeNameAfter).transaction(function(oldValue){
            return oldValue + 1;
        });
        // decrease nodeNameBefore
        ref.child('report').child(date).child('userReport').child(user.id).child(nodeNameBefore).transaction(function(oldValue){
            return oldValue - 1;
        });

        // if statusIdAfter == 6 (success) => update lastSuccessAt
        if(statusIdAfter==6){
            ref.child('report').child(date).child('lastSuccessAt').transaction(function(oldValue){
                return Date.now();
            });
            ref.child('report').child(date).child('userReport').child(user.id).child('lastSuccessAt').transaction(function(oldValue){
                return Date.now();
            });
        }
        // if statusIdAfter !== 1 (not call) => update calledCount
        if(statusIdAfter!==1){
            ref.child('report').child(date).child('calledCount').transaction(function(oldValue){
                return oldValue+1;
            });
            ref.child('report').child(date).child('userReport').child(user.id).child('calledCount').transaction(function(oldValue){
                return oldValue+1;
            });
        }

    }


    /**
    * Update Report if user change an order status
    * @param  {user}  user who changing status
    * @param  {statusIdBefor} Status Id before changing
    * @param  {statusIdAfter} Status Id after changing
    * @return {response data} response data
    */
    var updateReport = function(user, statusIdBefor, statusIdAfter){
        return new Promise(function(resolve, reject) {

            ////////////////////////////////////////////////
            ////////// UPDATE DAY REPORT
            // first weneed to check what day to update report
            var today = new Date();
            var reportDateString = convertDate(today);
            // check if exist today report record
            ref.child('report').orderByChild('date').equalTo(reportDateString).once('value', function(snapshot){
                if(snapshot.val() !== null){
                    // exist => update data
                    // changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter);
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
            });
            // END UPDATE DAY REPORT

            ////////////////////////////////////////////////
            ////////// UPDATE USER REPORT
            // check if exist user report record
            ref.child('report').child(reportDateString).child('userReport').child(user.id).once('value', function(snapshot){
                if(snapshot.val() !== null){
                    // exist => update data

                } else {
                    // not exist => create 
                    ref.child('report').child(reportDateString).child('userReport').child(user.id).transaction(function(){
                        return {
                            calledCount : 0,
                            blockedCount : 0, //8
                            callLaterCount : 0, //5
                            cancelCount : 0, // 7
                            penddingCount : 0, //3
                            missedCount : 0, //9
                            notCalledCount : 0, //1 <====== neet to init value here
                            successCount : 0, //6
                            id : user.id,
                            userName: user.last_name,
                            lastSuccessAt: 0
                        }
                    });
                }
                // finally update new data
                changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter, user);
            });

            resolve('Cập nhật thành công!');
        });
    }

    /**
    * Create file item formanager
    * @param  {fileName}  user who changing status
    * @return {response data} response data
    */
    var submitFileItem = function(fileName, uploadBy){
        return ref.child('uploads').child('products').child('images').push(
            {
                date : Date.now(),
                fileName : fileName,
                uploadBy : uploadBy
            });
    }

    /**
    * Get all file items
    * @return {response data} response data
    */
    var getAllFiles = function(){
        return ref.child('uploads').child('products').child('images').once('value', function(snapshot) {
            // console.log(snapshot.val());
        });
    }

    var addNewProduct = function(productName){
        return new Promise(function(resolve, reject) {
            var newKey = ref.child('products').push().key;
            ref.child('products').push({
                id: newKey,
                name: productName,
                note: 'none',
                size: 10,
            })
            resolve('Thêm sản phẩm thành công!');
        });
    }

    var addNewShippingItem = function(shippingItemData){
        console.log(shippingItemData)
        return new Promise(function(resolve, reject) {
            var newKey = ref.child('shippingItems').push().key;
            ref.child('shippingItems').push({
                id: newKey,
                data: shippingItemData,
                orderId: shippingItemData.orderData.id,
                customer_name: shippingItemData.customer_name,
                customer_mobile: shippingItemData.customer_mobile,
                created_time : shippingItemData.created_time
            })

            resolve('Thêm shipping item thành công!');
        });
    }

    /*
    * get specific order item given by id
    */
    var getOrderItem = function(id){
        return ref.child('newOrders').orderByChild('id').equalTo(id).once('value', function(snapshot){
        })
    }

    var getShippingItemByOrderId = function(orderId){
        return ref.child('shippingItems').orderByChild('orderId').equalTo(orderId).once('value', function(snapshot){
            console.log(snapshot.val());
        })
    }

    return {
    	getOrders : getOrders,
    	getSources : getSources,
    	getPacks : getPacks,
        getNewOrders : getNewOrders,
        getStatuses : getStatuses,
        getAllMembers : getAllMembers,
        updateReport : updateReport,
        submitFileItem : submitFileItem,
        getAllFiles : getAllFiles,
        addNewProduct: addNewProduct,
        addNewShippingItem : addNewShippingItem,
        getOrderItem : getOrderItem,
        getShippingItemByOrderId: getShippingItemByOrderId,
    }

}])
})();
