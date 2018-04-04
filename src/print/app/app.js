var mPrinting = angular.module('mPrinting', [
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
    .constant('access_token', 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD')
    .config(function($stateProvider, $locationProvider, $urlRouterProvider, 
      cfpLoadingBarProvider, FacebookProvider) {
        var myAppId = '1085772744867580';
        FacebookProvider.init(myAppId);

        cfpLoadingBarProvider.includeSpinner = false;
        // cfpLoadingBarProvider.parentSelector = '#loading-bar';

    	$locationProvider.hashPrefix('');

        // $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise("/");
        // $urlRouterProvider.when('/','printing');
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                templateUrl: "/src/print/home.html",
                resolve: {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                  // ghn_districs: function(MGHNService, ghn_token){
                  //     MGHNService.setAccessToken(ghn_token);
                  //     return MGHNService.getDistricts().then(function(response){
                  //         return response.data.data;
                  //     })
                  //   },
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
                    // ghn_hubs: function(MGHNService, ghn_token){
                    //   MGHNService.setAccessToken(ghn_token);
                    //   return MGHNService.getHubs().then(function(response){
                    //       return response.data.data;
                    //   })
                    // }
                },
            })
            .state('home.detail', {
                url: 'detail/id=:id&ctype=:ctype&cm=:cm&oid=:oid&pid=:page_id&poid=:post_id&cid=:customer_id&cv_id=:cv_id',
                params     : { id : null, ctype : null, cm : null, oid : null, page_id : null, post_id : null, 
                customer_id : null, cv_id : null},
                controller: 'DetailCtrl',
                templateUrl: "/src/print/detail.html",
                resolve : {
                  activeItem : function(MFirebaseService, $stateParams){
                    return MFirebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                      // console.log(snapshot.val());
                      return snapshot.val();
                    });
                  },
                }
            })
            .state('PrintInvoice', {
                url: '/PrintInvoice/id=:id',
                params : {id : null},
                controller: 'PrintCtrl',
                templateUrl: "/src/print/print-invoice.html",
                resolve : {
                  ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    },
                  activeItem : function(MFirebaseService, $stateParams){
                    return MFirebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                      // console.log(snapshot.val());
                      return snapshot.val();
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
                    },
                    // ghn_hubs: function(MGHNService, ghn_token){
                    //   MGHNService.setAccessToken(ghn_token);
                    //   return MGHNService.getHubs().then(function(response){
                    //       return response.data.data;
                    //   })
                    // }
                }
            })
            .state('PrintMultiInvoice', {
                url: '/PrintMultiInvoice',
                params: {
                   obj: null
                 },
                controller: 'PrintMultiInvoiceCtrl',
                templateUrl: "/src/print/print-multiple-invoice.html",
                resolve : {
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
                    },
                    ghn_hubs: function(MGHNService, ghn_token){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getHubs().then(function(response){
                          return response.data.data;
                      })
                    },
                    // orders: function($rootScope, PrintService){
                    //   console.log(PrintService);
                    //   return [
                    //     {
                    //       id : '1',
                    //     },
                    //     {
                    //       id : '2',
                    //     }
                    //   ]
                    // }
                }
            })
            .state('print', {
                url: '/printShipping/id=:id&time=:created_at',
                params : {id : null, time : null},
                controller: 'PrintShippingBillCtrl',
                templateUrl: "/src/print/print.html",
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
                }
            });
            
            
        $urlRouterProvider.otherwise('/');
    })
    .run(themeRun);

function themeRun($rootScope, appVersion, releaseDate, access_token) {
    $rootScope.access_token = access_token;
    $rootScope.appVersion = appVersion;
    $rootScope.releaseDate = releaseDate;
}

mPrinting
  .service('firebaseStorageService', ["$q", function ($q) { 
    var root = firebase.database().ref();
    var storageRef = firebase.storage().ref();

    function upload(file, uid, fileName) {
        var deferred = $q.defer();
        var fileRef = storageRef.child('uploads').child('products').child(fileName);
        // var storageRef = firebase.storage().ref('avatars/' + file.name);
        var uploadTask = fileRef.put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          function(snapshot) {
             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log('Upload is ' + progress + '% done');
             switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING:
                  console.log('Upload is running');
                  break;
             }
         }, 
         function(error) {
            switch (error.code) {
               case 'storage/unauthorized':
                   deferred.reject('User does not have permission to access the object.');
                   break;
               case 'storage/canceled':
                   deferred.reject('User canceled the upload.');
                   break;
               case 'storage/unknown':
                   deferred.reject(' Unknown error occurred, Please try later.');
                   break;
             }
          }, function() {
                deferred.resolve(uploadTask.snapshot.downloadURL);
          });

        return deferred.promise;
    }

    return {
        upload : upload,
    }

  }])


  angular.module('mPrinting').filter('cut', function () {
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

mPrinting.directive('searchEnter', function () {
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




