// mShip.controller('ShipCtrl', function (injectedValue) {
//         console.log(injectedValue) // What a time to be alive!

//         // $scope.submit = function(){
//         // 	console.log('submiting...');
//         // }

//      //    var vm = this;

// 	    // $scope.content = "This string was injected from modalcontroller";
// 	    // $scope.modalPreConfirmContent = "";

// 	    // $scope.preConfirm = function () {
// 	    //     $scope.modalPreConfirmContent = "This string was injected by preConfirm";
// 	    //     // return new $q.resolve();
// 	    // };
// });

mShip.controller('ShipCtrl', ['$q',  '$timeout', '$scope', '$filter', 'activeOrder', 'viettel_login_data', 
    'viettel_data', 'MFirebaseService', 'utils', 'MVIETTELService', 'MUtilitiesService',
	function ($q, $timeout, $scope, $filter, activeOrder, viettel_login_data, viettel_data, 
        MFirebaseService, utils,  MVIETTELService, MUtilitiesService) {
    console.log(viettel_data);

    var vm = this;
    // console.log(viettel_data);
    $scope.activeOrder = activeOrder;
    $scope.viettel_districs = viettel_data.districs;
    $scope.viettel_login_data = viettel_login_data;
    // get the province name for each district
    angular.forEach($scope.viettel_districs, (item) => {
      // Todo...
      item.PROVINCE_NAME = getProvince(item.PROVINCE_ID).PROVINCE_NAME;
    })

    angular.forEach(viettel_data.fanpages, (item) => {
        // console.log(item);
      if(item.id == activeOrder.data.data.orderData.page_id){
        $scope.activeOrder.page = item;
        angular.forEach(viettel_data.hubs, (hub) => {
          // Todo...
          if(hub.GROUPADDRESS_ID == item.GROUPADDRESS_ID || hub.GROUPADDRESS_ID == item.VIETTEL_STATION_ID){
            // console.log(hub);
            $scope.current_hub = hub;
          }
        })
      }
    })
    // console.log($scope.viettel_districs);
    // $scope.viettel_wards = null;

    $scope.onDistrictChange = function(district){
        // console.log(district);
        // angular.forEach(, function(district){
        //     $scope.orderData.RECEIVER_DISTRICT
        // })
        $scope.orderData.RECEIVER_PROVINCE = district.PROVINCE_ID;
        $scope.orderData.RECEIVER_DISTRICT = district.DISTRICT_ID;

        $scope.viettel_wards = [];
        // var wards = $filter("filter")(viettel_data.wards, {
        //     DISTRICT_ID: $scope.orderData.RECEIVER_DISTRICT
        // });
        angular.forEach(viettel_data.wards, (item) => {
          // Todo...
          if(item.DISTRICT_ID == $scope.orderData.RECEIVER_DISTRICT){
            $scope.viettel_wards.push(item);
          }
        })

        // $scope.viettel_wards = wards ? wards : null;
        $scope.calculateShippingFee();

    }
    // $scope.calculateShippingFee();

    function getProvince(province_id){
        var province = $filter("filter")(viettel_data.provinces, {
            PROVINCE_ID: province_id
        });
        return province ? province[0] : null;
    }

    var pack_size = {
        width: 10,
        length: 10,
        height: 5,
        weight: 50,
    }

    $scope.pick_at_hub = true;

    $scope.orderData = {
        "ORDER_NUMBER": "", //Mã đơn hàng/ Oder code
        "GROUPADDRESS_ID": $scope.current_hub.GROUPADDRESS_ID, //Mã kho/ Warehouse Id
        "CUS_ID": $scope.current_hub.CUS_ID, //Mã khách hàng/ Customer id
        "DELIVERY_DATE": $filter('date')(Date.now(), "dd/MM/yyyy H:m:s"), //dd/MM/yyyy H:m:s
        "SENDER_FULLNAME": $scope.current_hub.NAME, //Họ tên người gửi/ sender fullname
        "SENDER_ADDRESS": $scope.current_hub.ADDRESS, //Địa chỉ người gửi/ sender address
        "SENDER_PHONE": $scope.current_hub.PHONE, //Điện thoại người gửi/ sender phone
        "SENDER_EMAIL": $scope.viettel_login_data.UserName, //Email người gửi/ sender email
        "SENDER_WARD": $scope.current_hub.WARDS_ID, //Mã phường xã gửi/ sender wards
        "SENDER_DISTRICT": $scope.current_hub.DISTRICT_ID, //Mã Quận/huyện người gửi/ sender district code
        "SENDER_PROVINCE": $scope.current_hub.PROVINCE_ID, //Mã Tỉnh người gửi/ sender province code
        "SENDER_LATITUDE": 0, //Tọa độ gửi hàng/ sender latitude
        "SENDER_LONGITUDE": 0, //Tọa độ gửi hàng/ sender longitude
        "RECEIVER_FULLNAME": $scope.activeOrder.data.data.customerData.realName, //Họ tên người nhận/ receiver fullname
        "RECEIVER_ADDRESS": $scope.activeOrder.data.data.customerData.addresss,
        "RECEIVER_PHONE": $scope.activeOrder.data.data.customerData.recievedPhone,
        "RECEIVER_EMAIL": null,
        "RECEIVER_WARD": null,
        "RECEIVER_DISTRICT": $scope.currentDistrict ? $scope.currentDistrict.DISTRICT_ID : null,
        "RECEIVER_PROVINCE": null,
        "RECEIVER_LATITUDE": 0,
        "RECEIVER_LONGITUDE": 0,
        "PRODUCT_NAME": "VẬT PHẨM PHONG THỦY - HÀNG DỄ VỠ", 
        "PRODUCT_DESCRIPTION": "",
        "PRODUCT_QUANTITY": 1,
        "PRODUCT_PRICE": $scope.activeOrder.data.data.customerData.cod,
        "PRODUCT_WEIGHT": pack_size.weight,
        "PRODUCT_LENGTH": pack_size.length,
        "PRODUCT_WIDTH": pack_size.width,
        "PRODUCT_HEIGHT": pack_size.height,
        "PRODUCT_TYPE": "HH", //Kiểu hàng hóa: / Product type + TH: Thư/ Envelope + HH: Hàng hóa/ Goods
        "ORDER_PAYMENT": 3, 
        /*
            // Loại vận đơn/ Oder type
            1: Không thu tiền/ Uncollect money
            2: Thu hộ tiền cước và tiền hàng/ Collect express fee and price of goods.
            3: Thu hộ tiền hàng/ Collect price of goods
            4: Thu hộ tiền cước/ Collect express fee.
        */
        "ORDER_SERVICE": "VCN",
        "ORDER_SERVICE_ADD": $scope.pick_at_hub ? "GNG" : null,
        "ORDER_VOUCHER": "",
        "ORDER_NOTE": $scope.activeOrder.data.data.customerData.orderNote,
        "MONEY_COLLECTION": $scope.activeOrder.data.data.customerData.cod,
        "MONEY_TOTALFEE": 0,
        "MONEY_FEECOD": 0,
        "MONEY_FEEVAS": 0,
        "MONEY_FEEINSURRANCE": 0,
        "MONEY_FEE": 0,
        "MONEY_FEEOTHER": 0,
        "MONEY_TOTALVAT": 0,
        "MONEY_TOTAL": 0
    }

    $scope.customer_paid = false;
    $scope.customer_check = true;
    $scope.onCustomerCheckChange = function(){
        rebuild_received_name();
    }

    function rebuild_received_name(){
        if($scope.customer_check == true){
            $scope.orderData.RECEIVER_FULLNAME = $scope.orderData.RECEIVER_FULLNAME
            + '-' + parseInt($scope.orderData.MONEY_COLLECTION)/1000 + 'K' + ' CHO XEM HÀNG';
        }
        else{
            $scope.activeOrder.data.data.customerData.realName
            + '-' + parseInt($scope.orderData.MONEY_COLLECTION)/1000 + 'K';
        }
    }
    $scope.onCustomerPaidChange = function(){
        if($scope.customer_paid == true){
            $scope.orderData.MONEY_COLLECTION = parseInt($scope.activeOrder.data.data.customerData.cod) + 
            parseInt($scope.orderData.MONEY_TOTALFEE)
        }
        else{
            $scope.orderData.MONEY_COLLECTION = parseInt($scope.activeOrder.data.data.customerData.cod)
        }
    }

    $scope.content = "This string was injected from modalcontroller";
    $scope.modalPreConfirmContent = $scope.orderData.SENDER_FULLNAME;
    $scope.phone = '0943312354';
    $scope.services = viettel_data.services;

    $scope.onPickAtHubChange = function(){
        console.log($scope.pick_at_hub);
        if($scope.pick_at_hub == true){
            $scope.orderData.ORDER_SERVICE_ADD = 'GNG';
        }
        else{
            $scope.orderData.ORDER_SERVICE_ADD = null;
        }
        $scope.calculateShippingFee();
    }

    // console.log(MVIETTELService);
    $scope.calculateShippingFee = function(){

        if(!$scope.orderData.RECEIVER_DISTRICT){
            return;
        }
        var shipping_fee_data = {
                "SENDER_PROVINCE": $scope.orderData.SENDER_PROVINCE,
                "SENDER_DISTRICT": $scope.orderData.SENDER_DISTRICT,
                "RECEIVER_PROVINCE": $scope.orderData.RECEIVER_PROVINCE,
                "RECEIVER_DISTRICT": $scope.orderData.RECEIVER_DISTRICT,
                "PRODUCT_TYPE": "HH",
                "ORDER_SERVICE": $scope.orderData.ORDER_SERVICE,
                "ORDER_SERVICE_ADD": $scope.orderData.ORDER_SERVICE_ADD,
                "PRODUCT_WEIGHT": $scope.orderData.PRODUCT_WEIGHT,
                "PRODUCT_PRICE": $scope.activeOrder.data.data.customerData.cod,
                "MONEY_COLLECTION": $scope.orderData.MONEY_COLLECTION,
                "PRODUCT_QUANTITY":1,
                "NATIONAL_TYPE": 1
            };
        // console.log(shipping_fee_data);
        $scope.is_calculating_price = true;
        MVIETTELService.calculate_shipping_fee({
            data: shipping_fee_data, 
            token: $scope.viettel_login_data.TokenKey
        }).then(function(response){
            if(response && response.error == true){
                swal.showValidationError(response.message)
                $scope.$apply(function(){
                    $scope.is_calculating_price = null;
                    $scope.orderData.MONEY_TOTALFEE = 0;
                    $scope.fee_data = null;
                })
            }
            else{
                console.log(response)
                swal.resetValidationError();
                // MUtilitiesService.AlertError(response[0].PRICE);
                
                $scope.$apply(function(){
                    $scope.orderData.MONEY_TOTALFEE = response[0].PRICE;
                    $scope.fee_data = response;
                    $scope.is_calculating_price = null;
                })
            }
        })
        .catch(function(err){
            console.log(err);
            $scope.is_calculating_price = null;
            swal.showValidationError(err.statusText)
        })
        .finally(function(){
            $scope.$apply(function(){
                if($scope.customer_paid == true){
                    $scope.orderData.MONEY_COLLECTION = parseInt($scope.activeOrder.data.data.customerData.cod) + 
                    parseInt($scope.orderData.MONEY_TOTALFEE)
                }
                else{
                    $scope.orderData.MONEY_COLLECTION = parseInt($scope.activeOrder.data.data.customerData.cod)
                }
            })
        })
    }
    // $scope.calculateShippingFee();

    function validateOrderData(){
        // validate phone number
        swal.resetValidationError();
        return new Promise(function(resolve, reject){
            utils.validatePhoneNumber(false, 'Số điện thoại khách hàng', $scope.orderData.RECEIVER_PHONE).then(function(){
                if(!$scope.orderData.GROUPADDRESS_ID || $scope.orderData.GROUPADDRESS_ID == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.CUS_ID || $scope.orderData.CUS_ID == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_FULLNAME || $scope.orderData.SENDER_FULLNAME == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_ADDRESS || $scope.orderData.SENDER_ADDRESS == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_PHONE || $scope.orderData.SENDER_PHONE == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_WARD || $scope.orderData.SENDER_WARD == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_DISTRICT || $scope.orderData.SENDER_DISTRICT == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.SENDER_PROVINCE || $scope.orderData.SENDER_PROVINCE == 'undefinded'){
                    reject('Thông tin người gửi không tồn tại. Vui lòng liên hệ quản trị để được trợ giúp.');
                }
                if(!$scope.orderData.RECEIVER_FULLNAME || $scope.orderData.RECEIVER_FULLNAME == 'undefinded'){
                    reject('Vui lòng nhập tên người nhận!');
                }
                if(!$scope.orderData.RECEIVER_ADDRESS || $scope.orderData.RECEIVER_ADDRESS == 'undefinded'){
                    reject('Vui lòng nhập địa chỉ người nhận!');
                } 
                if(!$scope.orderData.RECEIVER_DISTRICT || $scope.orderData.RECEIVER_DISTRICT == 'undefinded'){
                    reject('Vui lòng chọn Quận/Huyện của người nhận!');
                }
                if(!$scope.orderData.RECEIVER_WARD || $scope.orderData.RECEIVER_WARD == 'undefinded'){
                    reject('Vui lòng chọn Phường/Xã của người nhận!');
                }
                if(!$scope.orderData.ORDER_SERVICE || $scope.orderData.ORDER_SERVICE == 'undefinded'){
                    reject('Vui lòng chọn dịch vụ vận chuyển');
                }
                if(!$scope.orderData.MONEY_COLLECTION || $scope.orderData.MONEY_COLLECTION == 'undefinded' 
                    || parseInt($scope.orderData.MONEY_COLLECTION) <= 0 || !angular.isNumber($scope.orderData.MONEY_COLLECTION)){
                    reject('Vui lòng nhập số tiền thu hộ!');
                }
                resolve('pass');
            })
            .catch(function(err){
                reject(err);
            })
        })
    }

    vm.preConfirm = function () {
        return new Promise(function(resolve, reject){
            // $scope.modalPreConfirmContent = "Kiểm tra dữ liệu...";
            validateOrderData().then(function(){
                rebuild_received_name();
                MVIETTELService.create_order({
                    data: $scope.orderData, 
                    token: $scope.viettel_login_data.TokenKey
                }).then(function(response){
                    // console.log(response);
                    resolve({
                        data: $scope.orderData,
                        result: response
                    })
                })
                .catch(function(err){
                    console.log(err);
                    reject(err);
                })
            })
            .catch(function(err){
                swal.showValidationError(err);
                swal.hideLoading();
                // reject('Xem lại dữ liệu nhập');
                // return;
            })
        })
    };
}]);