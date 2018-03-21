m_admin.controller('DashboardCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, Facebook,
        MFirebaseService, MFacebookService, MUtilitiesService, fanpages) {
        // get access token
        // console.log(fanpages);
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

        $scope.findPageById = function(id) {
            return $filter("filter")(fanpages, {
                id: id
            })[0];
        }


        

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
                // $rootScope.finishLoading = true;
                $rootScope.todayUsersReport = snapshot.val();
            });
        })
        MFirebaseService.getPagesReportForDate(date).then(function(snapshot){
            $rootScope.todayPagesReport = [];
            $scope.$apply(function(){
                // $rootScope.finishLoading = true;
                angular.forEach(snapshot.val(), function(value, key){
                    var page = {
                        id: key,
                        totalCustomers : value.totalCustomers,
                        totalsuccess : value.totalsuccess
                    }
                    $rootScope.todayPagesReport.push(page);
                })
                console.log($rootScope.todayPagesReport);
            });
        })

        MFirebaseService.getShippingReportForDate(date).then(function(snapshot){
            $scope.$apply(function(){
                $rootScope.finishLoading = true;
                $rootScope.todayShippingReport = snapshot.val();
            });
        })
    }
    getReport(dateToDisplay);

    $rootScope.selectedDate = dateToDisplay;

    $scope.getReportForSelectedDate = function(date){
        if(!date){
            getReport(dateToDisplay);
            return;
        }
        var d = new Date(date);
        var dd = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
        getReport(dd);
    }

    $scope.onAssignMoreForUser = function(userId){
        MUtilitiesService.AlertError('Chức năng này sẽ được bổ sung trong phiển bản release tiếp theo', 'Thông báo');
    }
    $scope.onReleaseMoreForUser = function(userId){
        MUtilitiesService.AlertError('Chức năng này sẽ được bổ sung trong phiển bản release tiếp theo', 'Thông báo');
    }  

});