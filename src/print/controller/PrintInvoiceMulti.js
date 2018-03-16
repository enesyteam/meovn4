mPrinting.controller('PrintMultiInvoiceCtrl',
    function($rootScope, $scope, $http, $filter, $state, $stateParams, fanpages, ghn_hubs, telesales, MUtilitiesService,
        PrintService) {
        $scope.orders = [];
        // console.log(orders);
        // alert('sdfsdfds');

        console.log($stateParams);

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

        // orders
        // $scope.orders = [];

    });