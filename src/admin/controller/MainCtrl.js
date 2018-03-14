m_admin.controller('MainCtrl',
    function($rootScope, $window, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, 
        cfpLoadingBar, Facebook, MFirebaseService, MFacebookService, MUtilitiesService) {

        $rootScope.signout = function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }, function(error) {
                // An error happened.
            });
        }

        $rootScope.sellers = [];
        firebase.auth().onAuthStateChanged(function(user) {
            // console.log(user);
            // alert('change user');
            if (!user) {
                console.log('Bạn chưa đăng nhập!');
                $window.location = '/login';
            } else {

                // console.log(user.email);
                $rootScope.firebaseUser = user;
                firebaseService.getAllMembers().then(function(members) {

                        angular.forEach(members.val(), function(member){
                            if(member.is_seller == 1){
                                $scope.$apply(function(){
                                    $rootScope.sellers.push(member);
                                });
                            }
                            

                            if(member.email == user.email){
                                if(member.is_admin !== 1 && member.is_mod !== 1){
                                    // console.log(member);
                                    $window.location = '/permissions';
                                }
                                // console.log(value);
                                 $scope.$apply(function(){
                                    $rootScope.currentMember = member;
                                });
                            }
                        })
                });
            }
        });
        // // get access token
        // var getAccessToken = function(){
        //     $http.get('../assets/access_token.json').
        //       then(function onSuccess(response) {
        //          $rootScope.access_token_arr = response.data;
        //       }).
        //       catch(function onError(response) {
        //        // console.log(response);
        //       });
        // }
        // getAccessToken();

    });