(function() {
    'use strict';

    angular.module('mFirebase', []);

    angular.module('mFirebase')
        .service('MFirebaseService', ["$http", 'MUtilitiesService', function($http, MUtilitiesService) {

            /*
             * firebase object
             */
            var firebase = null;

            var set_firebase = function(_firebase) {
                if (!_firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                firebase = _firebase;
            }

            // var ref = firebase.database().ref();

            /*
             * set current giao hang nhanh token
             */
            var set_ghn_token = function(token) {
                if (!firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('settings').update({
                            'ghn_access_token': token
                        })
                        .then(function(response) {
                            resolve('Thiết lập GHN token thành công');
                        })
                        .catch(function(err) {
                            reject(err);
                        })
                })

            }

            /*
             * get current giao hang nhanh token
             */
            var get_ghn_token = function() {
                if (!firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('settings').child('ghn_access_token').once('value', function(snapshot) {
                            resolve(snapshot.val());
                        })
                        .catch(function(err) {
                            reject(err);
                        })
                })
            }

            /*
             * set current giao hang nhanh token
             */
            var add_fanpage = function(page_data) {
                if (!firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('fanpages').push(page_data)
                        .then(function(response) {
                            resolve('Thêm page thành công');
                        })
                        .catch(function(err) {
                            reject(err);
                        })
                })
            }

            /*
             * edit a fanpage
             */
            var edit_fanpage = function(page_data) {
                console.log(page_data);
                if (!firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('fanpages').orderByChild('id').equalTo(page_data.id).once('value', function(snapshot) {
                        if (snapshot.val() !== null) {
                            angular.forEach(snapshot.val(), function(value, key) {
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
            var get_fanpages = function() {
                if (!firebase) {
                    console.log('Error: firebase is undefined.');
                    return;
                }
                return new Promise(function(resolve, reject) {
                    var result = [];
                    firebase.database().ref().child('fanpages').on('child_added', snapshot => {
                        result.push({
                            id: snapshot.val().id,
                            name: snapshot.val().name,
                            access_token: snapshot.val().access_token,
                            HubID: snapshot.val().HubID
                        });
                    });
                    resolve(result);
                })
            }

            /*
             * get order item by id
             */
            var getOrderItem = function(id) {
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + id).once('value', function(snapshot) {
                            resolve(snapshot.val());
                        })
                        .catch(function(err) {
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
            var onChangeOrderStatus = function(orderId, currentUser, statusId) {
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + orderId).once('value', function(snapshot) {
                            var orderOwnerId = snapshot.val().seller_will_call_id;

                            if (snapshot.val().status_id == statusId) reject('Trạng thái không thay đổi!');
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
                                            .then(function(response) {
                                                if (response) {
                                                    resolve('Admin hoặc Mod bắt đầu thao tác hủy đơn của user...');
                                                    // code hủy ở đây
                                                } else {
                                                    reject('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                                                }
                                            })
                                    } else {
                                        MUtilitiesService.showConfirmDialg('Thông báo',
                                                'Order này đã được chốt bởi không rõ ai cả, bạn có muốn hủy không?', 'Hủy', 'Bỏ qua')
                                            .then(function(response) {
                                                if (response) {
                                                    resolve('Admin hoặc Mod bắt đầu thao tác hủy đơn không rõ sở hữu của ai...');
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
                                    MUtilitiesService.showConfirmDialg('Thông báo',
                                            'Bạn đã chốt Order này vào lúc: 00:00:00. Bạn có muốn hủy không?', 'Hủy', 'Bỏ qua')
                                        .then(function(response) {
                                            if (response) {
                                                resolve('Bắt đầu thao tác hủy đơn của user...');
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
                                        MUtilitiesService.showConfirmDialg('Thông báo',
                                                'Bạn có muốn thay đổi trạng thái Order chưa được gán cho user không?', 'Thay đổi', 'Bỏ qua')
                                            .then(function(response) {
                                                if (response) {
                                                    onUpdateOrderStatus(orderId, currentUser, statusId).then(function(response) {
                                                            updateReport(currentUser, snapshot.val().status_id, statusId, orderOwnerId)
                                                                .then(function() {
                                                                    resolve('Admin hoặc Mod đã thay đổi trạng thái một Order chưa được gán và cập nhật báo cáo thành công.');
                                                                }).catch(function(err) {
                                                                    reject(err);
                                                                })
                                                        })
                                                        .catch(function(err) {
                                                            reject(err);
                                                        });
                                                } else {
                                                    reject('Admin hoặc Mod bỏ qua thao tác cập nhật trạng thái Order chưa được gán');
                                                }
                                            })
                                    } else {
                                        MUtilitiesService.showConfirmDialg('Thông báo',
                                                'Bạn có muốn thay đổi trạng thái Order này của user: ' + orderOwnerId + ' không?', 'Thay đổi', 'Bỏ qua')
                                            .then(function(response) {
                                                if (response) {
                                                    onUpdateOrderStatus(orderId, currentUser, statusId).then(function(response) {
                                                            updateReport(currentUser, snapshot.val().status_id, statusId, orderOwnerId)
                                                                .then(function() {
                                                                    resolve('Admin hoặc Mod đã thay đổi trạng thái và cập nhật báo cáo thành công.');
                                                                }).catch(function(err) {
                                                                    reject(err);
                                                                })
                                                        })
                                                        .catch(function(err) {
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
                                        .then(function(response) {
                                            if (response) {
                                                onUpdateOrderStatus(orderId, currentUser, statusId).then(function(response) {
                                                        updateReport(currentUser, snapshot.val().status_id, statusId, orderOwnerId)
                                                            .then(function() {
                                                                resolve('User đã thay đổi trạng thái và cập nhật báo cáo thành công.');
                                                            }).catch(function(err) {
                                                                reject(err);
                                                            })
                                                    })
                                                    .catch(function(err) {
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
                        .catch(function(err) {
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
            var onUpdateOrderStatus = function(orderId, currentUser, statusId) {
                return new Promise(function(resolve, reject) {
                    firebase.database().ref().child('newOrders/' + orderId).update({
                        "status_id": statusId
                    }).then(function() {
                        resolve('Thay đổi trạng thái Order thành công!');
                    }).catch(function(err) {
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
             * @param  {date}  date in YYMMDD
             * @param  {statusIdBefor}  status id before changing
             * @param  {statusIdAfter}  status change to
             * @return
             */
            var changeReportByStatus = function(date, statusIdBefor, statusIdAfter, user, orderOwnerId) {
                // nếu user thay đổi trạng thái 2 lần liên tiếp trong khoảng thời gian giới hạn < 5 phút
                // thì không cần phải tính là 1 cuộc gọi
                // nếu admin hoặc mod thay đổi trạng thái 1 order cũng không tính là 1 cuộc gọi
                // nodeNameBefore = 1 field của báo cáo tương ứng với trạng thái của Order trước khi thay đổi
                // nodeNameAfter = 1 field của báo cáo tương ứng với trạng thái của Order sau khi thay đổi
                // tùy thuộc vào id của trạng thái, sẽ có 1 field tương ứng

                // bắt đầu tìm tên của field trong báo cáo theo id của trạng thái
                var nodeNameBefore = findNodeName(parseInt(statusIdBefor)),
                    nodeNameAfter = findNodeName(parseInt(statusIdAfter));

                // phần cập nhật chung cho cả Admin, Mod và User
                // A - BÁO CÁO NGÀY
                // 1 - Tăng 1 đơn vị trong báo cáo ngày của nodeNameAfter
                firebase.database().ref().child('report').child(date).child(nodeNameAfter)
                    .transaction(function(oldValue) {
                        return oldValue + 1;
                    });
                // 2 - Giảm 1 đơn vị trong báo cáo ngày của nodeNameBefore
                firebase.database().ref().child('report').child(date).child(nodeNameBefore)
                    .transaction(function(oldValue) {
                        return oldValue - 1;
                    });

                // B - BÁO CÁO CỦA USER
                // PHẦN NÀY PHẢI XEM XÉT ORDER ĐANG THUỘC QUYỀN SỞ HỮU CỦA AI,
                // PHÒNG TRƯỜNG HỢP ORDER CHƯA ĐƯỢC GÁN
                // 1 - Tăng 1 đơn vị trong báo cáo USER của nodeNameAfter

                // phần cập nhật riêng cho Admin hoặc Mod
                if (user.is_admin == 1 || user.is_mod == 1) {
                    if (orderOwnerId) {
                        // order đã được gán
                        firebase.database().ref().child('report').child(date).child('userReport')
                            .child(orderOwnerId).child(nodeNameAfter).transaction(function(oldValue) {
                                return oldValue + 1;
                            });
                        // 2 - Giảm 1 đơn vị trong báo cáo USER của nodeNameBefore
                        firebase.database().ref().child('report').child(date).child('userReport')
                            .child(orderOwnerId).child(nodeNameBefore).transaction(function(oldValue) {
                                return oldValue - 1;
                            });
                    } else {
                        // order chưa được gán
                        MUtilitiesService.AlertError('Order này chưa được gán cho User, bỏ qua cập nhật báo cáo của User');
                    }
                } else {
                    firebase.database().ref().child('report').child(date).child('userReport')
                        .child(user.id).child(nodeNameAfter).transaction(function(oldValue) {
                            return oldValue + 1;
                        });
                    // 2 - Giảm 1 đơn vị trong báo cáo USER của nodeNameBefore
                    firebase.database().ref().child('report').child(date).child('userReport')
                        .child(user.id).child(nodeNameBefore).transaction(function(oldValue) {
                            return oldValue - 1;
                        });
                }

                // nếu statusIdAfter == 6 (chốt) => cập nhật field lastSuccessAt trong báo cáo
                if (statusIdAfter == 6) {
                    // báo cáo ngày
                    firebase.database().ref().child('report').child(date).child('lastSuccessAt')
                        .transaction(function(oldValue) {
                            return Date.now();
                        });

                    // báo cáo của user
                    if (user.is_admin == 1 || user.is_mod == 1) {
                        firebase.database().ref().child('report').child(date).child('userReport')
                            .child(orderOwnerId).child('lastSuccessAt').transaction(function(oldValue) {
                                return Date.now();
                            });
                    } else {
                        firebase.database().ref().child('report').child(date).child('userReport')
                            .child(user.id).child('lastSuccessAt').transaction(function(oldValue) {
                                return Date.now();
                            });
                    }

                }

                // thay đổi báo cáo số cuộc gọi trong ngày và báo cáo cuộc gọi của user
                if (statusIdAfter !== 1) {
                    if (user.is_admin == 1 || user.is_mod == 1) {
                        MUtilitiesService.AlertError('Admin hoặc Mod đã thay đổi trạng thái, bỏ qua cập nhật báo cáo về số cuộc gọi');
                    } else {
                        firebase.database().ref().child('report').child(date).child('calledCount').transaction(function(oldValue) {
                            return oldValue + 1;
                        });
                        firebase.database().ref().child('report').child(date).child('userReport').child(user.id).child('calledCount')
                            .transaction(function(oldValue) {
                                return oldValue + 1;
                            });
                    }
                }
            } // END changeReportByStatus()


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
            var updateReport = function(user, statusIdBefor, statusIdAfter, orderOwnerId) {
                return new Promise(function(resolve, reject) {

                    var today = new Date();
                    var reportDateString = convertDate(today);

                    preparingEmptyReport(user, orderOwnerId);
                    // finally update new data
                    changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter, user, orderOwnerId);

                    resolve('Cập nhật thành công!');
                });
            }

            /*
             * Khởi tạo báo cáo ngày của toàn hệ thống và báo cáo ngày của user
             * @param  {user}  người thực hiện thao tác khởi tạo
             * @param  {orderOwnerId}  ID của user sẽ tạo báo cáo
             */
            var preparingEmptyReport = function(user, orderOwnerId) {
                // first weneed to check what day to update report
                var today = new Date();
                var reportDateString = convertDate(today);

                // khởi tạo báo cáo ngày nếu chưa có
                // check if exist today report record
                firebase.database().ref().child('report').orderByChild('date').equalTo(reportDateString).once('value', function(snapshot) {
                    if (snapshot.val() !== null) {
                        console.log('Report cho ngày đã tồn tại, không cần khởi tạo');
                    } else {
                        // not exist => create 
                        firebase.database().ref().child('report').child(reportDateString).transaction(function() {
                            return {
                                calledCount: 0,
                                date: reportDateString,
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
                        });
                    }
                });

                // khởi tạo báo cáo trống cho user nếu cần
                // Nếu Order này chưa được gán => không cần khởi tạo báo cáo
                if (orderOwnerId) {
                    firebase.database().ref().child('report').child(reportDateString).child('userReport')
                        .child(orderOwnerId).once('value', function(snapshot) {
                            if (snapshot.val() !== null) {
                                // exist => update data
                                console.log('Report cho User đã tồn tại, không cần khởi tạo');
                            } else {
                                // not exist => create 
                                firebase.database().ref().child('report').child(reportDateString).child('userReport')
                                    .child(orderOwnerId).transaction(function() {
                                        return {
                                            calledCount: 0,
                                            blockedCount: 0, //8
                                            callLaterCount: 0, //5
                                            cancelCount: 0, // 7
                                            penddingCount: 0, //3
                                            missedCount: 0, //9
                                            notCalledCount: 0, //1 <====== neet to init value here
                                            successCount: 0, //6
                                            id: (user.is_admin == 1 || user.is_mod == 1) ? orderOwnerId : user.id,
                                            userName: user.is_admin == 1 || user.is_mod == 1 ? '' : user.last_name,
                                            lastSuccessAt: 0
                                        }
                                    });
                            }
                        });
                }
            }


            /**
             * Add new order to database
             * @param  {orderData}  order data as json object
             * @return {object} response
             */
            var onAddNewOrder = function(orderData) {
                return new Promise(function(resolve, reject) {
                    var updates = {};
                    updates['/newOrders/' + orderData.id] = orderData;
                    return firebase.database().ref().update(updates).then(function() {
                        // success add new order, we need to update report
                        // first we need to check if today report exist, if not we will append new report
                        ////////////////////////////////////////////////
                        ////////// UPDATE DAY REPORT
                        // first weneed to check what day to update report
                        var today = new Date();
                        var reportDateString = convertDate(today);
                        // check if exist today report record
                        ref.child('report').orderByChild('date').equalTo(reportDateString).once('value', function(snapshot) {
                            if (snapshot.val() !== null) {
                                // exist => update data
                            } else {
                                // not exist => create 
                                ref.child('report').child(reportDateString).transaction(function() {
                                    return {
                                        calledCount: 0,
                                        date: reportDateString,
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
                                });
                                // update data
                                // changeReportByStatus(reportDateString, statusIdBefor, statusIdAfter);
                            }
                            // BEGIN UPDATE REPORT
                            var nodeName = getNodeNameByStatus(orderData.status_id);
                            // update today report
                            ref.child('report').child(reportDateString).child('today').transaction(function(oldValue) {
                                return oldValue + 1;
                            });
                            ref.child('report').child(reportDateString).child(nodeName).transaction(function(oldValue) {
                                return oldValue + 1;
                            });

                            // update user report
                            if (orderData.seller_will_call_id) {
                                ref.child('report').child(reportDateString).child('userReport').child(orderData.seller_will_call_id).child(nodeName).transaction(function(oldValue) {
                                    return oldValue + 1;
                                });
                            }

                        });
                        // END UPDATE DAY REPORT
                        resolve('Cập nhật thành công!');
                    }).catch(function(error) {
                        reject('Lỗi: ' + error);
                    });
                });
            }


            // XỬ LÝ PHẦN PHÂN BỔ SỐ
            /*
             * Phân bổ danh sách một Orders cho một danh sách các Users
             * @param  {orders}  danh sách orders sẽ phân bổ
             * @param  {userIds}  danh sách user ids sẽ được phân bổ
             */
            var onPushOrders = function(orders, userIds) {
                var totalOrders = orders.length;
                return new Promise(function(resolve, reject) {
                    if (orders.length == 0) {
                        console.log('Lỗi ở đây..................................................');
                        reject('Vui lòng chọn Order(s) để phân bổ');
                        return;
                    }
                    if (userIds.length == 0) {
                        reject('Vui lòng chọn User(s) để phân bổ');
                        return;
                    }
                    // bắt đầu phân bổ số
                    var num = Math.floor(orders.length / userIds.length);
                    // var balance = orders.length % userIds.length;

                    var chunkArr = orders.chunk(num);

                    for (var i = 0; i < userIds.length; i++) {
                        console.log('update mảng thứ ' + i + ' cho user id: ' + userIds[i]);
                        onUpdateOrdersOwner(chunkArr[i], userIds[i]).then(function(response) {
                                console.log(response);
                            })
                            .catch(function(err) {
                                reject(err);
                                return;
                            })
                    }

                    // phân bổ phần còn dư cho user ngẫu nhiên
                    var randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

                    if (chunkArr.length > userIds.length) {
                        onUpdateOrdersOwner(chunkArr[chunkArr.length - 1], randomUserId).then(function(response) {
                                console.log(response);

                            })
                            .catch(function(err) {
                                reject(err);
                                return;
                            })
                    }

                    resolve('Phân bổ thành công ' + totalOrders + ' orders cho ' + userIds.length + ' users.');

                })
            }

            /*
             * Phân bổ danh sách một Orders cho một User
             * @param  {orders == array}  danh sách orders id sẽ phân bổ
             * @param  {userId}  user id sẽ được phân bổ
             */
            var onUpdateOrdersOwner = function(orders, userId) {
                // console.log(orders);
                return new Promise(function(resolve, reject) {
                    if (orders.length == 0) {
                        reject('Vui lòng chọn Order(s) để phân bổ');
                    }
                    if (!userId) {
                        reject('Vui lòng chọn User để phân bổ');
                    }

                    // tạo mảng dữ liệu sẽ updates
                    var updates = {};
                    angular.forEach(orders, function(order) {
                        updates['/newOrders/' + order.id + '/seller_will_call_id'] = userId;
                    });

                    // update firebase database
                    firebase.database().ref().update(updates).then(function(response) {
                        // cập nhật báo cáo của user
                        // console.log(orders);
                        var groupOrders = orders.groupBy('status_id');
                        // console.log(groupOrders);
                        angular.forEach(groupOrders, function(group, key){
                            console.log(key);
                            var nodeName = findNodeName(parseInt(key));
                            console.log(nodeName);
                            // Cập nhật báo cáo cho user
                            console.log('Cập nhật báo cáo ' + group.length + ' cho ' + nodeName + ' của user: ' + userId);
                        })

                        resolve('Đã phân bổ thành công ' + orders.length + ' orders cho user id = ' + userId);
                    }).catch(function(err) {
                        reject('Không thể phân bổ orders, đã có lỗi xảy ra');
                    })
                })
            }

            /* 
            Split an array into chunks and return an array
            of these chunks.
            This will *not* preserve array keys.
            * https://gist.github.com/webinista/11240585
            */
            Array.prototype.chunk = function(groupsize) {
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
            var convertDate = function(d) {
                return d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + "" + ("0" + d.getDate()).slice(-2);
            }

            /**
             * Group an Array by one field
             * @param  {list}  array to group
             * @param  {prop}  field to group
             * @return {array}
             */
            Array.prototype.groupBy = function(prop) {
              return this.reduce(function(groups, item) {
                const val = item[prop]
                groups[val] = groups[val] || []
                groups[val].push(item)
                return groups
              }, {})
            }

            return {
                set_firebase: set_firebase,
                set_ghn_token: set_ghn_token,
                get_ghn_token: get_ghn_token,
                get_fanpages: get_fanpages,
                add_fanpage: add_fanpage,
                edit_fanpage: edit_fanpage,
                getOrderItem: getOrderItem,
                onChangeOrderStatus: onChangeOrderStatus,
                onAddNewOrder: onAddNewOrder, // hàm chưa viết xong
                onPushOrders: onPushOrders,
                onUpdateOrdersOwner: onUpdateOrdersOwner

            }

        }]);
}());