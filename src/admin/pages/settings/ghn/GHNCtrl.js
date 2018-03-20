m_admin.controller('GHNCtrl',
function($rootScope, $scope, $filter, $http, MGHNService, MFirebaseService, MUtilitiesService,
 ghn_token, toastr,  toastrConfig, ghn_districs) {
	$scope.current_token = {
		token : ghn_token
	};
	$scope.ghn_districs = ghn_districs;
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
		if($rootScope.currentMember.is_admin !== 1){
			MUtilitiesService.AlertError('Bạn không được quyền thay đổi token', 'Cảnh báo');
			return;
		}
		

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

	// ADD NEW GHN HUB
	$scope.ghn_hub_data = {
        "Address": null,
        "ContactName": null,
        "ContactPhone": null,
        "DistrictID": null,
        "Email": "",
        "IsMain": false,
        "Latitude": "",
        "Longitude": "",
        "PeCode": "",
        "SMSPhone": ""
	}
	function validateHubData(){
		if(!$scope.ghn_hub_data.ContactName || !$scope.ghn_hub_data.ContactName){
			AlertError('Vui lòng nhập tên hub', 'Lỗi');
			return false;
		}
		if(!$scope.ghn_hub_data.Address || !$scope.ghn_hub_data.Address){
			AlertError('Vui lòng nhập địa chỉ', 'Lỗi');
			return false;
		}
		if(!$scope.ghn_hub_data.ContactPhone || !$scope.ghn_hub_data.ContactPhone){
			AlertError('Vui lòng nhập số điện thoại', 'Lỗi');
			return false;
		}
		if(!$scope.ghn_hub_data.DistrictID){
			AlertError('Vui lòng chọn khu vực', 'Lỗi');
			return false;
		}
		return true;
	}
	$scope.onAddNewHub = function(){
		if(validateHubData()){
			console.log($scope.ghn_hub_data);
			MGHNService.addHub($scope.ghn_hub_data.Address, $scope.ghn_hub_data.DistrictID, $scope.ghn_hub_data.ContactName,
				$scope.ghn_hub_data.ContactPhone).then(function(){
				AlertSuccessful('Thêm hub thành công', 'Thông báo');
				$scope.ghn_hub_data = {
			        "Address": null,
			        "ContactName": null,
			        "ContactPhone": null,
			        "DistrictID": null,
			        "Email": "",
			        "IsMain": false,
			        "Latitude": "",
			        "Longitude": "",
			        "PeCode": "",
			        "SMSPhone": ""
				}
			})
		}
	}
})