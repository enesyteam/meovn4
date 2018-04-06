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

            // var ref = firebase.database().ref();

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
                              access_token: snapshot.val().access_token,
                              HubID : snapshot.val().HubID
                          });
                      });
                    resolve(result);
                })
            }

            /*
            * get order item by id
            */
            var getOrderItem = function(id){
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + id).once('value', function(snapshot){
                        resolve(snapshot.val());
                    })
                    .catch(function(err){
                        reject(err);
                    })
                })
            }

            /*
            * On change an Order status
            * orderId : Orer to change
            * currentUser : user click change status
            * statusId : change to statusId
            */
            var onChangeOrderStatus = function(orderId, currentUser, statusId){
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + orderId).once('value', function(snapshot){
                        if(snapshot.val().status_id == statusId) reject('Trạng thái không thay đổi!');
                        if(snapshot.val().status_id == 6){
                            // hủy order
                            if(currentUser.is_admin == 1 || currentUser.is_mod == 1){
                                // 1. cập nhật trạng thái
                                // 2. cập nhật báo cáo
                                // 3. hủy shipping item tương ứng
                                // 4. tìm xem đơn hàng trên ghn đã tạo chưa để hủy
                                // 5. report cho admin biết nếu MOD hủy đơn
                                onUpdateOrderStatus(orderId, currentUser, statusId).then(function(response){
                                    resolve(response);
                                })
                                .catch(function(err){
                                    reject(err);
                                });

                                reject('Admin hoặc Mod muốn hủy Order đã chốt?');
                            }
                            else if(snapshot.val().seller_will_call_id !== currentUser.id){
                                reject('Không cho phép hủy Order của người khác!');
                            }
                            else{
                                // let user change his/her orders
                                // 1. cập nhật trạng thái

                                // 2. cập nhật báo cáo

                                // 3. hủy shipping item tương ứng

                                // 4. tìm xem đơn hàng trên ghn đã tạo chưa để hủy
                                reject('User hủy Order đã chốt của họ?');
                            }
                        }
                        else {
                            // 1. cập nhật trạng thái
                            // 2. cập nhật báo cáo
                            onUpdateOrderStatus(orderId, currentUser, statusId).then(function(response){
                                    updateReport(currentUser, snapshot.val().status_id, statusId).then(function(){
                                        resolve('Thay đổi trạng thái và cập nhật báo cáo thành công.');
                                    }).catch(function(err){
                                        reject(err);
                                    })
                                })
                                .catch(function(err){
                                    reject(err);
                                });
                            
                        }
                        // resolve(snapshot.val());
                    })
                    .catch(function(err){
                        reject(err);
                    })
                })
            }

            /*
            * Change an Order status
            * orderId : Orer to change
            * currentUser : user click change status
            * statusId : change to statusId
            */
            var onUpdateOrderStatus = function(orderId, currentUser, statusId){
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + orderId).update({
                        "status_id" : statusId
                    }).then(function(){
                        resolve('Thay đổi trạng thái Order thành công!');
                    }).catch(function(err){
                        reject(err);
                    })
                    
                })
            }

            /*
            * Update report when user change and Order status
            * orderOwner : Seller will call Id
            * currentUser : user click change status
            * fromStatusId : change from statusId
            * toStatusId : change to statusId
            */
            // var updateReport = function(orderOwner, fromStatusId, toStatusId, currentUser){
            //     return 'sdf';
            // }

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
                firebase.database().ref().child('report').child(date).child(nodeNameAfter).transaction(function(oldValue){
                    return oldValue + 1;
                });

                // decrease nodeNameBefore
                firebase.database().ref().child('report').child(date).child(nodeNameBefore).transaction(function(oldValue){
                    return oldValue - 1;
                });

                // UPDATE USER REPORT
                // increase nodeNameAfter
                firebase.database().ref().child('report').child(date).child('userReport').child(user.id).child(nodeNameAfter).transaction(function(oldValue){
                    return oldValue + 1;
                });
                // decrease nodeNameBefore
                firebase.database().ref().child('report').child(date).child('userReport').child(user.id).child(nodeNameBefore).transaction(function(oldValue){
                    return oldValue - 1;
                });

                // if statusIdAfter == 6 (success) => update lastSuccessAt
                if(statusIdAfter==6){
                    firebase.database().ref().child('report').child(date).child('lastSuccessAt').transaction(function(oldValue){
                        return Date.now();
                    });
                    firebase.database().ref().child('report').child(date).child('userReport').child(user.id).child('lastSuccessAt').transaction(function(oldValue){
                        return Date.now();
                    });
                }
                // if statusIdAfter !== 1 (not call) => update calledCount
                if(statusIdAfter!==1){
                    firebase.database().ref().child('report').child(date).child('calledCount').transaction(function(oldValue){
                        return oldValue+1;
                    });
                    firebase.database().ref().child('report').child(date).child('userReport').child(user.id).child('calledCount').transaction(function(oldValue){
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
                    firebase.database().ref().child('report').orderByChild('date').equalTo(reportDateString).once('value', function(snapshot){
                        if(snapshot.val() !== null){
                            // exist => update data
                            // changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter);
                        } else {
                            // not exist => create 
                            firebase.database().ref().child('report').child(reportDateString).transaction(function(){
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
                    firebase.database().ref().child('report').child(reportDateString).child('userReport').child(user.id).once('value', function(snapshot){
                        if(snapshot.val() !== null){
                            // exist => update data

                        } else {
                            // not exist => create 
                            firebase.database().ref().child('report').child(reportDateString).child('userReport').child(user.id).transaction(function(){
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
            * Convert date from 12315648465 to YYYYMMDD
            * @param  {d}  date in miliseconds
            * @return {string} date YYYYMMDD
            */
            var convertDate = function(d){
                return d.getFullYear() + ("0"+(d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
            }



            return {
                set_firebase : set_firebase,
                set_ghn_token : set_ghn_token,
                get_ghn_token : get_ghn_token,
                get_fanpages : get_fanpages,
                add_fanpage : add_fanpage,
                edit_fanpage : edit_fanpage,
                getOrderItem : getOrderItem,
                onChangeOrderStatus : onChangeOrderStatus,

            }

        }]);
}());