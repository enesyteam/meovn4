mRealtime.controller('OdersCtrl',
    function($rootScope, $scope, $state, $stateParams, $filter, $timeout, cfpLoadingBar, cfpLoadingBar, Facebook) {
        $scope.isShowFullPost = false;
        $scope.showFullPost = function(){
          $scope.isShowFullPost = true;  
        }
    	$scope.filterById = function(sources, id){
            return $filter("filter")(sources, {
                id: id
            })[0];
        }
        $scope.page_id = $stateParams.page_id;
        $scope.customer = null;
        
        $scope.post_id = $stateParams.post_id;
        $scope.conversation_id = $stateParams.conversation_id;
        $scope.conversation = null;

        $scope.finishGraphPostDetail = false;
        //get page id

        var graphPage = function(pageId) {
        	if(!pageId) return;

            Facebook.api('/' + $stateParams.customer_id + '?access_token=' + $rootScope.access_token, function(response) {
                // console.log(response);
                if(response && !response.error){
                    $scope.customer = response;
                }
            });

        	// console.log(pageId);
	        Facebook.api('/' + pageId + '?fields=picture,name&access_token=' + $rootScope.access_token, function(response) {
	        	// console.log(response);
	        	if(response && !response.error){
	        		$scope.$apply(function(){
		        		$scope.data = response; 
		        	});
                    graphPost($scope.post_id);
                    graphOriginalConversation($scope.conversation_id);
	        	}
	        });
	    }

        var graphPost = function(postId) {
        	if(!postId) return;
        	// console.log(pageId);
	        Facebook.api('/' + postId + '?fields=full_picture,message,picture,attachments,story,permalink_url&access_token=' + $rootScope.access_token, function(response) {
	        	// console.log(response.attachments.data[0].subattachments.data);
	        	if(response && !response.error){
                    // console.log(response);
	        		$scope.$apply(function(){
		        		$scope.postData = response; 
                        $scope.finishGraphPostDetail = true; 
		        	});
	        	}
	        });
	    }

        var graphOriginalConversation = function(conversationId) {
            Facebook.api('/' + conversationId + '?fields=comments{from,message,created_time,id},permalink_url,from,message,created_time,admin_creator&access_token=' + $rootScope.access_token, function(response) {
                // console.log(response);
                if(response && !response.error){
                    $scope.$apply(function(){
                        $scope.conversation = response;
                        
                    });
                }
            });
            
        }

	    graphPage($scope.page_id);
	    

        // 
        $scope.finishGraphData = false;
        var testGraph = function(){
            $timeout(function() {
               $scope.finishGraphData = true; 
            }, 500);
        }
        testGraph();
	});