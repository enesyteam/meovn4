m_admin.controller('PushOrderCtrl',
function($rootScope, $scope, firebaseService) {
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
		// 
		var updates = {};

		angular.forEach($rootScope.notAssignedOrders, function(order){
			if(order.selected){
				updates['/newOrders/' + order.id + '/seller_will_call_id'] = selectedUser[0].id;
				order.selected = false;
			}
		});
		$scope.onPushing = true;
		firebase.database().ref().update(updates).then(function(){
			console.log('Đã phân số xong!');
			$scope.$apply(function(){
				$scope.onPushing = false;
			})
		});
		// ref.child('newOrders').child(reportDateString).child(nodeName).transaction(function(oldValue){
  //                 return oldValue + 1;
  //             });
	}
});