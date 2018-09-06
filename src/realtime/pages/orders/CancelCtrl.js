mRealtime.controller('CancelCtrl', ['$q',  '$timeout', '$scope', '$http', '$filter', 
	'cancelReasons', 'orderId', 'pageId', 'MFirebaseService','MUtilitiesService',
	function ($q, $timeout, $scope, $http, $filter, cancelReasons, orderId, pageId, 
        MFirebaseService, MUtilitiesService) {

		vm = this;
		$scope.cancelReasons = cancelReasons;

		$scope.onStationChange = function(){
        	console.log($scope.selected_reason);
        	if( $scope.selected_reason.id == 5 ) {
				$scope.show_other_reason = true;
        	}
        	else {
        		$scope.show_other_reason = false;
        	}
	    }

	    $scope.reason = {
	    	text: null,
	    	id: null,
	    }

	    vm.cancelReason = function(){
	        return new Promise(function(resolve, reject){
	            if($scope.selected_reason){
	            	if( $scope.selected_reason.id !== 5 ) {
						$scope.reason.text = $scope.selected_reason.reason;
	            	}
	            	MFirebaseService.onCancelOrder( orderId, pageId, Object.assign( $scope.selected_reason, { text: $scope.reason.text } ) )
	            	.then( function( response ) {
						console.log( response );
	            	} )
	            	.catch( function( error ) {
						console.log( error );
	            	} )
	                resolve( Object.assign( $scope.selected_reason, { reason_text: $scope.reason.text } ) );
	            }
	            else{
	                swal.showValidationError('Vui lòng cung cấp lý do từ chối!');
	                swal.hideLoading();
	            }
	            // reject('Vui lòng chọn bưu cục!');
	        })
	    }

}]);