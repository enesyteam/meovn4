mRealtime.controller('MainCtrl',
  function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
    cfpLoadingBar, Facebook, firebaseService, firebaseStorageService, 
    MFirebaseService, MUtilitiesService, fanpages, telesales) {

    var pageSize = 30;
    $rootScope.availableOrders = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;

    $scope.telesales = telesales;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    function getOrders(){
        $rootScope.availableOrders = [];
        MFirebaseService.getOrders(pageSize).then(function(response) {
            response.reverse().map(function(order) {
                $scope.$apply(function() {
                    $rootScope.availableOrders.push(order.data);
                })
            })
            $scope.$apply(function() {
                $rootScope.newlyOrderKey = response[0].key;
                $rootScope.lastOrderKey = response[response.length - 1].key;
                $rootScope.isLoaddingOrder = false;
            })
        })
    }
    getOrders();

    // trigger when new item
    let newOrdersRef = firebase.database().ref().child('newOrders').limitToLast(1);
    newOrdersRef.on('child_added', snapshot => {
      if(snapshot.key !== $rootScope.newlyOrderKey){
        $scope.$apply(function(){
          $rootScope.newlyOrderKey = snapshot.key;
          $rootScope.availableOrders.unshift(snapshot.val())
        });
      }
    });
    
    $rootScope.getNextOrders = function() {
        $rootScope.isLoaddingOrder = true;
        MFirebaseService.getNextOrders($rootScope.lastOrderKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(order) {
                $scope.$apply(function() {
                    $rootScope.availableOrders.push(order.data);
                })
            })
            $scope.$apply(function() {
                $rootScope.lastOrderKey = response[response.length - 1].key;
                $rootScope.isLoaddingOrder = false;
                // console.log(response);
                if(response.length == 1){ // item bị trùng
                  $rootScope.canLoadMore = false;
                }
            })
        })
    }

    $rootScope.chatBoxBackgroundColor = '#ddd';

    $rootScope.searchQuery = {
      text : null
    }

    $rootScope.searchOrder = function(){
      if(!$rootScope.searchQuery.text || $rootScope.searchQuery.text == ''){
        // reset kết quả về mặc định
        getOrders();
        // MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
        return;
      }
      if($rootScope.searchQuery.text.length < 2){
        MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
        return;
      }
      if($rootScope.searchQuery.text.match(/^\d/)){
        if($rootScope.searchQuery.text.length < 4){
          MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
          return;
        }
        MFirebaseService.searchOrderByCustomerPhone($rootScope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $rootScope.availableOrders = response
          })
        });
      }
      else{
        MFirebaseService.searchOrderByCustomerName($rootScope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $rootScope.availableOrders = response
          })
        });
      }
      
    }

    $rootScope.fanpages = fanpages;

    $rootScope.filterById = function(sources, id) {
        if(!id) return null;
        return $filter("filter")(sources, {
            id: id
        })[0];
    }
    $rootScope.getSourceColor = function(statusId) {
        if (!$rootScope.statuses) return "null";
        var status = $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0];

        if (status) {
            return status.color;
        } else return null;
    }
    $rootScope.getStatusById = function(statusId) {
        if (!$rootScope.statuses) return "null";
        return $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0];
    }

    // var getAccessToken = function(){
    //     $http.get('../access_token.json').
    //       then(function onSuccess(response) {
    //          $rootScope.access_token_arr = response.data;
    //       }).
    //       catch(function onError(response) {
    //        // console.log(response);
    //       });
    // }
    // getAccessToken();

    $rootScope.sources = [];
    $rootScope.packs = [];
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

    var ref = firebase.database().ref();
    firebaseService.getStatuses().then(function(snapshot) {
        $scope.$apply(function() {
            $rootScope.statuses = snapshot.val();
        });
    });

    // listen for order change
    ref.child('newOrders').on('child_changed', snapshot => {
        console.log(snapshot.val());
        // find item in array
        $timeout(function() {
            $scope.$apply(function() {
                var itemChanged = $filter('filter')($rootScope.availableOrders, {
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



    $rootScope.finishLoadingOrders = true;

    $rootScope.isFaceboxShowing = false;
    $rootScope.showSelectPhotoFacebox = function() {
        $rootScope.isFaceboxShowing = true;

        $rootScope.imageFiles = [];
        let imageFilesRef = firebase.database().ref().child('uploads').child('products').child('images');
        imageFilesRef.on('child_added', snapshot => {

            $timeout(function() {
                $scope.$apply(function() {
                    $rootScope.imageFiles.push(snapshot.val());
                })
            })
        });
    }
    $rootScope.hideSelectPhotoFacebox = function() {
        $rootScope.isFaceboxShowing = false;
    }

    $scope.activeOrder = function(order) {
        $rootScope.activeOrder = order;
        $rootScope.activeStatusId = order.status_id;
    }

    $rootScope.signout = function() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }, function(error) {
            // An error happened.
        });
    }

    $scope.filterOrderByStatusId = function(){
        MUtilitiesService.AlertError('Bộ lọc theo trạng thái sẽ được bổ sung trong bản release tiếp theo', 'Thông báo');
    }

    $rootScope.faceboxWidth = 685;
    /*
     * upload files
     */
    $rootScope.onFileSelect = function($files) {
        angular.forEach($files, function(file) {
            // make file name
            var d = Date.now();
            var file_name = 'image_' + d;
            firebaseStorageService.upload(file, 1, file_name).then(function(response) {
                // response = file link
                // console.log(response);
                // create image item on firebase
                firebaseService.submitFileItem(response, $rootScope.currentMember.id);
            });
        });
        // $files = null;
    };

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

    // filter
    // filterPageId:filterGender:filterDestiny
    $rootScope.filterPageId = null;
    $rootScope.filterGender = null;
    $rootScope.filterDestiny = null;
    $rootScope.currentPhotosFilter = 'Page:' + $rootScope.filterPageId +
        ' Gender:' + $rootScope.filterGender +
        ' Destiny:' + $rootScope.filterDestiny;
    $rootScope.toggleFilterPageId = function() {
        if (!$rootScope.filterPageId) {
            $rootScope.filterPageId = 137428680255822;
        }
    }
    // filter
    $rootScope.genders = [
        {
            id : 1,
            name : 'Nam',
            selected: false,
        },
        {
            id : 2,
            name : 'Nữ',
            selected: false,
        }
    ]

    $rootScope.destinies = [
        {
            id : 1,
            name : 'Kim',
            selected: false,
        },
        {
            id : 2,
            name : 'Thủy',
            selected: false,
        },
        {
            id : 3,
            name : 'Hỏa',
            selected: false,
        },
        {
            id : 4,
            name : 'Thổ',
            selected: false,
        },
        {
            id : 5,
            name : 'Mộc',
            selected: false,
        }
    ]

    $rootScope.toggleFilterGender = function(genderId) {
        angular.forEach($rootScope.genders, function(gender){
            if (gender.id == genderId){
                if(gender.selected == true){
                    gender.selected = false;
                }
                else{
                    gender.selected = true;
                }
            }
        })
    }
    $rootScope.toggleFilterDestiny = function(destinyId) {
        angular.forEach($rootScope.destinies, function(destiny){
            if (destiny.id == destinyId){
                if(destiny.selected == true){
                    destiny.selected = false;
                }
                else{
                    destiny.selected = true;
                }
            }
        })
    }
});