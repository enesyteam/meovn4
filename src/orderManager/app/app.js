var mOrderManager = angular.module('mOrderManager', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'angularMoment'
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    	$locationProvider.hashPrefix('');

        // $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(true);

        // $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when('/','/orders');
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/orderManager/home.html",
            })
            .state('home.orders', {
                url: '/orders',
                // controller: 'MainCtrl',
                templateUrl: "/src/orderManager/pages/orders/orders.html",
            });
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

mOrderManager.filter('reverse', function() {
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

function themeRun($rootScope, appVersion, releaseDate, access_token) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
}





