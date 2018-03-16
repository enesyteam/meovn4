mPrinting.controller('MainCtrl',
    function($scope, $rootScope, $http, $window, $state, $stateParams, $document, $filter, $timeout, 
        Facebook, toastr, toastrConfig, moment,
        MFacebookService, MFirebaseService, 
        MUtilitiesService, fanpages, ngDialog) {
        
        var pageSize = 30;
        $rootScope.availableShippingItems = [];
        $rootScope.newlyOrderKey = null;
        $rootScope.lastOrderKey = null;
        $rootScope.canLoadMore = true;
        $rootScope.isLoaddingOrder = true;

        // tét
        // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
        //     console.log(response);
        // })

        function getShippingItems() {
            $rootScope.availableShippingItems = [];
            MFirebaseService.getShippingItems(pageSize).then(function(response) {
                response.reverse().map(function(order) {
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                })
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = response[0].key;
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                })
            })
        }
        getShippingItems();

        // trigger when new item
        let newOrdersRef = firebase.database().ref().child('shippingItems').orderByChild('publish_date').limitToLast(1);
        newOrdersRef.on('child_added', snapshot => {
            if (snapshot.key !== $rootScope.newlyOrderKey) {
                $scope.$apply(function() {
                    $rootScope.newlyOrderKey = snapshot.key;
                    $rootScope.availableShippingItems.unshift({
                        key: snapshot.key,
                        data: snapshot.val()
                    })
                });
            }
        });

        $rootScope.getNextShippingItems = function() {
            $rootScope.isLoaddingOrder = true;
            MFirebaseService.getNextShippingItems($rootScope.lastOrderKey, pageSize).then(function(response) {
                response.reverse().slice(1).map(function(order) {
                    $scope.$apply(function() {
                        $rootScope.availableShippingItems.push(order);
                    })
                })
                $scope.$apply(function() {
                    $rootScope.lastOrderKey = response[response.length - 1].key;
                    $rootScope.isLoaddingOrder = false;
                    // console.log(response);
                    if (response.length == 1) { // item bị trùng
                        $rootScope.canLoadMore = false;
                    }
                })
            })
        }



    	
    });