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

	        Facebook.api('/' + pageId + '?fields=picture,name&access_token=' + $rootScope.access_token, function(response) {
	        	// console.log(response);
	        	if(response && !response.error){
	        		$scope.$apply(function(){
		        		$scope.data = response; 
                        $scope.finishGraphPage = true;
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
                        $scope.finishGraphConversation = true; 
                    });
                }
            });
            
        }

	    graphPage($scope.page_id);

        //
        var getCurrentPageAccessToken = function(){
            if(!$rootScope.access_token_arr) return;
            var token = $scope.filterById($rootScope.access_token_arr, $scope.page_id);
            if(token){
                $scope.currentAccessToken = token.acess_token;
            }
        }
        getCurrentPageAccessToken();
	    

        // 
        $scope.finishGraphData = false;
        var testGraph = function(){
            $timeout(function() {
               $scope.finishGraphData = true; 
            }, 500);
        }
        testGraph();

        // test reply comment
        $scope.comentText = null;
        $scope.replyToComment = function(){
            /* make the API call */
            FB.api(
                "/" + $scope.conversation_id + "/comments",
                "POST",
                {
                    "message": $scope.comentText,
                    // "attachment_url" : "http://pluspng.com/img-png/github-octocat-logo-vector-png-octocat-icon-1600.png",
                    "access_token" : $scope.currentAccessToken
                },
                function (response) {
                  if (response && !response.error) {
                    /* handle the result */
                    $scope.$apply(function(){
                        $scope.comentText = null;
                        graphOriginalConversation($scope.conversation_id);
                    });
                  }
                }
            );
        }
	});