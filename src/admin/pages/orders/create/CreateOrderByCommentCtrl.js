m_admin.controller('CreateOrderByCommentCtrl',
function($rootScope, $scope, $http, $rootScope, $timeout, cfpLoadingBar, firebaseService, Facebook) {
  // $scope.successArr = $rootScope.successArr;
  $scope.test = 'ssssss';
  $scope.originalMessage = null;
  $scope.subMessages = null;
  $scope.conversationLink = '';
  $scope.userAvatar = 'assets/images/default-avatar-contact.svg';
  $scope.userName = '';
  $scope.pageInfo = null;
  $scope.post_data = null;

  $scope.finishedGraph = null;

  $scope.orderData = {
      id : null,
      page_id: null,
      post_id: null,
      conversation_id : null,
      customer_id: null,
      customer_name: null,
      customer_mobile: null,
      customer_message: null,
      admin_note: null,
      seller_will_call_id:null,
      publish_date: Date.now(),
    }

  // facebookService.graphOriginalConversation('326410367763204_326415471096027').then(function(data){
  // 	console.log(data);
  // });

  	// graph original conversation
  	// params: conversationId = Conversation ID; e.g: 326410367763204_326415471096027
    var graphOriginalConversation = function(conversationId) {
        Facebook.api('/' + conversationId + '?fields=comments{from,message,created_time,id},permalink_url,from,message,created_time,admin_creator&access_token=' + $rootScope.access_token, function(response) {
        	// console.log(response);
          var p = conversationId.split('_');

          $scope.orderData.conversation_id = conversationId; //

        	$scope.$apply(function(){
        		$scope.originalMessage = response; 
            $scope.orderData.customer_id = response.from.id; //
            $scope.orderData.customer_name = response.from.name; //
            // find owner post
            var link = response.permalink_url;
            // console.log(link);
            if(link.indexOf('permalink') !== -1){
              Facebook.api('/' + link + $rootScope.access_token, function(r){
                $scope.pageInfo = r;
                // console.log(r);

                $scope.orderData.page_id = r.id; //

                var post_id =  $scope.pageInfo.id + "_" + p[0];
                $scope.orderData.post_id = post_id; //

                Facebook.api('/' + post_id + '?access_token=' + $rootScope.access_token, function(r){
                    // console.log(r);
                    $scope.post_data  = r;
                  })
              })
            }
            else{
              var temp = link.split('/');
              var pageUsername = temp[3];
              Facebook.api('/' + pageUsername + '?access_token=' + $rootScope.access_token, function(r){
                $scope.pageInfo = r;
                $scope.orderData.page_id = r.id; //
                
                var post_id =  $scope.pageInfo.id + "_" + p[0];
                $scope.orderData.post_id = post_id; //
                Facebook.api('/' + post_id + '?fields=picture,message,created_time&access_token=' + $rootScope.access_token, function(r){
                    // console.log(r);
                    $scope.post_data  = r;
                    
                  })
              })
            }

            //
            $scope.subMessages = null;
              if(response.comments){
                $scope.subMessages= [];
                  angular.forEach(response.comments.data, function(item){
                    
                    Facebook.api('/' + item.from.id + '/picture?height=100&width=100', function(r) {
                        Facebook.api('/' + item.from.id + '?access_token=' + $rootScope.access_token, function(res) {
                            $scope.subMessages.push({
                              'avar' : r.data.url,
                              'id' : item.from.id,
                              'name' : res.name,
                              'content' : item.message,
                              'created_time' : item.created_time,
                            });
                            
                        });
                    });
                  });
                  // $scope.subMessages = response.data;
              }
              $scope.finishedGraph = true;
        	});
            
        });
    }
    var graphUserAvatar = function(userId) {
        Facebook.api('/' + userId + '/picture?height=100&width=100', function(response) {
            $scope.$apply(function(){
              $scope.userAvatar = response.data.url;
            });
            
        });
    }
    // var graphUserName = function(userId) {
    //     Facebook.api('/' + userId + '?access_token=' + $rootScope.access_token, function(response) {
    //         $scope.$apply(function(){
    //           $scope.userName = response.name;
    //         });
            
    //     });
    // }
   $scope.graph = function(){
    $scope.finishedGraph = null;

   	var l = $scope.conversationLink.split('/');
  	var conversationId = l[l.length -1];

   	graphOriginalConversation(conversationId);
    // graphSubConversation(conversationId);
    // display
    if($rootScope.sources){
      $scope.selectedSource = $rootScope.sources[1];
    }
   }

   // functions
   var findSource = function(){

   }
   
   $scope.selectedSource = null;
   $scope.sourceChanged = function(){
    console.log($scope.selectedSource);
    // alert('sdf');
   }

   // TODO: SUBMIT NEW ORDER
   
   $scope.submitOrder = function(){
      var newOrderKey = firebase.database().ref().child('newOrders').push().key;

      $scope.orderData.id = newOrderKey;

      firebase.database().ref().child('newOrders').push($scope.orderData).then(function(response){
        console.log(response);
      });
   }


});
