mNavigation.controller('MainCtrl',
    function($rootScope, $scope, $http, $filter, $timeout,
    	MFirebaseService, MUtilitiesService, MGHNService, ghn_token, fanpages, telesales) {
    	// console.log(telesales);
    	$scope.telesales = telesales;
        $scope.aProducts = [];
        var getAllAvailableProducts = function() {
            var ref = firebase.database().ref();
            let productsRef = ref.child('products');
            productsRef.on('child_added', snapshot => {
                $scope.aProducts.push(snapshot.val());
            });
        }

        getAllAvailableProducts();
        
    	$rootScope.filterById = function(sources, id) {
	        if(!id) return null;
	        return $filter("filter")(sources, {
	            id: id
	        })[0];
	    }
    	// alert('working!');
    	$rootScope.searchQuery = {
    		text: null,
    	}

    	$scope.resetSearch = function(){
    		$scope.finishSearch = false;
    	}

    	

    	var statuses = [
            {
                id: 101,
                code: 'ReadyToPick',
                text: 'Mới tạo',
                description : 'Trạng thái ReadyToPick là trạng thái đơn hàng mới được tạo ra và chờ nhân viên lấy hàng đến lấy. Khi đơn hàng được tạo ra mặc định sẽ nằm trong trạng thái này.'
            },
            {
                id: 0,
                code: 'Cancel',
                text: 'Đã hủy',
                description : 'Là trạng thái đơn hàng bị hủy'
            },
            {
                id: 201,
                code: 'Storing',
                text: 'GHN đã lấy',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đã nhận được và chuyển hàng hóa về kho lưu trữ'
            },
            {
                id: 202,
                code: 'Delivering',
                text: 'Đang giao hàng',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đang đi giao hàng cho người nhận'
            },
            {
                id: 203,
                code: 'Delivered',
                text: 'Giao thành công',
                description : 'Là trạng thái đơn hàng đã được giao thành công'
            },
            {
                id: 301,
                code: 'Return',
                text: 'Đang trả hàng',
                description : 'Là trạng thái đơn hàng trả lại cho người bán sau 3 lần giao hàng không thành công'
            },
            {
                id: 302,
                code: 'Returned',
                text: 'Trả hàng',
                description : 'Là trạng thái đơn hàng đã được trả lại cho người bán'
            },
            {
                id: 204,
                code: 'WaitingToFinish',
                text: 'Chờ hoàn tất',
                description : 'Là trạng thái đơn hàng đang được xử lý để hoàn thành (ví dụ chuyển tiền thu hộ)'
            },
            {
                id: 310,
                code: 'Finish',
                text: 'Hoàn tất',
                description : 'Đơn hàng đã hoàn thành'
            },
            {
                id: 111,
                code: 'LostOrder',
                text: 'Thất lạc',
                description : 'Trạng thái đơn hàng bị thất lạc'
            },
        ];


    	$scope.search = function() {

    		$scope.finishSearch = false;

            if (!$rootScope.searchQuery.text || $rootScope.searchQuery.text == '') {
                // reset kết quả về mặc định
                // getShippingItems();
                MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.length < 2) {
                MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                return;
            }
            if ($rootScope.searchQuery.text.match(/^\d/)) {
                if ($rootScope.searchQuery.text.length < 4) {
                    MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
                    return;
                }
                
                MFirebaseService.searchShippingItemsByCustomerPhone($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Thông báo');
                        return;
                    }
                	// console.log(response);
                   // $scope.$apply(function() {
                    angular.forEach(response, function(item){
                    	// console.log(item.data.push_to_ghn_at);
                    	if(!item.data.is_cancel && item.data.orderCode){
                    		MGHNService.getOrderLog(item.data.orderCode, item.data.push_to_ghn_at, ghn_token).then (function(r){
				                // console.log(r.data.data.Logs);
				                $scope.$apply(function(){
				                	item.logs = r.data.data.Logs
				                })
				            })
                    	}
                    })

                    $scope.result = response;
                    $scope.finishSearch = true;

                    // });
                });
            } else {

                MFirebaseService.searchShippingItemsByCustomerName($rootScope.searchQuery.text).then(function(response) {
                    if (response.length == 0) {
                        MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Thông báo');
                        return;
                    }
                    // console.log(response);
                   // $scope.$apply(function() {
                    angular.forEach(response, function(item){
                    	// console.log(item.data.push_to_ghn_at);
                    	if(!item.data.is_cancel && item.data.orderCode){
                    		MGHNService.getOrderLog(item.data.orderCode, item.data.push_to_ghn_at, ghn_token).then (function(r){
				                // console.log(r.data.data.Logs);
				                $scope.$apply(function(){
				                	item.logs = r.data.data.Logs
				                })
				            })
                    	}
                    })

                    $scope.result = response;
                    $scope.finishSearch = true;
                });
            }

        }

        $scope.getStatus = function(statusCode){
    		var result = $filter("filter")(statuses, {code: statusCode});
    		return result[0] || null;
    	}
    })