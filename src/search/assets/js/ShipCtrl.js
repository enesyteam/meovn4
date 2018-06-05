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

mSearch.controller('ShipCtrl', ['$q','$timeout', 'shipData', 
	function ($q, $timeout, shipData) {
	console.log(shipData);
    var vm = this;
    vm.shipData = shipData;
    vm.code = shipData.viettel_post_code;
    vm.station = shipData.viettel_post_station_name;
}]);