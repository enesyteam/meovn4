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

mSale.controller('ShipCtrl', ['$q','$timeout', 'activeOrder', 'ghn_districs', 'MFirebaseService', 
	function ($q, $timeout, activeOrder, ghn_districs, MFirebaseService) {
	console.log(ghn_districs);


    var vm = this;
    vm.activeOrder = activeOrder;
    vm.ghn_districs = ghn_districs;

    vm.content = "This string was injected from modalcontroller";
    vm.modalPreConfirmContent = "";
    vm.phone = '0943312354';
    vm.services = [
    	{
    		id: 1,
    		name: 'SCOD Giao hàng thu tiền',
    		short_name: 'SCOD'
    	},
    	{
    		id: 2,
    		name: 'PTN Phát trong ngày nội tỉnh',
    		short_name: 'PTN'
    	},
    	{
    		id: 3,
    		name: 'PHT Phát hỏa tốc nội tỉnh',
    		short_name: 'PHT'
    	},
    	{
    		id: 4,
    		name: 'PHS Phát hôm sau nội tỉnh',
    		short_name: 'PHS'
    	},
    	{
    		id: 5,
    		name: 'VCN Chuyển phát nhanh',
    		short_name: 'VCN'
    	},
    	{
    		id: 6,
    		name: 'VTK Tiết kiệm',
    		short_name: 'VTK'
    	},
    	{
    		id: 7,
    		name: 'V60 Dịch vụ Nhanh 60h',
    		short_name: 'V60'
    	},
    	{
    		id: 8,
    		name: 'VVT Dịch vụ vận tải',
    		short_name: 'VVT'
    	},
    	{
    		id: 9,
    		name: 'VHT Phát Hỏa tốc',
    		short_name: 'VHT'
    	},
    	{
    		id: 10,
    		name: 'VBS Nhanh theo hộp',
    		short_name: 'VBS'
    	},
    	{
    		id: 11,
    		name: 'VBE Tiết kiệm theo hộp',
    		short_name: 'VBE'
    	}
    ]

    vm.preConfirm = function () {
        vm.modalPreConfirmContent = "Kiểm tra dữ liệu...";

        if(!vm.activeOrder.data.data.customerData.recievedPhone || 
			vm.activeOrder.data.data.customerData.recievedPhone.length < 3){
			swal.showValidationError(
	          'Vui lòng kiểm tra lại số điện thoại'
	        )
			swal.hideLoading();
			vm.modalPreConfirmContent = "";
			return;
		}

        return new Promise(function(resolve, reject){
        	vm.modalPreConfirmContent = "Đang khởi tạo đơn hàng, vui lòng chờ...";
        	console.log(activeOrder);
        	$timeout(function() {
        		if(vm.activeOrder.data.data.customerData.recievedPhone !== '0943312354'){
        			// các lỗi không thể tạo đơn do API của Logistics
        			reject('Đã có lỗi xảy ra khi kết nối với API của đơn vị vận chuyển. Mã lỗi #A11C142-8');
        		}
        		else{
        			resolve('Đã tạo thành công đơn hàng của ' + vm.activeOrder.data.data.customerData.realName + '.');
        		}     		
        	}, 3000);
        })
    };

}]);