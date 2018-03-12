mShipping.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook, firebaseService, MFirebaseService, MUtilitiesService, fanpages, ghn_hubs, ghn_token) {

    var pageSize = 10;
    $rootScope.availableShippingItems = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    MFirebaseService.getShippingItems(pageSize).then(function(response) {
        response.reverse().map(function(order) {
            $scope.$apply(function() {
                $rootScope.availableShippingItems.push(order.data);
            })
        })
        $scope.$apply(function() {
            $rootScope.newlyOrderKey = response[0].key;
            $rootScope.lastOrderKey = response[response.length - 1].key;
            $rootScope.isLoaddingOrder = false;
        })
    })

    // trigger when new item
    let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('publish_date').limitToLast(1);
    newOrdersRef.on('child_added', snapshot => {
      if(snapshot.key !== $rootScope.newlyOrderKey){
        $scope.$apply(function(){
          $rootScope.newlyOrderKey = snapshot.key;
          $rootScope.availableShippingItems.unshift(snapshot.val())
        });
      }
    });
    
    $rootScope.getNextShippingItems = function() {
        $rootScope.isLoaddingOrder = true;
        MFirebaseService.getNextShippingItems($rootScope.lastOrderKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(order) {
                $scope.$apply(function() {
                    $rootScope.availableShippingItems.push(order.data);
                })
            })
            $scope.$apply(function() {
                $rootScope.lastOrderKey = response[response.length - 1].key;
                $rootScope.isLoaddingOrder = false;
                // console.log(response);
                if(response.length == 1){ // item bị trùng
                  $rootScope.canLoadMore = false;
                }
            })
        })
    }

    /////////////////////////////////////////////////////////////////////////////

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