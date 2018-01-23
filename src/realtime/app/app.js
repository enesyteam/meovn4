var mRealtime = angular.module('mRealtime', [
  'ui.router', 
  'ngAnimate',
  'mRealtime.orders',

  'angular-loading-bar',
  'firebase',
  'angular.filter',
  'facebook',
  'infinite-scroll',
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, cfpLoadingBarProvider, FacebookProvider) {
    	$locationProvider.hashPrefix('');
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        cfpLoadingBarProvider.includeSpinner = false;
        // $locationProvider.hashPrefix('');

        // $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when('/','realtime');
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/realtime/home.html",
            });
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

function themeRun($rootScope, appVersion, releaseDate, access_token) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
}