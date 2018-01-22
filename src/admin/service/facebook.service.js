/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('m_admin')
  .service('facebookService', ["$filter", 'Facebook', function ($filter, scope, Facebook) { 
  	var access_token = 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD';
  	// graph original conversation
  	// params: conversationId = Conversation ID; e.g: 326410367763204_326415471096027
    var graphOriginalConversation = function(conversationId) {
        Facebook.api('/' + conversationId + '?access_token=' + access_token, function(response) {
            return response; 
        });
    }


    // return
    return {
    	graphOriginalConversation : graphOriginalConversation,
    }

  }]);

})();