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
                templateUrl: "/src/ship/home.html",
                resolve: {
                  telesales: function(MFirebaseService){
                    return MFirebaseService.getAllSellers().then(function(response){
                      return response;
                    })
                  },
                }
                }
            );
    })
    .run(themeRun);


function themeRun($rootScope, appVersion, releaseDate) {
  $.fn.modal.Constructor.prototype.enforceFocus = function() {};
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

