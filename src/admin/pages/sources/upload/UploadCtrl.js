m_admin.controller('UploadCtrl',
function($rootScope, $scope, $http, $rootScope, $timeout, cfpLoadingBar, firebaseService, Facebook) {
	$rootScope.imageFiles = [];
    let imageFilesRef = firebase.database().ref().child('uploads').child('products').child('images');
    imageFilesRef.on('child_added', snapshot => {
        
          $timeout(function() {
            $scope.$apply(function(){
              $rootScope.imageFiles.push(snapshot.val());
            })
          })
    });
});