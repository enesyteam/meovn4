mShip.controller('ShowByPageCtrl', ['$q',  '$timeout', '$scope', '$filter', 'fanpages',
	function ($q, $timeout, $scope, $filter, fanpages) {
		vm = this;
		$scope.fanpages = fanpages;

    	$scope.selected_page = null;
    	

		$scope.onStationChange = function(){
        // console.log($scope.selected_station);
	    }

	    vm.preConfirm = function(){
	        return new Promise(function(resolve, reject){
	            if($scope.selected_page){
	                resolve($scope.selected_page);
	            }
	            else{
	            	reject('Vui lòng chọn page!');
	            }
	            
	        })
	    }

}]);