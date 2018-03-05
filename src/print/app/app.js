var mPrinting = angular.module('mPrinting', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'infinite-scroll',
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    	$locationProvider.hashPrefix('');

        // $locationProvider.hashPrefix('');

        // $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when('/','realtime');
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/print/home.html",
            });
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

function themeRun($rootScope, appVersion, releaseDate, access_token) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
}





