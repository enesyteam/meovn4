mShip.controller('HubCtrl', ['$q',  '$timeout', '$scope', '$http', '$filter', 'viettel_stations', 'MFirebaseService', 'MVIETTELService', 'MUtilitiesService',
	function ($q, $timeout, $scope, $http, $filter, viettel_stations,
        MFirebaseService,  MVIETTELService, MUtilitiesService) {

		vm = this;

		console.log(viettel_stations);
    	$scope.viettel_stations = viettel_stations;

		$scope.onStationChange = function(){
        // console.log($scope.selected_station);
	    }

	    vm.selectHub = function(){
	        return new Promise(function(resolve, reject){
	            if($scope.selected_station){
	                // login to get token
	                var login_data = {
	                        'USERNAME' : $scope.selected_station.email,
	                        'PASSWORD' : $scope.selected_station.password,
	                        'SOURCE' : 0
	                    }

	     //             var config = {
		    //             headers: {
		    //                 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
		    //             }
		    //         }

	     //            $http.post('https://api.viettelpost.vn/api/user/Login', login_data, config)
	     //            .then(function(response){
						// console.log(response);
	     //            })

	                MVIETTELService.get_access_token(login_data).then(function(response){
	                    if(response.error == true){
	                        MUtilitiesService.AlertError('Lỗi đăng nhập Viettel Post: ' + response.message);
	                    }
	                    // console.log(response);
	                    // get all hubs
	                    MVIETTELService.get_hubs({'Token': response.TokenKey}).then(function(r){
	                            $scope.$apply(function(){
	                                // $scope.hubs = response;
	                                // $scope.viettel_data.hubs = response;
	                                // console.log(r);
	                                swal.resetValidationError();
	                                resolve({
	                                    station: $scope.selected_station,
	                                    login_data: response,
	                                    hubs: r
	                                });
	                            })
	                             // console.log($scope.hubs);
	                        })
	                })
	                .catch(function(err){
	                    MUtilitiesService.AlertError(err);
	                })
	            }
	            else{
	                swal.showValidationError('Vui lòng chọn bưu cục để tiếp tục!');
	                swal.hideLoading();
	            }
	            // reject('Vui lòng chọn bưu cục!');
	        })
	    }

}]);