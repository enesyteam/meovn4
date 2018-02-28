m_admin.controller('OptionsCtrl',
function($rootScope, $scope, $filter, $http) {
	$scope.deleteDevData = function(){
		var ref = firebase.database().ref();
		ref.child('oldData').set(null);
		ref.child('comments').set(null);
		ref.child('blocks').set(null);
		ref.child('packs').set(null);
		ref.child('requests').set(null);
		ref.child('sources').set(null);
	}
	$scope.testApi = function(){
		var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        var data = {
			    "token": "5a93de5d1070b06c97794a48",
			    "OrderCode": $scope.mvd
			}

            $http.post('https://console.ghn.vn/api/v1/apiv3/OrderInfo', data, config)
            .then(function (data) {

                	$scope.ghnData = data;

            });
	}
	$scope.ghnData = null;
	$scope.mvd = null;

	$scope.getHubs = function(){
		var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        var data = {
			    "token": "5a0baf851070b03e4d16f4cb"
			}

            $http.post('https://console.ghn.vn/api/v1/apiv3/GetHubs', data, config)
            .then(function (data) {

                	$scope.ghnData = data;

            });
	}
	$scope.GetDistricts = function(){
		var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        var data = {
			    "token": "5a0baf851070b03e4d16f4cb"
			}

            $http.post('https://console.ghn.vn/api/v1/apiv3/GetDistricts', data, config)
            .then(function (data) {

                	$scope.ghnData = data;

            });
	}
	$scope.GetWards = function(){
		var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        var data = {
			    "token": "5a0baf851070b03e4d16f4cb",
			    "DistrictID": 1452
			}

            $http.post('https://console.ghn.vn/api/v1/apiv3/GetWards', data, config)
            .then(function (data) {

                	$scope.ghnData = data;

            });
	}
});