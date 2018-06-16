mShip.controller('ShowByUserCtrl', ['$q',  '$timeout', '$scope', '$filter', 'telesales',
	function ($q, $timeout, $scope, $filter, telesales) {
		vm = this;
		$scope.telesales = [];
		angular.forEach(telesales, (user) => {
		  if(user.is_seller == 1 && user.status == 1){
			$scope.telesales.push(user)
		  }
		})

    	$scope.selected_user = null;
    	

		$scope.onStationChange = function(){
        // console.log($scope.selected_station);
	    }

	    vm.preConfirm = function(){
	        return new Promise(function(resolve, reject){
	            if($scope.selected_user){
	                resolve($scope.selected_user);
	            }
	            else{
	            	reject('Vui lòng chọn telesale!');
	            }
	            
	        })
	    }

}]);