mPrinting.controller('PrintShippingBillCtrl',
    function($rootScope, $scope, $http, $filter, $state, $stateParams, MUtilitiesService) {
       var orderCode = $stateParams.id;

       if(!orderCode){
        MUtilitiesService.AlertError('Mã vận đơn không tồn tại', 'Lỗi');
       }

        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        var data = {
                "token": "5a0baf851070b03e4d16f4cb",
                "OrderCode": orderCode
            }

            $http.post('https://console.ghn.vn/api/v1/apiv3/OrderInfo', data, config)
            .then(function (data) {
                console.log(data);
                $scope.order = data.data.data;
            });

        $scope.getDay = function(date){
            var date = new Date(date);
            return date.getDate();
        }

    });