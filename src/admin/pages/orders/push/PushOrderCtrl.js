m_admin.controller('PushOrderCtrl',
function($rootScope, $scope, $timeout, firebaseService, MFirebaseService, MUtilitiesService, $q, 
	can_release_statuses) {

	// MFirebaseService.getOrdersPaginate("-L6zzq3C7ugXdIGN2bJE", 10);


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
		angular.forEach($rootScope.availableOrders, function(order){
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
		angular.forEach($rootScope.availableOrders, function(order){
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
			angular.forEach($rootScope.availableOrders, function(order){
				if(order.selected){
					result.push(order);
				}
			})
			return result;
		}
		else{
			return $rootScope.availableOrders;
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