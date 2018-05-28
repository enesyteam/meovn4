// mShip.controller('ShipCtrl', function (injectedValue) {
//         console.log(injectedValue) // What a time to be alive!

//         // $scope.submit = function(){
//         // 	console.log('submiting...');
//         // }

//      //    var vm = this;

// 	    // vm.content = "This string was injected from modalcontroller";
// 	    // vm.modalPreConfirmContent = "";

// 	    // vm.preConfirm = function () {
// 	    //     vm.modalPreConfirmContent = "This string was injected by preConfirm";
// 	    //     // return new $q.resolve();
// 	    // };
// });

mShip.controller('ShipCtrl', ['$q', '$scope', '$timeout', '$filter', 'activeOrder', 'viettel_login_data', 
    'viettel_data', 'MFirebaseService', 'utils', 'MVIETTELService', 'MUtilitiesService',
	function ($q, $timeout, $scope, $filter, activeOrder, viettel_login_data, viettel_data, 
        MFirebaseService, utils,  MVIETTELService, MUtilitiesService) {

    // console.log(activeOrder);

    var vm = this;
    // console.log(viettel_data);
    vm.activeOrder = activeOrder;
    vm.viettel_districs = viettel_data.districs;
    vm.viettel_login_data = viettel_login_data;
    // get the province name for each district
    angular.forEach(vm.viettel_districs, (item) => {
      // Todo...
      item.PROVINCE_NAME = getProvince(item.PROVINCE_ID).PROVINCE_NAME;
    })

    angular.forEach(viettel_data.fanpages, (item) => {
        // console.log(item);
      if(item.id == activeOrder.data.data.orderData.page_id){
        vm.activeOrder.page = item;
        angular.forEach(viettel_data.hubs, (hub) => {
          // Todo...
          if(hub.GROUPADDRESS_ID == item.GROUPADDRESS_ID){
            // console.log(hub);
            vm.current_hub = hub;
          }
        })
      }
    })
    // console.log(vm.viettel_districs);
    // vm.viettel_wards = null;

    vm.onDistrictChange = function(district){
        console.log(district);
        // angular.forEach(, function(district){
        //     vm.orderData.RECEIVER_DISTRICT
        // })
        vm.orderData.RECEIVER_PROVINCE = district.PROVINCE_ID;
        vm.orderData.RECEIVER_DISTRICT = district.DISTRICT_ID;

        vm.viettel_wards = [];
        // var wards = $filter("filter")(viettel_data.wards, {
        //     DISTRICT_ID: vm.orderData.RECEIVER_DISTRICT
        // });
        angular.forEach(viettel_data.wards, (item) => {
          // Todo...
          if(item.DISTRICT_ID == vm.orderData.RECEIVER_DISTRICT){
            vm.viettel_wards.push(item);
          }
        })

        // vm.viettel_wards = wards ? wards : null;
        vm.calculateShippingFee();

    }
    // vm.calculateShippingFee();

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
        weight: 100,
    }

    vm.orderData = {
        "ORDER_NUMBER": "", //Mã đơn hàng/ Oder code
        "GROUPADDRESS_ID": vm.current_hub.GROUPADDRESS_ID, //Mã kho/ Warehouse Id
        "CUS_ID": vm.current_hub.CUS_ID, //Mã khách hàng/ Customer id
        "DELIVERY_DATE":"01/10/2017 18:45:23", //dd/MM/yyyy H:m:s
        "SENDER_FULLNAME": vm.current_hub.NAME, //Họ tên người gửi/ sender fullname
        "SENDER_ADDRESS": vm.current_hub.ADDRESS, //Địa chỉ người gửi/ sender address
        "SENDER_PHONE": vm.current_hub.PHONE, //Điện thoại người gửi/ sender phone
        "SENDER_EMAIL": vm.viettel_login_data.UserName, //Email người gửi/ sender email
        "SENDER_WARD": vm.current_hub.WARDS_ID, //Mã phường xã gửi/ sender wards
        "SENDER_DISTRICT": vm.current_hub.DISTRICT_ID, //Mã Quận/huyện người gửi/ sender district code
        "SENDER_PROVINCE": vm.current_hub.PROVINCE_ID, //Mã Tỉnh người gửi/ sender province code
        "SENDER_LATITUDE": 0, //Tọa độ gửi hàng/ sender latitude
        "SENDER_LONGITUDE": 0, //Tọa độ gửi hàng/ sender longitude
        "RECEIVER_FULLNAME": vm.activeOrder.data.data.customerData.realName, //Họ tên người nhận/ receiver fullname
        "RECEIVER_ADDRESS": vm.activeOrder.data.data.customerData.addresss,
        "RECEIVER_PHONE": vm.activeOrder.data.data.customerData.recievedPhone,
        "RECEIVER_EMAIL": null,
        "RECEIVER_WARD": null,
        "RECEIVER_DISTRICT": vm.currentDistrict ? vm.currentDistrict.DISTRICT_ID : null,
        "RECEIVER_PROVINCE": null,
        "RECEIVER_LATITUDE": 0,
        "RECEIVER_LONGITUDE": 0,
        "PRODUCT_NAME": "Vật phẩm phong thủy", 
        "PRODUCT_DESCRIPTION": "",
        "PRODUCT_QUANTITY": 1,
        "PRODUCT_PRICE": null,
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
        "ORDER_SERVICE": "SCOD",
        "ORDER_SERVICE_ADD": "GHG",
        "ORDER_VOUCHER": "",
        "ORDER_NOTE": vm.activeOrder.data.data.customerData.orderNote,
        "MONEY_COLLECTION": vm.activeOrder ? vm.activeOrder.data.data.customerData.cod : 0,
        "MONEY_TOTALFEE": 0,
        "MONEY_FEECOD": 0,
        "MONEY_FEEVAS": 0,
        "MONEY_FEEINSURRANCE": 0,
        "MONEY_FEE": 0,
        "MONEY_FEEOTHER": 0,
        "MONEY_TOTALVAT": 0,
        "MONEY_TOTAL": 0
    }

    vm.content = "This string was injected from modalcontroller";
    vm.modalPreConfirmContent = vm.orderData.SENDER_FULLNAME;
    vm.phone = '0943312354';
    vm.services = viettel_data.services;

    // console.log(MVIETTELService);
    vm.calculateShippingFee = function(){
        if(!vm.orderData.RECEIVER_DISTRICT){
            return;
        }
        vm.is_calculating_price = true;
        MVIETTELService.calculate_shipping_fee({
            data: {
                "SENDER_PROVINCE": vm.orderData.SENDER_PROVINCE,
                "SENDER_DISTRICT": vm.orderData.SENDER_DISTRICT,
                "RECEIVER_PROVINCE": 25,
                "RECEIVER_DISTRICT": vm.orderData.RECEIVER_DISTRICT,
                "PRODUCT_TYPE": "HH",
                "ORDER_SERVICE": vm.orderData.ORDER_SERVICE,
                "ORDER_SERVICE_ADD": "",
                "PRODUCT_WEIGHT": vm.orderData.PRODUCT_WEIGHT,
                "PRODUCT_PRICE": vm.activeOrder.data.data.customerData.cod,
                "MONEY_COLLECTION": vm.orderData.MONEY_COLLECTION,
                "PRODUCT_QUANTITY":1,
                "NATIONAL_TYPE": 1
            }, 
            token: vm.viettel_login_data.TokenKey
        }).then(function(response){
            if(response){
                // console.log(response)
                MUtilitiesService.AlertError(response[0].PRICE);
                vm.orderData.MONEY_TOTALFEE = response[0].PRICE;
                    vm.is_calculating_price = false;
            }
        })
        .catch(function(){
            vm.is_calculating_price = false;
        })
    }
    // vm.calculateShippingFee();

    function validateOrderData(){
        // validate phone number
        return new Promise(function(resolve, reject){
            utils.validatePhoneNumber(false, 'Số điện thoại khách hàng', vm.orderData.RECEIVER_PHONE).then(function(){
                resolve('pass');
            })
            .catch(function(err){
                reject(err);
            })
        })
    }

    vm.preConfirm = function () {
        return new Promise(function(resolve, reject){
            // vm.modalPreConfirmContent = "Kiểm tra dữ liệu...";
            validateOrderData().then(function(){
                // create order
                // vm.modalPreConfirmContent = "Đang khởi tạo đơn hàng, vui lòng chờ...";
                console.log(vm.orderData);
                $timeout(function() {
                    if(vm.orderData.RECEIVER_PHONE !== '0943312354'){
                        // các lỗi không thể tạo đơn do API của Logistics
                        reject('Đã có lỗi xảy ra khi kết nối với API của đơn vị vận chuyển. Mã lỗi #A11C142-8');
                    }
                    else{
                        resolve('Đã tạo thành công đơn hàng của ' + vm.orderData.RECEIVER_FULLNAME + '.');
                    }           
                }, 3000);
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