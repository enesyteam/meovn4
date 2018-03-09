m_admin.controller('GeneralCtrl',
function($rootScope, $scope, $filter, $timeout, cfpLoadingBar, firebaseService) {
	var ref = firebase.database().ref();
    firebaseService.getStatuses().then(function(snapshot){
        $scope.$apply(function(){
            $rootScope.statuses = snapshot.val();
        });
    });

    $rootScope.getSourceColor = function(statusId){
        if(!$rootScope.statuses) return;
        return $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0].color;
    }
     $rootScope.getStatusById = function(statusId){
        if(!$rootScope.statuses) return "null";
        return $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0];
    }
});