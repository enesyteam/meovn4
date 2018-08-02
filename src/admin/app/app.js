var m_admin = angular.module('m_admin', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'angular-loading-bar',
  'slick',
  // 'localytics.directives', // chosen
  'firebase',
  'angular.filter',
  'facebook',
  'toastr',
  '720kb.datepicker',
  'ngDialog',
  'ngFileUpload',
  'infinite-scroll',
  // 'infinite-scroll',
  'angularMoment',
  'moment-picker',
  'angularSpinners',
  
  'mGHN',
  'mFacebook',
  'mFirebase',
  'mUtilities',
  'metricsgraphics',

  'm_admin.dashboard',
  'm_admin.settings',
  'm_admin.report',
  'm_admin.sources',
  'm_admin.orders',
  'm_admin.mix',
  ])
  .constant('appVersion', '4.3.0')
  .constant('releaseDate', 'Nov-20, 2017')
  .constant('access_token', 'EAAPbgSrDvvwBADMUsZB2k9FeG0ZB85XDBiX7LPIk0riVlwt8ulSjcl2sdgfxqS7CitKpoYYIfxaFmYu4OXzasmj0UFkEZAIOt1XDZCQi8h3kIb5uRiHxZBW8l32amfEG9vG0uT1OAPoBQd53g1iskscMjJiCvNmynV68AWSZBl9TT5ffG0ZAhZBT')
  .config(function($stateProvider, $locationProvider, $urlRouterProvider, cfpLoadingBarProvider, FacebookProvider){
    var myAppId = '1085772744867580';
    FacebookProvider.init(myAppId);
        
      cfpLoadingBarProvider.includeSpinner = false;
        $locationProvider.hashPrefix('');
        // use the HTML5 History API
        // $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/admin");
        $urlRouterProvider.when('/admin','/admin/dashboard/general');
        $urlRouterProvider.when('/','admin');
        $stateProvider
        .state('home',{
            url: '/admin',
                controller : 'MainCtrl',
                templateUrl: "src/admin/pages/home.html",
                resolve : {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                    fanpages: function(MFirebaseService){
                      return MFirebaseService.get_fanpages().then(function(response){
                        return response;
                      });
                    },
                    telesales: function(MFirebaseService){
                      return MFirebaseService.getAllSellers().then(function(response){
                        return response;
                      })
                    },
                    statuses: function(MFirebaseService){
                      return MFirebaseService.getStatuses().then(function(response){
                        return response;
                      })
                    },
                    reportData: function(MFirebaseService){
                      return MFirebaseService.getReportForChart().then(function(response){
                          return response;
                      })
                    }
                }
              });   

    })
  .run(themeRun);

angular.module('m_admin').filter('cut', function () {
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

function themeRun($rootScope, appVersion, releaseDate, access_token, cfpLoadingBar, moment){
    moment.locale('vi');
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;

    cfpLoadingBar.start();

    // $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    //   if(toState.resolve){
    //     $rootScope.isLoading = true;
    //     cfpLoadingBar.start();
    //   }
    // });

    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
      if(toState.resolve){
        $rootScope.isLoading = false;
        cfpLoadingBar.complete();
      }
    });
  }

m_admin.directive('searchEnter', function () {
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

m_admin.directive('dialogCommentEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.dialogCommentEnter);
                    // scope.searchOrder();
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    // scope.$eval(attrs.dialogCommentEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});

m_admin.directive('addOrderEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.addOrderEnter);
                    // scope.searchOrder();
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.addOrderEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});

m_admin.filter('quickReplyFilter', function () {
  return function(replies, input) {

    return replies.filter(function (item) {
      if(!input){
        return item;
      }
      // console.log(input);
      if(input.startsWith("/") && input.length == 1){
        return item;
      }

      if(item.key.indexOf(input.substr(1)) !== -1){
        return item;
      }
      else{
        return null;
      }
      
    });
  }
});

m_admin.filter('pushOrdersFilter', function () {
  return function(orders, status) {
    // console.log(status);
    return orders.filter(function (item) {
      if(!status){
        return item;
      }
      else{
        return item.status_id == status.id
      }
    });
  }
});

m_admin.directive("select2", ["$timeout", "$parse", function(c, b) {
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