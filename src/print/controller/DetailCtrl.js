mPrinting.controller('DetailCtrl',
    function($scope, $rootScope, $http, $window, $state, $stateParams, $document, $filter, $timeout, 
        Facebook, toastr, toastrConfig, moment,
        MFacebookService, MFirebaseService, 
        MUtilitiesService, fanpages, ngDialog, activeItem) {
        // alert('dsfsfd');
        
        angular.forEach(activeItem, function(value, key) {
            // console.log(value);
            $rootScope.activedItem = value;
            $scope.activedItem = value;
        });

        var page = $filter("filter")(fanpages, {
            id: $stateParams.page_id
        });
        $scope.currentAccessToken = page ? page[0].access_token : null;
        if (!$scope.currentAccessToken) {
            MUtilitiesService.AlertError('Chưa khai báo Fanpage', 'Lỗi');
        }

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

        $scope.openSingleInvoicePrintPage = function(orderId){
            // $state.go('PrintInvoice', {
            //     id: orderId //selectedItem and id is defined
            // });
            // alert(orderId);

            var url = $state.href('PrintInvoice', {});
            $window.open(url,'_blank');
        };

        // GRAPH FACEBOOK
        // graph page
        MFacebookService.graphPage($stateParams.page_id, $scope.currentAccessToken).then(function(response) {
                // console.log(response);
                $scope.$apply(function() {
                    $scope.pageData = response;
                })
            })
            .catch(function(err) {
                MUtilitiesService.AlertError(err, 'Lỗi');
            })

        //
        if ($stateParams.ctype == 1) {
            // messages
            // alert($stateParams.cv_id);
            MFacebookService.graphMessages($stateParams.cv_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        $scope.messageData = response;
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })
        } else {
            // graph post
            MFacebookService.graphPost($stateParams.post_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        $scope.postData = response;
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })

            // also graph comments
            // alert($stateParams.cv_id);
            MFacebookService.graphComments($stateParams.cv_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        $scope.commentData = response;
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })
        }

        $scope.isShowFullPost = false;
        $scope.showFullPost = function(){
          $scope.isShowFullPost = true;  
        }  

    });