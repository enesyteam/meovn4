m_admin.controller('OrdersCtrl',
function($rootScope, $scope, $filter, MFirebaseService, MUtilitiesService, telesales, statuses, fanpages, replies) {
	$rootScope.telesales = telesales;
	$rootScope.statuses = statuses;
	
	$rootScope.filterById = function(sources, id) {
        if(!id) return null;
        return $filter("filter")(sources, {
            id: id
        })[0];
    }	

    $rootScope.showChatBox = function(order){
      	MUtilitiesService.showChatBox(function(){
                var findReply = function(key){
                    return new Promise(function(resolve, reject){
                        MFirebaseService.findReplyByKey(key).then(function(response){
                            resolve(response);
                        })
                        .catch(function(err){
                            reject(err);
                        })
                    })
                }
                return {
                    order : order,
                    token: $rootScope.access_token,
                    fanpages: fanpages,
                    findReply : findReply,
                    replies : replies
                }
            })
            .then(function(response){
                // console.log(response);
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err);
            });
    }
});