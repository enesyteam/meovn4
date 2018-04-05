m_admin.controller('QuickReplyCtrl',
function($rootScope, $scope, $filter, $http, MFirebaseService, MUtilitiesService,
toastr,  toastrConfig, replies) {
	$scope.replies = replies;
	$scope.quickReply = {
		text: null,
		key: null
	}
	function validateReply(){
		if(!$scope.quickReply.text || $scope.quickReply.text.length == 0){
			MUtilitiesService.AlertError('Vui lòng nhập nội dung tin nhắn', 'Lỗi');
			return false;
		}
		if(!$scope.quickReply.key || $scope.quickReply.key.length == 0){
			MUtilitiesService.AlertError('Vui lòng nhập ký tự tắt', 'Lỗi');
			return false;
		}
		return true;
	}
	$scope.submitQuickReply = function(){
		if(validateReply()){
			var id = firebase.database().ref().child('quickReplies').push().key;
			$scope.quickReply.id = id;

			MFirebaseService.onAddNewReply($scope.quickReply).then(function(response){
				$scope.quickReply = {
					text: null,
					key: null,
					id: null,
				}
				MUtilitiesService.AlertSuccessful(response, 'Thông báo');
			})
			.catch(function(err){
				MUtilitiesService.AlertError(err, 'Lỗi');
			})
		}
	}
	$scope.onDeleteReply = function(id){
		MUtilitiesService.showConfirmDialg('Thông báo', 'Bạn có chắc muốn xóa mẫu câu trả lời nhanh này không?', 'Tiếp tục', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                	MFirebaseService.onDeleteReply(id).then(function(response){
						MUtilitiesService.AlertSuccessful(response, 'Thông báo');
					})
					.catch(function(err){
							MUtilitiesService.AlertError(err, 'Lỗi');
						})
                }
            })
		
	}
});