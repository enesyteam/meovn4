m_admin.controller('GHNCtrl',
function($rootScope, $scope, $filter, $http, MGHNService, MFirebaseService, ghn_token, toastr,  toastrConfig) {
	$scope.current_token = {
		token : ghn_token
	};
	toastrConfig.closeButton = true;
    toastrConfig.timeOut = 3000;
    function AlertError(c, d) {
        toastr.error(c, d)
    };

    function AlertSuccessful(c, d) {
        toastr.success(c, d)
    };

    function AlertWarning(c, d) {
        toastr.warning(c, d)
    };

	$scope.set_ghn_token = function(){
		if(!$scope.current_token.token || $scope.current_token.token.length == 0){
			// console.log('Token không đúng');
			AlertError('Token không đúng', 'Lỗi');
			return;
		}
		MFirebaseService.set_ghn_token($scope.current_token.token).then(function(response){
			// console.log(response);
			AlertSuccessful('Cập nhật token thành công', 'Thông báo');
			get_hubs();
		})
		.catch(function(err){
			console.log(err)
		});
	}

	/*
	* set token for using MGHNService
	*/
	MGHNService.setAccessToken(ghn_token);
	function get_hubs(){
		MGHNService.getHubs().then(function(response){
			$scope.$apply(function(){
				$scope.hubs = response
			})
		})
	}
	get_hubs();
})