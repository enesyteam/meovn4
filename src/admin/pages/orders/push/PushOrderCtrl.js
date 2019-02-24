m_admin.controller('PushOrderCtrl',
    function($rootScope, $scope, $filter, $timeout, firebaseService, MFirebaseService, MUtilitiesService, $q,
        can_release_statuses, telesales, $state, $stateParams, ) {

        $rootScope.myPagingFunction = function(){
            // console.log('test');
        }

        $rootScope.currentUserId = $stateParams.uid;
        // console.log($stateParams.uid);

        $rootScope.selectedOrders = [];

        $scope.can_release_statuses = can_release_statuses;
        // console.log(can_release_statuses);

        

        angular.forEach($rootScope.telesales_arr, function(tls) {
            tls.selected = false;
        })

        // MFirebaseService.getOrdersPaginate("-L6zzq3C7ugXdIGN2bJE", 10);
        var pageSize = 100;
        $scope.canAsignOrders = [];
        $scope.newlyOrderKey = null;
        $scope.lastOrderKey = null;
        $rootScope.canLoadMore = true;
        $scope.isLoaddingOrder = false;

        // tét
        // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
        //     console.log(response);
        // })

        /*
        * find an item in available items (loaded items)
        */
        function findAvailbleItemByKey(key){
            var found = $filter("filter")($scope.canAsignOrders, {key: key});
            return found ? found[0] : null;
        }

        function getOrders() {
            $rootScope.finishLoadFullData = null;
            $scope.isLoaddingOrder = true;
            $scope.searchMode = null;
            $scope.canAsignOrders = [];
            MFirebaseService.getOrders(pageSize).then(function(response) {
                response.reverse().map(function(order) {
                    var item = {
                        customer_name: order.data.customer_name,
                        customer_mobile: order.data.customer_mobile,
                        customer_id: order.data.customer_id,
                        id: order.data.id,
                        type: order.data.type,
                        page_id: order.data.page_id,
                        post_id: order.data.post_id,
                        selected: false,
                        conversation_id: order.data.conversation_id,
                        seller_will_call_id: order.data.seller_will_call_id,
                        status_id: order.data.status_id,
                        publish_date: order.data.publish_date,
                        is_bad_number: order.data.is_bad_number,
                        active_log: order.data.activeLog,
                        admin_note: order.data.admin_note,
                        key: order.key,
                    }
                    $scope.$apply(function() {
                        $scope.canAsignOrders.push(item);
                    })
                })
                $scope.$apply(function() {
                    $scope.newlyOrderKey = response[0].key;
                    $scope.lastOrderKey = response[response.length - 1].key;
                    $scope.isLoaddingOrder = false;
                    $rootScope.finishLoadFullData = true;
                })

                // trigger when new order added
                let newOrdersRef = firebase.database().ref().child('newOrders').orderByChild('publish_date').limitToLast(1);
                newOrdersRef.on('child_added', snapshot => {
                    if (snapshot.key !== $scope.newlyOrderKey && snapshot.val().status_id !== 6) {
                        var item = {
                            customer_name: snapshot.val().customer_name,
                            customer_mobile: snapshot.val().customer_mobile,
                            customer_id: snapshot.val().customer_id,
                            id: snapshot.val().id,
                            type: snapshot.val().type,
                            selected: false,
                            page_id: snapshot.val().page_id,
                            post_id: snapshot.val().post_id,
                            conversation_id: snapshot.val().conversation_id,
                            seller_will_call_id: snapshot.val().seller_will_call_id,
                            status_id: snapshot.val().status_id,
                            publish_date: snapshot.val().publish_date,
                            is_bad_number: snapshot.val().is_bad_number,
                            active_log: snapshot.val().activeLog,
                            admin_note: snapshot.val().admin_note,
                        }
                        var exist = findAvailbleItemByKey(snapshot.key) != null;
                        if( !exist ) {
                            $timeout(function() {
                                $scope.$apply(function() {
                                    $scope.newlyOrderKey = snapshot.key;
                                    $scope.canAsignOrders.unshift(snapshot.val());
                                });
                            }, 10);
                        }
                        
                    }
                });
            })
        }

        getOrders();

        firebase.database().ref().child('newOrders').on('child_changed', snapshot => {

            var itemChanged = $filter('filter')($scope.canAsignOrders, {
                        'id': snapshot.key
            });
            if(itemChanged[0]){
                // find item in array
                $timeout(function() {
                    $scope.$apply(function() {
                        itemChanged[0].seller_will_call_id = snapshot.val().seller_will_call_id;
                        itemChanged[0].status_id = snapshot.val().status_id;
                        itemChanged[0].is_bad_number = snapshot.val().is_bad_number;
                        itemChanged[0].active_log = snapshot.val().activeLog;
                        itemChanged[0].admin_note = snapshot.val().admin_note;
                    })
                }, 10);

                itemChanged[0].is_changing = true;
                $timeout(function() {
                    itemChanged[0].is_changing = false;
                }, 3000);
            }
            else{
                console.log('order ' + snapshot.val().id + ' đã thay đổi trạng thái nhưng không được hiển thị ở đây nên không cần cập nhật view...');
            }
	    });

        var current_pagination = 1;
        $scope.getNextOrders = function() {
            if(!$scope.lastOrderKey) return;
            if($scope.isLoaddingOrder) return;

            if(current_pagination == 15){
                // MUtilitiesService.AlertError('sdfsdf');
                return;
            }

            
            $scope.isLoaddingOrder = true;
            MFirebaseService.getNextOrders($scope.lastOrderKey, pageSize).then(function(response) {
                response.reverse().slice(1).map(function(order) {
                    var item = {
                        customer_name: order.data.customer_name,
                        customer_mobile: order.data.customer_mobile,
                        customer_id: order.data.customer_id,
                        id: order.data.id,
                        type: order.data.type,
                        page_id: order.data.page_id,
                        post_id: order.data.post_id,
                        selected: false,
                        conversation_id: order.data.conversation_id,
                        seller_will_call_id: order.data.seller_will_call_id,
                        status_id: order.data.status_id,
                        publish_date: order.data.publish_date,
                        is_bad_number: order.data.is_bad_number,
                        active_log: order.data.activeLog,
                        admin_note: order.data.admin_note
                    }
                    $scope.$apply(function() {
                        $scope.canAsignOrders.push(item);
                    })
                })
                $scope.$apply(function() {
                    $scope.lastOrderKey = response[response.length - 1].key;
                    $scope.isLoaddingOrder = false;

                    console.log('Đã tải thêm ' + response.length + ' orders.');
                    current_pagination++;
                    if (response.length == 1) { // item bị trùng
                        $rootScope.canLoadMore = false;
                    }
                })
            })
        }

        $rootScope.loadMoreOrders = function(){
            $scope.getNextOrders();
        }

        var date = new Date();

        var dateToDisplay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);

        MFirebaseService.getUsersReportForDate(dateToDisplay).then(function(snapshot) {
            $scope.$apply(function() {
                $scope.usersReport = snapshot.val();
            });
        })
        // ng-click="showChatBox(order); $event.stopPropagation();"

        $rootScope.searchQuery = {
            text: null
        }

        $rootScope.searchOrder = function() {
            if (!$rootScope.searchQuery.text || $rootScope.searchQuery.text == '') {
                // reset kết quả về mặc định
                getOrders();
                // MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.length < 2) {
                MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.match(/^\d/)) {
                // alert($scope.searchQuery.text);
                if ($rootScope.searchQuery.text.length < 4) {
                    MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                    return;
                }
                MFirebaseService.searchOrderByCustomerPhone($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    $scope.$apply(function() {
                        $scope.searchMode = true;
                        $scope.canAsignOrders = response
                    })
                });
            } else {
                MFirebaseService.searchOrderByCustomerName($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    $scope.$apply(function() {
                        $scope.searchMode = true;
                        $scope.canAsignOrders = response
                    })
                });
            }

        }


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

        // console.log(can_release_statuses);

        $rootScope.checkedAll = false;
        $rootScope.checkAll = function() {
            if ($rootScope.checkedAll == false) {
                $rootScope.checkedAll = true;
            } else {
                $rootScope.checkedAll = false;
            }
            angular.forEach($scope.canAsignOrders, function(order) {
                order.selected = $rootScope.checkedAll;
            });
        }

        $rootScope.unCheckedAll = function() {
            angular.forEach($scope.canAsignOrders, function(order) {
                order.selected = false;
            });
            $rootScope.selectedOrders = [];
        }

        $scope.checkedUser = function(user) {
            user.selected = !user.selected;
        }

        function getSelectedOrders() {
            var res = [];
            angular.forEach($scope.canAsignOrders, function(order) {
                if (order.selected == true) {
                    res.push(order);
                }
            });
            return res;
        }

        $scope.testPush = function() {
            // get demo user ID for test
            // alert($rootScope.selectedOrders);
            var uid = null;

            // var selectedOrders = selectedOrders;
            var selectedUsers = [];

            // lấy danh sách orders để phân bổ
            var count = 0;
            angular.forEach($scope.canAsignOrders, function(order) {
                if (order.selected == true && order.seller_will_call_id) {
                    // order.notAllowPush = true;
                    order.selected = false;
                    count++;
                }
            })

            if (count > 0) {
                $rootScope.selectedOrders = [];
                MUtilitiesService.AlertError(count + ' orders được chọn không cho phép phân bổ vì đã được phân bổ trước đó.');
                return;
            }

            // lấy danh sách user id để phân bổ
            angular.forEach($rootScope.telesales_arr, function(s) {
                if (s.selected) {
                    selectedUsers.push(s);
                }
            });

            if (!selectedUsers || selectedUsers.length == 0) {
                // $scope.toggleShowUserPane();
                // MUtilitiesService.AlertError('users: ' + selectedUsers.length);
                MUtilitiesService.AlertError('Vui lòng chọn telesale(s) trước khi phân bổ', 'Lỗi');
                return;
            }

            var selected = $rootScope.selectedOrders;
            // console.log( selected );

            if (! selected || selected.length == 0) {
                // $scope.toggleShowUserPane();
                MUtilitiesService.AlertError('Vui lòng chọn orders trước khi phân bổ', 'Lỗi');
                return;
            }

            // chú ý: sửa validate orders và users trước khi gọi waiting dialog
            if(selectedUsers.length > selected.length){
                MUtilitiesService.AlertError('Không thể phân bổ ' + selected.length + ' order(s) cho ' + selectedUsers.length + ' telesale(s)');
                return;
            }

            MUtilitiesService.showWaitingDialog('Đang phân bổ Orders, vui lòng chờ...', function() {
                var init = function() {
                    return new Promise(function(resolve, reject) {
                        MFirebaseService.onPushOrders(selected, selectedUsers).then(function(response) {
                            $rootScope.unCheckedAll();
                            resolve(true);
                            MUtilitiesService.AlertSuccessful(response);
                        }).catch(function(error) {
                            resolve(false);
                            MUtilitiesService.AlertError(error, 'Lỗi');
                        })
                    })
                }

                return {
                    init: init,
                }
            });
        }

        $scope.showUserPane = true;
        $scope.toggleShowUserPane = function() {
            $scope.showUserPane = true;
        }
        $scope.toggleHideUserPane = function() {
            $scope.showUserPane = false;
        }

        /*
         * Tùy chọn cho phép chỉ hủy trong số các orders được chọn
         */
        $scope.releaseOnlySelectedOrders = true;

        /*
         * Tùy chọn cho phép chỉ hủy trong số các users được chọn
         */
        $scope.releaseOnlySelectedUsers = true;

        /*
         * Lấy danh sách tất cả Orders sẽ hủy
         */
        function getOrdersArrayToRelease() {
            var result = [];
            angular.forEach($scope.canAsignOrders, function(order) {
                if (order.selected) {
                    result.push(order);
                }
            })
            if (result.length > 0) {
                return result;
            } else {
                return $scope.canAsignOrders
            }



            // if($scope.releaseOnlySelectedOrders){
            // 	angular.forEach($scope.canAsignOrders, function(order){
            // 		if(order.selected){
            // 			result.push(order);
            // 		}
            // 	})
            // 	return result;
            // }
            // else{
            // 	return $scope.canAsignOrders;
            // }
        }

        /*
         * Lấy danh sách tất cả Users sẽ hủy
         */
        function getUsersArrayToRelease() {
            var result = [];
            if ($rootScope.currentUserId) {
                var currentUser = $filter('filter')($rootScope.telesales_arr, {
                    id: $rootScope.currentUserId
                })
                result.push(currentUser[0]);
            } else {
                angular.forEach($rootScope.telesales_arr, function(s) {
                    if (s.selected) {
                        result.push(s);
                    }
                });
            }
            return result;
        }

        $rootScope.toggleSelectAnOrder = function(order) {
            // order.selected = !order.selected;
            // alert(order.selected);
            if (order.selected == true) {
                order.selected = false;
                var index = $rootScope.selectedOrders.indexOf(order);
                $rootScope.selectedOrders.splice(index, 1);
            } else {
                order.selected = true;
                $rootScope.selectedOrders.push(order);
            }

            console.log( $rootScope.selectedOrders );
        }

        // $rootScope.selectOrderByStatus = function(status){
        // 	status.selected = !status.selected;
        // 	angular.forEach($scope.canAsignOrders, function(order){
        // 		if(order.status_id == status.id){
        // 			order.selected = !order.selected;
        // 		}
        // 	})
        // }

        // $rootScope.selectOrderBySeller = function(seller){
        // 	seller.checked = !seller.checked;
        // 	angular.forEach($scope.canAsignOrders, function(order){
        // 		if(order.seller_will_call_id == seller.id){
        // 			order.selected = !order.selected;
        // 		}
        // 	})
        // }

        $rootScope.countSelectedOrders = function() {
            var count = 0;
            angular.forEach( $scope.canAsignOrders, order => {
                if( order.selected == true ) {
                    count++;
                }
            } )
            return count;
        }

        $rootScope.releaseSelectedUsers = function() {
            var orders = [];
            var users = [];

            // if ($rootScope.currentUserId) {
            //     angular.forEach($scope.canAsignOrders, function(order) {
            //         if (order.seller_will_call_id == $rootScope.currentUserId) {
            //             orders.push(order);
            //         }
            //     })
            // } else {

            //     orders = getOrdersArrayToRelease();
            // }

            users = getUsersArrayToRelease();
            orders = getSelectedOrders();

            if (orders.length > 0 && users.length > 0) {
                onReleaseOrder(orders, users);
            } else if(orders.length == 0) {
                MUtilitiesService.AlertError('Vui lòng chọn Orders để hủy', 'Thông báo');
            }
            else if(users.length == 0){
            	MUtilitiesService.AlertError('Vui lòng chọn telesale(s) để hủy', 'Thông báo');
            }
        }

        $rootScope.releaseUser = function(user, event) {
            event.stopPropagation();
            // tìm tất cả orders khả dụng của user này
            // hàm MFirebaseService.releaseUser sẽ chỉ release các order có trạng thái cho phép hủy
            var orders = [];
            angular.forEach($scope.canAsignOrders, function(order) {
                if (order.seller_will_call_id == user.id) {
                    orders.push(order);
                }
            })
            var users = [];
            users.push(user);
            onReleaseOrder(orders, users);
        }

        function onReleaseOrder(orders, users) {
            // console.log(users);
            if (!users || users.length == 0) {
                MUtilitiesService.AlertError('Vui lòng chọn telesale(s) trước khi hủy', 'Lỗi');
                return;
            }

            if (!orders || orders.length == 0) {
                MUtilitiesService.AlertError('Vui lòng chọn orders trước khi hủy', 'Lỗi');
                return;
            }

            doRelease(orders, users);
        }

        function doRelease(orders, users) {
            // console.log(orders);
            var userNames = null;
            if (users.length > 1) {
                // alert('Hủy nhiều users');
                var userNames = users.map(function(user) {
                        // console.log(user.last_name);
                        return user.last_name;
                    })
                    .join(", ");
            } else {
                // alert('Hủy 1 users');
                userNames = users[0].last_name;
            }

            var selectedOrders = [];

            angular.forEach(orders, function(order) {
                // console.log(order);
                if (order.selected == true) {
                    selectedOrders.push(order);
                }
            })

            if(!selectedOrders || selectedOrders.length == 0){
            	MUtilitiesService.AlertError('Vui lòng chọn Orders để hủy', 'Thông báo');
            	return;
            }

            // console.log(selectedOrders);


            var title = '';
            // if (!selectedOrders || selectedOrders.length == 0) {
            //     // hủy các số của user 
            //     title = 'Không có orders nào được chọn. Thao tác này sẽ thực hiện hủy orders của ' +
            //         +userNames + ' trong số ' + orders.length + ' orders đang hiển thị.';
            //     // orders = $scope.canAsignOrders;
            // } else {
                
            // }

            title = 'Hủy orders của ' + userNames + ' trong số ' + selectedOrders.length + ' orders được chọn.';

            MUtilitiesService.showConfirmDialg('Thông báo', title, 'Tiếp tục', 'Bỏ qua')
                .then(function(response) {
                    if (response) {
                        MUtilitiesService.showWaitingDialog('Đang hủy các Orders của ' +
                            userNames + ', vui lòng chờ...',
                            function() {
                                var init = function() {
                                    return new Promise(function(resolve, reject) {
                                        var promises = [];

                                        angular.forEach(users, function(user) {

                                            var deferred = $q.defer();

                                            MFirebaseService.releaseUser(selectedOrders, user, can_release_statuses).then(function(response) {
                                                    // console.log('Hủy thành công ' + orders.length + ' của ' + user.last_name);
                                                    deferred.resolve(true);
                                                })
                                                .catch(function(err) {

                                                    deferred.resolve(false);
                                                })

                                            promises.push(deferred.promise);
                                        })

                                        $q.all(promises).then(function(results) {
                                            resolve(true);
                                        })
                                    })
                                }

                                return {
                                    init: init
                                }
                            });

                        // code hủy ở đây
                    } else {
                        console.log('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                    }

                    // bỏ chọn tất cả orders
                    angular.forEach($scope.canAsignOrders, function(order) {
                        order.selected = false;
                    });
                    $rootScope.selectedOrders = [];
                })
        }

        // $rootScope.filterStatus = null;
        // filter
        $rootScope.toggleFilterStatus = function(status) {
            // unselect all orders in list
            $rootScope.unCheckedAll();

            if ($rootScope.filterStatus !== status) {
                $rootScope.filterStatus = status;
            } else {
                $rootScope.filterStatus = null;
            }
            // alert($scope.filterStatus.id);
        }
        // filter
        $rootScope.resetFilterStatus = function() {
            $rootScope.filterStatus = null;
        }

        

        $scope.findById = function(sources, id) {
            if(!id) return null;
            var res = $filter("filter")(sources, {
                id: id
            });
            return res ? res[0] : null;
        }



    });