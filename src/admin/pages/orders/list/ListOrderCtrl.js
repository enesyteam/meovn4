m_admin.controller('ListOrderCtrl',
function($scope, $rootScope, $timeout, cfpLoadingBar, firebaseService, Facebook,
	MFirebaseService, MUtilitiesService, MFacebookService, fanpages) {
	var pageSize = 100;
    $scope.availableOrders = [];
    $scope.newlyOrderKey = null;
    $scope.lastOrderKey = null;
    $scope.canLoadMore = true;
    $scope.isLoaddingOrder = true;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    function getOrders(){
      $scope.availableOrders = [];
        MFirebaseService.getOrders(pageSize).then(function(response) {
          response.reverse().map(function(order) {
            var item = {
                    customer_name : order.data.customer_name,
                    customer_mobile : order.data.customer_mobile,
                    customer_id : order.data.customer_id,
                    id : order.data.id,
                    type: order.data.type,
                    page_id : order.data.page_id,
                    post_id : order.data.post_id,
                    selected : false,
                    conversation_id: order.data.conversation_id,
                    seller_will_call_id : order.data.seller_will_call_id,
                    status_id : order.data.status_id,
                    publish_date : order.data.publish_date,
                    is_bad_number : order.data.is_bad_number,
                    active_log : order.data.activeLog,
                  }
              $scope.$apply(function() {
                  $scope.availableOrders.push(item);
              })
          })
          $scope.$apply(function() {
              $scope.newlyOrderKey = response[0].key;
              $scope.lastOrderKey = response[response.length - 1].key;
              $scope.isLoaddingOrder = false;
          })

          // trigger when new order added
        let newOrdersRef = firebase.database().ref().child('newOrders').orderByChild('publish_date').limitToLast(1);
        newOrdersRef.on('child_added', snapshot => {
          if(snapshot.key !== $scope.newlyOrderKey){
            var item = {
                customer_name : snapshot.val().customer_name,
                customer_mobile : snapshot.val().customer_mobile,
                customer_id : snapshot.val().customer_id,
                id : snapshot.val().id,
                type: snapshot.val().type,
                selected : false,
                page_id : snapshot.val().page_id,
                post_id : snapshot.val().post_id,
                conversation_id: snapshot.val().conversation_id,
                seller_will_call_id : snapshot.val().seller_will_call_id,
                status_id : snapshot.val().status_id,
                publish_date : snapshot.val().publish_date,
                is_bad_number : snapshot.val().is_bad_number,
                active_log : snapshot.val().activeLog,
              }
            $timeout(function() {
              $scope.$apply(function(){
                $scope.newlyOrderKey = snapshot.key;
                $scope.availableOrders.unshift(snapshot.val());
              });
            }, 10);
          }
        });
      })
    }
    getOrders();

    

    
    $scope.getNextAddedOrders = function() {
        $scope.isLoaddingOrder = true;
        MFirebaseService.getNextOrders($scope.lastOrderKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(order) {
                var item = {
                    customer_name : order.data.customer_name,
                    customer_mobile : order.data.customer_mobile,
                    customer_id : order.data.customer_id,
                    id : order.data.id,
                    type: order.data.type,
                    selected : false,
                    page_id : order.data.page_id,
                    post_id : order.data.post_id,
                    conversation_id: order.data.conversation_id,
                    seller_will_call_id : order.data.seller_will_call_id,
                    status_id : order.data.status_id,
                    publish_date : order.data.publish_date,
                    is_bad_number : order.data.is_bad_number,
                    active_log : order.data.activeLog,
                  }
                $scope.$apply(function() {
	                $scope.availableOrders.push(item);
                })
            })
            $scope.$apply(function() {
                $scope.lastOrderKey = response[response.length - 1].key;
                $scope.isLoaddingOrder = false;
                // console.log(response);
                if(response.length == 1){ // item bị trùng
                  $scope.canLoadMore = false;
                }
            })
        })
    }

    $scope.searchQuery = {
      text : null
    }

    $scope.searchOrder = function(){
      if(!$scope.searchQuery.text || $scope.searchQuery.text == ''){
        // reset kết quả về mặc định
        getOrders();
        // MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
        return;
      }
      if($scope.searchQuery.text.length < 2){
        MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
        return;
      }
      if($scope.searchQuery.text.match(/^\d/)){
        // alert($scope.searchQuery.text);
        if($scope.searchQuery.text.length < 4){
          MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
          return;
        }
        MFirebaseService.searchOrderByCustomerPhone($scope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $scope.availableOrders = response
          })
        });
      }
      else{
        MFirebaseService.searchOrderByCustomerName($scope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $scope.availableOrders = response
          })
        });
      }
      
    }

    
});