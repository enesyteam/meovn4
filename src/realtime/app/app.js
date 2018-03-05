var mRealtime = angular.module('mRealtime', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  'localytics.directives',
  'mRealtime.orders',

  'angular-loading-bar',
  'firebase',
  'angular.filter',
  'facebook',
  'infinite-scroll',
  // 'ui.scroll',
  // 'snackbar',
  'toastr',
  'ngFileUpload'
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      cfpLoadingBarProvider, FacebookProvider) {
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

function themeRun($rootScope, appVersion, releaseDate, access_token, cfpLoadingBar) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;

        // show loading
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      if(toState.resolve){
        $rootScope.isLoading = true;
        cfpLoadingBar.start();
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
      if(toState.resolve){
        $rootScope.isLoading = false;
        cfpLoadingBar.complete();
        
      }
    });
}

mRealtime.filter('reverse', function() {
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

angular.module('mRealtime').directive('ngFileModel', ['$parse', function ($parse, $sce) {
     return {
         restrict: 'A',
         link: function (scope, element, attrs) {
             var model = $parse(attrs.ngFileModel);
             //var isMultiple = attrs.multiple;
             var modelSetter = model.assign;
             var value = '';
             element.bind('change', function () {
                 angular.forEach(element[0].files, function (item) {
                     //To check FileName contains special character
                     if (!(/[#%\&*{}[\]<>?/|:~]/.test(item.name))) {
                         //To check FileName already exists
                         if (!(scope.attachedFile.filter(function (e) { return e.FileName == item.name; }).length > 0)) {
                             var reader = new FileReader();
                             reader.filename = item.name;
                             var values = {
                                 FileName: item.name,
                                 ServerRelativeUrl: URL.createObjectURL(item), //$sce.trustAsResourceUrl(URL.createObjectURL(item)), 
                                 _file: item,
                                 newlyAdded: true
                             };
                             scope.fileAlreadyExists = false;
                             scope.invalidFileName = false;
                             scope.attachedFile.push(values);
                         }
                         else
                             scope.fileAlreadyExists = true;
                     }
                     else {
                         scope.invalidFileName = true;
                     }
                 });
                 scope.$apply(function () {
                     modelSetter(scope, '');
                 });
             });
         }
     };
 }]);

mRealtime.filter("photosFilter", function() { // register new filter
  /*
  * photos : array of photos to filter
  * pageId : photo belong to pageID
  * gender : photo of gender
  * destiny : photo of destiny (Mệnh)
  */
  return function(photos, pageId, gender, destiny) { // filter arguments
    if(!photos) return null;
    // console.log(photos);
    // console.log(scope.filterGender);
    // return input.replace(RegExp(searchRegex), replaceRegex); // implementation
    return photos.filter(function (item) {
      if(!gender && !destiny){
        return item;
      }
      else if(!gender){
        return item.destiny == destiny;
      }
      else if(!destiny){
        return item.gender == gender;
      }
      return item.pageId == (pageId || null) && item.gender == (gender || null) && item.destiny == (destiny || null);
    });
  };
});

