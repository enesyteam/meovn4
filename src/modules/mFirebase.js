(function () {
    'use strict';

    angular.module('mFirebase', ['firebase']);

    angular.module('mFirebase')
        .service('MFirebaseService', ["$http", '$q', "$timeout", 'MUtilitiesService', 'firebase',
            function ($http, $q, $timeout, MUtilitiesService, firebase) {
                // console.log(MGHNService);

                var getAllMembers = function () {
                    return firebase.database().ref().child('members').orderByChild('status').equalTo(1).once('value', function (snapshot) {});
                }

                var getShippingItem = function (id) {
                    return firebase.database().ref().child('shippingItems').orderByChild('id').equalTo(id).once('value', function (snapshot) {
                        // console.log(snapshot.val());
                        // return snapshot.val()
                    })
                }

                // function upload(file, uid, fileName) {
                //     var deferred = $q.defer();
                //     var fileRef = storageRef.child('uploads').child('products').child(fileName);
                //     // var storageRef = firebase.storage().ref('avatars/' + file.name);
                //     var uploadTask = fileRef.put(file);

                //     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                //       function(snapshot) {
                //          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //          console.log('Upload is ' + progress + '% done');
                //          switch (snapshot.state) {
                //             case firebase.storage.TaskState.PAUSED:
                //               console.log('Upload is paused');
                //               break;
                //             case firebase.storage.TaskState.RUNNING:
                //               console.log('Upload is running');
                //               break;
                //          }
                //      }, 
                //      function(error) {
                //         switch (error.code) {
                //            case 'storage/unauthorized':
                //                deferred.reject('User does not have permission to access the object.');
                //                break;
                //            case 'storage/canceled':
                //                deferred.reject('User canceled the upload.');
                //                break;
                //            case 'storage/unknown':
                //                deferred.reject(' Unknown error occurred, Please try later.');
                //                break;
                //          }
                //       }, function() {
                //             deferred.resolve(uploadTask.snapshot.downloadURL);
                //       });

                //     return deferred.promise;
                // }
                /*
                 * firebase object
                 */
                // var firebase = null;

                var set_firebase = function (_firebase) {
                    if (!_firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    firebase = _firebase;
                }

                // var ref = firebase.database().ref();

                /*
                 * Mảng chứa các status id cho phép hủy order nếu trạng thái của order == id trong mảng này
                 */
                var getCanReleaseStatusIds = function () {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('statuses').on('child_added', snapshot => {
                            if (snapshot.val().canRelease) {
                                result.push(
                                    snapshot.val()
                                );
                            }
                        });
                        resolve(result);
                    })
                }

                /*
                 * set current giao hang nhanh token
                 */
                var set_ghn_token = function (token) {
                    if (!firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('settings').update({
                                'ghn_access_token': token
                            })
                            .then(function (response) {
                                resolve('Thiết lập GHN token thành công');
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })

                }

                /*
                 * get current giao hang nhanh token
                 */
                var get_ghn_token = function () {
                    if (!firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('settings').child('ghn_access_token').once('value', function (snapshot) {
                                resolve(snapshot.val());
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })
                }

                /*
                 * set current giao hang nhanh token
                 */
                var add_fanpage = function (page_data) {
                    if (!firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('fanpages').push(page_data)
                            .then(function (response) {
                                resolve('Thêm page thành công');
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })
                }

                /*
                 * edit a fanpage
                 */
                var edit_fanpage = function (page_data) {
                    console.log(page_data);
                    if (!firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('fanpages').orderByChild('id').equalTo(page_data.id).once('value', function (snapshot) {
                            if (snapshot.val() !== null) {
                                angular.forEach(snapshot.val(), function (value, key) {
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
                var get_fanpages = function () {
                    if (!firebase) {
                        console.log('Error: firebase is undefined.');
                        return;
                    }
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('fanpages').on('child_added', snapshot => {
                            result.push({
                                id: snapshot.val().id,
                                name: snapshot.val().name,
                                access_token: snapshot.val().access_token,
                                HubID: snapshot.val().HubID,
                                GROUPADDRESS_ID: snapshot.val().GROUPADDRESS_ID,
                                VIETTEL_STATION_ID: snapshot.val().VIETTEL_STATION_ID,
                            });
                        });
                        resolve(result);
                    })
                }

                /*
                 * get order item by id
                 */
                var getOrderItem = function (id) {
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('newOrders/' + id).once('value', function (snapshot) {
                                resolve(snapshot.val());
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })
                }

                function validateOrderBeforChangeStatus(orderOwnerId, currentUser, currentStatusId, changeToStatusId) {
                    if (currentUser.is_admin == 1 || currentUser.is_mod == 1) {
                        // allway accept change by admin or mod
                        return true;
                    }
                    if (!orderOwnerId || orderOwnerId !== currentUser.id) {
                        MUtilitiesService.AlertError('Không cho phép thay đổi trạng thái Order của người khác', 'Thông báo');
                        return false;
                    }

                    if (currentStatusId == changeToStatusId) {
                        MUtilitiesService.AlertError('Trạng thái không thay đổi, bạn có thể bổ sung ghi chú', 'Thông báo');
                        return false;
                    }
                    return true;
                }

                /*
                 * On change an Order status
                 * orderId : Orer to change
                 * currentUser : user click change status
                 * statusId : change to statusId
                 */
                var onChangeOrderStatus = function (orderId, currentUser, statusId, sellers) {
                    return new Promise(function (resolve, reject) {

                        firebase.database().ref().child('newOrders/' + orderId).once('value', function (snapshot) {

                                // validate order befor change status
                                if (!validateOrderBeforChangeStatus(snapshot.val().seller_will_call_id,
                                        currentUser, snapshot.val().status_id, statusId)) {
                                    // reject('Không thể thay đổi trạng thái Order');
                                    return;
                                }
                                var orderOwnerId = snapshot.val().seller_will_call_id;
                                var orderOwner = null;
                                angular.forEach(sellers, function (seller) {
                                    if (seller.id == orderOwnerId) {
                                        orderOwner = seller;
                                    }
                                })

                                // ngày tạo order
                                // alert(snapshot.val().publish_date);
                                var orderCreatedDateString = convertDate(new Date(snapshot.val().publish_date));
                                // alert(orderCreatedDateString);


                                // if (snapshot.val().status_id == statusId) reject('Trạng thái không thay đổi!');
                                if (snapshot.val().status_id == 6) {
                                    // hủy order
                                    if (currentUser.is_admin == 1 || currentUser.is_mod == 1) {
                                        // ADMIN HOẶC MOD HỦY MỘT ORDER
                                        // 1. cập nhật trạng thái
                                        // 2. cập nhật báo cáo
                                        // 3. hủy shipping item tương ứng
                                        // 4. tìm xem đơn hàng trên ghn đã tạo chưa để hủy
                                        // 5. report cho admin biết nếu MOD hủy đơn
                                        if (orderOwnerId) {
                                            MUtilitiesService.showConfirmDialg('Thông báo',
                                                    'Order này đã được chốt bởi user có ID: ' + orderOwnerId + ', bạn có muốn hủy không?', 'Hủy', 'Bỏ qua')
                                                .then(function (response) {
                                                    if (response) {
                                                        // Khởi tạo mảng báo cáo nếu cần
                                                        preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                        onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                                updateReport(currentUser, snapshot.val().status_id, statusId,
                                                                        orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                    .then(function () {
                                                                        // tìm và hủy shipping
                                                                        // tìm và hủy đơn trên GHN
                                                                        // report cho admin nếu thao tác hủy là của MOD
                                                                        // update_at: new Date();
                                                                        updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                            console.log(response);
                                                                        })
                                                                        // console.log('Bắt đầu hủy shipping item, hủy đơn trên GHN...');
                                                                        // hủy đơn trên hệ thống
                                                                        // tìm shipping item
                                                                        searchShippingByOrderId(orderId).then(function(response){
                                                                            // chú ý response là 1 mảng
                                                                            if(response.length == 1){
                                                                                var shippingItem = response[0].data;
                                                                                var date = new Date(shippingItem.push_to_ghn_at);
                                                                                var reportDateString = convertDate(date);

                                                                                // hủy trên giao hàng nhanh
                                                                                if(shippingItem.orderCode){
                                                                                    cancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                            shippingItem.service_fee, response[0].key).then(function(response){
                                                                                        // console.log(response);
                                                                                        MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng ' + shippingItem.orderCode + ' trên GHN thành công', 'Thông báo');
                                                                                        
                                                                                    })
                                                                                    .catch(function(err){
                                                                                        MUtilitiesService.AlertError('Không thể hủy đơn hàng trên GHN, Lỗi: ' + err, 'Thông báo')
                                                                                    })
                                                                                }

                                                                                if(shippingItem.is_cancel != true){
                                                                                    // hủy trên hệ thống
                                                                                    // cập nhật trạng thái đã hủy cho shipping item
                                                                                    var date = new Date(shippingItem.created_time);
                                                                                    // console.log('Shipping Item tạo lúc: ' + shippingItem.created_time);
                                                                                    var reportDateString = convertDate(date);
                                                                                    // console.log('Cần cập nhật báo cáo cho ngày: ' + reportDateString);

                                                                                    onCancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                        shippingItem.service_fee, response[0].key).then(function(response){
                                                                                            // $scope.activedItem.orderCode = null;
                                                                                        // console.log(response);
                                                                                        // tìm và cập nhật item này trong danh sách

                                                                                        MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng trên hệ thống thành công.', 'Thông báo');
                                                                                    })
                                                                                    .catch(function(err){
                                                                                        MUtilitiesService.AlertError('Không thể hủy đơn hàng trên hệ thống, Lỗi: ' + err, 'Thông báo')
                                                                                    })
                                                                                }
                                                                            }
                                                                        })

                                                                        resolve('Admin hoặc Mod đã thay đổi trạng thái một Order chưa được gán và cập nhật báo cáo thành công.');
                                                                    }).catch(function (err) {
                                                                        reject(err);
                                                                    })
                                                            })
                                                            .catch(function (err) {
                                                                reject(err);
                                                            });
                                                        // resolve('Admin hoặc Mod bắt đầu thao tác hủy đơn của user...');
                                                        // code hủy ở đây
                                                    } else {
                                                        reject('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                                                    }
                                                })
                                        } else {
                                            MUtilitiesService.showConfirmDialg('Thông báo',
                                                    'Order này đã được chốt nhưng không rõ người chốt, bạn có muốn hủy không?', 'Hủy', 'Bỏ qua')
                                                .then(function (response) {
                                                    if (response) {
                                                        preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                        // resolve('Admin hoặc Mod bắt đầu thao tác hủy đơn không rõ sở hữu của ai...');
                                                        onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                                updateReport(currentUser, snapshot.val().status_id, statusId,
                                                                        orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                    .then(function () {
                                                                        // tìm và hủy shipping
                                                                        // tìm và hủy đơn trên GHN
                                                                        // report cho admin nếu thao tác hủy là của MOD
                                                                        // update_at: new Date();
                                                                        updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                            console.log(response);
                                                                        })
                                                                        // hủy đơn trên hệ thống
                                                                        // tìm shipping item
                                                                        searchShippingByOrderId(orderId).then(function(response){
                                                                            // chú ý response là 1 mảng
                                                                            if(response.length == 1){
                                                                                var shippingItem = response[0].data;
                                                                                var date = new Date(shippingItem.push_to_ghn_at);
                                                                                var reportDateString = convertDate(date);

                                                                                // hủy trên giao hàng nhanh
                                                                                if(shippingItem.orderCode){
                                                                                    cancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                            shippingItem.service_fee, response[0].key).then(function(response){
                                                                                        // console.log(response);
                                                                                        MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng ' + shippingItem.orderCode + ' trên GHN thành công', 'Thông báo');
                                                                                        
                                                                                    })
                                                                                }

                                                                                if(shippingItem.is_cancel !== true){
                                                                                    // hủy trên hệ thống
                                                                                    // cập nhật trạng thái đã hủy cho shipping item
                                                                                    var date = new Date(shippingItem.created_time);
                                                                                    // console.log('Shipping Item tạo lúc: ' + shippingItem.created_time);
                                                                                    var reportDateString = convertDate(date);
                                                                                    // console.log('Cần cập nhật báo cáo cho ngày: ' + reportDateString);

                                                                                    onCancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                        shippingItem.service_fee, response[0].key).then(function(response){
                                                                                            // $scope.activedItem.orderCode = null;
                                                                                        // console.log(response);
                                                                                        // tìm và cập nhật item này trong danh sách

                                                                                        MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng trên hệ thống thành công.', 'Thông báo');

                                                                                    })
                                                                                }
                                                                            }
                                                                        })

                                                                        resolve('Admin hoặc Mod đã hủy đơn không rõ sở hữu của ai');
                                                                    }).catch(function (err) {
                                                                        reject(err);
                                                                    })
                                                            })
                                                            .catch(function (err) {
                                                                reject(err);
                                                            });
                                                        // code hủy ở đây
                                                    } else {
                                                        reject('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                                                    }
                                                })
                                        }

                                    } else if (snapshot.val().seller_will_call_id !== currentUser.id) {
                                        // USER HỦY MỘT ORDER KHÔNG PHẢI CỦA HỌ
                                        reject('Không cho phép hủy Order của người khác!');
                                    } else {
                                        // USER HỦY ORDER CỦA HỌ
                                        // 1. cập nhật trạng thái
                                        // 2. cập nhật báo cáo
                                        // 3. hủy shipping item tương ứng
                                        // 4. tìm xem đơn hàng trên ghn đã tạo chưa để hủy
                                        MUtilitiesService.showConfirmDialg('Thay đổi trạng thái Order đã chốt?',
                                                'Bạn đã chốt Order này vào lúc: ' + new Date(snapshot.val().updated_at) + '.', 'Thay đổi', 'Bỏ qua')
                                            .then(function (response) {
                                                if (response) {
                                                    preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                    // resolve('Bắt đầu thao tác hủy đơn của user...');
                                                    onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                            updateReport(currentUser, snapshot.val().status_id, statusId,
                                                                    orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                .then(function () {
                                                                    // tìm và hủy shipping
                                                                    // tìm và hủy đơn trên GHN
                                                                    // report cho admin nếu thao tác hủy là của MOD
                                                                    // update_at: new Date();
                                                                    updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                        console.log(response);
                                                                    })
                                                                    // hủy đơn trên hệ thống
                                                                    // tìm shipping item
                                                                    searchShippingByOrderId(orderId).then(function(response){
                                                                        // chú ý response là 1 mảng
                                                                        if(response.length == 1){
                                                                            var shippingItem = response[0].data;
                                                                            var date = new Date(shippingItem.push_to_ghn_at);
                                                                            var reportDateString = convertDate(date);

                                                                            // hủy trên giao hàng nhanh
                                                                            if(shippingItem.orderCode){
                                                                                cancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                        shippingItem.service_fee, response[0].key).then(function(response){
                                                                                    // console.log(response);
                                                                                    MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng ' + shippingItem.orderCode + ' trên GHN thành công', 'Thông báo');
                                                                                    
                                                                                })
                                                                            }

                                                                            if(shippingItem.is_cancel != true){
                                                                                // hủy trên hệ thống
                                                                                // cập nhật trạng thái đã hủy cho shipping item
                                                                                var date = new Date(shippingItem.created_time);
                                                                                // console.log('Shipping Item tạo lúc: ' + shippingItem.created_time);
                                                                                var reportDateString = convertDate(date);
                                                                                // console.log('Cần cập nhật báo cáo cho ngày: ' + reportDateString);

                                                                                onCancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                                                                    shippingItem.service_fee, response[0].key).then(function(response){
                                                                                        // $scope.activedItem.orderCode = null;
                                                                                    // console.log(response);
                                                                                    // tìm và cập nhật item này trong danh sách

                                                                                    MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng trên hệ thống thành công.', 'Thông báo');

                                                                                })
                                                                            }
                                                                        }
                                                                    })

                                                                    resolve(currentUser.last_name + 'đã hủy đơn thành công...');
                                                                }).catch(function (err) {
                                                                    reject(err);
                                                                })
                                                        })
                                                        .catch(function (err) {
                                                            reject(err);
                                                        });
                                                } else {
                                                    reject('User bỏ qua thao tác hủy Order');
                                                }
                                            })
                                    }
                                } else {
                                    // ADMIN HOẶC MOD THAY ĐỔI TRẠNG THÁI ORDER
                                    // USER CẬP NHẬT TRẠNG THÁI ORDER CỦA HỌ
                                    // 1. cập nhật trạng thái
                                    // 2. cập nhật báo cáo
                                    if (currentUser.is_admin == 1 || currentUser.is_mod == 1) {
                                        // ADMIN HOẶC MOD THAY ĐỔI TRẠNG THÁI ORDER
                                        if (!orderOwnerId) {
                                            // console.log('Order chưa được gán cho user');
                                            MUtilitiesService.showConfirmDialg('Thông báo',
                                                    'Bạn có muốn thay đổi trạng thái Order chưa được gán cho user không?', 'Thay đổi', 'Bỏ qua')
                                                .then(function (response) {
                                                    if (response) {
                                                        preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                        onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                                updateReport(currentUser, snapshot.val().status_id, statusId,
                                                                        orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                    .then(function () {
                                                                        // update_at: new Date();
                                                                        updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                            console.log(response);
                                                                        })
                                                                        resolve('Admin hoặc Mod đã thay đổi trạng thái một Order chưa được gán và cập nhật báo cáo thành công.');
                                                                    }).catch(function (err) {
                                                                        reject(err);
                                                                    })
                                                            })
                                                            .catch(function (err) {
                                                                reject(err);
                                                            });
                                                    } else {
                                                        reject('Admin hoặc Mod bỏ qua thao tác cập nhật trạng thái Order chưa được gán');
                                                    }
                                                })
                                        } else {
                                            // console.log('Order đã được gán cho user');
                                            MUtilitiesService.showConfirmDialg('Thông báo',
                                                    'Bạn có muốn thay đổi trạng thái Order này của user: ' + orderOwnerId + ' không?', 'Thay đổi', 'Bỏ qua')
                                                .then(function (response) {
                                                    if (response) {
                                                        preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                        onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                                updateReport(currentUser, snapshot.val().status_id,
                                                                        statusId, orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                    .then(function () {
                                                                        // update_at: new Date();
                                                                        updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                            console.log(response);
                                                                        })
                                                                        resolve('Admin hoặc Mod đã thay đổi trạng thái và cập nhật báo cáo thành công.');
                                                                    }).catch(function (err) {
                                                                        reject(err);
                                                                    })
                                                            })
                                                            .catch(function (err) {

                                                                reject(err);
                                                            });
                                                    } else {
                                                        reject('Admin hoặc Mod bỏ qua thao tác cập nhật trạng thái Order của user');
                                                    }
                                                })
                                        }

                                    } else {
                                        // USER CẬP NHẬT TRẠNG THÁI ORDER CỦA HỌ
                                        MUtilitiesService.showConfirmDialg('Thông báo',
                                                'Bạn có muốn thay đổi trạng thái Order này không?', 'Thay đổi', 'Bỏ qua')
                                            .then(function (response) {
                                                if (response) {
                                                    preparingEmptyReport(currentUser, orderOwner, snapshot.val().page_id);
                                                    onUpdateOrderStatus(orderId, currentUser, statusId).then(function (response) {
                                                            updateReport(currentUser, snapshot.val().status_id,
                                                                    statusId, orderOwner, snapshot.val().page_id, orderCreatedDateString)
                                                                .then(function () {
                                                                    // update_at: new Date();
                                                                    updateOrderItem(orderId, Date.now()).then(function (response) {
                                                                        console.log(response);
                                                                    })
                                                                    resolve('User đã thay đổi trạng thái và cập nhật báo cáo thành công.');
                                                                }).catch(function (err) {
                                                                    reject(err);
                                                                })
                                                        })
                                                        .catch(function (err) {
                                                            reject(err);
                                                        });
                                                    // resolve('Bắt đầu thao tác thay đổi trạng thái Order của user...');
                                                } else {
                                                    reject('User bỏ qua thao tác cập nhật trạng thái Order');
                                                }
                                            })
                                    }

                                }
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })
                }

                var updateOrderItem = function (orderId, dataToUpdate) {
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/newOrders/' + orderId + '/updated_at'] = dataToUpdate;
                        return firebase.database().ref().update(updates).then(function () {
                                resolve('Cập nhật dữ liệu Order ' + orderId + ' thành công.');
                            })
                            .catch(function (err) {
                                reject('Không thể cập nhật, lỗi: ' + err)
                            })
                    })
                }

                /*
                 * Change an Order status
                 * orderId : Orer to change
                 * currentUser : user click change status
                 * statusId : change to statusId
                 */
                var onUpdateOrderStatus = function (orderId, currentUser, statusId) {
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('newOrders/' + orderId).update({
                            "status_id": statusId
                        }).then(function () {
                            resolve('Thay đổi trạng thái Order thành công!');
                        }).catch(function (err) {
                            reject('Không thể thay đổi trạng thái Order. Lỗi ' + err);
                        })

                    })
                }

                function findNodeName(statusId) {
                    switch (statusId) {
                        case 1:
                            return 'notCalledCount';
                            break;
                        case 3:
                            return 'penddingCount';
                            break;
                        case 5:
                            return 'callLaterCount';
                            break;
                        case 6:
                            return 'successCount';
                            break;
                        case 7:
                            return 'cancelCount';
                            break;
                        case 8:
                            return 'blockedCount';
                            break;
                        case 9:
                            return 'missedCount';
                            break;
                        default:
                            return '';
                    }
                }

                /**
                 * Change day report value
                 * @param  {date}  date in YYMMDD (ngày tạo order)
                 * @param  {statusIdBefor}  status id before changing
                 * @param  {statusIdAfter}  status change to
                 * @return
                 */
                var changeReportByStatus = function (date, statusIdBefor, statusIdAfter, user, orderOwnerId, pageId) {
                    // nếu user thay đổi trạng thái 2 lần liên tiếp trong khoảng thời gian giới hạn < 5 phút
                    // thì không cần phải tính là 1 cuộc gọi
                    // nếu admin hoặc mod thay đổi trạng thái 1 order cũng không tính là 1 cuộc gọi
                    // nodeNameBefore = 1 field của báo cáo tương ứng với trạng thái của Order trước khi thay đổi
                    // nodeNameAfter = 1 field của báo cáo tương ứng với trạng thái của Order sau khi thay đổi
                    // tùy thuộc vào id của trạng thái, sẽ có 1 field tương ứng

                    var today = new Date();
                    var todayDateString = convertDate(today);

                    // Tìm tên của field trong báo cáo theo id của trạng thái
                    var nodeNameBefore = findNodeName(parseInt(statusIdBefor)),
                        nodeNameAfter = findNodeName(parseInt(statusIdAfter));

                    // node name after thay đổi ở ngày cũ nếu trạng thái đơn không phải là chốt
                    if(statusIdAfter == 6){
                        // cập nhật báo cáo chi tiết của seller
                        firebase.database().ref()
                            .child('assigned')
                            .child(todayDateString)
                            .child(orderOwnerId)
                            .child('success_by_pages')
                            .child( pageId )
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            }).then(function (res) {
                                // do nothing
                                // resolve( 'success' );
                            });
                        // phần cập nhật chung cho cả Admin, Mod và User
                        // A - BÁO CÁO NGÀY CỦA TOÀN HỆ THỐNG
                        // 1 - Tăng 1 đơn vị trong báo cáo ngày của nodeNameAfter
                        firebase.database().ref().child('report').child(todayDateString).child(nodeNameAfter)
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            });

                        // B - BÁO CÁO CỦA USER
                        // PHẦN NÀY PHẢI XEM XÉT ORDER ĐANG THUỘC QUYỀN SỞ HỮU CỦA AI,
                        // PHÒNG TRƯỜNG HỢP ORDER CHƯA ĐƯỢC GÁN
                        // 1 - Tăng 1 đơn vị trong báo cáo USER của nodeNameAfter

                        if (orderOwnerId) { // order đã được gán
                            firebase.database().ref().child('report').child(todayDateString).child('userReport')
                                .child(orderOwnerId).child(nodeNameAfter).transaction(function (oldValue) {
                                    return oldValue + 1;
                                });
                        } else {
                            // order chưa được gán
                            // bỏ qua cập nhật báo cáo của user
                            console.log('Order này chưa được gán cho user, bỏ qua cập nhật báo cáo của user');
                        }

                        // cập nhật lastSuccessAt
                        firebase.database().ref().child('report').child(todayDateString).child('lastSuccessAt')
                            .transaction(function (oldValue) {
                                return Date.now();
                            });

                        // báo cáo của user lastSuccessAt
                        if (user.is_admin == 1 || user.is_mod == 1) {
                            firebase.database().ref().child('report').child(todayDateString).child('userReport')
                                .child(orderOwnerId).child('lastSuccessAt').transaction(function (oldValue) {
                                    return Date.now();
                                });
                        } else {
                            firebase.database().ref().child('report').child(todayDateString).child('userReport')
                                .child(user.id).child('lastSuccessAt').transaction(function (oldValue) {
                                    return Date.now();
                                });
                        }

                        // báo cáo của page
                        firebase.database().ref().child('report').child(todayDateString).child('pageReport')
                            .child(pageId).child('totalsuccess').transaction(function (oldValue) {
                                return oldValue + 1;
                            });
                    }
                    else{
                        firebase.database().ref().child('report').child(todayDateString).child(nodeNameAfter)
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            });

                        // B - BÁO CÁO CỦA USER
                        // PHẦN NÀY PHẢI XEM XÉT ORDER ĐANG THUỘC QUYỀN SỞ HỮU CỦA AI,
                        // PHÒNG TRƯỜNG HỢP ORDER CHƯA ĐƯỢC GÁN
                        // 1 - Tăng 1 đơn vị trong báo cáo USER của nodeNameAfter

                        if (orderOwnerId) { // order đã được gán
                            firebase.database().ref().child('report').child(todayDateString).child('userReport')
                                .child(orderOwnerId).child(nodeNameAfter).transaction(function (oldValue) {
                                    return oldValue + 1;
                                });
                        } else {
                            // order chưa được gán
                            // bỏ qua cập nhật báo cáo của user
                            console.log('Order này chưa được gán cho user, bỏ qua cập nhật báo cáo của user');
                        }
                    }

                    // node name before luôn luôn thay đổi ở ngày tạo
                    firebase.database().ref().child('report').child(todayDateString).child(nodeNameBefore)
                    .transaction(function (oldValue) {
                        if (oldValue < 1) {
                            return oldValue;
                        } else {
                            return oldValue - 1;
                        }

                    });

                    // node name befor của user cũng luôn luôn thay đổi ở ngày tạo
                    if (orderOwnerId) { // order đã được gán
                        // 2 - Giảm 1 đơn vị trong báo cáo USER của nodeNameBefore
                        firebase.database().ref().child('report').child(todayDateString).child('userReport')
                            .child(orderOwnerId).child(nodeNameBefore).transaction(function (oldValue) {
                                if (oldValue < 1) {
                                    return oldValue;
                                } else {
                                    return oldValue - 1;
                                }
                            });
                    } else {
                        // order chưa được gán
                        // bỏ qua cập nhật báo cáo của user
                        console.log('Order này chưa được gán cho user, bỏ qua cập nhật báo cáo của user');
                    }
                    
                    // CÁC PHẦN CẬP NHẬT BÁO CÁO BỔ SUNG KHÁC

                    // thay đổi báo cáo số cuộc gọi trong ngày và báo cáo cuộc gọi của user
                    // HỦY ĐƠN HÀNG HOẶC CHUYỂN SANG TRẠNG THÁI CHƯA GỌI => KHÔNG CẦN THAY ĐỐI SỐ CUỘC GỌI
                    if (statusIdBefor !== 6 && statusIdAfter !== 1) {
                        if (user.is_admin == 1 || user.is_mod == 1) {
                            console.log('Admin hoặc Mod đã thay đổi trạng thái, bỏ qua cập nhật báo cáo về số cuộc gọi');
                        } else {
                            firebase.database().ref().child('report').child(todayDateString).child('calledCount').transaction(function (oldValue) {
                                return oldValue + 1;
                            });
                            firebase.database().ref().child('report').child(todayDateString).child('userReport').child(user.id).child('calledCount')
                                .transaction(function (oldValue) {
                                    return oldValue + 1;
                                });
                        }
                    }

                    // hủy order => cập nhật báo cáo page
                    if (statusIdBefor == 6) {
                        firebase.database().ref().child('report').child(date).child('pageReport')
                            .child(pageId).child('totalsuccess').transaction(function (oldValue) {
                                if (oldValue < 1) {
                                    return oldValue;
                                } else {
                                    return oldValue - 1;
                                }
                            });

                        // cập nhật báo cáo chi tiết của seller
                        firebase.database().ref()
                            .child('assigned')
                            .child(todayDateString)
                            .child(orderOwnerId)
                            .child('success_by_pages')
                            .child( pageId )
                            .transaction(function (oldValue) {
                                if ( oldValue > 0 ) {
                                    return oldValue - 1;
                                }
                                else {
                                    return 0;
                                }
                            }).then(function (res) {
                                // do nothing
                                // resolve( 'success' );
                            });
                    }

                    return new Promise(function (resolve, reject) {
                        resolve('Cập nhật báo cáo thành công');
                    })
                }


                // ?????????????????????????????????
                // PHẦN NÀY CẦN THAY ĐỔI, KHI ADMIN HOẶC MOD THAY ĐỔI TRẠNG THÁI CẦN TẠO RA BẢNG BÁO CÁO THEO ID CỦA USER
                // LÀ NGƯỜI ĐANG SỞ HỮU ORDER
                /**
                 * Update Report if user change an order status
                 * @param  {user}  user who changing status
                 * @param  {statusIdBefor} Status Id before changing
                 * @param  {statusIdAfter} Status Id after changing
                 * @return {response data} response data
                 */
                var updateReport = function (user, statusIdBefor, statusIdAfter, orderOwner, pageId, createdDateString) {
                    return new Promise(function (resolve, reject) {
                        // console.log(orderOwner);
                        // console.log(orderOwner);
                        // console.log(orderOwner);
                        // console.log(orderOwner);
                        // var today = new Date();
                        // var reportDateString = convertDate(today);

                        // finally update new data
                        changeReportByStatus(createdDateString, statusIdBefor, statusIdAfter, user, orderOwner.id, pageId)
                            .then(function (response) {
                                resolve(response);
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    });
                }

                /*
                 * Khởi tạo báo cáo ngày của toàn hệ thống và báo cáo ngày của user
                 * @param  {user}  người thực hiện thao tác khởi tạo
                 * @param  {orderOwnerId}  ID của user sẽ tạo báo cáo
                 * @param  {pageId}  page ID
                 */
                var preparingEmptyReport = function (user, orderOwner, pageId) {
                    return new Promise(function (resolve, reject) {
                        var today = new Date();
                        var reportDateString = convertDate(today);
                        prepareEmptyDayReport(reportDateString).then(function (response) {
                            console.log(response);
                            prepareEmptyUserReport(user, orderOwner, reportDateString).then(function (response) {
                                console.log(response);
                                prepareEmptyPageReport(pageId, reportDateString).then(function (response) {
                                    console.log(response);
                                    console.log('------------------SUCCESS----------------------');
                                    resolve('Đã khởi tạo thành công tất cả báo cáo');
                                })
                            })
                        })

                    })
                }

                var prepareEmptyShippingReport = function (date) {
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('report').child(date).child('shippingReport')
                            .once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    resolve('Báo cáo shipping của ngày ' + date + ' đã có => không cần khởi tạo')
                                    // return;
                                } else {
                                    firebase.database().ref().child('report').child(date).child('shippingReport').transaction(function () {
                                            return {
                                                total_shipping_items: 0,
                                                total_new_customers: 0,
                                                date: date,
                                                total_created_items: 0,
                                                total_not_created_items: 0,
                                                total_cancel_ghn: 0,
                                                total_cancel: 0,
                                                total_cod: 0,
                                                total_shipping_costs: 0,
                                            }
                                        })
                                        .then(function (response) {
                                            resolve('Khởi tạo báo cáo shipping ngày ' + date + ' thành công');
                                        })
                                        .catch(function (err) {
                                            reject(err);
                                        })
                                }
                            })
                    })
                }

                var onCreateShippingItem = function (date) {
                    // tăng 1 đơn vị trong báo cáo về tổng số shipping items
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('report').child(date)
                            .child('shippingReport').child('total_shipping_items')
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            });
                        firebase.database().ref().child('report').child(date)
                            .child('shippingReport').child('total_not_created_items')
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            });
                        resolve('Cập nhật báo cáo ngày của shipping thành công');
                    })
                }

                var onUpdateShippingReport = function (date, cod, shipping_cod) {
                    // update cod
                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_cod')
                        .transaction(function (oldValue) {
                            return oldValue + cod;
                        });

                    // update shipping costs
                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_shipping_costs')
                        .transaction(function (oldValue) {
                            return oldValue + shipping_cod;
                        });

                    // update total_created_items
                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_created_items')
                        .transaction(function (oldValue) {
                            return oldValue + 1;
                        });

                    // update total_not_created_items
                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_not_created_items')
                        .transaction(function (oldValue) {
                            if(oldValue >= 1){
                                return oldValue - 1;
                            }
                            else{
                                return oldValue;
                            }
                        });

                    return new Promise(function (resolve, reject) {
                        resolve('Cập nhật báo cáo shipping ngày thành công');
                    })
                }

                // Hủy đơn hàng trên hệ thống
                var onCancelShippingItem = function (date, cod, shipping_cod, itemKey, isCancelOnSystem = true) {

                    // cập nhật firebase
                    var updates = {};
                        
                    if(isCancelOnSystem){
                        updates['/shippingItems/' + itemKey + '/is_cancel'] = true;
                    }

                    // update firebase database
                    firebase.database().ref().update(updates).then(function (response) {
                            // resolve('Đã cập nhật dữ liệu Order thành công');
                        })
                        .catch(function (err) {
                            reject(err)
                        })

                    // update total_created_items
                    // firebase.database().ref().child('report').child(date)
                    // .child('shippingReport').child('total_created_items')
                    //     .transaction(function(oldValue) {
                    //         return oldValue - 1;
                    // });

                    // update total_cancel
                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_cancel')
                        .transaction(function (oldValue) {
                            return oldValue + 1;
                        });

                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_not_created_items')
                        .transaction(function (oldValue) {
                            if(oldValue >= 1){
                                return oldValue - 1;
                            }
                            else{
                                return oldValue;
                            }
                        });

                    firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_shipping_items')
                        .transaction(function (oldValue) {
                            if(oldValue >= 1){
                                return oldValue - 1;
                            }
                            else{
                                return oldValue;
                            }
                        });


                    return new Promise(function (resolve, reject) {
                        resolve('Cập nhật báo cáo shipping ngày thành công');
                    })
                }

                var addShippingNote = function(id, data){
                    console.log(id)
                    // var updates = {};
                        
                    // updates['/shippingItems/' + id + '/note'] = data;

                    return new Promise(function(resolve, reject){
                        // update firebase database
                        // firebase.database().ref().update(updates).then(function (response) {
                        //         resolve('Thêm ghi chú thành công');
                        //     })
                            // .catch(function (err) {
                            //     reject(err)
                            // })
                            // resolve('dd')
                            firebase.database().ref().child('shippingItems').child(id).once('value', function(snapshot){
                                if (snapshot.val() !== null) {
                                    
                                    firebase.database().ref().child('shippingItems').child(id).child('notes').push(data)
                                    .then(function(){
                                       resolve('Thêm ghi chú thành công'); 
                                    })
                                    .catch(function(err){
                                       reject('Không thể thêm ghi chú đơn hàng. Lỗi ' + err); 
                                    })
                                }
                                else{
                                    reject('Không thể thêm ghi chú đơn hàng. Lỗi không tìm thấy đơn hàng.');
                                }
                            })
                    })
                }

                function prepareEmptyDayReport(date) {
                    return new Promise(function (resolve, reject) {
                        // kiểm tra báo cáo đã có chưa
                        firebase.database().ref().child('report').orderByChild('date').equalTo(date)
                            .once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    resolve('Báo cáo ngày ' + date + ' đã có => không cần khởi tạo')
                                } else {
                                    firebase.database().ref().child('report').child(date).transaction(function () {
                                            return {
                                                calledCount: 0,
                                                date: date,
                                                blockedCount: 0, //8
                                                callLaterCount: 0, //5
                                                cancelCount: 0, // 7
                                                penddingCount: 0, //3
                                                missedCount: 0, //9
                                                notCalledCount: 0, //1 <====== neet to init value here
                                                successCount: 0, //6
                                                lastSuccessAt: 0,
                                                today: 0, // <====== neet to init value here
                                            }
                                        })
                                        .then(function (response) {
                                            resolve('Khởi tạo báo cáo ngày ' + date + ' thành công');
                                        })
                                        .catch(function (err) {
                                            reject(err);
                                        })
                                }
                            })

                    })
                }

                function prepareEmptyUserReport(user, owner, date) {
                    return new Promise(function (resolve, reject) {
                        if (owner) {
                            firebase.database().ref().child('report').child(date).child('userReport')
                                .child(owner.id).once('value', function (snapshot) {
                                    if (snapshot.val() !== null) {
                                        resolve('Báo cáo ngày của user ' + user.last_name + ' đã có => không cần khởi tạo')
                                    } else {
                                        firebase.database().ref().child('report').child(date).child('userReport')
                                            .child(owner.id).transaction(function () {
                                                return {
                                                    calledCount: 0,
                                                    blockedCount: 0, //8
                                                    callLaterCount: 0, //5
                                                    cancelCount: 0, // 7
                                                    penddingCount: 0, //3
                                                    missedCount: 0, //9
                                                    notCalledCount: 0, //1 <====== neet to init value here
                                                    successCount: 0, //6
                                                    id: (user.is_admin == 1 || user.is_mod == 1) ? owner.id : user.id,
                                                    userName: (user.is_admin == 1 || user.is_mod == 1) ? owner.last_name : user.last_name,
                                                    lastSuccessAt: 0
                                                }
                                            })
                                            .then(function () {
                                                resolve('Khởi tạo báo cáo ngày của user ' + owner.last_name + ' thành công');
                                            });
                                    }
                                })
                        } else {
                            resolve('Không cần khởi tạo báo cáo ngày cho user == null')
                        }
                    })
                }

                function prepareEmptyPageReport(pageId, date) {
                    return new Promise(function (resolve, reject) {
                        if (pageId) {
                            firebase.database().ref().child('report').child(date).child('pageReport')
                                .child(pageId).once('value', function (snapshot) {
                                    if (snapshot.val() !== null) {
                                        resolve('Report cho Page' + pageId + ' đã tồn tại, không cần khởi tạo');
                                    } else {
                                        firebase.database().ref().child('report').child(date).child('pageReport')
                                            .child(pageId).transaction(function () {
                                                return {
                                                    totalCustomers: 0,
                                                    totalsuccess: 0, //
                                                }
                                            }).then(function (r) {
                                                resolve('Khởi tạo báo cáo ngày của page ' + pageId + ' thành công');
                                            });
                                    }
                                })
                        } else {
                            resolve('Không cần khởi tạo báo cáo cho page id == null');
                        }
                    })
                }

                /**
                 * Add new reply to database
                 * @param  {replyData}  order data as json object
                 * @return {object} response
                 */
                var onAddNewReply = function (replyData) {
                    return new Promise(function (resolve, reject) {
                        // kiểm tra xem tổ hợp phím tắt đã tồn tại chưa
                        firebase.database().ref().child('quickReplies').orderByChild('key')
                        .equalTo(replyData.key)
                            .once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    // tổ hợp phím tắt đã tồn tại
                                    reject('Tổ hợp phím tắt ' + replyData.key + ' đã tồn tại. Vui lòng thử một tổ hợp khác');
                                }
                                else{
                                    // tổ hợp phím tắt chưa tồn tại => thêm vào database
                                    var updates = {};
                                    updates['/quickReplies/' + replyData.id] = replyData;
                                    return firebase.database().ref().update(updates).then(function () {
                                        resolve('Thêm mẫu trả lời nhanh thành công!');
                                    })
                                    .catch(function (error) {
                                        reject('Không thể thêm mẫu trả lời nhanh. Lỗi: ' + error);
                                    });
                                }
                            });
                    });
                }

                var findReplyByKey = function (key) {
                    return new Promise(function (resolve, reject) {
                        // kiểm tra xem tổ hợp phím tắt đã tồn tại chưa
                        firebase.database().ref().child('quickReplies').orderByChild('key')
                        .equalTo(key)
                            .once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    angular.forEach(snapshot.val(), function(value, key){
                                        resolve(value);
                                    })
                                }
                                else{
                                   reject('Không tìm thấy mẫu trả lời nhanh');
                                }
                            });
                    });
                }

                var onDeleteReply = function(id){
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/quickReplies/' + id] = null;
                        return firebase.database().ref().update(updates).then(function () {
                            resolve('Xóa mẫu trả lời nhanh thành công!');
                        })
                        .catch(function (error) {
                            reject('Không thể xóa mẫu trả lời nhanh. Lỗi: ' + error);
                        });
                    });
                }

                var getReplies = function () {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('quickReplies')
                            .on('child_added', snapshot => {
                                if (snapshot.val())
                                    result.push(snapshot.val());
                                
                            })
                        resolve(result);
                    })
                }


                /**
                 * Add new order to database
                 * @param  {orderData}  order data as json object
                 * @return {object} response
                 */
                var onAddNewOrder = function (user, orderData, sellers) {
                    var today = new Date();
                    var reportDateString = convertDate(today);
                    var nodeNameToUpdate = findNodeName(parseInt(orderData.status_id));

                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/newOrders/' + orderData.id] = orderData;
                        return firebase.database().ref().update(updates).then(function () {
                            // đoạn code này không an toàn
                            // code ở đây không được thực thi, phải chờ khi firebase update xong dữ liệu mới có thể 
                            // cập nhật report được
                            // cập nhật report
                            // orderData.seller_will_call_id
                            // cần tìm seller và truyền vào phuuwong thức sau nếu ki tạo order gán cho serler
                            var owner = null;
                            if (orderData.seller_will_call_id) {
                                angular.forEach(sellers, function (seller) {
                                    if (seller.id == orderData.seller_will_call_id) {
                                        owner = seller;
                                    }
                                })
                            }
                            preparingEmptyReport(user, owner, orderData.page_id).then(function (response) {
                                // cập nhật báo cáo cho page
                                firebase.database().ref().child('report').child(reportDateString).child('pageReport')
                                    .child(orderData.page_id).child('totalCustomers').transaction(function (oldValue) {
                                        return oldValue + 1;
                                    });

                                //
                                firebase.database().ref().child('report').child(reportDateString).child(nodeNameToUpdate)
                                    .transaction(function (oldValue) {
                                        return oldValue + 1;
                                    });
                                // 2 - nếu order này được gán cho 1 seller => tăng 1 đơn vị trong báo cáo ngày của 
                                // user của nodeNameToUpdate
                                if (orderData.seller_will_call_id) {
                                    firebase.database().ref().child('report').child(reportDateString).child('userReport')
                                        .child(orderData.seller_will_call_id).child(nodeNameToUpdate).transaction(function (oldValue) {
                                            return oldValue + 1;
                                        });
                                }

                                // update today report
                                firebase.database().ref().child('report').child(reportDateString).child('today').transaction(function (oldValue) {
                                    return oldValue + 1;
                                });

                                resolve('Thêm Order thành công!');
                            });

                        }).catch(function (error) {
                            reject('Không thể tạo Order. Lỗi: ' + error);
                        });
                    });
                }


                // XỬ LÝ PHẦN PHÂN BỔ SỐ
                /*
                 * Phân bổ danh sách một Orders cho một danh sách các Users
                 * @param  {orders}  danh sách orders sẽ phân bổ
                 * @param  {userIds}  danh sách user ids sẽ được phân bổ
                 */
                var onPushOrders = function (orders, users) {
                    var totalOrders = orders.length;
                    var _d = new Date();
                    var reportDateString = convertDate(_d); // yyyyMMdd

                    return new Promise(function (resolve, reject) {
                        if (orders.length == 0) {
                            reject('Vui lòng chọn Order(s) để phân bổ');
                            return;
                        }
                        if (users.length == 0) {
                            reject('Vui lòng chọn User(s) để phân bổ');
                            return;
                        }
                        if(users.length > orders.length){
                            reject('Không thể phân bổ ' + orders.length + ' order(s) cho ' + users.length + ' user(s)');
                            return;
                        }
                        // bắt đầu phân bổ số
                        var num = Math.floor(orders.length / users.length);
                        // var balance = orders.length % users.length;

                        var chunkArr = orders.chunk(num);

                        for (var i = 0; i < users.length; i++) {
                            console.log('update mảng thứ ' + i + ' cho user id: ' + users[i].id);
                            onUpdateOrdersOwner(chunkArr[i], users[i]).then(function (response) {
                                    console.log(response);
                                    
                                })
                                .catch(function (err) {
                                    reject(err);
                                })
                        }

                        // phân bổ phần còn dư cho user ngẫu nhiên
                        var randomUser = users[Math.floor(Math.random() * users.length)];

                        if (chunkArr.length > users.length) {
                            onUpdateOrdersOwner(chunkArr[chunkArr.length - 1], randomUser).then(function (response) {
                                    console.log(response);
                                })
                                .catch(function (err) {
                                    reject(err);
                                })
                        }
                        resolve('Phân bổ thành công ' + totalOrders + ' orders cho ' + users.length + ' users.');
                    })
                }

                /*
                 * Phân bổ danh sách một Orders cho một User
                 * @param  {orders == array}  danh sách orders id sẽ phân bổ
                 * @param  {userId}  user id sẽ được phân bổ
                 */
                var onUpdateOrdersOwner = function (orders, user) {
                    ////////////////////////////////////////////////////////////////////
                    //////??????????????????????????????????????????????????????????????
                    //////??????????????????????????????????????????????????????????????
                    //////??????????????????????????????????????????????????????????????
                    // KHI PHÂN SỐ CŨ CỦA NGÀY TRƯỚC XỬ LÝ BÁO CÁO NHƯ THẾ NÀO????????

                    // phân bổ ===> luôn luôn tăng giá trị báo cáo ở thời điểm hiện tại
                    // hủy ===> giảm ở báo cáo của ngày trùng với ngày tạo order

                    // console.log(orders);
                    return new Promise(function (resolve, reject) {
                        if (orders.length == 0) {
                            reject('Vui lòng chọn Order(s) để phân bổ');
                        }
                        if (!user) {
                            reject('Vui lòng chọn User để phân bổ');
                        }

                        // tạo mảng dữ liệu sẽ updates
                        var canPushOrders = [];
                        var updates = {};
                        angular.forEach(orders, function (order) {
                            // ngăn không cho phân bổ các order đang có người sở hữu
                            if(!order.seller_will_call_id){
                                canPushOrders.push(order);
                                updates['/newOrders/' + order.id + '/seller_will_call_id'] = user.id;
                            }
                            if(order.status_id !== 1){
                                updates['/newOrders/' + order.id + '/is_old'] = true;
                            }
                        });

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {

                            // cập nhật báo cáo của user
                            var groupOrders = canPushOrders.groupBy('status_id');

                            var today = new Date();
                            var reportDateString = convertDate(today);

                            onAssignedOrdersToSeller(reportDateString, canPushOrders, user.id)
                            .then(function(res){
                                console.log(res);
                            });

                            // console.log(groupOrders);
                            preparingEmptyReport(user, user, null).then(function (response) {

                                var promises = [];

                                angular.forEach(groupOrders, function (group, key) {
                                    // console.log(key);
                                    var deferred = $q.defer();

                                    var nodeName = findNodeName(parseInt(key));

                                    // Cập nhật báo cáo cho user
                                    firebase.database().ref().child('report').child(reportDateString).child('userReport')
                                        .child(user.id).child(nodeName).transaction(function (oldValue) {
                                            return oldValue + group.length;
                                        }).then(function (res) {
                                            deferred.resolve('Đã phân bổ thành công ' + canPushOrders.length + ' orders cho user id = ' + user.id);
                                            console.log('Đã phân bổ thành công ' + canPushOrders.length + ' orders cho user id = ' + user.id);
                                        });
                                    promises.push(deferred.promise);
                                    console.log('Cập nhật báo cáo ' + group.length + ' cho ' + nodeName + ' của user: ' + user.id);
                                })/////

                                $q.all(promises).then(function(results){
                                        resolve('Đã phân bổ thành công ' + canPushOrders.length + ' orders cho user id = ' + user.id);
                                    })

                            }).catch(function (err) {
                                console.log(err);
                                reject('Không thể cập nhật báo cáo của user');
                            })

                        }).catch(function (err) {
                            reject('Không thể phân bổ orders, đã có lỗi xảy ra');
                        })
                    })
                }

                // XỬ LÝ PHẦN PHÂN HỦY SỐ
                /*
                 * Tìm tất cả orders khả dụng của một User
                 */
                var findAvalableUserOrders = function (allOrders, user, accept_statuses) {
                    return new Promise(function (resolve, reject) {
                        // tìm các orders khả dụng của 1 user
                        var result = [];

                        angular.forEach(allOrders, function (order) {
                            if (order.seller_will_call_id == user.id) {
                                if (accept_statuses.indexOf(order.status_id) !== -1) {
                                    result.push(order);
                                }
                            }
                        })

                        if (result.length > 0) {
                            resolve(result);
                        } else {
                            reject('Không có Order nào của ' + user.last_name + ' khả dụng để hủy.');
                        }
                    })
                }

                /*
                 * Hủy tất cả orders khả dụng của một User
                 * allOrders = danh sách tất cả orders khả dụng của tất cả users
                 * accept_statuses là mảng chứa các status id cho phép hủy
                 * updateReport là tùy chọn có cập nhật báo cáo của user hay không
                 * đề phòng trường hợp khi hủy order của user ở ngày cũ lại cập nhật báo cáo sang ngày mới
                 */
                var releaseUser = function (allOrders, user, accept_statuses, updateReport = true) {
                    var can_release_statuses = [];

                    angular.forEach(accept_statuses, function (status) {
                        can_release_statuses.push(status.id);
                    })
                    console.log(can_release_statuses);
                    return new Promise(function (resolve, reject) {
                        // tìm các orders khả dụng của 1 user
                        if (!user) reject('Vui lòng chọn User trước khi hủy');
                        findAvalableUserOrders(allOrders, user, can_release_statuses).then(function (orders) {

                                if (orders.length == 0) {
                                    reject('Không có Order nào của ' + user.last_name + ' khả dụng để hủy.');
                                }
                                // hủy
                                onReleaseUserOrders(orders, user, can_release_statuses).then(function (response) {
                                        // đã hủy thành công
                                        MUtilitiesService.AlertSuccessful('Hủy thành công ' + orders.length + ' của ' + user.last_name, 'Thông báo');
                                        resolve(response);
                                    })
                                    .catch(function (err) {
                                        MUtilitiesService.AlertError(err, 'Lỗi');
                                        reject(err);
                                    })
                            })
                            .catch(function (err) {
                                MUtilitiesService.AlertError(err, 'Lỗi');
                                reject(err);
                            })
                    })
                }

                /*
                 * Hủy danh sách một Orders của một User
                 * @param  {orders == array}  danh sách orders id sẽ hủy
                 * @param  {userId}  user id sẽ được phân bổ
                 */
                var onReleaseUserOrders = function (orders, user, updateReport = true) {
                    return new Promise(function (resolve, reject) {
                        if (orders.length == 0) {
                            reject('Vui lòng chọn Order(s) để hủy');
                        }
                        if (!user) {
                            reject('Vui lòng chọn User để hủy');
                        }
                        // tạo mảng dữ liệu sẽ updates
                        var updates = {};
                        angular.forEach(orders, function (order) {
                            if(order.seller_will_call_id){
                                updates['/newOrders/' + order.id + '/previous_seller_id'] = order.seller_will_call_id;
                            }
                            updates['/newOrders/' + order.id + '/seller_will_call_id'] = null;
                        });

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {
                            // assigned
                            var today = new Date();
                            var reportDateString = convertDate(today);

                            onReleaseSellerOrders(reportDateString, orders, user.id).then(function(res){
                                console.log(res);
                            })
                                if (updateReport) {
                                    // đã hủy thành công => cập nhật báo cáo
                                    var groupOrders = orders.groupBy('status_id');

                                    

                                    angular.forEach(groupOrders, function (group, key) {

                                        // tiếp tục phân loại theo từng ngày, để cập nhật cho báo cáo ngày tương ứng
                                        // console.log(group);
                                        angular.forEach(group, function (item) {
                                            // console.log(item);
                                            item.date = convertDate(new Date(item.publish_date));
                                            // console.log(item.date);
                                        });

                                        // phân nhóm theo ngày tạo order
                                        var subGroup = group.groupBy('date');

                                        var nodeName = findNodeName(parseInt(key));

                                        angular.forEach(subGroup, function (childGroup, k) {
                                            // console.log(k);

                                            // tạo mảng báo cáo cho user nếu cần
                                            // CẨN THẬN: NẾU HỦY CÁC ORDERS CỦA NGÀY CŨ SẼ PHÁT SINH BÁO CÁO TRONG NGÀY MỚI
                                            // CẦN XỬ LÝ
                                            preparingEmptyReport(user, user, null).then(function (response) {
                                                firebase.database().ref().child('report').child(k).child('userReport')
                                                    .child(user.id).child(nodeName).transaction(function (oldValue) {
                                                        if (oldValue <= 0) {
                                                            return oldValue;
                                                        } else {
                                                            return oldValue - childGroup.length;
                                                        }

                                                    }).then(function (res) {
                                                        console.log('Đã hủy thành công ' + childGroup.length + ' orders của user id = ' + user.id +
                                                            ' và cập nhật báo cáo của user thành công.');

                                                    });
                                            }).catch(function (err) {
                                                console.log(err);
                                                reject('Không thể cập nhật báo cáo của user');
                                            })
                                        })
                                        resolve('Hủy thành công');
                                        // console.log('Cập nhật báo cáo ' + group.length + ' cho ' + nodeName + ' của user: ' + user.id);
                                    })
                                } else {
                                    resolve('Đã hủy thành công ' + orders.length + ' orders của user id = ' + user.id +
                                        '. Bỏ qua cập nhật báo cáo của user.');
                                }

                            })
                            .catch(function (err) {
                                console.log(err);
                                reject('Không thể hủy orders, đã có lỗi xảy ra. Lỗi: ' + err);
                            })
                    })
                }

                var updateBadNumber = function (oerderId) {
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/newOrders/' + oerderId + '/is_bad_number'] = 1;

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {
                                resolve('Đã thông báo sai số thành công');
                            })
                            .catch(function (err) {
                                reject(err)
                            })
                    })
                }

                /* 
                Split an array into chunks and return an array
                of these chunks.
                This will *not* preserve array keys.
                * https://gist.github.com/webinista/11240585
                */
                Array.prototype.chunk = function (groupsize) {
                    var sets = [],
                        chunks, i = 0;
                    chunks = this.length / groupsize;

                    while (i < chunks) {
                        sets[i] = this.splice(0, groupsize);
                        i++;
                    }
                    return sets;
                };

                /**
                 * Convert date from 12315648465 to YYYYMMDD
                 * @param  {d}  date in miliseconds
                 * @return {string} date YYYYMMDD
                 */
                var convertDate = function (d) {
                    return d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
                }
                var convertDate2 = function (a) {
                    var d = new Date(a);
                    return d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
                }

                /**
                 * Group an Array by one field
                 * @param  {list}  array to group
                 * @param  {prop}  field to group
                 * @return {array}
                 */
                Array.prototype.groupBy = function (prop) {
                    return this.reduce(function (groups, item) {
                        const val = item[prop]
                        groups[val] = groups[val] || []
                        groups[val].push(item)
                        return groups
                    }, {})
                }

                var getOrders = function (pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                // console.log(snapshot.val());
                                if (snapshot.val().status_id !== 6 && snapshot.val().status_id !== 7 && snapshot.val().status_id !== 8)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                resolve(result);
                            })
                    })
                }

                /*
                * get orders by User
                */
                var getOrdersByUser = function (pageSize, user) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('seller_will_call_id')
                            .equalTo(user.id)
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                resolve(result);
                            })
                    })
                }

                var getNextOrdersByUser = function (pageSize, user, fromKey) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByKey()
                            .endAt(fromKey)
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                resolve(result);
                            })
                    })
                }



                var getOrdersByDate = function (date) {
                    return new Promise(function (resolve, reject) {

                        var orderDays = [];

                        var endTime = new Date(date);
                        var startTime = new Date(date);
                        startTime.setHours(0,0,0,0);
                        endTime.setHours(23,59,59,999);

                        startTime = startTime.getTime();
                        endTime = endTime.getTime();

                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('created_time')
                            .startAt(startTime)
                            .endAt(endTime)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function(item){
                                    result.push(item);
                                })
                                resolve(result);
                            })
                    })
                }

                var getOrdersByDateRange = function (from_date, to_date) {
                    return new Promise(function (resolve, reject) {

                        var orderDays = [];

                        var endTime = new Date(from_date);
                        var startTime = new Date(to_date);
                        startTime.setHours(0,0,0,0);
                        endTime.setHours(23,59,59,999);

                        startTime = startTime.getTime();
                        endTime = endTime.getTime();

                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('created_time')
                            .startAt(startTime)
                            .endAt(endTime)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function(item){
                                    result.push(item);
                                })
                                resolve(result);
                            })
                    })
                }

                var getAllOrdersByDateRange = function (from_date, to_date) {
                    return new Promise(function (resolve, reject) {

                        var orderDays = [];

                        var endTime = new Date(from_date);

                        var startTime = new Date(to_date);
                        endTime.setHours(0,0,0,0);
                        startTime.setHours(23,59,59,999);

                        startTime = startTime.getTime();
                        endTime = endTime.getTime();

                        console.log( startTime );

                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('publish_date')
                            .startAt(endTime)
                            .endAt(startTime)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function(item){
                                    result.push(item);
                                })
                                resolve(result);
                            })
                    })
                }

                var getNextOrders = function (fromKey, pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .endAt(fromKey)
                            // .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                if (snapshot.val().status_id !== 6 && snapshot.val().status_id !== 7 && snapshot.val().status_id !== 8)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                // console.log(snapshot.val());
                                // console.log(snapshot.key);
                                resolve(result);
                            })
                    })
                }

                // TÌM KIẾM ORDER
                var searchOrderByCustomerName = function (query) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('customer_name')
                            .equalTo(query)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push(value);
                                })
                                // console.log(snapshot.val());
                                resolve(result);
                            })
                    })
                }
                var searchOrderByCustomerPhone = function (phone) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('customer_mobile')
                            .equalTo(phone)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    console.log(key);
                                    result.push(value);
                                })
                                resolve(result);
                            })
                    })
                }

                var findDuplicateOrerByPhone = function(phone){
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('customer_mobile')
                            .equalTo(phone)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push(value);
                                })
                                resolve(result);
                            })
                    })
                }

                // search shipping item
                var searchShippingByCustomerPhone = function (phone) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('customer_mobile')
                            .startAt(phone)
                            .endAt(phone + "\uf8ff")
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push(value);
                                })
                                resolve(result);
                            })
                    })
                }
                var searchShippingByCustomerName = function (query) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('customer_name')
                            .startAt(query)
                            .endAt(query + "\uf8ff")
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push(value);
                                })
                                // console.log(snapshot.val());
                                resolve(result);
                            })
                    })
                }

                var searchShippingByOrderId = function (orderId) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('orderId')
                            .equalTo(orderId)
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push({
                                        key : key,
                                        data : value,
                                    });
                                })
                                resolve(result);
                            })
                    })
                }

                var updateShippingItemCustomerData = function (itemId, customerData) {
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/shippingItems/' + itemId + '/data/customerData'] = customerData;

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {
                                resolve('Đã cập nhật dữ liệu Order thành công');
                            })
                            .catch(function (err) {
                                reject(err)
                            })
                    })
                }

                var getShippingItem = function(id){
                    return firebase.database().ref().child('shippingItems').orderByChild('id').equalTo(id).once('value', function(snapshot){
                    })
                  }

                /*
                * Hủy đơn trên GHN
                */
                var cancelShippingItem = function(date, cod, shipping_cod, itemKey, isCancelOnSystem = false){
                    return new Promise(function (resolve, reject) {

                        var updates = {};
                        
                        if(isCancelOnSystem){
                            updates['/shippingItems/' + itemKey + '/is_cancel'] = true;
                        }
                        updates['/shippingItems/' + itemKey + '/cancel_ghn_at'] = Date.now();
                        updates['/shippingItems/' + itemKey + '/orderCode'] = null;
                        updates['/shippingItems/' + itemKey + '/push_to_ghn_at'] = null;

                        // cập nhật báo cáo
                        firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_cod')
                        .transaction(function (oldValue) {
                            return oldValue - cod;
                        });

                        firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_created_items')
                        .transaction(function (oldValue) {
                            return oldValue - 1;
                        });

                        firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_not_created_items')
                        .transaction(function (oldValue) {
                            return oldValue + 1;
                        });

                        firebase.database().ref().child('report').child(date)
                        .child('shippingReport').child('total_cancel_ghn')
                        .transaction(function (oldValue) {
                            return oldValue + 1;
                        });

                        
                        // update shipping costs
                        firebase.database().ref().child('report').child(date)
                            .child('shippingReport').child('total_shipping_costs')
                            .transaction(function (oldValue) {
                                return oldValue - shipping_cod;
                            });

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {
                                resolve('Đã cập nhật dữ liệu Order thành công');
                            })
                            .catch(function (err) {
                                reject(err)
                            })
                    })
                }

                // GET ORDERS BY STATUS ID
                var getOrdersByStatusId = function (status_id, pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('newOrders')
                            .orderByChild('status_id')
                            .equalTo(status_id)
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                result.push({
                                    key: snapshot.key,
                                    data: snapshot.val()
                                });
                                resolve(result);
                            })
                    })
                }

                ////// get images
                var getPhotos = function (pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('uploads').child('products').child('images')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                // console.log(snapshot.val());
                                if (snapshot.val().status_id !== 0)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                resolve(result);
                            })
                    })
                }

                var getNextPhotos = function (fromKey, pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('uploads').child('products').child('images')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .endAt(fromKey)
                            // .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                if (snapshot.val().status_id !== 0)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val()
                                    });
                                // console.log(snapshot.val());
                                // console.log(snapshot.key);
                                resolve(result);
                            })
                    })
                }

                /////////////////////////////////////////////////////////////////////////////////////
                // TRANG SHIPPING
                var getShippingItems = function (pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                // console.log(snapshot.val());
                                if (snapshot.val().status_id !== 0)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val(),
                                        notes: []
                                    });
                                resolve(result);
                            })
                    })
                }
                var getShippingItemsByUser = function (uid) {
                    return new Promise(function (resolve, reject) {

                        var orderDays = [];

                        var endTime = new Date();
                        var startTime = new Date();
                        startTime.setHours(0,0,0,0);
                        endTime.setHours(23,59,59,999);

                        startTime = startTime.getTime();
                        endTime = endTime.getTime();


                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('created_time')
                            .startAt(startTime)
                            .endAt(endTime)
                            .once('value', snapshot => {
                                // console.log(snapshot.val());
                                angular.forEach(snapshot.val(), function(item, key){
                                    // console.log(item);
                                    if(item.data.orderData.seller_will_call_id == uid && !item.is_cancel){
                                        result.push({
                                            key: key,
                                            data: item,
                                            notes: []
                                        });
                                    }
                                })
                                resolve(result);
                            })
                    })
                }

                var getShippingItemsByPage = function (page_id) {
                    return new Promise(function (resolve, reject) {

                        var orderDays = [];

                        var endTime = new Date();
                        var startTime = new Date();
                        startTime.setDate(endTime.getDate());
                        startTime.setHours(0,0,0,0);

                        endTime.setDate(endTime.getDate());
                        endTime.setHours(23,59,59,999);

                        startTime = startTime.getTime();
                        endTime = endTime.getTime();


                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('created_time')
                            .startAt(startTime)
                            .endAt(endTime)
                            .once('value', snapshot => {
                                // console.log(snapshot.val());
                                angular.forEach(snapshot.val(), function(item, key){
                                    // console.log(item);
                                    if(item.data.orderData.page_id == page_id && !item.is_cancel){
                                        result.push({
                                            key: key,
                                            data: item,
                                            notes: []
                                        });
                                    }
                                })
                                resolve(result);
                            })
                    })
                }


                var getNextShippingItems = function (fromKey, pageSize) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByKey()
                            .limitToLast(pageSize)
                            .endAt(fromKey)
                            // .limitToLast(pageSize)
                            .on('child_added', snapshot => {
                                if (snapshot.val().status_id !== 0)
                                    result.push({
                                        key: snapshot.key,
                                        data: snapshot.val(),
                                        notes: []
                                    });
                                // console.log(snapshot.val());
                                // console.log(snapshot.key);
                                resolve(result);
                            })
                    })
                }

                // TÌM KIẾM SHIPPING ITEMS
                var searchShippingItemsByCustomerName = function (query) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('customer_name')
                            .startAt(query)
                            .endAt(query + "\uf8ff")
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push({
                                        key: key,
                                        data: value,
                                        notes: []
                                    });
                                })
                                // console.log(snapshot.val());
                                resolve(result);
                            })
                    })
                }
                var searchShippingItemsByCustomerPhone = function (phone) {
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('shippingItems')
                            .orderByChild('customer_mobile')
                            .startAt(phone)
                            .endAt(phone + "\uf8ff")
                            .once('value', snapshot => {
                                angular.forEach(snapshot.val(), function (value, key) {
                                    result.push({
                                        key: key,
                                        data: value,
                                        notes: []
                                    });
                                })
                                resolve(result);
                            })
                    })
                }

                // REPORT

                var getReportForDate = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('report')
                    .child(reportDateString).once('value', function (snapshot) {});
                }
                var getSuccessForDate = function (date) {
                    // date = 2018-07-03

                    var reportDateString = convertDate(new Date(date));
                    // alert( reportDateString );
                    // return firebase.database().ref().child('report')
                    // .child(reportDateString)
                    // .child('successCount').once('value', function (snapshot) {
                    //     console.log( snapshot.value() );
                    // });

                    return new Promise(function(resolve, reject){
                        firebase.database().ref().child('report')
                        .child(reportDateString).child('successCount')
                        .once('value', function (snapshot) {
                            resolve(snapshot.val());
                        });
                    })
                }
                var getReportForToday = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('report').limitToLast(1)
                    .once('value', function (snapshot) {});
                }
                var getUsersReportForDate = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('report').child(reportDateString).child('userReport').once('value', function (snapshot) {});
                }

                var getPagesReportForDate = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('report').child(reportDateString)
                        .child('pageReport').once('value', function (snapshot) {});
                }

                var getShippingReportForDate = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('report').child(reportDateString)
                        .child('shippingReport').once('value', function (snapshot) {});
                }

                var getAssignedReportForDate = function (date) {
                    // date = 2018-07-03
                    var reportDateString = convertDate2(date);
                    return firebase.database().ref().child('assigned').child(reportDateString)
                        .once('value', function (snapshot) {});
                }

                var getReportForChart = function () {
                    // date = 2018-07-03
                    return new Promise(function(resolve, reject){
                        firebase.database().ref().child('report').limitToLast(10).once('value', function (snapshot) {
                            // console.log(snapshot.val());
                            // var res = [];
                            var new_customer = [], success = [], user_report = [],
                             called = [], notCalled = [], missCall = [], callLater = [],
                             pendding = [], cancel = [];


                            angular.forEach(snapshot.val(), function(item){
                                console.log(item);
                                new_customer.push({
                                    'date' : new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.today
                                });
                                success.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.successCount
                                });
                                called.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.calledCount
                                });
                                notCalled.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.notCalledCount
                                });
                                missCall.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.missedCount
                                });
                                callLater.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.callLaterCount
                                });
                                pendding.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.penddingCount
                                });
                                cancel.push({
                                    'date': new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
                                    'value' : item.cancelCount
                                });
                                // if(page_report.length>0){
                                //    angular.forEach(page_report, function(page_data){
                                //         if(page_data && page_data.id == item.pageReport.id){
                                //             page_report.push({
                                //                 id : page_data.totalCustomers + item.pageReport.totalCustomers
                                //             });
                                //         }
                                //     }) 
                                // }
                                // else{

                                // }
                                
                                // page_report_new.push({
                                //     'date': item.date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'),
                                //     'value' : item.successCount
                                // });
                                // angular.forEach(item.userReport, function(userData){

                                // })
                                // if(item.userReport){
                                //     angular.forEach(item.userReport, function(userReport){
                                //         console.log(userReport);
                                //     })
                                // }
                                user_report.push({
                                    'date': item.date,
                                    'value': item.userReport
                                })

                            })
                            // res.push(new_customer);
                            // res.push(success);

                            resolve({
                                success: success,
                                new_customer: new_customer,
                                called: called,
                                notCalled: notCalled,
                                missCall: missCall,
                                callLater: callLater,
                                pendding: pendding,
                                cancel: cancel,
                                user_report: user_report
                            });
                        });
                    })
                }

                // get report for month
                // @param: month = 01 to 12
                var getMonthReport = function(month){
                    var fromDate = '2018' + month + '01', toDate = '2018' + month + '02';
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('report')
                        .orderByKey()
                        .startAt(fromDate)
                        .endAt(toDate)
                        .once('value', function(response){
                            resolve(response.val());
                        })
                            
                    })

                }


                /**
                 * Create file item formanager
                 * @param  {fileName}  user who changing status
                 * @return {response data} response data
                 */
                var submitFileItem = function (fileData) {
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('uploads').child('products').child('images').push(fileData)
                            .then(function () {
                                resolve('Tạo node thành công');
                            });
                    })
                }

                var deleteFileItem = function (id) {
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        updates['/uploads/products/images/' + id] = null;
                        return firebase.database().ref().update(updates).then(function () {
                                resolve('Đã xóa ' + id + ' thành công.');
                            })
                            .catch(function (err) {
                                reject('Không thể xóa, lỗi: ' + err)
                            })
                    })
                }

                var getAllSellers = function () {
                    return new Promise(function (resolve, reject) {
                        var res = [];
                        firebase.database().ref().child('members').orderByChild('status')
                            .equalTo(1).once('value', function (snapshot) {
                                angular.forEach(snapshot.val(), function (member) {
                                    if (member.is_seller == 1) {
                                        res.push(member);
                                    }
                                })
                            })
                            .then(function () {
                                resolve(res);
                            })
                            .catch(function () {
                                resolve(null)
                            });
                    })
                }
                var getAllMembers = function () {
                    return new Promise(function (resolve, reject) {
                        var res = [];
                        firebase.database().ref().child('members')
                            .once('value', function (snapshot) {
                                angular.forEach(snapshot.val(), function (member) {
                                        res.push(member);
                                })
                            })
                            .then(function () {
                                resolve(res);
                            })
                            .catch(function () {
                                resolve(null)
                            });
                    })
                }
                var getAllActiveMembers = function(){
                    return firebase.database().ref().child('members').orderByChild('status').equalTo(1).once('value', function(snapshot) {
                    });
                }
                var getStatuses = function () {
                    return new Promise(function (resolve, reject) {
                        var res = [];
                        firebase.database().ref().child('statuses').orderByChild('allow_change').equalTo(1)
                            .once('value', function (snapshot) {
                                angular.forEach(snapshot.val(), function (status) {
                                    if (status.active == 1) {
                                        res.push(status);
                                    }
                                })
                            })
                            .then(function () {
                                resolve(res);
                            })
                            .catch(function () {
                                resolve(null)
                            });
                    })

                }

                var updateMemberMask = function(member_id, is_mask = null){
                    return new Promise(function (resolve, reject) {
                        // find this member
                        firebase.database().ref().child('members').orderByChild('id')
                        .equalTo(member_id)
                        .once('value', function (snapshot) {
                            var member_key = null;
                            angular.forEach(snapshot.val(), function (value, key) {
                                    // console.log(key);
                                    if(key){
                                        member_key = key;
                                    }
                                });

                            if(!member_key){
                                reject('Không thể cập nhật mask cho user');
                            }
                            var updates = {};
                            updates['/members/' + member_key + '/is_mask'] = is_mask;
                            return firebase.database().ref().update(updates).then(function () {
                                var title = is_mask? 'Gắn ' : 'Gỡ ';
                                resolve(title + 'Mask cho user thành công!');
                            })
                            .catch(function (error) {
                                reject('Không thể cập nhật mask cho user. Lỗi: ' + error);
                            });
                        });
                    });
                }

                /*
                * get Pancake Token from page ID: 261147674417633
                */
                var getPancakeReport = function(page_id, from_date, to_date){
                    var pancake_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJlMjBmNzJiNi0yMjc2LTQ0MDUtYjY2MC0xOGJiMzlkYjYzZjQiLCJpYXQiOjE1MzIwODA5NTAsImZiX25hbWUiOiJOZ3V54buFbiBWxINuIEPDtG5nIiwiZmJfaWQiOiIxMjM0NDY3MDg2NjA1MjM4IiwiZXhwIjoxNTM5ODU2OTUwfQ.Xn8v3LcHAYoGBBv-D03wouHm0flvvKCxuV9hH_hut04';
                    var url = 'https://pages.fm/api/v1/pages/' + page_id + '/statistics?date_range=' +  from_date + '%20-%20' + to_date + '&is_detail=true&access_token=' + pancake_token;

                    return new Promise(function(resolve, reject){
                        // var config = {
                        // headers: {
                        //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        //     }
                        //   }

                        $http.get(url)
                            .then(function(response) {
                                // console.log(response);
                                resolve(response);
                            })
                            .catch(function(err){
                                reject('Can not get categories data. Erorr: ' + err);
                            })
                    })
                }

                var getMemberByEmail = function (email) {
                    return new Promise(function (resolve, reject) {
                        // kiểm tra xem tổ hợp phím tắt đã tồn tại chưa
                        firebase.database().ref().child('members').orderByChild('email')
                        .equalTo(email)
                            .once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    angular.forEach(snapshot.val(), function(value, key){
                                        resolve(value);
                                    })
                                }
                                else{
                                   reject('Can not found member with email: ' + email);
                                }
                            });
                    });
                }

                // viettel post
                var onCreateViettelPostSuccess = function (order_key, order_success_date, order_data, order_code, station) {
                    return new Promise(function (resolve, reject) {

                        var _d = new Date(order_success_date);
                        var reportDateString = convertDate(_d); // yyyyMMdd

                        // cập nhật firebase
                        var updates = {};
                            
                        updates['/shippingItems/' + order_key + '/viettel_post_data'] = order_data;
                        updates['/shippingItems/' + order_key + '/viettel_post_code'] = order_code;
                        updates['/shippingItems/' + order_key + '/viettel_post_station_id'] = station.id;
                        updates['/shippingItems/' + order_key + '/viettel_post_station_name'] = station.name;

                        // update firebase database
                        // order chốt ngày nào sẽ cập nhật vào báo cáo của ngày đó
                        firebase.database().ref().update(updates).then(function (response) {
                            // cập nhật tổng số đơn đã tạo
                            firebase.database().ref().child('report').child(reportDateString)
                            .child('shippingReport').child('total_created_items')
                            .transaction(function (oldValue) {
                                return oldValue + 1;
                            })
                            .then(function(){
                                // giảm tổng số đơn chưa tạo
                                firebase.database().ref().child('report').child(reportDateString)
                                .child('shippingReport').child('total_not_created_items')
                                .transaction(function (oldValue) {
                                    if(oldValue >= 1){
                                        return oldValue - 1;
                                    }
                                    else{
                                        return oldValue;
                                    }
                                })
                                .then(function(){
                                    firebase.database().ref().child('report').child(reportDateString)
                                    .child('shippingReport').child('total_cod')
                                    .transaction(function (oldValue) {
                                        return oldValue + parseInt(order_data.MONEY_COLLECTION);
                                    })
                                    .then(function(){
                                        firebase.database().ref().child('report').child(reportDateString)
                                        .child('shippingReport').child('total_shipping_costs')
                                        .transaction(function (oldValue) {
                                            return oldValue + parseInt(order_data.MONEY_TOTALFEE);
                                        })
                                        .then(function(){
                                            firebase.database().ref().child('report').child(reportDateString)
                                            .child('shippingReport').child('viettel_post_items')
                                            .transaction(function (oldValue) {
                                                return oldValue + 1;
                                            })
                                            .then(function(){
                                                firebase.database().ref().child('report').child(reportDateString)
                                                .child('shippingReport').child('viettel_post_cod')
                                                .transaction(function (oldValue) {
                                                    return oldValue + parseInt(order_data.MONEY_COLLECTION);
                                                })
                                                .then(function(){
                                                    firebase.database().ref().child('report').child(reportDateString)
                                                    .child('shippingReport').child('viettel_post_shipping_costs')
                                                    .transaction(function (oldValue) {
                                                        return oldValue + parseInt(order_data.MONEY_TOTALFEE);
                                                    })
                                                    .then(function(){
                                                        resolve('Cập nhật đơn hàng và báo cáo thành công!');
                                                    })
                                                })
                                            })
                                        })
                                    })
                                });
                            })
                            .catch(function(err){
                                reject(err)
                            });
                        })
                        .catch(function (err) {
                            reject(err)
                        })
                    })   
                }
                var onCancelViettelPostSuccess = function (order_key, order_success_date, order_data, order_code) {
                    return new Promise(function (resolve, reject) {
                        var _d = new Date(order_success_date);
                        var reportDateString = convertDate(_d); // yyyyMMdd

                        // cập nhật firebase
                        var updates = {};
                            
                        updates['/shippingItems/' + order_key + '/viettel_post_data'] = null;
                        updates['/shippingItems/' + order_key + '/viettel_post_code'] = null;

                        // update firebase database
                        // order chốt ngày nào sẽ cập nhật vào báo cáo của ngày đó
                        firebase.database().ref().update(updates).then(function (response) {
                            // cập nhật tổng số đơn đã tạo
                            firebase.database().ref().child('report').child(reportDateString)
                            .child('shippingReport').child('total_created_items')
                            .transaction(function (oldValue) {
                                return oldValue - 1;
                            })
                            .then(function(){
                                // giảm tổng số đơn chưa tạo
                                firebase.database().ref().child('report').child(reportDateString)
                                .child('shippingReport').child('total_not_created_items')
                                .transaction(function (oldValue) {
                                    return oldValue + 1;
                                })
                                .then(function(){
                                    firebase.database().ref().child('report').child(reportDateString)
                                    .child('shippingReport').child('total_cod')
                                    .transaction(function (oldValue) {
                                        if(oldValue > 0){
                                            return oldValue - parseInt(order_data.MONEY_COLLECTION);
                                        }
                                        else{
                                            return oldValue;
                                        }
                                        
                                    })
                                    .then(function(){
                                        firebase.database().ref().child('report').child(reportDateString)
                                        .child('shippingReport').child('total_shipping_costs')
                                        .transaction(function (oldValue) {
                                            if(oldValue > 0){
                                                return oldValue - parseInt(order_data.MONEY_TOTALFEE);
                                            }
                                            else{
                                                return oldValue;
                                            }
                                        })
                                        .then(function(){
                                            firebase.database().ref().child('report').child(reportDateString)
                                            .child('shippingReport').child('viettel_post_items')
                                            .transaction(function (oldValue) {
                                                if(oldValue >= 1){
                                                    return oldValue - 1;
                                                }
                                                else{
                                                    return oldValue;
                                                }
                                            })
                                            .then(function(){
                                                firebase.database().ref().child('report').child(reportDateString)
                                                .child('shippingReport').child('viettel_post_cod')
                                                .transaction(function (oldValue) {
                                                    if(oldValue > 0){
                                                        return oldValue - parseInt(order_data.MONEY_COLLECTION);
                                                    }
                                                    else{
                                                        return oldValue;
                                                    }
                                                })
                                                .then(function(){
                                                    firebase.database().ref().child('report').child(reportDateString)
                                                    .child('shippingReport').child('viettel_post_shipping_costs')
                                                    .transaction(function (oldValue) {
                                                        if(oldValue > 0){
                                                            return oldValue - parseInt(order_data.MONEY_TOTALFEE);
                                                        }
                                                        else{
                                                            return oldValue;
                                                        }
                                                    })
                                                    .then(function(){
                                                        resolve('Cập nhật đơn hàng và báo cáo thành công!');
                                                    })
                                                })
                                            })
                                        })
                                    })
                                });
                            })
                            .catch(function(err){
                                reject(err)
                            });
                        })
                        .catch(function (err) {
                            reject(err)
                        })
                    })   
                }

                var maskShippingItemsPrinted = function (item_keys) {
                    return new Promise(function (resolve, reject) {
                        var updates = {};
                        angular.forEach(item_keys, (item) => {
                            updates['/shippingItems/' + item + '/printed'] = true;
                        })

                        // update firebase database
                        firebase.database().ref().update(updates).then(function (response) {
                                resolve('Đã cập nhật dữ liệu Order thành công');
                            })
                            .catch(function (err) {
                                reject(err)
                            })
                    })
                }

                var toggleMaskPrintedShippingItem = function(item_key){
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('/shippingItems/' + item_key + '/printed')
                        .transaction(function (oldValue) {
                            return !oldValue;
                        });
                        resolve('Success toggled Printed/Unprinted');
                    })
                }

                var get_viettel_stations = function(){
                    return new Promise(function (resolve, reject) {
                        var result = [];
                        firebase.database().ref().child('settings/viettel_hubs').on('child_added', snapshot => {
                            result.push({
                                id: snapshot.val().id,
                                name: snapshot.val().name,
                                email: snapshot.val().email,
                                password: snapshot.val().password
                            });
                        });
                        resolve(result);
                    })
                }

                var get_versions = function(){
                    return new Promise(function (resolve, reject) {
                        firebase.database().ref().child('settings/versions_update').orderByChild('version')
                        .limitToLast(1).on('child_added', snapshot => {
                            resolve(snapshot.val());
                        });
                        
                    })
                }


                // rewrite assigned orders
                function onAssignedOrdersToSeller(date, orders, seller_id) {
                    return new Promise(function (resolve, reject) {
                        angular.forEach(orders, (order) => {
                            console.log(order);
                            // check if duplicate
                            firebase.database().ref().child('assigned')
                            .child(date)
                            .child(seller_id)
                            .child('assigned_list')
                            .orderByChild('key')
                            .equalTo(order.id)
                            .once('value', snapshot => {
                                if( snapshot.val() == null ) {
                                    // báo cáo assigned
                                    firebase.database().ref()
                                    .child('assigned')
                                    .child(date)
                                    .child(seller_id)
                                    .child('assigned_list')
                                    .push({
                                        key: order.id
                                    })
                                    .then(function (response) {
                                        // increment assigned count
                                        firebase.database().ref()
                                        .child('assigned')
                                        .child(date)
                                        .child(seller_id)
                                        .child('count')
                                        .transaction(function (oldValue) {
                                            return oldValue + 1;
                                        }).then(function (res) {
                                            // cập nhật báo cáo phân số seller theo page
                                            firebase.database().ref()
                                            .child('assigned')
                                            .child(date)
                                            .child(seller_id)
                                            .child('pages')
                                            .child( order.page_id )
                                            .transaction(function (oldValue) {
                                                return oldValue + 1;
                                            }).then(function (res) {
                                                // do nothing
                                                resolve( 'success' );
                                            });
                                        });
                                    })
                                    .catch(function (err) {
                                        reject(err);
                                    })
                                }
                                else {
                                    // duplicate => ignore
                                    resolve( 'ignore' );
                                    console.log('this order is duplicate assigned to this seller');
                                }
                            } )
                        })

                        resolve('Updated assigned log success!');
                    })
                }

                function onReleaseSellerOrders(date, orders, seller_id) {
                    return new Promise(function (resolve, reject) {
                        if( !date ) reject('error date');
                        if( !seller_id ) reject( 'error seller id' );

                        angular.forEach(orders, (order) => {
                            console.log(order);
                            // check if duplicate
                            firebase.database().ref().child('assigned')
                            .child(date)
                            .child(seller_id)
                            .child('assigned_list')
                            .orderByChild('key')
                            .equalTo(order.id)
                            .once('value', snapshot => {
                                if( snapshot.val() !== null ) {
                                    var key = Object.keys(snapshot.val())[0];
                                    console.log( key );

                                    var updates = {};
                                    updates[ '/assigned/' + date + '/' + seller_id + '/assigned_list/' + key ] = null;

                                    return firebase.database().ref().update(updates).then(function () {
                                        // resolve('Cập nhật dữ liệu Order ' + orderId + ' thành công.');
                                        firebase.database().ref()
                                        .child('assigned')
                                        .child(date)
                                        .child(seller_id)
                                        .child('count')
                                        .transaction(function (oldValue) {
                                            if( oldValue > 0 ) {
                                                return oldValue - 1;
                                            }
                                            else {
                                                return 0;
                                            }
                                            
                                        }).then(function (res) {
                                            // do nothing
                                            // resolve('success');
                                            // cập nhật báo cáo phân số seller theo page
                                            firebase.database().ref()
                                            .child('assigned')
                                            .child(date)
                                            .child(seller_id)
                                            .child('pages')
                                            .child( order.page_id )
                                            .transaction(function (oldValue) {
                                                if( oldValue > 0 ) {
                                                    return oldValue - 1;
                                                }
                                                else {
                                                    return 0;
                                                }
                                            }).then(function (res) {
                                                // do nothing
                                                resolve( 'success' );
                                            });
                                        });
                                    })
                                    .catch(function (err) {
                                        reject('Không thể cập nhật, lỗi: ' + err)
                                    })

                                }
                                else {
                                    // duplicate => ignore
                                    resolve( 'ignore' );
                                    // console.log( 'this order is not in list, do nothing' );
                                    console.log('this order is not in list, do nothing');
                                }
                            } )
                        })

                        // resolve('Updated assigned log success!');
                    })
                }

                /*
                * get orders assigned to user_id
                * @param: date = yyyyMMdd
                */
                var getMyOrders = function(user_id, date){
                    // console.log(user_id);
                    return new Promise(function(resolve, reject){
                        var result = [];
                        // var promises = [];
                        firebase.database().ref().child('assigned').child(date).child(user_id)
                        .on('child_added', function(snapshot){
                            // var order_data = null;
                            // var deferred = $q.defer();
                            // firebase.database().ref().child('/newOrders/' + snapshot.val().key)
                            // .once('value', function(s){
                            //     // result.push()
                            //     deferred.resolve({
                            //         key: snapshot.val().key,
                            //         data: s.val()
                            //     });
                            //     // console.log(deferred);
                            //     promises.push(deferred.promise);
                            // })
                            result.push(snapshot.val().key)
                        })
                        resolve(result);
                        // $q.all(promises).then(function(results){
                        //     console.log(promises);
                        //     resolve(promises);
                        // })
                    })
                }

                var getShippingItemByOrderId = function(orderId){
                    return firebase.database().ref().child('shippingItems').orderByChild('orderId').equalTo(orderId).once('value', function(snapshot){
                        console.log(snapshot.val());
                    })
                }

                return {
                    getCanReleaseStatusIds: getCanReleaseStatusIds,
                    getOrders: getOrders,
                    getOrdersByDate : getOrdersByDate,
                    getOrdersByStatusId: getOrdersByStatusId,
                    searchOrderByCustomerName: searchOrderByCustomerName,
                    searchOrderByCustomerPhone: searchOrderByCustomerPhone,
                    findDuplicateOrerByPhone: findDuplicateOrerByPhone,
                    getNextOrders: getNextOrders,

                    // trang shipping
                    getShippingItems: getShippingItems,
                    getNextShippingItems: getNextShippingItems,
                    searchShippingItemsByCustomerPhone: searchShippingItemsByCustomerPhone,
                    searchShippingItemsByCustomerName: searchShippingItemsByCustomerName,
                    searchShippingByOrderId : searchShippingByOrderId,


                    set_firebase: set_firebase,
                    set_ghn_token: set_ghn_token,
                    get_ghn_token: get_ghn_token,
                    get_fanpages: get_fanpages,
                    add_fanpage: add_fanpage,
                    edit_fanpage: edit_fanpage,
                    getOrderItem: getOrderItem,
                    onChangeOrderStatus: onChangeOrderStatus,
                    onAddNewOrder: onAddNewOrder,
                    onPushOrders: onPushOrders,
                    onUpdateOrdersOwner: onUpdateOrdersOwner,
                    preparingEmptyReport: preparingEmptyReport,
                    releaseUser: releaseUser, // hủy tất cả order của user

                    // REPORT
                    getReportForDate: getReportForDate,
                    getUsersReportForDate: getUsersReportForDate,
                    getPagesReportForDate: getPagesReportForDate,
                    getShippingReportForDate: getShippingReportForDate,

                    // photos
                    getPhotos: getPhotos,
                    getNextPhotos: getNextPhotos,
                    submitFileItem: submitFileItem,
                    deleteFileItem: deleteFileItem,

                    getAllSellers: getAllSellers,
                    getStatuses: getStatuses,
                    updateBadNumber: updateBadNumber,

                    // convert date from 'yyyy-mm-dd' to yyyymmdd
                    convertDate2: convertDate2,
                    // convert date from millisecons to yyyymmdd
                    convertDate: convertDate,

                    prepareEmptyShippingReport: prepareEmptyShippingReport,

                    onCreateShippingItem: onCreateShippingItem,
                    onUpdateShippingReport: onUpdateShippingReport,
                    
                    getAllMembers: getAllMembers,
                    getShippingItem: getShippingItem,

                    updateShippingItemCustomerData: updateShippingItemCustomerData,
                    cancelShippingItem : cancelShippingItem,
                    onCancelShippingItem: onCancelShippingItem,
                    getReportForChart: getReportForChart,
                    onAddNewReply : onAddNewReply,
                    getReplies : getReplies,
                    onDeleteReply : onDeleteReply,
                    findReplyByKey : findReplyByKey,

                    addShippingNote: addShippingNote,
                    getAllMembers:getAllMembers,
                    updateMemberMask: updateMemberMask,
                    getAllActiveMembers: getAllActiveMembers,
                    getPancakeReport: getPancakeReport,
                    getMemberByEmail: getMemberByEmail,

                    // viettel post
                    onCreateViettelPostSuccess: onCreateViettelPostSuccess,
                    onCancelViettelPostSuccess: onCancelViettelPostSuccess,
                    maskShippingItemsPrinted: maskShippingItemsPrinted,
                    toggleMaskPrintedShippingItem: toggleMaskPrintedShippingItem,
                    get_viettel_stations : get_viettel_stations,

                    // telesale
                    getOrdersByUser: getOrdersByUser,
                    getNextOrdersByUser: getNextOrdersByUser,

                    // month report
                    getMonthReport: getMonthReport,
                    getMyOrders: getMyOrders,

                    getShippingItemByOrderId: getShippingItemByOrderId,
                    getShippingItemsByUser: getShippingItemsByUser,
                    getShippingItemsByPage: getShippingItemsByPage,
                    getReportForToday: getReportForToday,
                    getSuccessForDate: getSuccessForDate,
                    get_versions: get_versions,
                    getOrdersByDateRange: getOrdersByDateRange,
                    getAssignedReportForDate: getAssignedReportForDate,
                    getAllOrdersByDateRange: getAllOrdersByDateRange,
                }

            }
        ]);
}());