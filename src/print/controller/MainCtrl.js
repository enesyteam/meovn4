mPrinting.controller('MainCtrl',
    function($rootScope, $scope, $http) {
    	$scope.orders = []

    	$scope.getOrders1 = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            var startTime = new Date(); // today
            var endTime = new Date(); // today

            startTime.setDate(startTime.getDate() - 2); // get 4 recent days
            endTime.setDate(endTime.getDate());
            startTime = startTime.getTime();
            endTime = endTime.getTime();

            var data = {
                "token": '5a0baf851070b03e4d16f4cb', //$rootScope.ghnToken,
                // "OrderCode": "DB9NKNQ4"
                "FromTime": startTime,
                // "ToTime" : Date.now(),
                "Condition": {
                    // "ShippingOrderID": 56721015,
                    "CurrentStatus": "ReadyToPick",
                    "CustomerID": 187464,
                    "OrderCode": $scope.trackingCode
                },
                "Skip": 0
            }
            $http.post('https://console.ghn.vn/api/v1/apiv3/GetOrderLogs', data, config)
                .then(function(data) {
                    // console.log(data);
                    console.log(data);
                    $scope.orders = data.data.data.Logs;
                })
                 .catch(function(err) {
                    console.log(err);
                    // AlertError(err.data.msg, err.statusText);
                });
        }

        $scope.setPrintOrder = function(o){
        	var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            }
	        var data = {
				    "token": "5a93de5d1070b06c97794a48",
				    "OrderCode": o.OrderCode
				}

	            $http.post('https://console.ghn.vn/api/v1/apiv3/OrderInfo', data, config)
	            .then(function (data) {

	                	$scope.order = data.data.data;

	            });
        }

        $scope.getOrders = function(){
			var config = {
	                headers : {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
	                }
	            }
	        var data = {
				    "token": "5a93de5d1070b06c97794a48",
				    "OrderCode": $scope.orderCode
				}

	            $http.post('https://console.ghn.vn/api/v1/apiv3/OrderInfo', data, config)
	            .then(function (data) {

	                	$scope.order = data.data.data;

	            });
		}
    });