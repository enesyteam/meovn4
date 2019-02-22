
mSearch.controller('MainCtrl',
  function($rootScope, $scope, $q, $http, $window, $document, $filter, $timeout, MFirebaseService, MUtilitiesService,
  telesales, sweetAlert, fanpages, statuses) {
    
    
    

    $rootScope.fanpages = fanpages;
    $rootScope.statuses = statuses;

    // var myOrders = orders;
    // angular.forEach(orders, (order) => {
    //   // Todo...
    // })
    // $rootScope.myOrders = orders;
    $rootScope.searchQuery = {
        text: null
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

    $scope.search = function(){
        $scope.is_searching = true;
        $scope.search_result = null;

        if (!$rootScope.searchQuery.text || $rootScope.searchQuery.text == '') {
                $scope.is_searching = false;
                // reset kết quả về mặc định
                // getOrders();
                MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.length < 2) {
                $scope.is_searching = false;
                MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.match(/^\d/)) {
                // alert($scope.searchQuery.text);
                if ($rootScope.searchQuery.text.length < 4) {
                    $scope.is_searching = false;
                    MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                    return;
                }
                MFirebaseService.searchOrderByCustomerPhone($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        $scope.is_searching = false;
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    console.log(response);
                    $scope.searched_query = $rootScope.searchQuery.text;
                    // if status == 6
                    angular.forEach(response, (item) => {
                        console.log(item);
                      // Todo...
                      if(item.status_id == 6){
                        MFirebaseService.getShippingItemByOrderId(item.id).then(function(snapshot){
                            $scope.$apply(function(){
                                angular.forEach(snapshot.val(), function(value, key){
                                    item.shipData = value;
                                    item.shipKey = key;
                                });
                            })
                        });
                      }
                    })
                    

                    $scope.$apply(function() {
                        $scope.is_searching = false;
                        $scope.search_result = response
                    })
                });
            } else {
                MFirebaseService.searchOrderByCustomerName($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        $scope.is_searching = false;
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
                        return;
                    }
                    console.log(response);
                    // if status == 6
                    angular.forEach(response, (item) => {
                      // Todo...
                      if(item.status_id == 6){
                        MFirebaseService.getShippingItemByOrderId(item.id).then(function(snapshot){
                            $scope.$apply(function(){
                                angular.forEach(snapshot.val(), function(value, key){
                                    item.shipData = value;
                                    item.shipKey = key;
                                });
                            })
                        });
                      }
                    })
                    $scope.searched_query = $rootScope.searchQuery.text;
                    $scope.$apply(function() {
                        $scope.is_searching = false;
                        $scope.search_result = response
                    })
                });
            }
    }

    
    var report = true;
    if( report ) {
        ///////////////////////lấy báo cáo tháng
        var totalSuccessMonth = 0;
        var totalNewCustomer = 0;
        var user_month_report = [];
        angular.forEach(telesales, (telesale) => {
            if ( telesale.is_seller == 1 && telesale.status == 1 ) {
                user_month_report.push({
                    name: telesale.last_name,
                    id: telesale.id,
                    success: 0,
                    called: 0
                })
            }
        });
        // console.log( user_month_report );
        
        MFirebaseService.getMonthReport('01').then(function(response){
            angular.forEach(response, (date_report) => {
                // console.log( response );
              totalSuccessMonth += date_report.successCount;
              totalNewCustomer += date_report.today;
              angular.forEach(date_report.userReport, (user_report) => {
                 // find in user_month_report
                 var found = $filter("filter")(user_month_report, {id: user_report.id})[0];

                 if(found){

                    found.success += user_report.successCount;
                    found.called += user_report.calledCount;
                    // console.log( found );
                 }
                 else{
                    console.log(found)
                 }
                })
            })
            console.log('Tổng số điện thoại trong tháng: ' + totalNewCustomer);
            console.log('Tổng số đơn chốt trong tháng: ' + totalSuccessMonth);
            console.log('Hiệu suất chốt tháng: ' + totalSuccessMonth/totalNewCustomer*100 + ' %');
            // console.log( user_month_report );
            // console.log(user_month_report);
            angular.forEach(user_month_report, (item) => {
              // Todo...
              if ( item.success > 0) {
                console.log( item.name + ': ' + item.called + '/' + item.success + ' (đã gọi/chốt) = ' + (item.success / item.called) * 100 + ' %');
              }
            })
        })
        ///////////////////////lấy báo cáo tháng
    }

    function getShippingReport( fromDate, toDate ) {
        var result = [];
        _.map( telesales, function( tls ) {
            if( tls.is_seller == 1 ) {
                result.push( {
                    id: tls.id,
                    name: tls.last_name,
                    count: 0,
                    cod: 0,

                } )
            }
        } );
        
        console.log( 'getting shiping report' );
        MFirebaseService.getAllShippingsByDateRange( fromDate, toDate )
        .then( function( data ) {
            _.map( data, function( shipping_item ) {
                angular.forEach( result, function( telesale_data ) {
                    if( telesale_data.id == shipping_item.data.orderData.seller_will_call_id ) {
                        telesale_data.count += 1;
                        telesale_data.cod += shipping_item.data.customerData.cod;
                    }
                } )
            } )
            console.log( 'finished!' );
        } )

        console.log( 'result', result );
    }

    getShippingReport( '2019-01-01', '2019-01-31' );
    
    

    // console.log($rootScope.currentMember);
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

    var pageSize = 10;
    $rootScope.availableShippingItems = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;

    var fake_user = {
        id: 102,
        last_name: 'Lợi'
    }


        

    $scope.myOrders = [];
    function getOrders(){
        $scope.isGettingOrders = true;
        var startTime = new Date().getTime();
        var promises = [];

        firebase.database().ref().child('assigned')
        .child(MFirebaseService.convertDate(new Date()))
        .child(102)
        .on('child_added', function(snapshot){

            var deferred = $q.defer();
              firebase.database().ref().child('/newOrders/' + snapshot.val().key)
                .once('value', function(s){
                    $scope.$apply(function(){
                        $scope.myOrders.unshift({
                            key: snapshot.val().key,
                            data: s.val()
                        })
                        deferred.resolve();
                        promises.push(deferred.promise);
                    })
                })
        })

        $q.all(promises).then(function(results){
            var endTime = new Date().getTime();
            console.log('đã tải xong dữ liệu orders trong ' + (endTime - startTime) + ' ms');
            // resolve(promises);
            $scope.isGettingOrders = false;
        })
    }
    getOrders();
    // $scope.myOrders = orders;


    // $rootScope.getMyNextOrders = function(){
    //     MFirebaseService.getNextOrdersByUser(pageSize, fake_user, $scope.latestOrderKey)
    //     .then(function(response){
    //         response.reverse().slice(1).map(function(order) {
    //             if(order.data.seller_will_call_id == fake_user.id){
    //                 $scope.$apply(function() {
    //                     $rootScope.myOrders.push(order);
    //                 })
    //             }
    //         })
    //         $scope.$apply(function() {
    //             $scope.latestOrderKey = response[response.length - 1].key;
    //         })
    //     })
    // }



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
        // getShippingItems();
        // console.log('sd');

    // let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('created_time').limitToLast(1);
    //     newOrdersRef.on('child_added', snapshot => {
    //         console.log(snapshot.key);
    //         if (snapshot.key !== $rootScope.newlyOrderKey) {
    //             var checked_by = $rootScope.filterById(telesales, snapshot.val().data.orderData.seller_will_call_id).last_name;
    //             MUtilitiesService.AlertSuccessful(checked_by + ' vừa chốt 1 đơn hàng.');
    //             $scope.$apply(function() {
    //                 $rootScope.newlyOrderKey = snapshot.key;
    //                 $rootScope.availableShippingItems.unshift({
    //                             key : snapshot.key,
    //                             data : snapshot.val(),
    //                             notes: snapshot.val().notes,
    //                         })
    //             });
    //             // // listen for this order changing
    //             // firebase.database().ref().child('shippingItems/' + snapshot.key + '/notes')
    //             // .on('child_added', snapshot => {
    //             //     $timeout(function() {
    //             //         $scope.$apply(function() {
    //             //             order.notes.push(snapshot.val());
    //             //         })
    //             //     }, 100);
    //             // })
    //         }
    //     });

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
            console.log(order);
            angular.forEach($scope.myOrders, function(item){
                item.selected = null;
            })
            order.selected = true;
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

        


        $scope.showShipData = function(order){
            if(!order.shipData) return;
            sweetAlert.open({
                    title: "Thông tin đơn hàng đã tạo",
                    htmlTemplate: "src/search/partials/ship-detail.html",
                    confirmButtonText: 'Đóng',
                    customClass: 'swal-wide',
                    // showCancelButton: true,
                    showCloseButton: true,
                    // allowOutsideClick: false,
                    // showLoaderOnConfirm: true,
                    controller: 'ShipCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        shipData: function() {
                            return order.shipData;
                        },
                        // stationData: function(){
                        //     return {
                        //         orderCode: order.shipData.
                        //     }
                        // }
                    }
                })
        }

        $scope.showChatBox = function(order){
            sweetAlert.open({
                    title: "Hội thoại từ khách hàng",
                    htmlTemplate: "src/search/partials/chat-box.html",
                    confirmButtonText: 'Gửi tin nhắn',
                    customClass: 'swal-wide',
                    showCancelButton: true,
                    showCloseButton: true,
                    // allowOutsideClick: false,
                    preConfirm: 'reply',
                    showLoaderOnConfirm: true,
                    controller: 'ChatCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        order: function() {
                            return order;
                        },
                        fanpages: function(){
                            return fanpages;
                        }
                    }
                })
                .then(function(response){
                    console.log(response);
                    if(response && !response.dismiss){
                        sweetAlert.success('Gửi tin nhắn thành công!');
                    }
                })
                .catch(function(err){
                    console.log(err);
                    sweetAlert.alert(err, {title: 'Lỗi!'})
                });
        }

        $scope.showNoteBox = function(order){
            // console.log(order);
            sweetAlert.open({
                    title: "Thêm ghi chú",
                    htmlTemplate: "src/search/partials/note-box.html",
                    confirmButtonText: 'Thêm ghi chú',
                    // customClass: 'swal-wide',
                    showCancelButton: true,
                    showCloseButton: true,
                    // allowOutsideClick: false,
                    preConfirm: 'addNote',
                    showLoaderOnConfirm: true,
                    controller: 'NoteCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        order: function() {
                            return order;
                        },
                        currentMember: function(){
                            return $rootScope.currentMember;
                        }
                    }
                })
                .then(function(response){
                    console.log(response);
                    if(response && !response.dismiss){
                        sweetAlert.success(response.value);
                    }
                })
                .catch(function(err){
                    console.log(err);
                    sweetAlert.alert(err, {title: 'Lỗi!'})
                });
        }


        $rootScope.finishLoadFullData = true;
  });