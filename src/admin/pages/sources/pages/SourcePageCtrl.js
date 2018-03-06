m_admin.controller('SourcePageCtrl',
function($rootScope, $scope, $http, $state, $rootScope, $timeout, cfpLoadingBar, firebaseService, Facebook, 
	MGHNService, MFirebaseService, fanpages, toastr,  toastrConfig, MFacebookService, access_token,
	ghn_token, ghn_hubs) {

	$scope.ghn_hubs = ghn_hubs;

	MFacebookService.MFacebookServiceSetApp(Facebook);
	// console.log(fanpages);

	$scope.fanpages = fanpages;

	function AlertError(c, d) {
        toastr.error(c, d)
    };

    function AlertSuccessful(c, d) {
        toastr.success(c, d)
    };

    function AlertWarning(c, d) {
        toastr.warning(c, d)
    };

	$scope.page_data = {
		id : null,
		name : null,
		access_token : null,
		HubID : null
	}

	function validate_page_data(data){
		if(!data.id || data.id.length == 0){
			AlertError('Vui lòng nhập Page ID', 'Lỗi');
			return false;
		}
		if(!data.name || data.name.length == 0){
			AlertError('Vui lòng nhập Page Name', 'Lỗi');
			return false;
		}
		if(!data.access_token || data.access_token.length == 0){
			AlertError('Vui lòng nhập Page token', 'Lỗi');
			return false;
		}
		if(!data.HubID){
			AlertError('Vui lòng chọn khu vực', 'Lỗi');
			return false;
		}
		return true;
	}

	$scope.onAddNewPage = function(){
		if(validate_page_data($scope.page_data)){
			MFirebaseService.add_fanpage($scope.page_data).then(function(){
				AlertSuccessful('Thêm fanpage thành công', 'Thông báo');
				$scope.page_data = {
						id : null,
						name : null,
						access_token : null,
						HubID : null
					}
			})
			.catch(function(err){
				AlertError('Vui lòng kiểm tra lại dữ liệu', 'Lỗi');
			})
		}
	}
	$scope.onEditPage = function(page){
		console.log(page);
		$scope.page_data_to_edit = page;
	}
	$scope.onSubmitEditPage= function(){
		if(validate_page_data($scope.page_data_to_edit)){
			MFirebaseService.edit_fanpage($scope.page_data_to_edit).then(function(){
				AlertSuccessful('Thêm fanpage thành công', 'Thông báo');
			})
			.catch(function(err){
				AlertError('Vui lòng kiểm tra lại dữ liệu', 'Lỗi');
			})
		}
	}

	$scope.graph_page = function(){
		MFacebookService.graphPage($scope.page_data_to_edit.id, access_token).then(function(response){
			$scope.$apply(function(){
				$scope.page_data_to_edit.name = response.name
			})
		});
	}
	$scope.graph_add_page = function(){
		MFacebookService.graphPage($scope.page_data.id, access_token).then(function(response){
			$scope.$apply(function(){
				$scope.page_data.name = response.name
			})
		})
		.catch(function(err){
			AlertError(err, 'Lỗi');
		})
	}
	$scope.goToAddHub = function(){
		$state.go('home.settings.ghn');
	}
});