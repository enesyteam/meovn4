mShip.controller('MainCtrl',
  function($rootScope, $scope, $http, $window, $document, $filter, $timeout, MFirebaseService, MUtilitiesService,
  telesales, sweetAlert, $q, fanpages, MVIETTELService, viettel_provinces, viettel_districs, viettel_wards,
  viettel_services, viettel_extra_services, viettel_stations) {

    // console.log(fanpages)

    var date = new Date();

        var dateToDisplay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        
        // alert( 'sdf' );
        // MFirebaseService.getReportForChart().then(function(response){
        //   console.log( response );
        // })

        MFirebaseService.getSuccessForDate(date).then(function(response){
                console.log( response );
                // alert( response )
                $scope.$apply(function(){
                    $scope.todaySuccess = response;
                })
            })

    // console.log(sweetAlert);
    $scope.fanpages = fanpages;

    $scope.loadMoreOrders = function(){
        console.log('dđ');
    }

    $scope.viettel_data = {
        provinces: viettel_provinces,
        districs: viettel_districs,
        wards: viettel_wards,
        services: viettel_services,
        extraServices: viettel_extra_services,
        fanpages: fanpages
    }

    // console.log($scope.viettel_data);

    // /*
    // * Auth
    // */
    // $rootScope.members = [];
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (!user) {
    //         // console.log('Bạn chưa đăng nhập!');
    //         $window.location = '/login';
    //     } else {

    //         $rootScope.firebaseUser = user;
    //         MFirebaseService.getAllActiveMembers().then(function(members) {

    //             // $scope.$apply(function() {
    //             //     $rootScope.members = members.val();
    //             // });

    //             // console.log($rootScope.sellers);

    //             angular.forEach(members.val(), function(value) {
    //                 $rootScope.members.push(value);
    //                 if (value.email == user.email) {

    //                     // console.log(value);
    //                     $scope.$apply(function() {
    //                         $rootScope.currentMember = value;
    //                     });
    //                 }
    //             });
    //         });
    //     }
    // });

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
    $scope.findWard = function(ward_id){
        // if(!ward_id) return null;
        // var w = $filter('filter')(viettel_wards, { WARDS_ID: ward_id});
        // return w && w[0] ? w[0] : null;
        angular.forEach(viettel_wards, (item) => {
          if(item.WARDS_ID == ward_id){
            return item;
          }
        })
        return null;
    }
    $scope.findDistrict = function(district_id){
        // console.log(parseInt(district_id));
        if(!district_id) return null;
        var w = $filter('filter')(viettel_districs, {DISTRICT_ID: parseInt(district_id)})[0];
        return w && w[0] ? w[0] : null;
        // console.log()
        // angular.forEach(viettel_districs, (item) => {
        //     console.log(parseInt(item.DISTRICT_ID));
        //   if(parseInt(item.DISTRICT_ID) == parseInt(district_id)){
        //     return item;
        //   }
        // })
        // return null;
    }
    $scope.findProvince = function(province_id){
        // console.log(province_id);
        // if(!province_id) return null;
        // var w = $filter('filter')(viettel_provinces, { PROVINCE_ID: province_id});
        // return w && w[0] ? w[0] : null;
        angular.forEach(viettel_provinces, (item) => {
            // console.log(item)
          if(item.PROVINCE_ID == province_id){
            return item;
          }
        })
        return null;
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

    var pageSize = 150;
    $rootScope.availableShippingItems = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;


    function getShippingItemsByUser(uid){
        $rootScope.is_getting_orders = true;
        MFirebaseService.getShippingItemsByUser(uid).then(function(response) {
            $scope.$apply(function(){
                $rootScope.availableShippingItems = response.reverse();
                $rootScope.display_mode = 'user';
                $rootScope.display_id = uid;
                $rootScope.is_getting_orders = false;
            })
        })
    }
    function getShippingItemsByPage(pageId){
        $rootScope.is_getting_orders = true;
        MFirebaseService.getShippingItemsByPage(pageId).then(function(response) {
            $scope.$apply(function(){
                $rootScope.availableShippingItems = response.reverse();
                $rootScope.display_mode = 'page';
                $rootScope.display_id = pageId;
                $rootScope.is_getting_orders = false;
            })
        })
    }

    $scope.getByUser = function(){
        sweetAlert.open({
                    title: "Hiển thị các đơn hàng của telesale",
                    htmlTemplate: "src/ship/partials/select-telesale.html",
                    confirmButtonText: 'Chọn',
                    showCancelButton: true,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    preConfirm: 'preConfirm',
                    showLoaderOnConfirm: true,
                    controller: 'ShowByUserCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        telesales: function() {
                            return telesales;
                        }
                    }
                })
                .then(function(response){
                    // console.log(response);
                    if(response && !response.dismiss && response.value){
                        // console.log(response.value)
                        getShippingItemsByUser(response.value);
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
    }
    $scope.getByPage = function(){
        sweetAlert.open({
                    title: "Hiển thị các đơn hàng theo Page",
                    htmlTemplate: "src/ship/partials/select-page.html",
                    confirmButtonText: 'Chọn',
                    showCancelButton: true,
                    showCloseButton: true,
                    allowOutsideClick: false,
                    preConfirm: 'preConfirm',
                    showLoaderOnConfirm: true,
                    controller: 'ShowByPageCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        fanpages: function() {
                            return fanpages;
                        }
                    }
                })
                .then(function(response){
                    // console.log(response);
                    if(response && !response.dismiss && response.value){
                        // console.log(response.value)
                        getShippingItemsByPage(response.value);
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
    }
    $scope.get =function(){
        getShippingItems();
    }

    function getShippingItems() {
            $rootScope.display_mode = null;
            $rootScope.display_id = null;
            $rootScope.is_getting_orders = true;

            $rootScope.availableShippingItems = [];
            MFirebaseService.getShippingItems(pageSize).then(function(response) {
                response.reverse().map(function(order) {
                    // console.log(order.key && order.key !== 'undefined' && typeof order.key !== undefined);
                    if(order.key && order.key !== 'undefined' && typeof order.key !== undefined){
                        $scope.$apply(function() {
                            $rootScope.availableShippingItems.push(order);
                        })
                    }
                    
                })
                $scope.$apply(function() {
                    // console.log($rootScope.availableShippingItems[0]);
                    $rootScope.newlyOrderKey = $rootScope.availableShippingItems[0].key;
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                    $rootScope.is_getting_orders = false;
                })
            })
        }
        getShippingItems();

        // get next items
        $rootScope.getNextShippingItems = function() {
            $rootScope.isLoaddingOrder = true;
            MFirebaseService.getNextShippingItems($rootScope.lastOrderKey, pageSize).then(function(response) {
                response.reverse().slice(1).map(function(order) {
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                    // listen for this order changing
                    // firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                    // .on('child_added', snapshot => {
                    //     $timeout(function() {
                    //         $scope.$apply(function() {
                    //             order.notes.push(snapshot.val());
                    //         })
                    //     }, 100);
                    // })
                    // listenShippingItemChange(order);
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

        /*
        * find an item in available items (loaded items)
        */
        function findAvailbleItemByKey(key){
            var found = $filter("filter")($rootScope.availableShippingItems, {key: key});
            return found ? found[0] : null;
        }

    let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('created_time').limitToLast(1);
        newOrdersRef.on('child_added', snapshot => {
            var exist = findAvailbleItemByKey(snapshot.key) != null;
            var checked_by = $rootScope.filterById(telesales, snapshot.val().data.orderData.seller_will_call_id);
            // console.log(snapshot.key);
            if (!exist && (!$rootScope.display_mode || ($rootScope.display_mode && checked_by.id == $rootScope.display_id))) {
                
                MUtilitiesService.AlertSuccessful(checked_by.last_name + ' vừa chốt 1 đơn hàng.');
                var order = {
                    key : snapshot.key,
                    data : snapshot.val(),
                    notes: snapshot.val().notes,
                }
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = snapshot.key;
                    $rootScope.availableShippingItems.unshift(order)
                });
                // listen for this order changing
                // firebase.database().ref().child('shippingItems/' + snapshot.key + '/notes')
                // .on('child_added', snapshot => {
                //     $timeout(function() {
                //         $scope.$apply(function() {
                //             order.notes.push(snapshot.val());
                //         })
                //     }, 100);
                // })
                // listenShippingItemChange(order);
            }
        });

        

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
                    // angular.forEach(response, function(order){
                    //     // listen for this order changing
                    //     firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                    //     .on('child_added', snapshot => {
                    //         $timeout(function() {
                    //             $scope.$apply(function() {
                    //                 order.notes.push(snapshot.val());
                    //             })
                    //         }, 100);
                    //     })
                    // })
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
                    // angular.forEach(response, function(order){
                    //     // listen for this order changing
                    //     firebase.database().ref().child('shippingItems/' + order.key + '/notes')
                    //     .on('child_added', snapshot => {
                    //         $timeout(function() {
                    //             $scope.$apply(function() {
                    //                 order.notes.push(snapshot.val());
                    //             })
                    //         }, 100);
                    //     })
                    // })
                });
            }

        }

        

        firebase.database().ref().child('shippingItems').on('child_changed', snapshot => {
            // console.log(snapshot.key + ' đã thay đổi');
            // console.log(snapshot.val());
            angular.forEach($rootScope.availableShippingItems, function(item){
                if(item.key == snapshot.key){
                    // kiểm tra thay đổi về tạo đơn thành công
                    if(item.data.viettel_post_code !== snapshot.val().viettel_post_code){
                        // vừa tạo đơn thành công
                        $timeout(function() {
                            $scope.$apply(function(){
                                item.data.viettel_post_code = snapshot.val().viettel_post_code;
                                // item.data.viettel_post_data = snapshot.val().viettel_post_data
                            })
                        }, 100);
                    }
                    // kiểm tra thay đổi về station
                    if(item.data.viettel_post_station_id !== snapshot.val().viettel_post_station_id){
                        // vừa tạo đơn thành công
                        $timeout(function() {
                            $scope.$apply(function(){
                                item.data.viettel_post_station_id = snapshot.val().viettel_post_station_id;
                                // item.data.viettel_post_station_name = snapshot.val().viettel_post_station_name
                            })
                        }, 100);
                    }
                    // Kiểm tra thay đổi về in ấn
                    if(item.data.printed !== snapshot.val().printed){
                        // vừa in phiếu xuất kho
                        $timeout(function() {
                            $scope.$apply(function(){
                                item.data.printed = snapshot.val().printed;
                            })
                        }, 100);
                    }
                    // Kiểm tra thay đổi về hủy đơn
                    if(item.data.is_cancel !== snapshot.val().is_cancel){
                        // vừa in phiếu xuất kho
                        $timeout(function() {
                            $scope.$apply(function(){
                                item.data.is_cancel = snapshot.val().is_cancel;
                            })
                        }, 100);
                    }
                }
            })
            
            // kiểm tra và cập nhật active item
            if($scope.activeOrder && $scope.activeOrder.key == snapshot.key){
                // kiểm tra thay đổi về tạo đơn thành công
                if($scope.activeOrder.data.viettel_post_code !== snapshot.val().viettel_post_code){
                    // vừa tạo đơn thành công
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.activeOrder.data.viettel_post_code = snapshot.val().viettel_post_code;
                            $scope.activeOrder.data.viettel_post_data = snapshot.val().viettel_post_data
                        })
                    }, 100);
                }
                // Kiểm tra thay đổi về in ấn
                if($scope.activeOrder.data.printed !== snapshot.val().printed){
                    // vừa in phiếu xuất kho
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.activeOrder.data.printed = snapshot.val().printed;
                        })
                    }, 100);
                }
                // kiểm tra thay đổi về station
                if($scope.activeOrder.data.viettel_post_station_id !== snapshot.val().viettel_post_station_id){
                    // vừa tạo đơn thành công
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.activeOrder.data.viettel_post_station_id = snapshot.val().viettel_post_station_id;
                            $scope.activeOrder.data.viettel_post_station_name = snapshot.val().viettel_post_station_name
                        })
                    }, 100);
                }
                // Kiểm tra thay đổi về hủy đơn
                if($scope.activeOrder.data.is_cancel !== snapshot.val().is_cancel){
                    // vừa in phiếu xuất kho
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.activeOrder.data.is_cancel = snapshot.val().is_cancel;
                        })
                    }, 100);
                }
            }
        });

        $rootScope.toTitleCase = function(str) {
            return str.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        $rootScope.onClickOrder = function(order){
            console.log(order);
            // giải pháp tạm thời để kiểm tra trùng đơn
            // console.log('Order key: ' + order.key);
            $scope.activeOrder = null;
            $scope.activeOrder = order;
            angular.forEach($rootScope.availableShippingItems, function(item){
                // console.log(item);
                item.selected = null;
                if(item.data.data && 
                    item.data.data.customerData.recievedPhone == $scope.activeOrder.data.data.customerData.recievedPhone
                    && item.key !== $scope.activeOrder.key){
                    $scope.activeOrder.is_dublicated = true;
                }
            })
            order.selected = true;
            $scope.findStation($scope.activeOrder.data.viettel_post_station_id);

            // console.log($scope.activeOrder.data.viettel_post_station_id);

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

        function addComment(text, item_id){
            var data = {
                text: text,
                uid: $rootScope.currentMember ? $rootScope.currentMember.id : 2,
                created_at: Date.now()
            }

            MFirebaseService.addShippingNote(item_id, data)
            .then(function(response){
                MUtilitiesService.AlertSuccessful(response);
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi')
            })
        }


        // var login_data = {
        //         'USERNAME' : 'phudv.meo@gmail.com',
        //         'PASSWORD' : 'nguyenthiphu',
        //         'SOURCE' : 0
        //     }

        // MVIETTELService.get_access_token(login_data).then(function(response){
        //     if(response.error == true){
        //         MUtilitiesService.AlertError('Lỗi đăng nhập Viettel Post: ' + response.message);
        //     }
        //     // console.log(response);
        //     $scope.$apply(function(){
        //         $scope.viettel_login_data = response;
        //     })
        //     // get all hubs
        //     MVIETTELService.get_hubs({'Token': $scope.viettel_login_data.TokenKey}).then(function(response){
        //             $scope.$apply(function(){
        //                 // $scope.hubs = response;
        //                 $scope.viettel_data.hubs = response;
        //                 // console.log(response);
        //             })
        //              // console.log($scope.hubs);
        //         })
        // })
        // .catch(function(err){
        //     MUtilitiesService.AlertError(err);
        // })

        $scope.createViettelPost = function(){
            sweetAlert.open({
                title: "Lựa chọn bưu cục",
                htmlTemplate: "src/ship/partials/select-hub.html",
                confirmButtonText: 'Tiếp tục',
                // customClass: 'swal-wide',
                showCancelButton: true,
                showCloseButton: true,
                allowOutsideClick: false,
                preConfirm: 'selectHub',
                showLoaderOnConfirm: true,
                controller: 'HubCtrl',
                controllerAs: 'vm',
                resolve: {
                    viettel_stations: function(MFirebaseService) {
                        return viettel_stations;
                    }
                }
            })
            .then(function(station_data){
                if(!station_data || !station_data.value) return;
                console.log(station_data);
                $scope.station_data = station_data;
                sweetAlert.open({
                    title: "Tạo đơn hàng " + station_data.value.station.name,
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
                        viettel_data: function(){
                            return {
                                provinces: viettel_provinces,
                                districs: viettel_districs,
                                wards: viettel_wards,
                                services: viettel_services,
                                extraServices: viettel_extra_services,
                                fanpages: fanpages,
                                hubs: station_data.value.hubs,
                            };
                        },
                        viettel_login_data: function(){
                            return station_data.value.login_data;
                        }
                    }
                })
                .then(function(response){
                    // console.log(response);
                    if(response && !response.dismiss && response.value.result && response.value.result.error == false){
                        if(response.value.result.message == "SUCCESS"){
                            sweetAlert.success('Tạo đơn hàng thành công.', {timer: 2500});
                            addComment('[Auto log] Tạo đơn hàng thành công.', $scope.activeOrder.key);
                            // console.log({
                            //     order_key: $scope.activeOrder.key,
                            //     order_success_date: $scope.activeOrder.data.created_time,
                            //     order_data: response.value.data,
                            //     order_code: response.value.result.data.ORDER_NUMBER,
                            //     date_string: MFirebaseService.convertDate(new Date($scope.activeOrder.data.created_time))
                            // });
                            // 1 - cập nhật thông tin của shipping item
                            // 2 - cập nhật báo cáo ngày
                            // 3 - cập nhật log dành cho shipping item
                            MFirebaseService.onCreateViettelPostSuccess($scope.activeOrder.key,
                                $scope.activeOrder.data.created_time,
                                response.value.data, response.value.result.data.ORDER_NUMBER,
                                station_data.value.station).then(function(response){
                                    //
                                    $scope.activeOrder.data.viettel_post_station_id = station_data.value.station.id;
                                    $scope.activeOrder.data.viettel_post_station_name = station_data.value.station.name;
                                    // find item in list and update
                                    angular.forEach($rootScope.availableShippingItems, (item) => {
                                      if(item.key == $scope.activeOrder.key){
                                        item.data.viettel_post_station_id = station_data.value.station.id;
                                        item.data.viettel_post_station_name = station_data.value.station.name;
                                      }
                                    })
                                MUtilitiesService.AlertSuccessful(response);
                            })
                            .catch(function(err){
                                console.log(err);
                                MUtilitiesService.AlertError(err);
                                addComment('[Auto log] Tạo đơn hàng thất bại. Lỗi ' + err, $scope.activeOrder.key);
                            })
                        }
                        // console.log('Tạo đơn thành công, cập nhật Order number = ' + response.value.data.ORDER_NUMBER);
                        // .then(function(){
                        //     MUtilitiesService.AlertSuccessful('Tạo đơn thành công!')
                        // });

                        console.log(response);
                    }
                })
                .catch(function(err){
                    console.log(err);
                    sweetAlert.alert(err, {title: 'Lỗi!'});
                    addComment('[Auto log] Tạo đơn hàng thất bại. Lỗi ' + err, $scope.activeOrder.key);
                    // .then(function(){
                    //     MUtilitiesService.AlertError('Tạo đơn không thành công!')
                    // });
                });
            })
            .catch(function(err){
                console.log(err);
            })
        }

        $scope.createGHN = function(){
            sweetAlert.alert('Hệ thống chưa hỗ trợ tích hợp nhà vận chuyển này!')
        }
        $scope.createShip = function(){
            sweetAlert.alert('Hệ thống chưa hỗ trợ tích hợp nhà vận chuyển này!')
        }

        $scope.findStation = function(station_id){
            if(station_id){
                angular.forEach(viettel_stations, function(station){
                    if(station_id == station.id){
                        $scope.currentSattion = station;
                        return;
                    }
                })
            }
            else{
                return getDefaultStation();
            }
        }

        function getDefaultStation(){
            return {
                name: "Reload (F5) để cập nhật"
            }
        }

        $scope.cancelOrder = function(){
            // get station of active order
            // các order cũ đã tạo với station == null => Viettel Post Hạ Đình (ID = 1)
            var station_id = 1;
            if($scope.activeOrder.data.viettel_post_station_id){
                station_id = $scope.activeOrder.data.viettel_post_station_id;
            }
            var current_station = null;
            angular.forEach(viettel_stations, function(station){
                if(station_id == station.id){
                    current_station = station;
                }
            })

            var login_data = {
                'USERNAME' : current_station.email,
                'PASSWORD' : current_station.password,
                'SOURCE' : 0
            }

            MVIETTELService.get_access_token(login_data).then(function(response){
                var _token = response.TokenKey;
                if(response.error == true){
                    MUtilitiesService.AlertError('Lỗi đăng nhập Viettel Post: ' + response.message);
                }
                // console.log(response);
                // get all hubs
                MVIETTELService.get_hubs({'Token': response.TokenKey}).then(function(r){
                        // console.log($scope.activeOrder.data.viettel_post_code);
                    sweetAlert.confirm('Bạn có muốn hủy đơn hàng không?', {title: 'Cảnh báo', 
                        confirmButtonText: 'Hủy đơn', cancelButtonText: 'Bỏ qua', showCancelButton: true}).then(function(response){
                        if(response && response.value == true){
                            MVIETTELService.cancel_order({
                                data: {
                                    "TYPE": 4,
                                    "ORDER_NUMBER": $scope.activeOrder.data.viettel_post_code,
                                    "NOTE": "Hủy đơn hàng",
                                    "DATE": $filter('date')(Date.now(), "dd/MM/yyyy H:m:s"),
                                },
                                token: _token
                            })
                            .then(function(response){
                                console.log(response);
                                if(response.error == false){
                                    sweetAlert.success(response.message);
                                    // 1 - cập nhật thông tin của shipping item
                                    // 2 - cập nhật báo cáo ngày
                                    // 3 - cập nhật log dành cho shipping item
                                    MFirebaseService.onCancelViettelPostSuccess($scope.activeOrder.key, 
                                        $scope.activeOrder.data.created_time,
                                        $scope.activeOrder.data.viettel_post_data, $scope.activeOrder.data.viettel_post_code).then(function(response){
                                        MUtilitiesService.AlertSuccessful(response);
                                        addComment('[Auto log] Hủy đơn hàng thành công.', $scope.activeOrder.key);
                                    })
                                    .catch(function(err){
                                        console.log(err);
                                        MUtilitiesService.AlertError(err);
                                    })
                                }
                                else{
                                    addComment('[Auto log] Hủy đơn hàng thất bại. Lý do: ' + response.message, $scope.activeOrder.key);
                                    sweetAlert.alert('Không thể hủy đơn hàng. Lý do: ' + response.message, {title: 'Lỗi!'})
                                }
                            })
                            .catch(function(err){
                                console.log(response);
                                addComment('[Auto log] Lỗi xảy ra khi hủy đơn hàng. ' + err.message, $scope.activeOrder.key);
                                sweetAlert.alert(err.message)
                            })
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                })
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err);
            })
        }

        // print
        $scope.print = function(){
            angular.forEach($rootScope.availableShippingItems, (item) => {
              if($scope.activeOrder && item.key == $scope.activeOrder.key){
                item.printed = true;
              }
              else{
                item.printed = false;
              }
            })
            sweetAlert.open({
                title: "In phiếu xuất kho",
                htmlTemplate: "src/ship/partials/create-print.html",
                confirmButtonText: 'Tạo trang in',
                // customClass: 'swal-wide',
                showCancelButton: true,
                showCloseButton: true,
                allowOutsideClick: false,
                preConfirm: 'preConfirm',
                showLoaderOnConfirm: true,
                controller: 'PrintCtrl',
                controllerAs: 'vm',
                resolve: {
                    activeOrder: function() {
                        return angular.copy($scope.activeOrder);
                    },
                    pages: function(){
                        return fanpages;
                    },
                    products: function(){
                        return $scope.aProducts;
                    },
                    telesales: function(){
                        return telesales;
                    }
                }
            })
            .then(function(response){
                console.log(response);
                if(response && !response.dismiss){
                    sweetAlert.open({
                        title: "Xem trước bản in",
                        htmlTemplate: "src/ship/partials/print-preview.html",
                        confirmButtonText: 'In phiếu',
                        customClass: 'swal-wide',
                        showCancelButton: true,
                        showCloseButton: true,
                        allowOutsideClick: false,
                        preConfirm: 'printConfirm',
                        showLoaderOnConfirm: true,
                        controller: 'PrintCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            activeOrder: function() {
                                return angular.copy($scope.activeOrder);
                            },
                            pages: function(){
                                return fanpages;
                            },
                            products: function(){
                                return $scope.aProducts;
                            },
                            telesales: function(){
                                return telesales;
                            }
                        }
                    })
                    .then(function(response){
                        // console.log(response);
                        if(response && !response.dismiss){
                            sweetAlert.success('Thao tác thành công.');
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                        sweetAlert.alert(err, {title: 'Lỗi!'})
                    });
                }
            })
            .catch(function(err){
                console.log(err);
                sweetAlert.alert(err, {title: 'Lỗi!'})
            });
        }

        $scope.togglePrintedItem = function(item_key, is_printed){
            MFirebaseService.toggleMaskPrintedShippingItem(item_key, is_printed).then(function(response){
                console.log(response);
            })
            .catch(function(err){
                console.log(err);
            })
        }

        

        // versión
        MFirebaseService.get_versions().then(function(response){
            $scope.$apply(function(){
                $rootScope.versions = response
            })
            // listen for new version
            firebase.database().ref().child('settings/versions_update').orderByChild('version')
            .limitToLast(1).on('child_added', snapshot => {
                if(snapshot.val().version !== response.version){
                    $scope.$apply(function(){
                        $rootScope.update_content = snapshot.val().content;
                    })
                }
            });
        })

        

        var todayDateString = MFirebaseService.convertDate(new Date());
        firebase.database().ref().child('report/' + todayDateString).on('child_changed', snapshot => {
            if(snapshot.key == 'successCount'){
                    // console.log('THÔNG BÁO: SỐ ĐƠN CHỐT ĐÃ THAY ĐỔI THÀNH ' + snapshot.val());
                    $scope.$apply(function(){
                        $scope.todaySuccess = snapshot.val();
                    })
                }
        });
        
        $scope.getCSV = function(){
            if(!$scope.availableShippingItems || $scope.availableShippingItems.length == 0){
                MUtilitiesService.AlertError('Không có dữ liệu', 'Lỗi');
                return null;
            }
            if(!$scope.display_mode){
                MUtilitiesService.AlertError('Hệ thống chỉ cho phép xuất dữ liệu theo Telesale hoặc Page', 'Lỗi');
                return null;
            }

            var res = [];
            angular.forEach($scope.availableShippingItems, function(order){
                console.log(order);
                if(order.is_cancel !== true){
                    var productLength = order.data.data.customerData.products ? order.data.data.customerData.products.length : 0;
                    var product1, product2, product3, product4;
                    if(productLength == 1){
                        product1 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[0].id);
                    }
                    else if(productLength == 2){
                        product1 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[1].id);
                    }
                    else if(productLength == 3){
                        product1 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[1].id);
                        product3 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[2].id);
                    }
                    else if(productLength == 4){
                        product1 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[1].id);
                        product3 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[2].id);
                        product4 = $scope.filterById($scope.aProducts, order.data.data.customerData.products[3].id);
                    }
                    var date = new Date(order.data.data.created_time);
                    var x = $scope.filterById($scope.telesales, order.data.data.orderData.seller_will_call_id);
                    res.push({
                        name: order.data.customer_name,
                        mobile: '0' + order.data.customer_mobile,
                        created_date: ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear(),
                        address:  order.data.data.customerData.addresss,
                        birthday: order.data.data.customerData.birthDay,
                        code: order.orderCode,
                        cod: order.data.data.customerData.cod,
                        shipping_fee: order.service_fee,
                        by: x ? x.last_name : 'Không rõ',
                        current_status: 
                        order.logs ? $scope.getStatus(order.logs[order.logs.length -1].CurrentStatus).text : 'Không rõ',
                        product1: product1 ? product1.name + ' (' + order.data.data.customerData.products[0].note + ')' : '',
                        product1_count: product1 ? order.data.data.customerData.products[0].count : null,

                        product2: product2 ? product2.name + ' (' + order.data.data.customerData.products[1].note + ')' : '',
                        product2_count: product2 ? order.data.data.customerData.products[1].count : null,

                        product3: product3 ? product3.name + ' (' + order.data.data.customerData.products[2].note + ')' : '',
                        product3_count: product3 ? order.data.data.customerData.products[2].count : null,
                        page_id: order.data.data.orderData.page_id,
                        page: $filter('filter')(fanpages, {id: order.data.data.orderData.page_id})[0].name,
                        note: order.data.data.customerData.orderNote,
                    });
                }
            })
            return res;
        }   
        $rootScope.currentDate = Date.now();
        
        $rootScope.finishLoadFullData = true;
  });