mRealtime.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $filter, $timeout, cfpLoadingBar, cfpLoadingBar, Facebook, firebaseService) {
    	
        var getAccessToken = function(){
            $http.get('../access_token.json').
              then(function onSuccess(response) {
                 $rootScope.access_token_arr = response.data;
              }).
              catch(function onError(response) {
               // console.log(response);
              });
        }
        getAccessToken();

        $rootScope.orders = [];
    	$rootScope.sources = [];
    	$rootScope.packs = [];
        $rootScope.windowsHeight = $window.innerHeight;

        // on windows resize
        var appWindow = angular.element($window);
        appWindow.bind('resize', function () {
            // console.log($window.innerHeight);
            $scope.$apply(function(){
                $rootScope.windowsHeight = $window.innerHeight;
            });
          });

    	// get sources
    	firebaseService.getSources().then(function(snapshot){
    		$scope.$apply(function(){
    			snapshot.forEach(function(child){
	    			// console.log(child.val());
	    			$rootScope.sources.push(child.val());
	    		});
    		});
    	});
    	// get orders
    	// firebaseService.getOrders().then(function(snapshot){
    	// 	$scope.$apply(function(){
    	// 		snapshot.forEach(function(child){
	    // 			// console.log(child.val());
	    // 			$rootScope.orders.push(child.val());
	    // 		});
     //            $rootScope.finishLoadingOrders = true;
    	// 	});
    		
    	// });
        // v4
        firebaseService.getNewOrders().then(function(snapshot){
            $scope.$apply(function(){
                // snapshot.forEach(function(child){
                //     $rootScope.orders.push(child.val());
                // });
                $rootScope.orders = snapshot.val();
                $rootScope.finishLoadingOrders = true;
            });
            
        });
    	firebaseService.getPacks().then(function(snapshot){
    		$scope.$apply(function(){
    			snapshot.forEach(function(child){
	    			$rootScope.packs.push(child.val());
	    		});
    		});
    		
    	});

        $rootScope.testScroll = function(){
            console.log('dd');
        }

        
	});