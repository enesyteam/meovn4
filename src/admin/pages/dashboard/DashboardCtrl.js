m_admin.controller('DashboardCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, Facebook,
        MFirebaseService, MFacebookService, MUtilitiesService, fanpages, access_token) {
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
    
});