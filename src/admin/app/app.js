var m_admin = angular.module('m_admin', [
  'ui.router', 
  'ngAnimate',
  'm_admin.dashboard',
  'm_admin.settings',
  'm_admin.report',
  'm_admin.sources',
  'm_admin.orders',
  'angular-loading-bar',
  'firebase',
  'angular.filter',
  'facebook',
  ])
  .constant('appVersion', '3.0.0')
  .constant('releaseDate', 'Nov-20, 2017')
  .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
  .config(function($stateProvider, $locationProvider, $urlRouterProvider, cfpLoadingBarProvider, FacebookProvider){
    var myAppId = '1085772744867580';
    FacebookProvider.init(myAppId);
        
      cfpLoadingBarProvider.includeSpinner = false;
        $locationProvider.hashPrefix('');
        // use the HTML5 History API

        $urlRouterProvider.otherwise("/admin");
        $urlRouterProvider.when('/admin','/admin/dashboard/general');
        $urlRouterProvider.when('/','admin');
        $stateProvider
        .state('home',{
            url: '/admin',
                controller : 'MainCtrl',
                templateUrl: "src/admin/pages/home.html"
              });

    })
  .run(themeRun);

function themeRun($rootScope, appVersion, releaseDate, access_token){
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
    $rootScope.successArr = [];
    $rootScope.notCalledArr = [];
    $rootScope.todayArr = [];
    $rootScope.othersArr = [];
  }