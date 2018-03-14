var meovnAuth = angular.module('meovnAuth', ['firebase']);

meovnAuth.controller('AuthController',
function($scope, $http, $window, $timeout, $filter, $firebaseArray) {

	var ref = firebase.database().ref();
	membersArr = $firebaseArray(ref.child('members'));

	function getAllMembers(){
		return membersArr.$loaded();
	};

	$scope.email = '';
	$scope.password = '';

	var auth = firebase.auth();

  $scope.loginFail = false;
  $scope.errorMes = '';
  $scope.reset = function(){
    $scope.loginFail = false;
  }

	$scope.signIn = function(e){
		e.preventDefault();

		// check authientation
      	// getAllMembers().then(function(members){
      	// 	angular.forEach(members, function(m){
      	// 		if(m.email == $scope.email){
      	// 			if(m.is_admin != 1 && m.is_mod != 1){
      	// 				$window.location = '/realtime';
      	// 				return;
      	// 			}
      	// 		}
      	// 	});
      	// });
		// console.log($scope.email + $scope.password);
		var promise = auth.signInWithEmailAndPassword($scope.email, $scope.password);
		promise.catch(function(){
      $scope.errorMes = e.message;
      $scope.loginFail = true;
    })
	}
	$scope.firebaseUser = null;
    firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
              // console.log('Bạn chưa đăng nhập!');
          } else {
          	$scope.firebaseUser = user;
          	$window.location = '/';
          }
      });

});

