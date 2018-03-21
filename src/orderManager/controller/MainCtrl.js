mOrderManager.controller('MainCtrl',
    function($rootScope, $scope, $http, moment) {
        $scope.formatDate = function(d){
          return moment(d).format("DD/MM/YYYY hh:mm");
        }

    	$scope.orders = [];

        var startTime = new Date(); // today
        var endTime = new Date(); // today

        startTime.setDate(startTime.getDate() - 1); // get 4 recent days
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();

        $scope.canNext = function(){
            return currentPage*items < $scope.Total;
        }


        $scope.statuses = [
            {
                id: 101,
                code: 'ReadyToPick',
                text: 'Mới tạo',
                description : 'Trạng thái ReadyToPick là trạng thái đơn hàng mới được tạo ra và chờ nhân viên lấy hàng đến lấy. Khi đơn hàng được tạo ra mặc định sẽ nằm trong trạng thái này.'
            },
            {
                id: 0,
                code: 'Cancel',
                text: 'Hủy',
                description : 'Là trạng thái đơn hàng bị hủy'
            },
            {
                id: 201,
                code: 'Storing',
                text: 'Đã lấy',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đã nhận được và chuyển hàng hóa về kho lưu trữ'
            },
            {
                id: 202,
                code: 'Delivering',
                text: 'Đang giao',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đang đi giao hàng cho người nhận'
            },
            {
                id: 203,
                code: 'Delivered',
                text: 'Thành công',
                description : 'Là trạng thái đơn hàng đã được giao thành công'
            },
            {
                id: 301,
                code: 'Return',
                text: 'Trả hàng',
                description : 'Là trạng thái đơn hàng trả lại cho người bán sau 3 lần giao hàng không thành công'
            },
            {
                id: 302,
                code: 'Returned',
                text: 'Đã trả',
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

        $scope.selectedStatus = $scope.statuses[0];

        $scope.changeStatus = function(status){
            $scope.selectedStatus = status;
            console.log($scope.selectedStatus);
            currentPage = 0;
            getOrders();
        }

        

    	var getOrders = function() {
            $scope.orders = [];
            // console.log($scope.selectedStatus);
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            var data = {
                "token": '5a0baf851070b03e4d16f4cb', //$rootScope.ghnToken,
                // "OrderCode": "DB9NKNQ4"
                "FromTime": startTime,
                // "ToTime" : Date.now(),
                "Condition": {
                    // "ShippingOrderID": 56721015,
                    "CurrentStatus": $scope.selectedStatus.code,
                    "CustomerID": 187464,
                    // "OrderCode": $scope.trackingCode,
                },
                "Skip": currentPage*items
            }
            $scope.isLoading = true;
            $http.post('https://console.ghn.vn/api/v1/apiv3/GetOrderLogs', data, config)
                .then(function(data) {
                    // console.log(data);
                    console.log(data);
                    $scope.orders = data.data.data.Logs;
                    $scope.Total = data.data.data.Total;
                    $scope.isLoading = false;
                    currentPage++;
                })
                 .catch(function(err) {
                    console.log(err);
                    // AlertError(err.data.msg, err.statusText);
                });
        }
        getOrders();

        var items = 30;
        var currentPage = 0;
        $scope.getNextOrders = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            var data = {
                "token": '5a0baf851070b03e4d16f4cb', //$rootScope.ghnToken,
                // "OrderCode": "DB9NKNQ4"
                "FromTime": startTime,
                // "ToTime" : Date.now(),
                "Condition": {
                    // "ShippingOrderID": 56721015,
                    // "CurrentStatus": "ReadyToPick",
                    "CurrentStatus": $scope.selectedStatus.code,
                    "CustomerID": 187464,
                    "OrderCode": $scope.trackingCode
                },
                "Skip": currentPage*items
            }
            $scope.isLoading = true;
            $http.post('https://console.ghn.vn/api/v1/apiv3/GetOrderLogs', data, config)
                .then(function(data) {
                    // console.log(data);
                    // console.log(data);
                    $scope.Total = data.data.data.Total;
                    angular.forEach(data.data.data.Logs, function(item){
                        $scope.orders.push(item);
                        $scope.isLoading = false;
                    })
                    
                    currentPage++;
                })
                 .catch(function(err) {
                    console.log(err);
                    // AlertError(err.data.msg, err.statusText);
                });
        }
    });