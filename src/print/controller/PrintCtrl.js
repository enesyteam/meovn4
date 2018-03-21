mPrinting.controller('PrintCtrl',
    function($rootScope, $scope, $http, $filter, fanpages, ghn_hubs, telesales, activeItem, MUtilitiesService) {

        $scope.telesales = telesales;

        $scope.aProducts = [];
        var getAllAvailableProducts = function(){
          var ref = firebase.database().ref();
          let productsRef = ref.child('products');
          productsRef.on('child_added', snapshot => {
            $scope.aProducts.push(snapshot.val());
          });
        }
        getAllAvailableProducts();

        $scope.findProduct = function(id){
            return $filter("filter")($scope.aProducts, {id: id})[0];
        }

         $rootScope.filterById = function(sources, id) {
            if(!id) return null;
            return $filter("filter")(sources, {
                id: id
            })[0];
        }

        angular.forEach(activeItem, function(value, key) {
            // console.log(value);
            $scope.activedItem = value;
        });
        // console.log($scope.activedItem);
        $scope.currentTime = Date.now();

        $scope.current_Page = $filter("filter")(fanpages, {
            id: $scope.activedItem.data.orderData.page_id
        });
        $scope.currentAccessToken = $scope.current_Page && $scope.current_Page[0] ? $scope.current_Page[0].access_token : null;
        if (!$scope.currentAccessToken) {
            MUtilitiesService.AlertError('Đã có lỗi xảy ra, vui lòng reload (F5) lại', 'Lỗi');
        }

        var hubId = $filter("filter")(fanpages, {
                        id: $scope.activedItem.data.orderData.page_id
                    })[0].HubID;

        $scope.current_hub = $filter("filter")(ghn_hubs, {
                        HubID: hubId
                    })[0];

    });