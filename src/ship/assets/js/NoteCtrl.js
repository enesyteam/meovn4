mSearch.controller('ChatCtrl', ['$q','$timeout', '$filter', '$scope', 'order',
	function ($q, $timeout, $filter, $scope, order) {
	console.log(order);
    var vm = this;
    vm.order = order;

    $scope.noteContent = {
    	text: null
    }

    /*
    * add a note to order
    */
    vm.addNote = function(order){
        if(!$scope.noteContent.text || $scope.noteContent.text.length == 0){
            MUtilitiesService.AlertError('Vui lòng nhập nội dung', 'Lỗi');
            return;
        }
        var activeLogItem = {
            uid : $rootScope.currentMember.id,
            uname : $rootScope.currentMember.last_name,
            type: 2, //note,
            status_after : null,
            content: $scope.noteContent.text,
            updated_at: firebase.database.ServerValue.TIMESTAMP
        }
        return new Promise(function(resolve, reject){
        	firebase.database().ref().child('newOrders/' + order.id).child('activeLog').push(activeLogItem)
	        .then(function(){
	        	firebase.database().ref().child('newOrders/' + order.id).child('commentCount').transaction(function(oldValue){
	              return oldValue + 1;
	          }).then(function(){
	          	$scope.noteContent.text = '';
	          	resolve('Thêm ghi chú thành công');
	          });
	        });
        })
        
        // update comment count for this order
        
    }
}]);