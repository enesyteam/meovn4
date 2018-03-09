m_admin.controller('OrdersCtrl',
function($rootScope, $scope, $filter, MFirebaseService, MUtilitiesService) {

	var pageSize = 30;
    $rootScope.availableOrders = [];
    $rootScope.newlyOrderKey = null;
    $rootScope.lastOrderKey = null;
    $rootScope.canLoadMore = true;
    $rootScope.isLoaddingOrder = true;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    MFirebaseService.getOrders(pageSize).then(function(response) {
        response.reverse().map(function(order) {
            $scope.$apply(function() {
            	var item = {
					customer_name : order.data.customer_name,
					customer_mobile : order.data.customer_mobile,
					id : order.data.id,
					selected : false,
					seller_will_call_id : order.data.seller_will_call_id,
					status_id : order.data.status_id
				}
                $rootScope.availableOrders.push(item);
            })
        })
        $scope.$apply(function() {
            $rootScope.newlyOrderKey = response[0].key;
            $rootScope.lastOrderKey = response[response.length - 1].key;
            $rootScope.isLoaddingOrder = false;
        })
    })

    // trigger when new order added
    let newOrdersRef = firebase.database().ref().child('newOrders').orderByChild('publish_date').limitToLast(1);
    newOrdersRef.on('child_added', snapshot => {
      if(snapshot.key !== $rootScope.newlyOrderKey){
        $scope.$apply(function(){
          $rootScope.newlyOrderKey = snapshot.key;
          // $rootScope.availableOrders.unshift(snapshot.val());
          var item = {
					customer_name : snapshot.val().customer_name,
					customer_mobile : snapshot.val().customer_mobile,
					id : snapshot.val().id,
					selected : false,
					seller_will_call_id : snapshot.val().seller_will_call_id,
					status_id : snapshot.val().status_id
				}
                $rootScope.availableOrders.unshift(snapshot.val());
        });
      }
    });

    
    $rootScope.getNextOrders = function() {
        $rootScope.isLoaddingOrder = true;
        MFirebaseService.getNextOrders($rootScope.lastOrderKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(order) {
                $scope.$apply(function() {
                    var item = {
						customer_name : order.data.customer_name,
						customer_mobile : order.data.customer_mobile,
						id : order.data.id,
						selected : false,
						seller_will_call_id : order.data.seller_will_call_id,
						status_id : order.data.status_id
					}
	                $rootScope.availableOrders.push(item);
                })
            })
            $scope.$apply(function() {
                $rootScope.lastOrderKey = response[response.length - 1].key;
                $rootScope.isLoaddingOrder = false;
                console.log(response);
                if(response.length == 1){ // item bị trùng
                  $rootScope.canLoadMore = false;
                }
            })
        })
    }

    $rootScope.searchQuery = {
      text : null
    }

    $rootScope.searchOrder = function(){
      if(!$rootScope.searchQuery.text || $rootScope.searchQuery.text == ''){
        MUtilitiesService.AlertError('Vui lòng nhập từ khóa tìm kiếm', 'Lỗi');
        return;
      }
      if($rootScope.searchQuery.text.length < 2){
        MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
        return;
      }
      if($rootScope.searchQuery.text.match(/^\d/)){
        alert($rootScope.searchQuery.text);
        if($rootScope.searchQuery.text.length < 4){
          MUtilitiesService.AlertError('Chuỗi tìm kiếm quá ngắn', 'Lỗi');
          return;
        }
        MFirebaseService.searchOrderByCustomerPhone($rootScope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $rootScope.availableOrders = response
          })
        });
      }
      else{
        MFirebaseService.searchOrderByCustomerName($rootScope.searchQuery.text).then(function(response){
          if(response.length == 0){
            MUtilitiesService.AlertError('Không tìm thấy kết quả nào', 'Lỗi');
            return;
          }
          $scope.$apply(function(){
            $rootScope.availableOrders = response
          })
        });
      }
      
    }
	/////////////////////////////////////

	// listen for order change
    firebase.database().ref().child('newOrders').on('child_changed', snapshot => {
      // find item in array
      var itemChanged = $filter('filter')($rootScope.availableOrders, {'id':snapshot.val().id})[0];
      if(itemChanged.status_id !== snapshot.val().status_id){
        itemChanged.status_id = snapshot.val().status_id; 
      }
      if(itemChanged.seller_will_call_id !== snapshot.val().seller_will_call_id){
        itemChanged.seller_will_call_id = snapshot.val().seller_will_call_id; 
      }
      
    });
			
});