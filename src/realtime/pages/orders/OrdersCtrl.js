mRealtime.controller('OdersCtrl',
    function($rootScope, $scope, $state, $stateParams, $filter, $timeout, cfpLoadingBar, cfpLoadingBar, Facebook, $snackbar) {
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
        $scope.conversation = null;

        $scope.finishGraphPostDetail = false;

        // get current access token
        var getCurrentPageAccessToken = function(){
            if(!$rootScope.access_token_arr) return;
            var token = $scope.filterById($rootScope.access_token_arr, $stateParams.page_id);
            if(token){
                $scope.currentAccessToken = token.acess_token;
            }
        }
        getCurrentPageAccessToken();

        // graph user
        if($stateParams.customer_id){
            Facebook.api('/' + $stateParams.customer_id + '?access_token=' + $rootScope.access_token, function(response) {
                // console.log(response);
                if(response && !response.error){
                    $scope.customer = response;
                }
            });
        }

        // graph page
        if($stateParams.page_id){
             Facebook.api('/' + $stateParams.page_id + '?fields=picture,name&access_token=' + $rootScope.access_token, function(response) {
                // console.log(response);
                if(response && !response.error){
                    $scope.$apply(function(){
                        $scope.data = response; 
                        $scope.finishGraphPage = true;
                    });
                    // graphPost($scope.post_id);
                    // graphOriginalConversation($scope.conversation_id);
                }
            });
        }

        // graph messages
        var graphMessages = function(){
            Facebook.api('/' + $stateParams.conversation_id + '?fields=messages.limit(100){message,from,created_time},snippet,link,unread_count,participants&date_format=U&access_token=' + $scope.currentAccessToken, function(r) {
                $scope.messsageLog = r;
                // console.log(r);
            });
        }

        // if mesage => graph all messages
        if($stateParams.type == 1){
            graphMessages();
        }

        // if comment => graph post owner
        if($stateParams.post_id){
            Facebook.api('/' + $stateParams.post_id + '?fields=full_picture,message,picture,attachments,story,permalink_url&date_format=U&access_token=' + $rootScope.access_token, function(response) {
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

        // if comment => graph conversation log
        var graphComments = function(){
            Facebook.api('/' + $stateParams.conversation_id + '?fields=comments{from,message,created_time,id},permalink_url,from,message,created_time,admin_creator&date_format=U&access_token=' + $rootScope.access_token, function(response) {
                // console.log(response);
                if(response && !response.error){
                    $scope.$apply(function(){
                        $scope.conversation = response;
                        $scope.finishGraphConversation = true; 
                    });
                }
            });
        }
        if(!$stateParams.type){
            graphComments();
        }
        

        // #test
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
            if($stateParams.type == 1){
                replyMessage();
            }
            else{
                replyComment();
            }
            
        }

        var replyComment = function(){
            FB.api(
                "/" + $stateParams.conversation_id + "/comments",
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
                        graphComments();
                    });
                  }
                }
            );
        }
        var replyMessage = function(){
            FB.api(
                "/" + $stateParams.conversation_id + "/messages",
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
                        graphMessages();
                    });
                  }
                }
            );
        }

        // snackbar functions
        $scope.showSnackbar = function() {
            var options = {
              message : "custom text",
              time: "LONG"
            }
            $snackbar.show(options);
        };

        
	});