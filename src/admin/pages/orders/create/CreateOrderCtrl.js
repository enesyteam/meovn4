m_admin.controller('CreateOrderCtrl',
function($rootScope, $scope, $timeout, cfpLoadingBar, firebaseService, Facebook) {
  // $scope.successArr = $rootScope.successArr;
  // $scope.test = 'ssssss';
  // $scope.test2 = '';
  // $scope.conversationLink = '';

  // // facebookService.graphOriginalConversation('326410367763204_326415471096027').then(function(data){
  // // 	console.log(data);
  // // });

  // var access_token = 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD';
  // 	// graph original conversation
  // 	// params: conversationId = Conversation ID; e.g: 326410367763204_326415471096027
  //   var graphOriginalConversation = function(conversationId) {
  //       Facebook.api('/' + conversationId + '?access_token=' + access_token, function(response) {
  //       	// console.log(response);
  //       	$scope.$apply(function(){
  //       		$scope.test2 = response; 
  //       	});
            
  //       });
  //   }
  //  $scope.graph = function(){
  //  	alert($scope.conversationLink);
  //  	var temp = $scope.conversationLink.split('/');
  // 	var conversationId = temp[temp.length -1];
  // 	console.log(conversationId);

  //  	graphOriginalConversation(conversationId);
  //  }
   

});