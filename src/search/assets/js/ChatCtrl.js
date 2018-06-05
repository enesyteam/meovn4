mSearch.controller('ChatCtrl', ['$q','$timeout', '$filter', '$scope', 'order', 'fanpages', 'MFacebookService', 'MUtilitiesService', 
	function ($q, $timeout, $filter, $scope, order, fanpages, MFacebookService, MUtilitiesService) {
	console.log(order);
    var vm = this;
    vm.order = order;

    var page = $filter("filter")(fanpages, {
        id: order.page_id
    });
    $scope.currentAccessToken = page ? page[0].access_token : null;
    if (!$scope.currentAccessToken) {
        MUtilitiesService.AlertError('Chưa khai báo Fanpage', 'Lỗi');
    }

    // GRAPH FACEBOOK nếu đơn hàng chưa tạo thành công
    var getToken = function(pageId) {
        return new Promise(function(resolve, reject) {
            var page = $filter("filter")(fanpages, {
                id: pageId
            });
            if (page[0]) {
                resolve(page[0].access_token);
            } else {
                reject('Page với ID ' + pageId + ' chưa được thêm vào danh sách quản lý.');
            }
        })
    }
    // graph page
    MFacebookService.graphPage(order.page_id, $scope.currentAccessToken).then(function(response) {
            // console.log(response);
            $scope.$apply(function() {
                $scope.pageData = response;
            })
        })
        .catch(function(err) {
            MUtilitiesService.AlertError(err, 'Lỗi');
        })

    //
    if (order.type == 1) {
        // messages
        // alert($stateParams.cv_id);
        MFacebookService.graphMessages(order.conversation_id, $scope.currentAccessToken).then(function(response) {
                $scope.$apply(function() {
                    // console.log(response);
                    angular.forEach(response.messages.data, function(mes){
                        // mes = 'sdfsdfsdf';
                        if(mes.shares && mes.shares.data){
                            if(mes.shares.data[0].link){
                                // mes = 'sdfds';
                                // console.log(mes.shares.data[0].link);
                                // var link = $scope.detectMessageSharesLink(mes.shares.data[0].link);

                                MUtilitiesService.detectMessageSharesLink(mes.shares.data[0].link).then(function(result){
                                    if(result.type == 'photo'){
                                        mes.link = result.link;
                                    }
                                    else if(result.type == 'post'){
                                        // console.log(result);
                                        // alert('share is post');
                                        MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, $scope.currentAccessToken)
                                        .then(function(response){
                                            // console.log(response);
                                            // mes.x = response.data;
                                            // return response.data.attachments.picture;
                                            $scope.$apply(function(){
                                                mes.post_share = response.data;
                                            })
                                        })
                                        .catch(function(err){
                                            // console.log(err);
                                            MUtilitiesService.AlertError(err);
                                        });
                                    }
                                    else {
                                        return 'Trường hợp khác'
                                    }
                                })

                                // console.log(link);
                                
                                
                            }
                        }
                    })
                    $scope.messageData = response;
                })
            })
            .catch(function(err) {
                MUtilitiesService.AlertError(err, 'Lỗi');
            })
    } else {
        // graph post
        MFacebookService.graphPost(order.post_id, $scope.currentAccessToken).then(function(response) {
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
        MFacebookService.graphComments(order.conversation_id, $scope.currentAccessToken).then(function(response) {
                $scope.$apply(function() {
                    // console.log(response);
                    $scope.commentData = response;
                })
            })
            .catch(function(err) {
                MUtilitiesService.AlertError(err, 'Lỗi');
            })
    }

    // reply
    vm.reply = function(){
    	doReply(vm.order);
    }

    $scope.messageContent = {
    	text: null
    }
    function doReply(order){
    	return new Promise(function(resolve, reject){
    		if(order.type == 1){
	        // reply message
	        MFacebookService.replyMessage(order.conversation_id,
	            $scope.currentAccessToken, null, $scope.messageContent.text).then(function(response){
	            resolve(response);
	            $scope.$apply(function(){
	                // mục đích hiển thị
	                $scope.messageData.messages.data.unshift({
	                    from: {
	                        id: $scope.pageData.id,
	                        name: $scope.pageData.name || 'Tên page',
	                    },
	                    message : $scope.messageContent.text,
	                    created_time : Date.now(),
	                })

	                $scope.messageContent.text = null;
	                $scope.startReplying = false;
	            });
	        })
	        .catch(function(err){
	        	console.log(err);
	            reject(err)
	        })
	    }
	    else{
	        // reply comment
	        MFacebookService.replyComment(order.conversation_id,
	            $scope.currentAccessToken, null, $scope.messageContent.text).then(function(response){
	            resolve(response);
	            $scope.$apply(function(){
	                // mục đích hiển thị
	                $scope.commentData.comments.data.push({
	                    from: {
	                        id: $scope.pageData.id,
	                        name: $scope.pageData.name || 'Tên page',
	                    },
	                    message : $scope.messageContent.text,
	                    created_time : Date.now(),
	                })

	                $scope.messageContent.text = null;
	                $scope.startReplying = false;
	            });
	        })
	        .catch(function(err){
	            reject(err)
	        })
	    }


	    $scope.shouldDisplayQuickReply = false;
    	})
	}
}]);