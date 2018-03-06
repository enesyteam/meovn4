m_admin.controller('MainCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, 
        cfpLoadingBar, Facebook, MUtilitiesService) {
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

    $rootScope.myPagingFunction = function(){
        console.log('scrolling...');
    }

    $rootScope.sellers = [];
    firebaseService.getMembers().then(function(snapshot){
        $scope.$apply(function(){
            angular.forEach(snapshot.val(), function(member){
                if(member.is_seller == 1){
                    $rootScope.sellers.push({
                        last_name : member.last_name,
                        id: member.id,
                        selected: false,
                    });
                }
            });
        });
    });

        // GET REPORT FOR TODAY
        $rootScope.finishLoading = false;
        firebaseService.getTodayReport().then(function(snapshot){
            $scope.$apply(function(){
                // $scope.finishLoading = true;
                $rootScope.todayReport = snapshot.val();
            });

            // get users report
            firebaseService.getTodayUsersReport().then(function(snapshot){
                $scope.$apply(function(){
                    $rootScope.finishLoading = true;
                    $rootScope.todayUsersReport = snapshot.val();
                });
            });
        })

    });