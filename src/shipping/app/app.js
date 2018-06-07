var mShipping = angular.module('mShipping', [
  'ui.router', 
  'ngAnimate',
  'ngSanitize',
  // 'localytics.directives',
  'angular-loading-bar',
  'firebase',
  'angular.filter',
  'facebook',
  // 'infinite-scroll',
  'ngDialog',
  // 'snackbar',
  'ngFileUpload',
  'toastr',
  'angularMoment',
  'mGHN',
  'mFacebook',
  'mFirebase',
  'mUtilities',
	])
    .constant('appVersion', '3.0.0')
    .constant('releaseDate', 'Nov-20, 2017')
    .constant('access_token', 'EAAPbgSrDvvwBAA0wbOmvzgB3yATIpmDeLcmMYxMgH1Gl1GxZBZARWIBIpHMyuj9H3pgCafaja0L0ooY2VGAHKbUMk7RNy8XmlrTpkpsuumvxZC7ZCG1dHbVZB4uV0vpz2w0cwAYZAUA2FtuPP96C23HeRKndm2lpUZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      cfpLoadingBarProvider, FacebookProvider) {
    	// $locationProvider.hashPrefix('');
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.parentSelector = '#loading-bar';
        $locationProvider.hashPrefix('');
        // $locationProvider.html5Mode(true);
        // $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when( '/','realtime');
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/shipping/home.html",
                resolve: {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                  ghn_districs: function(MGHNService, ghn_token, MUtilitiesService){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getDistricts().then(function(response){
                        return response.data.data;
                      })
                      .catch(function(err){
                        MUtilitiesService.AlertError('Lỗi kết nối tới Giao hàng nhanh', 'Lỗi');
                      })
                      
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
                    },
                    ghn_hubs: function(MGHNService, ghn_token){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getHubs().then(function(response){
                        return response.data.data;
                      })
                      .catch(function(err){
                        MUtilitiesService.AlertError('Lỗi kết nối tới Giao hàng nhanh', 'Lỗi');
                      })
                    }
                },
                
            })
            .state('home.detail', {
                url: 'detail/id=:id&ctype=:ctype&cm=:cm&oid=:oid&pid=:page_id&poid=:post_id&cid=:customer_id&cv_id=:cv_id',
                controller: 'DetailCtrl',
                templateUrl: "/src/shipping/detail.html",
                params     : { id : null, ctype : null, cm : null, oid : null, page_id : null, post_id : null, 
                  customer_id : null, cv_id : null},
                resolve : {
                  activeItem : function(firebaseService, $stateParams){
                    return firebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                      return snapshot.val();
                    });
                  },
                  current_hub: function(ghn_hubs, fanpages, $stateParams, $filter){
                    // console.log($stateParams.page_id);
                    var hubId = $filter("filter")(fanpages, {
                                    id: $stateParams.page_id
                                })[0].HubID;

                    var hub = $filter("filter")(ghn_hubs, {
                                    HubID: hubId
                                })[0];

                    return hub;
                    // console.log(hub);
                  },
                }
            })
            .state('print', {
                url: '/print',
                controller: 'PrintCtrl',
                templateUrl: "/src/shipping/print.html",
                resolve: {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                  ghn_districs: function(MGHNService, ghn_token){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getDistricts().then(function(response){
                          return response.data.data;
                      })
                    },
                  fanpages: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_fanpages().then(function(response){
                        // console.log(response);
                        return response;
                      });
                    },
                    ghn_hubs: function(MGHNService, ghn_token){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getHubs().then(function(response){
                          return response.data.data;
                      })
                    }
                },
                
            });
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

angular.module('mShipping').filter('cut', function () {
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

function themeRun($window, $rootScope, appVersion, releaseDate, access_token, accessTokenService, cfpLoadingBar) {
    $window.location = '/ship';
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;

    $rootScope.access_token_arr = [];
    accessTokenService.getAccessToken().then(function(response){
        $rootScope.access_token_arr = response;
      }.bind(this));

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

// angular.get('/wh', function(){
//   console.log('sdfsdf');
// });

mShipping.filter('reverse', function() {
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

mShipping.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});

angular.module('mShipping').directive('ngFileModel', ['$parse', function ($parse, $sce) {
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

mShipping.filter("photosFilter", function() { // register new filter
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

mShipping.directive('searchEnter', function () {
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

mShipping.directive("select2", ["$timeout", "$parse", function(c, b) {
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

