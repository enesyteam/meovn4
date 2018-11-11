var mNavigation = angular.module('mNavigation', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',

  'facebook',


    'toastr',
    '720kb.datepicker',
    'ngCsv',
    'mGHN',
    'mFacebook',
    'mFirebase',
    'mUtilities',
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, FacebookProvider) {
    	$locationProvider.hashPrefix('');

      var myAppId = '1085772744867580';
    FacebookProvider.init(myAppId);

        // $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(true);

        // $urlRouterProvider.otherwise("/");
        $urlRouterProvider.when('/','/report');

        $stateProvider
            .state('search', {
                url: '/search',
                controller: 'MainCtrl',
                templateUrl: "/src/navigation/pages/search/index.html",
            })
            .state('search.result', {
                url: '/result',
                controller: 'MainCtrl',
                templateUrl: "/src/navigation/pages/search/result.html",
            })
            .state('report', {
                url: '/report',
                controller: 'ReportCtrl',
                templateUrl: "/src/navigation/pages/report/index.html",
                resolve: {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                  telesales: function(MFirebaseService){
                    return MFirebaseService.getAllSellers().then(function(response){
                      return response;
                    })
                  },
                  fanpages: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_fanpages().then(function(response){
                        // console.log(response);
                        return response;
                      });
                    }
                },
            });
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

mNavigation.filter('reverse', function() {
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

function themeRun($rootScope, appVersion, releaseDate, access_token, MFirebaseService, MUtilitiesService) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // alert('Bạn chưa đăng nhập!');
            // $window.location = '/login';
            // return;
        } else {
            // console.log(user);
            MFirebaseService.getMemberByEmail(user.email).then(function(member){
                MUtilitiesService.AlertSuccessful('You are logged in as "' + member.email + '"');

                $rootScope.currentMember = member;
                $rootScope.activeFilter = {
                    filter_status_id: null,
                    filter_seller_id: $rootScope.currentMember.id,
                }
            });
        }
    });
}

mNavigation.directive('searchEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.searchEnter);
                    // scope.search();
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
