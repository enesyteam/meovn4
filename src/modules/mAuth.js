(function () {
    'use strict';

	angular.module('mAuth', ['firebase']);

	angular.module('mAuth')
	    .service('MAuthService', ["$http", '$q', "$timeout", 'firebase',
	        function ($http, $q, $timeout, firebase) {
	        	// console.log(firebase);

	        	var auth = function(){
	        		firebase.auth().onAuthStateChanged(function(user) {
	        			// console.log(user);
				        // return new Promise(function(resolve, reject){
				        	if (!user) {
					            return null;
					        } else {
					        	return user;
					        }
				        // })
				    });
	        	}

	        	return {
	        		auth: auth,
	        	}

	        }
	]);

}());