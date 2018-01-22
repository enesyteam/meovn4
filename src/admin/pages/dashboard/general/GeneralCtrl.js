m_admin.controller('GeneralCtrl',
function($rootScope, $scope, $timeout, cfpLoadingBar, firebaseService) {
	$scope.orderChanging = false;
	// var ref = firebase.database().ref();
	//   ref.child('orders').limitToLast(1)
	//     .on('child_changed', function(snap) {
	//         // console.log(snap.val());
	//         $scope.orderChanging = true;
	//         $timeout(function() {
	//         	$scope.orderChanging = false;
	//         }, 10000);
	//     });

});