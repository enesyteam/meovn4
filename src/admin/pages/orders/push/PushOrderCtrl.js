m_admin.controller('PushOrderCtrl',
function($rootScope, $scope, $timeout, firebaseService, MFirebaseService, MUtilitiesService) {
	Array.prototype.chunk = function(groupsize){
	    var sets = [], chunks, i = 0;
	    chunks = this.length / groupsize;

	    while(i < chunks){
	        sets[i] = this.splice(0,groupsize);
		i++;
	    }
		
	    return sets;
	};
	$scope.checkedAll = false;
	$scope.checkAll = function(){
		if ($scope.checkedAll == false) {
            $scope.checkedAll = true;
        } else {
            $scope.checkedAll = false;
        }
		angular.forEach($rootScope.notAssignedOrders, function(order){
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
		var selectedUserIds = [];

		// lấy danh sách orders để phân bổ
		angular.forEach($rootScope.notAssignedOrders, function(order){
			if(order.selected){
				selectedOrders.push(order);
			}
		})

		// lấy danh sách user id để phân bổ
		angular.forEach($rootScope.sellers, function(s){
			if(s.selected){
				selectedUserIds.push(s.id);
			}
		});

		if(!selectedUserIds || selectedUserIds.length == 0){
			$scope.toggleShowUserPane();
		}

		MUtilitiesService.showWaitingDialog('Đang phân bổ Orders, vui lòng chờ...', function(){
			var init = function(){
				return new Promise(function(resolve, reject){
					MFirebaseService.onPushOrders(selectedOrders, selectedUserIds).then(function(response){
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

	$scope.releaseUserOrders = function(seller, event){
		event.stopPropagation();
		MUtilitiesService.showConfirmDialg('Thông báo',
                'Bạn có chắc muốn hủy tất cả Orders của : ' + seller.last_name + ' không?', 'Hủy', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                	MUtilitiesService.showWaitingDialog('Đang hủy tất cả Orders của ' + seller.last_name + ', vui lòng chờ...', 
                		function(){
                			return new Promise(function(resolve, reject){
								$timeout(function() {
									resolve(true);
								}, 2000);
							})
                		});
                    console.log('Bắt đầu hủy nhận các orders của seller...');
                    // code hủy ở đây
                } else {
                    console.log('Admin hoặc Mod bỏ qua thao tác hủy đơn');
                }
            })
	}

	$scope.testWaitingDialg = function(callBackFunction){
		MUtilitiesService.showWaitingDialog('Đang phân bổ Orders, vui lòng chờ...', callBackFunction);
	}

	$scope.onOpenCallback = function(){
		return new Promise(function(resolve, reject){
			$timeout(function() {
				resolve(true);
			}, 2000);
		})
		
	}

	const $Vals = {};
	function A() {
	  return new Promise((resolve, reject) => {
	    resolve([1, 2, 3])
	  })
	}

	function B() {
	  return new Promise((resolve, reject) => {
	    resolve([4, 5, 6])
	  })
	}



	A().then((dt) => {
	  $Vals.A = dt;
	  return B();
	}).then((dt) => {
	  $Vals.B = dt;
	  console.log($Vals);
	})
});