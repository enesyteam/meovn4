/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('mShipping')
  .service('accessTokenService', ["$http", function ($http, scope) { 

	var getAccessToken = function(){
       return $http.get('../access_token.json').
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