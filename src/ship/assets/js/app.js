var mShip = angular.module('mShip', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'firebase',
  'facebook',
  'infinite-scroll',
  'toastr',
  'ngDialog',
  'angular-sweet-alert',
  'ngPrint',
  'AngularPrint',
  'moment-picker',
  // 'dynamicNumber',
  'ngCsv',
  'mFacebook',
  'mFirebase',
  'mUtilities',
  'utils',
  'mViettel',
	])
    .constant('appVersion', '4.4.0')
    .constant('releaseDate', 'May-20, 2018')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      FacebookProvider) {
    	$locationProvider.hashPrefix('');
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        // cfpLoadingBarProvider.includeSpinner = false;
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/ship/home.html",
                resolve: {
                  telesales: function(MFirebaseService){
                    return MFirebaseService.getAllMembers().then(function(response){
                      return response;
                    })
                  },
                  fanpages: function(MFirebaseService){
                      return MFirebaseService.get_fanpages().then(function(response){
                        return response;
                      });
                    },
                  viettel_stations: function(MFirebaseService) {
                        return MFirebaseService.get_viettel_stations().then(function(response){
                            // console.log(response);
                            return response;
                        })
                    },
                  viettel_provinces: function($http){
                    return $http.get('../assets/viettel_provinces.json').
                      then(function onSuccess(response) {
                         return response.data;
                      }).
                      catch(function onError(response) {
                       return null;
                      });
                    // return MVIETTELService.get_viettel_provinces().then(function(response){
                    //     return response;
                    // })
                  },
                  viettel_districs: function($http){
                    // return MVIETTELService.get_viettel_districs().then(function(response){
                    //     return response;
                    // })
                    // .catch(err => {
                    //   console.log(err)
                    // })
                    return $http.get('../assets/viettel_districs.json').
                      then(function onSuccess(response) {
                         return response.data;
                      }).
                      catch(function onError(response) {
                       return null;
                      });
                  },
                  viettel_wards: function($http){
                    // return MVIETTELService.get_viettel_wards().then(function(response){
                    //     return response;
                    // })
                    return $http.get('../assets/viettel_wards.json').
                      then(function onSuccess(response) {
                         return response.data;
                      }).
                      catch(function onError(response) {
                       return null;
                      });
                  },
                  viettel_services: function($http){
                    // return MVIETTELService.get_services({ "TYPE": 1 }).then(function(response){
                    //     return response;
                    // })
                    return $http.get('../assets/viettel_services.json').
                      then(function onSuccess(response) {
                        // console.log(response);
                         return response.data;
                      }).
                      catch(function onError(response) {
                       return null;
                      });
                  },
                  viettel_extra_services: function($http){
                    // return MVIETTELService.get_extra_services().then(function(response){
                    //     return response;
                    // })
                    return $http.get('../assets/viettel_extra_services.json').
                      then(function onSuccess(response) {
                        // console.log(response);
                         return response.data;
                      }).
                      catch(function onError(response) {
                       return null;
                      });
                  },

                }
                }
            );
    })
    .run(themeRun);


function themeRun($window, $rootScope, appVersion, $timeout, releaseDate, MFirebaseService, MUtilitiesService) {

    // $timeout(function() {
    //     console.log('hehhe');
    // }, 10000);
    /*
    * Auth
    */
    // $rootScope.members = [];
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // alert('Bạn chưa đăng nhập!');
            $window.location = '/login';
            // return;
        } else {
            // console.log(user);
            MFirebaseService.getMemberByEmail(user.email).then(function(member){
                MUtilitiesService.AlertSuccessful('You are logged in as "' + member.email + '"')
                $rootScope.currentMember = member;
                if(!member.is_admin && member.shipping_editor !== 1){
                  // MUtilitiesService.AlertWarning('Đang chuyển hướng đến trang tìm kiếm...');
                  $window.location = '/tim-kiem';
                }
            });

            // 
            // firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            //     // console.log(idToken);
            //     firebase.auth().verifyIdToken(idToken)
            //       .then(function(decodedToken) {
            //         var uid = decodedToken.uid;
            //         console(uid)
            //         // ...
            //       }).catch(function(error) {
            //         // Handle error
            //       });
            //   // ...
            // }).catch(function(error) {
            //   // Handle error
            // });


            // $rootScope.current_member = user;
            // MFirebaseService.getAllActiveMembers().then(function(members) {

            //     // $scope.$apply(function() {
            //     //     $rootScope.members = members.val();
            //     // });

            //     // console.log($rootScope.sellers);

            //     angular.forEach(members.val(), function(value) {
            //         $rootScope.members.push(value);
            //         if (value.email == user.email) {

            //             // console.log(value);
            //             $scope.$apply(function() {
            //                 $rootScope.currentMember = value;
            //             });
            //         }
            //     });
            // });
        }
    });
}


mShip.directive('searchEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.searchEnter);
                    // scope.searchOrder();
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.searchEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});

mShip.filter('reverse', function() {
      function toArray(list) {
         var k, out = [];
         if( list ) {
            if( angular.isArray(list) ) {
               out = list;
            }
            else if( typeof(list) === 'object' ) {
               for (k in list) {
                  if (list.hasOwnProperty(k)) { out.push(list[k]); }
               }
            }
         }
         return out;
      }
      return function(items) {
         return toArray(items).slice().reverse();
      };
   });

mShip.directive('commentEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.commentEnter);
                    // scope.searchOrder();
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.commentEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});

mShip.directive("select2", ["$timeout", "$parse", function(c, b) {
    return {
        restrict: "AC",
        require: "ngModel",
        link: function(i, e, d) {
            c(function() {
                e.select2({
                    width: "100%"
                });
                e.select2Initialized = true
            });
            var h = function() {
                if (!e.select2Initialized) {
                    return
                }
                c(function() {
                    e.trigger("change")
                })
            };
            var g = function() {
                if (!e.select2Initialized) {
                    return
                }
                c(function() {
                    e.select2("destroy");
                    e.select2({
                        width: "100%"
                    })
                })
            };
            i.$watch(d.ngModel, h);
            if (d.ngOptions) {
                var f = d.ngOptions.match(/ in ([^ ]*)/)[1];
                i.$watch(f, g)
            }
            if (d.ngDisabled) {
                i.$watch(d.ngDisabled, h)
            }
        }
    }
}]);

