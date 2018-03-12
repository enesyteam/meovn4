m_admin.controller('DashboardCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, Facebook,
        MFirebaseService, MFacebookService, MUtilitiesService) {
        // get access token
        var getAccessToken = function(){
            $http.get('../assets/access_token.json').
              then(function onSuccess(response) {
                 $rootScope.access_token_arr = response.data;
              }).
              catch(function onError(response) {
               // console.log(response);
              });
        }
        getAccessToken();


        

        // var ref = firebase.database().ref();
    var date = new Date();

    var dateToDisplay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
    // alert(dateToDisplay);
    // GET REPORT FOR TODAY
    $rootScope.finishLoading = false;
    var getReport = function(date){
        $rootScope.todayReport = null;
        $rootScope.todayUsersReport = null;
        $rootScope.finishLoading = false;
        MFirebaseService.getReportForDate(date).then(function(snapshot){
            $scope.$apply(function(){
                $rootScope.todayReport = snapshot.val();
            });
        })
        MFirebaseService.getUsersReportForDate(date).then(function(snapshot){
            $scope.$apply(function(){
                $rootScope.finishLoading = true;
                $rootScope.todayUsersReport = snapshot.val();
            });
        })
    }
    getReport(dateToDisplay);

    $rootScope.selectedDate = null;

    $scope.getReportForSelectedDate = function(date){
        var d = new Date(date);
        var dd = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
        getReport(dd);
    }
       

});