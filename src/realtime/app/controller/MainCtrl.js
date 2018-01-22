mRealtime.controller('MainCtrl',
    function($rootScope, $scope, $window, $filter, $timeout, cfpLoadingBar, cfpLoadingBar, Facebook, firebaseService) {
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

        
	});