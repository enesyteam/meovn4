mShipping.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook, firebaseService, fanpages, ghn_hubs, ghn_token) {
        var ref = firebase.database().ref();

        // console.log(fanpages);

        //GHN API
        $rootScope.ghnToken = ghn_token;
        $rootScope.Hubs = ghn_hubs;
        
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
                      orderCode: snapshot.val().orderCode
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

        $rootScope.filterInArray = function(arr, fieldTofilter, valueToFilter){
            return $filter("filter")(arr, {
                fieldTofilter: valueToFilter
            })[0];
        }

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