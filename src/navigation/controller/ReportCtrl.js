mNavigation.controller('ReportCtrl',
    function($rootScope, $scope, $http, $filter, $timeout,
    	MFirebaseService, MUtilitiesService, MGHNService, ghn_token, fanpages, telesales) {
        // console.log(ghn_token);
        $scope.aProducts = [];
        var getAllAvailableProducts = function() {
            var ref = firebase.database().ref();
            let productsRef = ref.child('products');
            productsRef.on('child_added', snapshot => {
                $scope.aProducts.push(snapshot.val());
            });
        }

        getAllAvailableProducts();

    	$scope.telesales = telesales;
    	$scope.filterById = function(sources, id) {
	        if(!id) return null;
	        return $filter("filter")(sources, {
	            id: id
	        })[0];
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

        $scope.getStatus = function(statusCode){
    		var result = $filter("filter")(statuses, {code: statusCode});
    		return result[0] || null;
    	}

    	var date = new Date();

    	// var dateToDisplay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);

    	$scope.selectedDate = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
    	
    	$scope.isGettingData = false;
    	function getReport(selectedDate){
    		$scope.isGettingData = true;
    		MFirebaseService.getOrdersByDate(selectedDate).then(function(response){
    			// console.log(response);
    			if(response.length == 0){
    				$scope.$apply(function(){
	    				$scope.isGettingData = false;
	    				$scope.result = null;
    				})
    				return;
    			}
    		// console.log(response);
	    		angular.forEach(response, function(item){
	            	// console.log(item.data.push_to_ghn_at);
	            	if(!item.is_cancel && item.orderCode){
	            		MGHNService.getOrderLog(item.orderCode, item.push_to_ghn_at, ghn_token).then (function(r){
			                // console.log(r.data.data.Logs);
			                $scope.$apply(function(){
			                	item.logs = r.data.data.Logs
			                	
			                })
			            })
	            	}

	            })
                $scope.$apply(function(){
                    $scope.isGettingData = false;
                    $scope.result = response;
                })
                console.log(response);
	    	})
	    	.catch(function(){
	    		$scope.isGettingData = false;
	    	})
    	}

    	getReport(date);

    	$scope.getReportForSelectedDate = function(date){
    		if(date){
    			var currentDate = new Date(date);
    			// console.log(currentDate.getTime());
    			// currentDate.getTime()
    			getReport(currentDate);
    		}
    		else{
    			getReport(Date.now());
    		}
    		
    	}

        $scope.getCSV = function(){
            if(!$scope.result || $scope.result.length == 0){
                MUtilitiesService.AlertError('Không có dữ liệu', 'Lỗi');
                return null;
            }



            var res = [];
            angular.forEach($scope.result, function(order){
                if(order.is_cancel !== true){
                    var productLength = order.data.customerData.products ? order.data.customerData.products.length : 0;
                    var product1, product2, product3, product4;
                    if(productLength == 1){
                        product1 = $scope.filterById($scope.aProducts, order.data.customerData.products[0].id);
                    }
                    else if(productLength == 2){
                        product1 = $scope.filterById($scope.aProducts, order.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.customerData.products[1].id);
                    }
                    else if(productLength == 3){
                        product1 = $scope.filterById($scope.aProducts, order.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.customerData.products[1].id);
                        product3 = $scope.filterById($scope.aProducts, order.data.customerData.products[2].id);
                    }
                    else if(productLength == 4){
                        product1 = $scope.filterById($scope.aProducts, order.data.customerData.products[0].id);
                        product2 = $scope.filterById($scope.aProducts, order.data.customerData.products[1].id);
                        product3 = $scope.filterById($scope.aProducts, order.data.customerData.products[2].id);
                        product4 = $scope.filterById($scope.aProducts, order.data.customerData.products[3].id);
                    }
                    var date = new Date(order.data.created_time);
                    var x = $scope.filterById($scope.telesales, order.data.orderData.seller_will_call_id);
                    res.push({
                        name: order.customer_name,
                        mobile: '0' + order.customer_mobile,
                        created_date: ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear(),
                        address:  order.data.customerData.addresss,
                        birthday: order.data.customerData.birthDay,
                        code: order.orderCode,
                        cod: order.cod_amount,
                        shipping_fee: order.service_fee,
                        by: x ? x.last_name : 'Không rõ',
                        current_status: 
                        order.logs ? $scope.getStatus(order.logs[order.logs.length -1].CurrentStatus).text : 'Không rõ',
                        product1: product1 ? product1.name + ' (' + order.data.customerData.products[0].note + ')' : '',
                        product1_count: product1 ? order.data.customerData.products[0].count : null,

                        product2: product2 ? product2.name + ' (' + order.data.customerData.products[1].note + ')' : '',
                        product2_count: product2 ? order.data.customerData.products[1].count : null,

                        product3: product3 ? product3.name + ' (' + order.data.customerData.products[2].note + ')' : '',
                        product3_count: product3 ? order.data.customerData.products[2].count : null,
                        page_id: order.data.orderData.page_id,
                        page: $filter('filter')(fanpages, {id: order.data.orderData.page_id})[0].name
                    });
                }
            })
            return res;
        }   

        $scope.getCSVFileName = function(){
            var date = new Date($scope.selectedDate);
            return ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
        }


    })