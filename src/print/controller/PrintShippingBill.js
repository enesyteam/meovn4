mPrinting.controller('PrintShippingBillCtrl',
    function($rootScope, $scope, $http, $filter, $state, $stateParams, MUtilitiesService, 
        ghn_districs, ghn_token) {
       var orderCode = $stateParams.id;
        
       $scope.created_at = $stateParams.time;

       if(!orderCode){
        MUtilitiesService.AlertError('Mã vận đơn không tồn tại', 'Lỗi');
        return;
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
                // console.log(data);
                $scope.order = data.data.data;

                // get wards
                var wdata = {
                    "token": ghn_token,
                    "DistrictID": data.data.data.ToDistrictID
                }
                $http.post('https://console.ghn.vn/api/v1/apiv3/GetWards', wdata, config)
                .then(function(wdata) {
                    // console.log(wdata);
                    // $scope.Wards = data.data.data.Wards
                        var ward = $filter("filter")(wdata.data.data.Wards, {
                            WardCode: data.data.data.ToWardCode
                        })[0];

                        $scope.ward = ward;
                });
            });

        $scope.getDay = function(date){
            var date = new Date(date);
            return date.getDate();
        }

        $scope.NoteCodes = [{
                code: 'CHOTHUHANG',
                text: 'Cho thử hàng'
            },
            {
                code: 'CHOXEMHANGKHONGTHU',
                text: 'Cho xem hàng không cho thử'
            },
            {
                code: 'KHONGCHOXEMHANG',
                text: 'Không cho xem hàng'
            }
        ];

        $scope.findNoteCode = function(code) {
            if(!code) return null;
            return $filter("filter")($scope.NoteCodes, {
                code: code
            })[0];
        }

        // console.log(ghn_districs)

        $scope.findDistrict = function(DistrictID){
            if(!DistrictID) return null;
            return $filter("filter")(ghn_districs, {
                DistrictID: DistrictID
            })[0];
        }

        

    });