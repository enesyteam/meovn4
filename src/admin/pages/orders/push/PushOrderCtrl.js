m_admin.controller('PushOrderCtrl',
function($rootScope, $scope, $filter, $timeout, firebaseService, MFirebaseService, MUtilitiesService, $q, 
	can_release_statuses) {

	// MFirebaseService.getOrdersPaginate("-L6zzq3C7ugXdIGN2bJE", 10);
	var pageSize = 30;
    $scope.canAsignOrders = [];
    $scope.newlyOrderKey = null;
    $scope.lastOrderKey = null;
    $scope.canLoadMore = true;
    $scope.isLoaddingOrder = true;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    MFirebaseService.getOrders(pageSize).then(function(response) {
        response.reverse().map(function(order) {
          var item = {
                  customer_name : order.data.customer_name,
                  customer_mobile : order.data.customer_mobile,
                  id : order.data.id,
                  selected : false,
                  seller_will_call_id : order.data.seller_will_call_id,
                  status_id : order.data.status_id
                }
            $scope.$apply(function() {
                $scope.canAsignOrders.push(item);
            })
        })
        $scope.$apply(function() {
            $scope.newlyOrderKey = response[0].key;
            $scope.lastOrderKey = response[response.length - 1].key;
            $scope.isLoaddingOrder = false;
        })
    })

    // trigger when new order added
    let newOrdersRef = firebase.database().ref().child('newOrders').orderByChild('publish_date').limitToLast(1);
    newOrdersRef.on('child_added', snapshot => {
      if(snapshot.key !== $scope.newlyOrderKey){
        var item = {
            customer_name : snapshot.val().customer_name,
            customer_mobile : snapshot.val().customer_mobile,
            id : snapshot.val().id,
            selected : false,
            seller_will_call_id : snapshot.val().seller_will_call_id,
            status_id : snapshot.val().status_id
          }
        $timeout(function() {
        	$scope.$apply(function(){
	          $scope.newlyOrderKey = snapshot.key;
	          $scope.canAsignOrders.unshift(snapshot.val());
	        });
        }, 10);
      }
    });

    firebase.database().ref().child('newOrders').on('child_changed', snapshot => {
      // find item in array
      var itemChanged = $filter('filter')($scope.canAsignOrders, {'id':snapshot.val().id})[0];
      if(itemChanged.status_id !== snapshot.val().status_id){
        itemChanged.status_id = snapshot.val().status_id; 
      }
      if(itemChanged.seller_will_call_id !== snapshot.val().seller_will_call_id){
        itemChanged.seller_will_call_id = snapshot.val().seller_will_call_id; 
      }
      
    });

    
    $scope.getNextOrders = function() {
        $scope.isLoaddingOrder = true;
        MFirebaseService.getNextOrders($scope.lastOrderKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(order) {
                var item = {
                    customer_name : order.data.customer_name,
                    customer_mobile : order.data.customer_mobile,
                    id : order.data.id,
                    selected : false,
                    seller_will_call_id : order.data.seller_will_call_id,
                    status_id : order.data.status_id
                  }
                $scope.$apply(function() {
	                $scope.canAsignOrders.push(item);
                })
            })
            $scope.$apply(function() {
                $scope.lastOrderKey = response[response.length - 1].key;
                $scope.isLoaddingOrder = false;
                // console.log(response);
                if(response.length == 1){ // item bị trùng
                  $scope.canLoadMore = false;
                }
            })
        })
    }

    $scope.searchQuery = {
      text : null
    }

    $scope.searchOrder = function(){
      if(!$scope.searchQuery.text || $scope.searchQuery.text == ''){
        MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
        return;
      }
      if($scope.searchQuery.text.length < 2){
        MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
        return;
      }
      if($scope.searchQuery.text.match(/^\d/)){
        alert($scope.searchQuery.text);
        if($scope.searchQuery.text.length < 4){
          MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
          return;
        }
        MFirebaseService.searchOrderByCustomerPhone($scope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $scope.canAsignOrders = response
          })
        });
      }
      else{
        MFirebaseService.searchOrderByCustomerName($scope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $scope.canAsignOrders = response
          })
        });
      }
      
    }


	Array.prototype.chunk = function(groupsize){
	    var sets = [], chunks, i = 0;
	    chunks = this.length / groupsize;

	    while(i < chunks){
	        sets[i] = this.splice(0,groupsize);
		i++;
	    }
		
	    return sets;
	};

	// console.log(can_release_statuses);

	$scope.checkedAll = false;
	$scope.checkAll = function(){
		if ($scope.checkedAll == false) {
            $scope.checkedAll = true;
        } else {
            $scope.checkedAll = false;
        }
		angular.forEach($scope.canAsignOrders, function(order){
			order.selected = $scope.checkedAll;
		});
	}

	$scope.checkedUser = function(user){
		user.selected = !user.selected;
	}

	$scope.testPush = function(){
		// get demo user ID for test
		var uid = null;
		var selectedUser = [];
		angular.forEach($rootScope.sellers, function(s){
			if(s.selected == true){
				selectedUser.push(s);
			}
		});

		var selectedOrders = [];
		var selectedUsers = [];

		// lấy danh sách orders để phân bổ
		angular.forEach($scope.canAsignOrders, function(order){
			if(order.selected){
				selectedOrders.push(order);
			}
		})

		// lấy danh sách user id để phân bổ
		angular.forEach($rootScope.sellers, function(s){
			if(s.selected){
				selectedUsers.push(s);
			}
		});

		if(!selectedUsers || selectedUsers.length == 0){
			$scope.toggleShowUserPane();
		}

		// chú ý: sửa validate orders và users trước khi gọi waiting dialog

		MUtilitiesService.showWaitingDialog('Đang phân bổ Orders, vui lòng chờ...', function(){
			var init = function(){
				return new Promise(function(resolve, reject){
					MFirebaseService.onPushOrders(selectedOrders, selectedUsers).then(function(response){
						resolve(true);
						MUtilitiesService.AlertSuccessful(response);
					}).catch(function(error){
						resolve(false);
						MUtilitiesService.AlertError(error, 'Lỗi');
					})
				})
			}

			return {
				init : init,
			}
		});
	}

	$scope.showUserPane = true;
	$scope.toggleShowUserPane = function(){
		$scope.showUserPane = true;
	}
	$scope.toggleHideUserPane = function(){
		$scope.showUserPane = false;
	}


	/*
	* Hủy
	*/
	// $scope.releaseUserOrders = function(seller, event){
	// 	event.stopPropagation();
	// 	MUtilitiesService.showConfirmDialg('Thông báo',
 //                'Bạn có chắc muốn hủy tất cả Orders của : ' + seller.last_name + ' không?', 'Hủy', 'Bỏ qua')
 //            .then(function(response) {
 //                if (response) {
 //                	MUtilitiesService.showWaitingDialog('Đang hủy tất cả Orders của ' + seller.last_name + ', vui lòng chờ...', 
 //                		function(){
 //                			return new Promise(function(resolve, reject){
	// 							$timeout(function() {
	// 								resolve(true);
	// 							}, 2000);
	// 						})
 //                		});
 //                    console.log('Bắt đầu hủy nhận các orders của seller...');
 //                    // code hủy ở đây
 //                } else {
 //                    console.log('Admin hoặc Mod bỏ qua thao tác hủy đơn');
 //                }
 //            })
	// }

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
	function getOrdersArrayToRelease(){
		var result = [];
		if($scope.releaseOnlySelectedOrders){
			angular.forEach($scope.canAsignOrders, function(order){
				if(order.selected){
					result.push(order);
				}
			})
			return result;
		}
		else{
			return $scope.canAsignOrders;
		}
	}

	/*
	* Lấy danh sách tất cả Users sẽ hủy
	*/
	function getUsersArrayToRelease(){
		var result = [];
		angular.forEach($rootScope.sellers, function(s){
			if(s.selected){
				result.push(s);
			}
		});
		return result;
	}

	$scope.releaseSelectedUsers = function(){
		var orders = getOrdersArrayToRelease();
		var users = getUsersArrayToRelease();

		// make users list
		var userNames = users.map(function(user){
			return user.last_name;
		})
		.join(", ");

		// var canReleaseArr = can_release_statuses.map(function(status){
		// 	return status.id;
		// })
		// console.log(canReleaseArr);

		MUtilitiesService.showConfirmDialg('Thông báo',
                'Bạn có chắc muốn hủy tất cả Orders của : ' + userNames + ' không?', 'Hủy', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                	MUtilitiesService.showWaitingDialog('Đang hủy tất cả Orders của ' + 
                		userNames + ', vui lòng chờ...', function(){
                			var init = function(){
								return new Promise(function(resolve, reject){
									var promises = [];

									angular.forEach(users, function(user){

										var deferred = $q.defer();

										MFirebaseService.releaseUser(orders, user, can_release_statuses).then(function(response){
											// console.log('Hủy thành công ' + orders.length + ' của ' + user.last_name);
											deferred.resolve(true);
										})
										.catch(function(err){
											
											deferred.resolve(false);
										})

										promises.push(deferred.promise);
									})

									$q.all(promises).then(function(results){
										resolve(true);
									})
								})
							}
							
							return {
								init : init
							}
                		});
                    
                    // code hủy ở đây
                } else {
                    console.log('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                }
            })
	}

});