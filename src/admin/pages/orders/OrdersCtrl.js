m_admin.controller('OrdersCtrl',
function($rootScope, $scope, $filter) {
	$rootScope.orders = [];
	$rootScope.notAssignedOrders = [];

	var ref = firebase.database().ref();
	let ordersRef = ref.child('newOrders').orderByChild('publish_date').limitToLast(100);
	ordersRef.on('child_added', snapshot => {
	    // $scope.$apply(function(){
	    	$rootScope.orders.push(snapshot.val());

		    //test
		    if(snapshot.val().status_id == 1 || snapshot.val().status_id == 6){
				var item = {
					customer_name : snapshot.val().customer_name,
					customer_mobile : snapshot.val().customer_mobile,
					id : snapshot.val().id,
					selected : false,
					seller_will_call_id : snapshot.val().seller_will_call_id,
				}

				$rootScope.notAssignedOrders.push(item);
			}
			
	    // })
	});

	// listen for order change
    ref.child('newOrders').on('child_changed', snapshot => {
      // find item in array
      var itemChanged = $filter('filter')($rootScope.notAssignedOrders, {'id':snapshot.val().id})[0];
      if(itemChanged.status_id !== snapshot.val().status_id){
        itemChanged.status_id = snapshot.val().status_id; 
      }
      if(itemChanged.seller_will_call_id !== snapshot.val().seller_will_call_id){
        itemChanged.seller_will_call_id = snapshot.val().seller_will_call_id; 
      }
      
    });
			
});