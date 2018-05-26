mShip.controller('MainCtrl',
  function($rootScope, $scope, $http, $window, $document, $filter, $timeout, MFirebaseService, MUtilitiesService,
  telesales, sweetAlert, $q) {

    console.log(sweetAlert);

    /*
    * Auth
    */
    $rootScope.members = [];
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // console.log('Bạn chưa đăng nhập!');
            $window.location = '/login';
        } else {

            $rootScope.firebaseUser = user;
            MFirebaseService.getAllActiveMembers().then(function(members) {

                // $scope.$apply(function() {
                //     $rootScope.members = members.val();
                // });

                // console.log($rootScope.sellers);

                angular.forEach(members.val(), function(value) {
                    $rootScope.members.push(value);
                    if (value.email == user.email) {

                        // console.log(value);
                        $scope.$apply(function() {
                            $rootScope.currentMember = value;
                        });
                    }
                });
            });
        }
    });

    /*
    * window size
    */
    $rootScope.windowsHeight = $window.innerHeight;
    $rootScope.windowsWidth = $window.innerWidth;
    var appWindow = angular.element($window);
    appWindow.bind('resize', function() {
        $scope.$apply(function() {
            $rootScope.windowsHeight = $window.innerHeight;
            $rootScope.windowsWidth = $window.innerWidth;
        });
    });

    $scope.telesales = telesales;
    $rootScope.filterById = function(sources, id) {
        if(!id) return null;
        return $filter("filter")(sources, {
            id: id
        })[0];
    }
    $scope.fixAva = function(avatar_url){
        console.log(avatar_url);
        if(avatar_url.indexOf('.jpg') == -1){
            return 'assets/images/default-avatar-contact.svg';
        }
        else{
            return avatar_url
        }
    }

    $scope.aProducts = [];
    var getAllAvailableProducts = function(){
      var ref = firebase.database().ref();
      let productsRef = ref.child('products');
      productsRef.on('child_added', snapshot => {
        $scope.aProducts.push(snapshot.val());
      });
    }
    getAllAvailableProducts();

    $scope.findProduct = function(id){
        return $filter("filter")($scope.aProducts, {id: id})[0];
    }

    var pageSize = 30;
    $rootScope.availableShippingItems = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;

  	function getShippingItems() {
            $rootScope.availableShippingItems = [];
            MFirebaseService.getShippingItems(pageSize).then(function(response) {
                response.reverse().map(function(order) {
                    // console.log(order.key && order.key !== 'undefined' && typeof order.key !== undefined);
                    if(order.key && order.key !== 'undefined' && typeof order.key !== undefined){
                        $scope.$apply(function() {
                            $rootScope.availableShippingItems.push(order);
                        })
                    }
                    // listen for this order changing
                    firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                    .on('child_added', snapshot => {
                        $timeout(function() {
                            $scope.$apply(function() {
                                order.notes.push(snapshot.val());
                            })
                        }, 100);
                    })
                    
                })
                $scope.$apply(function() {
                    console.log($rootScope.availableShippingItems[0]);
                    $rootScope.newlyOrderKey = $rootScope.availableShippingItems[0].key;
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                })
            })
        }
        getShippingItems();
        // console.log('sd');

    let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('created_time').limitToLast(1);
        newOrdersRef.on('child_added', snapshot => {
            console.log(snapshot.key);
            if (snapshot.key !== $rootScope.newlyOrderKey) {
                var checked_by = $rootScope.filterById(telesales, snapshot.val().data.orderData.seller_will_call_id).last_name;
                MUtilitiesService.AlertSuccessful(checked_by + ' vừa chốt 1 đơn hàng.');
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = snapshot.key;
                    $rootScope.availableShippingItems.unshift({
                                key : snapshot.key,
                                data : snapshot.val(),
                                notes: snapshot.val().notes,
                            })
                });
                // // listen for this order changing
                // firebase.database().ref().child('shippingItems/' + snapshot.key + '/notes')
                // .on('child_added', snapshot => {
                //     $timeout(function() {
                //         $scope.$apply(function() {
                //             order.notes.push(snapshot.val());
                //         })
                //     }, 100);
                // })
            }
        });

        // get next items
        $rootScope.getNextShippingItems = function() {
            $rootScope.isLoaddingOrder = true;
            MFirebaseService.getNextShippingItems($rootScope.lastOrderKey, pageSize).then(function(response) {
                response.reverse().slice(1).map(function(order) {
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                    // listen for this order changing
                    firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                    .on('child_added', snapshot => {
                        $timeout(function() {
                            $scope.$apply(function() {
                                order.notes.push(snapshot.val());
                            })
                        }, 100);
                    })
                })
                $scope.$apply(function() {
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.newlyOrderKey = response[response.length - 1].key;
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
                        $rootScope.availableShippingItems = response;
                        if(response.length == 1){
                            $scope.activeOrder = response[0]
                        }
                        else{
                            $scope.activeOrder = null
                        }
                    });
                    angular.forEach(response, function(order){
                        // listen for this order changing
                        firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                        .on('child_added', snapshot => {
                            $timeout(function() {
                                $scope.$apply(function() {
                                    order.notes.push(snapshot.val());
                                })
                            }, 100);
                        })
                    })
                });
            } else {
                MFirebaseService.searchShippingItemsByCustomerName($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems = response;
                        if(response.length == 1){
                            $scope.activeOrder = response[0]
                        }
                        else{
                            $scope.activeOrder = null
                        }
                    })
                    angular.forEach(response, function(order){
                        // listen for this order changing
                        firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                        .on('child_added', snapshot => {
                            $timeout(function() {
                                $scope.$apply(function() {
                                    order.notes.push(snapshot.val());
                                })
                            }, 100);
                        })
                    })
                });
            }

        }

        $rootScope.toTitleCase = function(str) {
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        $rootScope.onClickOrder = function(order){
            // console.log('Order key: ' + order.key);
            $scope.activeOrder = null;
            $scope.activeOrder = order;
            angular.forEach($rootScope.availableShippingItems, function(item){
                item.selected = null;
            })
            order.selected = true;

            // order.notes = [];

            // listen for changing
            // firebase.database().ref().child('shippingItems/' + order.key + '/notes').limitToLast(1)
            // .on('child_added', snapshot => {
            //     console.log(snapshot.val());
            //     $timeout(function() {
            //         $scope.$apply(function() {
            //             // order.notes.push(snapshot.val());
            //             angular.extend(order.notes, {
            //                 'note' : snapshot.val()
            //             })
            //         })
            //     }, 100);
            //     console.log(order.notes);
            //     // console.log(snapshot.val());
            //     // console.log(snapshot.ref.parent.parent.key);
            //     // console.log($scope.activeOrder.key);
            //     // if (snapshot.ref.parent.parent.key !== $scope.activeOrder.key) {
            //     //     MUtilitiesService.AlertError('đây rồi');
            //     //     // var checked_by = $rootScope.filterById(telesales, snapshot.val().data.orderData.seller_will_call_id).last_name;
            //     //     // MUtilitiesService.AlertSuccessful(checked_by + ' vừa chốt 1 đơn hàng.');
            //     //     // $scope.$apply(function() {
            //     //     //     $rootScope.newlyOrderKey = snapshot.key;
            //     //     //     $rootScope.availableShippingItems.unshift({
            //     //     //                 key : snapshot.key,
            //     //     //                 data : snapshot.val()
            //     //     //             })
            //     //     // });

            //         $timeout(function() {
            //             $scope.$apply(function() {
            //                 $scope.activeOrder.notes.push(snapshot.val());
            //             })
            //         }, 100);
            //     // }
            // });
        }

        $scope.focusSearch = function(){
            $scope.isSearchBoxSelect = true;
        }
        $scope.blurSearch = function(){
            $scope.isSearchBoxSelect = false;
        }
        $scope.focusChat = function(){
            $scope.isChatSelect = true;
        }
        $scope.blurChat = function(){
            $scope.isChatSelect = false;
        }
        // $scope.submitComment = function(){
        //     MUtilitiesService.AlertError('Submit comment');
        // }

        $scope.noteData = {
            text: null,
            uid: null,
            created_at: Date.now()
        }

        $scope.submitComment = function(id){
            if(!$scope.noteData.text || $scope.noteData.text.length == 0){
                MUtilitiesService.AlertError('Vui lòng nhập nội dung ghi chú');
                return;
            }
            $scope.noteData.uid = $rootScope.currentMember ? $rootScope.currentMember.id : 2;
            MFirebaseService.addShippingNote(id, $scope.noteData)
            .then(function(response){
                MUtilitiesService.AlertSuccessful(response);
                // $scope.activeOrder.notes.push($scope.noteData);
                $scope.noteData = {
                    text: null,
                    uid: null,
                    created_at: Date.now()
                }
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi')
            })
        }

        


        $scope.testSweetAlert = function(){
            // sweetAlert.alert("Look out, I'm about to close!", {timer: 2000});

            // sweetAlert.confirm("Are you sure you want to take the red pill?");

            // sweetAlert.success("Great job!");

            $http.get('../assets/ghn-districs.json').
              then(function onSuccess(districs_data) {
                // console.log(response.data.data);
                 // return response.data.data;

                 sweetAlert.open({
                    title: "Tạo đơn hàng Viettel Post",
                    htmlTemplate: "src/ship/partials/create-ship.html",
                    confirmButtonText: 'Tạo đơn',
                    customClass: 'swal-wide',
                    showCancelButton: true,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    preConfirm: 'preConfirm',
                    showLoaderOnConfirm: true,
                    controller: 'ShipCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        activeOrder: function() {
                            return angular.copy($scope.activeOrder);
                        },
                        ghn_districs: function(){
                            return districs_data.data.data;
                        }
                    }
                }).then(function(response){
                    if(response.value){
                        sweetAlert.success(response.value, {timer: 2500})
                        .then(function(){
                            MUtilitiesService.AlertSuccessful('Tạo đơn thành công!')
                        });
                    }
                })
                .catch(function(err){
                    sweetAlert.alert(err, {title: 'Lỗi!'})
                    .then(function(){
                        MUtilitiesService.AlertError('Tạo đơn không thành công!')
                    });
                });
              }).
              catch(function onError(response) {
                // console.log(response);
                sweetAlert.alert(response.status + ': ' + response.statusText, {title: 'Lỗi!'});
              });
        }

  });