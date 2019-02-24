var mRealtime = angular.module('mRealtime', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  // 'localytics.directives',
  'mRealtime.orders',

  'angular-loading-bar',
  'firebase',
  'angular.filter',
  'facebook',
  // 'angular-clipboard',
  // 'infinite-scroll',
  'ngDialog',
  'angular-sweet-alert',
  // 'ui.scroll',
  // 'snackbar',
  'ngFileUpload',
  'toastr',
  'mGHN',
  'mFacebook',
  'mFirebase',
  'mUtilities',
	])
    .constant('appVersion', '4.2.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAAfvGk9HiGTAK5CH1x2qWUAJdpXO33CXFThGDTzeCZBNtFPRR0LU0A6KZB4KPZCfvZAdARaZC3MMIZC8oll16yhrunD1Xewv1k6xmVr8aXTvAi5sG3K9m6qXpF77vPReN3AU0QLaxFzejut16vGESpv7oxlKXodKwSEXy8TE3S')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      cfpLoadingBarProvider, FacebookProvider) {
    	$locationProvider.hashPrefix('');
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        cfpLoadingBarProvider.includeSpinner = false;
        $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when('/sale','/admin/dashboard/general');
        // $urlRouterProvider.when('/','sale');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/realtime/home.html",
                resolve: {
                  fanpages: function(MFirebaseService){
                      return MFirebaseService.get_fanpages().then(function(response){
                        return response;
                      });
                    },
                  telesales: function(MFirebaseService){
                    return MFirebaseService.getAllSellers().then(function(response){
                      return response;
                    })
                  }

                },
            });
            
        // $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

angular.module('mRealtime').filter('cut', function () {
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

function themeRun($window, $rootScope, appVersion, releaseDate, access_token, cfpLoadingBar, MFirebaseService, MUtilitiesService) {

  firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            // alert('Bạn chưa đăng nhập!');
            $window.location = '/login';
            // return;
        } else {
            // console.log(user);
            MFirebaseService.getMemberByEmail(user.email).then(function(member){
                MUtilitiesService.AlertSuccessful('You are logged in as "' + member.email + '"');

                if(!member.is_admin && member.is_seller !== 1){
                  // MUtilitiesService.AlertWarning('Đang chuyển hướng đến trang tìm kiếm...');
                  $window.location = '/tim-kiem';
                }

                $rootScope.currentMember = member;
                $rootScope.activeFilter = {
                    filter_status_id: null,
                    filter_seller_id: $rootScope.currentMember.id,
                }
            });
        }
    });

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

mRealtime.directive('scrollToBottom', function () {
    var unbind;
    return {
      restrict: 'A',
      scope: { scrollToBottom: "=" },
      link: function (scope, element) {
        if( unbind ) { unbind(); }
        unbind = scope.$watchCollection('scrollToBottom', function () {
          $(element).animate({scrollTop: element[0].scrollHeight});
        });
      }
    }
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
  return function(photos, pageId, genders, destinies) { // filter arguments

    if(!photos) return null;

    return photos.filter(function (item) {
      return item;
      ////
      // if(item.genders){
      //   for (var i = 0; i < genders.length; i++) {
      //     if(item.genders[i].selected == true && genders[i].selected == true){
      //       return item;
      //     }
      //   }
      // }

    })
  };
});

mRealtime.filter("ordersFilter", function() { // register new filter
  /*
  * photos : array of photos to filter
  * pageId : photo belong to pageID
  * gender : photo of gender
  * destiny : photo of destiny (Mệnh)
  */
  return function(orders, status_id, search_mod = false) { // filter arguments
    // console.log(orders);

    if(!orders) return null;
    return orders.filter(function (item) {
      if(search_mod){
        return item;
      }
      else{
        if(!status_id){
          return item;
        }
        else{
          if(status_id == item.status_id){
            return item;
          }
          else{
            return null;
          }
        }
      }

    })
  };
});

function checkIfOneItemSelected(arr){
  return new Promise(function(resolve, reject){
    angular.forEach(arr, function(item){
      console.log('s')
        if(item.selected == true){
          resolve(true);
          return;
        }
      })
    resolve(false);
  })
  // return false;
}

var genders = [
        {
            id : 1,
            name : 'Nam',
            selected: false,
        },
        {
            id : 2,
            name : 'Nữ',
            selected: true,
        }
    ]

mRealtime.directive('searchEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    // scope.$eval(attrs.searchEnter);
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

mRealtime.directive("select2", ["$timeout", "$parse", function(c, b) {
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

