mShipping.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook, firebaseService) {
        var ref = firebase.database().ref();

        // var deferred = $q.defer();
        // console.log(deferred);
        
        
        // $scope.$apply();

        // $timeout(function() {
        //   $scope.shippingItems = shippingItems;
        // }, 0);


        $rootScope.shippingItems = [];
        let shippingRef = ref.child('shippingItems').limitToLast(100);
          shippingRef.on('child_added', snapshot => {
              $scope.$apply(function(){
                $rootScope.shippingItems.push({
                      id: snapshot.val().id,
                      data : snapshot.val().data,
                  });
              })
          });
        


        // $scope.$evalAsync(function()
        //     // Code here
        //     $scope.shippingItems = shippingItems;
        // });



        $rootScope.filterById = function(sources, id){
            return $filter("filter")(sources, {
                id: id
            })[0];
        }

        //GHN API
        $rootScope.ghnToken = '5a93de5d1070b06c97794a48';

        // setup pages and hub
        $rootScope.pages = [
          {
            id : 137428680255822,
            hubId : 1006532,
          },
          {
            id : 1754290804583419,
            hubId : 1006561,
          }
        ];

        // GetHubs
        $scope.getHubs = function(){
          var config = {
                      headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                      }
                  }
              var data = {
                "token": $rootScope.ghnToken
            }

            $http.post('https://console.ghn.vn/api/v1/apiv3/GetHubs', data, config)
            .then(function (data) {
                  $rootScope.Hubs = data;
            });
        }.call(this);

        $rootScope.Hubs = [];

        $rootScope.windowsHeight = $window.innerHeight;
        $rootScope.windowsWidth = $window.innerWidth;

        // on windows resize
        var appWindow = angular.element($window);
        appWindow.bind('resize', function() {
            $scope.$apply(function() {
                $rootScope.windowsHeight = $window.innerHeight;
                $rootScope.windowsWidth = $window.innerWidth;
            });
        });
    });