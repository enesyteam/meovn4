var mSale = angular.module('mSale', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'firebase',
  'facebook',
  'mGHN',
  'mFacebook',
  'mFirebase',
  'mUtilities',
	])
    .constant('appVersion', '4.4.0')
    .constant('releaseDate', 'May-20, 2018')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      cfpLoadingBarProvider, FacebookProvider) {
    	$locationProvider.hashPrefix('');
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        cfpLoadingBarProvider.includeSpinner = false;
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/sale/home.html"
                },
            });
    })
    .run(themeRun);


function themeRun($rootScope, appVersion, releaseDate) {
  
}

