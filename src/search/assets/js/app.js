var mSearch = angular.module('mSearch', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'firebase',
  'facebook',
  'infinite-scroll',
  'toastr',
  'ngDialog',
  'angular-sweet-alert',
  'mAuth',
  'mFacebook',
  'mFirebase',
  'mUtilities'
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
                templateUrl: "/src/search/home.html",
                resolve: {
                    
                    telesales: function(MFirebaseService){
                        return MFirebaseService.getAllMembers().then(function(response){
                          return response;
                        })
                      },
                    statuses: function(MFirebaseService){
                        return MFirebaseService.getStatuses().then(function(response){
                            console.log(response);
                            return response;
                        })
                    },
                    fanpages: function(MFirebaseService){
                        return MFirebaseService.get_fanpages().then(function(response){
                            return response;
                          });
                        },
                    },

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
                $rootScope.currentMember = member;
                MUtilitiesService.AlertSuccessful('You are logged in as "' + member.email + '"')
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

mSearch.filter('reverse', function() {
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

angular.module('mSearch').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });


mSearch.directive('searchEnter', function () {
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

mSearch.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.hover(function(){
                // on mouseenter
                element.tooltip('show');
            }, function(){
                // on mouseleave
                element.tooltip('hide');
            });
        }
    };
});

mSearch.directive('commentEnter', function () {
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

mSearch.directive("select2", ["$timeout", "$parse", function(c, b) {
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

