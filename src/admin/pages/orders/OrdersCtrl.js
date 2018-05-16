m_admin.controller('OrdersCtrl',
function($rootScope, $scope, $filter, MFirebaseService, MUtilitiesService, telesales, statuses, fanpages, replies) {
    // console.log(statuses);
	$rootScope.telesales = telesales;
    $rootScope.telesales_arr = telesales;
	$rootScope.statuses = statuses;

    $rootScope.finishLoadFullData = null;
	
	$rootScope.filterById = function(sources, id) {
        if(!id) return null;
        return $filter("filter")(sources, {
            id: id
        })[0];
    }

    var todayDateString = MFirebaseService.convertDate(new Date());

    firebase.database().ref().child('report/' + todayDateString + '/userReport')
        .on('child_added', snapshot => {
            
            // check if report for this user is exist?
            // var keepGoing = true;
            // $rootScope.telesales_arr.forEach(function(tls){
            //     if(snapshot.key == tls.id){
                    
            //     }
            // })

            // if(keepGoing){
            //     // console.log('sdsfsdfsd')
            //     $scope.$apply(function(){
            //         $rootScope.telesales_arr.indexOf()
            //         var changed_tls = $scope.filterById($rootScope.telesales_arr, snapshot.key);
            //         if(changed_tls){
            //            changed_tls.report =  snapshot.val();
            //         }
            //     })
            // }

            angular.forEach($rootScope.telesales_arr, function(seller) {
                if (snapshot.key == seller.id) {
                    // console.log(report);
                    seller.report = snapshot.val();
                }
            })
        })
    

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