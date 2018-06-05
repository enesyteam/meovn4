mShipping.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook, firebaseService, MFirebaseService, MUtilitiesService,
        fanpages, ghn_hubs, ghn_token, ghn_districs, telesales) {
        

        // console.log(ghn_districs);
        // if(!ghn_districs || !ghn_hubs){
        //     MUtilitiesService.AlertError('Lỗi kết nối tới hệ thống GHN', 'Lỗi');
        //     return;
        // }

        $rootScope.telesales = telesales;

        var ref = firebase.database().ref();

        var pageSize = 30;
        $rootScope.availableShippingItems = [];
        $rootScope.newlyOrderKey = null;
        $rootScope.lastOrderKey = null;
        $rootScope.canLoadMore = true;
        $rootScope.isLoaddingOrder = true;

        // tét
        // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
        //     console.log(response);
        // })p

        function getShippingItems() {
            $rootScope.availableShippingItems = [];
            MFirebaseService.getShippingItems(pageSize).then(function(response) {
                response.reverse().map(function(order) {
                    // console.log(order);
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                })
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = response[0].key;
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                })
            })
        }
        getShippingItems();

        // trigger when new item
        let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('publish_date').limitToLast(1);
        newOrdersRef.on('child_added', snapshot => {
            if (snapshot.key !== $rootScope.newlyOrderKey) {
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = snapshot.key;
                    $rootScope.availableShippingItems.unshift({
                                key : snapshot.key,
                                data : snapshot.val()
                            })
                });
            }
        });

        // $timeout(function(){
        //     angular.forEach($rootScope.availableShippingItems, function(item){
        //         console.log(item.data.id);
        //     })
        // }, 3000)


    // listen for order change
    firebase.database().ref().child('shippingItems')
    .on('child_changed', snapshot => {
        // console.log(snapshot.val().id);
        var itemChanged = null;
        angular.forEach($rootScope.availableShippingItems, function(item){
            if(item.data.id == snapshot.val().id){
                itemChanged =  item; //item.data.is_cancel = true;
            }
        });
        // find item in array
        $timeout(function() {
            $scope.$apply(function() {
                if(itemChanged){
                    if (itemChanged.data.cancel_ghn_at !== snapshot.val().cancel_ghn_at) {
                        itemChanged.data.cancel_ghn_at = snapshot.val().cancel_ghn_at;
                    }
                    if (itemChanged.data.is_cancel !== snapshot.val().is_cancel) {
                        itemChanged.data.is_cancel = snapshot.val().is_cancel;
                    }
                    if(itemChanged.data.orderCode !== snapshot.val().orderCode){
                        itemChanged.data.orderCode = snapshot.val().orderCode;
                    }
                    if(itemChanged.data.push_to_ghn_at !== snapshot.val().push_to_ghn_at){
                        itemChanged.data.push_to_ghn_at = snapshot.val().push_to_ghn_at;
                    }
                    if(itemChanged.data.cod_amount !== snapshot.val().cod_amount){
                        itemChanged.data.cod_amount = snapshot.val().cod_amount;
                    }
                    if(itemChanged.data.service_fee !== snapshot.val().service_fee){
                        itemChanged.data.service_fee = snapshot.val().service_fee;
                    }
                    if($rootScope.activedItem){
                        $rootScope.activedItem.is_cancel = snapshot.val().is_cancel;
                        $rootScope.activedItem.orderCode = snapshot.val().orderCode;
                    }
                }
                else{
                    console.log('order ' + snapshot.val().id + ' đã thay đổi trạng thái nhưng không được hiển thị ở đây nên không cần cập nhật view...');
                }
                
            })
        }, 10);

    });

    firebase.database().ref().child('newOrders').on('child_changed', snapshot => {
        console.log(snapshot.val());
        // find item in array
        $timeout(function() {
            $scope.$apply(function() {
                var itemChanged = $filter('filter')($rootScope.availableShippingItems, {
                    'id': snapshot.val().id
                });
                if(itemChanged[0]){
                    if (itemChanged[0].status_id !== snapshot.val().status_id) {
                        itemChanged[0].status_id = snapshot.val().status_id;
                    }
                    if (itemChanged[0].seller_will_call_id !== snapshot.val().seller_will_call_id) {
                        itemChanged[0].seller_will_call_id = snapshot.val().seller_will_call_id;
                    }
                    if(snapshot.val().is_bad_number == 1){
                        itemChanged[0].is_bad_number = 1;
                    }
                }
                else{
                    console.log('order ' + snapshot.val().id + ' đã thay đổi trạng thái nhưng không được hiển thị ở đây nên không cần cập nhật view...');
                }
                
            })
        }, 10);

    });

        $rootScope.getNextShippingItems = function() {
            $rootScope.isLoaddingOrder = true;
            MFirebaseService.getNextShippingItems($rootScope.lastOrderKey, pageSize).then(function(response) {
                response.reverse().slice(1).map(function(order) {
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                })
                $scope.$apply(function() {
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                    // console.log(response);
                    if (response.length == 1) { // item bị trùng
                        $rootScope.canLoadMore = false;
                    }
                })
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Thông báo');
            })
        }

        $rootScope.searchQuery = {
            text: null
        }

        $rootScope.searchOrder = function() {

            if (!$rootScope.searchQuery.text || $rootScope.searchQuery.text == '') {
                // reset kết quả về mặc định
                getShippingItems();
                // MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.length < 2) {
                MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.match(/^\d/)) {
                if ($rootScope.searchQuery.text.length < 4) {
                    MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                    return;
                }
                MFirebaseService.searchShippingItemsByCustomerPhone($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems = response
                    })
                });
            } else {
                MFirebaseService.searchShippingItemsByCustomerName($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems = response
                    })
                });
            }

        }

        // present
        var currentStatus = "\u2605 online";
        var userListRef = ref.child("presence");
        var myUserRef = userListRef.push();

        function setUserStatus(status) {
            // Set our status in the list of online users.
            userListRef.once('value', function(snapshot) {

            });
            currentStatus = status;
            if ($rootScope.firebaseUser) {
                var name = $rootScope.firebaseUser.email;
                myUserRef.set({
                    name: name,
                    status: status
                });
            }
        }

        $document.onIdle = function() {
            setUserStatus("\u2606 idle");
            console.log("Người dùng đi xa");
        }
        $document.onBack = function(isIdle, isAway) {
            setUserStatus("\u2605 online");
            console.log("Người dùng đã trở lại");
        }
        $document.onAway = function() {
            setUserStatus("\u2604 away");
            console.log("Người dùng đã trở lại");
        }
        setIdleTimeout(10000);
        setAwayTimeout(100000);

        $rootScope.signout = function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }, function(error) {
                // An error happened.
            });
        }

        firebase.auth().onAuthStateChanged(function(user) {
            if (!user) {
                // console.log('Bạn chưa đăng nhập!');
                $window.location = '/login';
            } else {
                
                // for presence
                var connectedRef = ref.child(".info/connected");
                connectedRef.on("value", function(isOnline) {
                    if (isOnline.val()) {
                        // If we lose our internet connection, we want ourselves removed from the list.
                        myUserRef.onDisconnect().remove();

                        // Set our initial online status.
                        setUserStatus("\u2605 online");
                        console.log(isOnline.val());
                    } else {
                        console.log('không rõ');
                        // We need to catch anytime we are marked as offline and then set the correct status. We
                        // could be marked as offline 1) on page load or 2) when we lose our internet connection
                        // temporarily.
                        setUserStatus(currentStatus);
                    }
                });

                $rootScope.firebaseUser = user;
                firebaseService.getAllMembers().then(function(members) {

                    $scope.$apply(function() {
                        $rootScope.sellers = members.val();
                    });

                    // console.log($rootScope.sellers);

                    angular.forEach($rootScope.sellers, function(value) {
                        if (value.email == user.email) {

                            // console.log(value);
                            $scope.$apply(function() {
                                $rootScope.currentMember = value;
                            });
                        }
                    });
                });
                // console.log(user);
                //   firebaseService.getAllMembers().then(function(members){
                //   angular.forEach(members, function(m){
                //     if(m.email ==user.email){
                //       if(m.is_admin != 1 || m.is_mod != 1){
                //         // $window.location = '/404.html';
                //         return;
                //       }
                //     }
                //     // else{
                //     //   $window.location = '/admin/#/dashboard';
                //     // }
                //   });
                // });
            }
        });

        /////////////////////////////////////////////////////////////////////////////

        var ref = firebase.database().ref();

        // console.log(fanpages);

        //GHN API
        $rootScope.ghnToken = ghn_token;
        $rootScope.Hubs = ghn_hubs;

        // $scope.$apply();

        // $timeout(function() {
        //   $scope.shippingItems = shippingItems;
        // }, 0);


        // let shippingRef = ref.child('shippingItems').limitToLast(100);
        // shippingRef.on('child_added', snapshot => {
        //     $scope.$apply(function() {
        //         $rootScope.availableShippingItems.push({
        //             id: snapshot.val().id,
        //             data: snapshot.val().data,
        //             orderCode: snapshot.val().orderCode
        //         });
        //     })
        // });

        $rootScope.filterById = function(sources, id) {
            if(!id) return null;
            return $filter("filter")(sources, {
                id: id
            })[0];
        }

        $rootScope.filterInArray = function(arr, fieldTofilter, valueToFilter) {
            return $filter("filter")(arr, {
                fieldTofilter: valueToFilter
            })[0];
        }

        $rootScope.windowsHeight = $window.innerHeight;
        $rootScope.windowsWidth = $window.innerWidth;

        // on windows resize
        var appWindow = angular.element($window);
        appWindow.bind('resize', function() {
            $scope.$apply(function() {
                $rootScope.windowsHeight = $window.innerHeight;
                $rootScope.windowsWidth = $window.innerWidth;
            });
        });
    });