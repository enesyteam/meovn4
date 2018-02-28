/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('mRealtime')
  .service('accessTokenService', ["$http", function ($http, scope) { 

	var getAccessToken = function(){
       return $http.get('../assets/access_token.json').
          then(function onSuccess(response) {
             return response.data;
          }).
          catch(function onError(response) {
          });
    }

    return {
    	getAccessToken : getAccessToken,
    }
        

}])
})();