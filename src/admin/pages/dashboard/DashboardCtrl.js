m_admin.controller('DashboardCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, Facebook,
        MFirebaseService, MFacebookService, MUtilitiesService, fanpages, access_token, $stateParams) {
        // get access token
        // console.log(fanpages);
        var getAccessToken = function(){
            $http.get('../assets/access_token.json').
              then(function onSuccess(response) {
                 $rootScope.access_token_arr = response.data;
              }).
              catch(function onError(response) {
               // console.log(response);
              });
        }
        getAccessToken();

        $scope.findPageById = function(id) {
            return $filter("filter")(fanpages, {
                id: id
            })[0];
        }

        // 

        $scope.fromDate = $stateParams.fromDate;
        $scope.toDate = $stateParams.toDate;
        $scope.statusId = $stateParams.statusId;

        $scope.gettingOrders = true;

        MFirebaseService.getAllOrdersByDateRange( $scope.fromDate, $scope.toDate ).then( function( response ) {
          $scope.$apply( function() {
            console.log(response);
            $scope.gettingOrders = false;
            $scope.result = response;
          } )
        } );

        $scope.getStatusById = function(statusId){
            if(!$rootScope.statuses) return "null";
            return $filter("filter")($rootScope.statuses, {
                id: statusId
            })[0];
        }  

        function getComment( order ) {
          if ( !order || !order.activeLog || !order.activeLog.length == 0 ) return null;
          
          let comment = '';
          angular.forEach( order.activeLog, function( log ) {
              if( log.type == 2 ) {
                comment += ' ' + log.content;
              }
          } );

          return comment;
        }

        $scope.currentDateRange = function() {
          return $scope.fromDate + '~' + $scope.toDate;
        }

        $scope.getCSV = function(){
            if(!$scope.result || $scope.result.length == 0){
                MUtilitiesService.AlertError('Không có dữ liệu', 'Lỗi');
                return null;
            }
            
            var res = [];
            angular.forEach($scope.result, function(order){
              res.push( {
                name: order.customer_name,
                mobile: order.customer_mobile,
                page: $filter('filter')(fanpages, {id: order.page_id})[0].name,
                status: $scope.getStatusById(order.status_id).name,
                comment: getComment(order),
                cancel_reason: order.cancel_reason,

              } )
            });
          // console.log( res );
          return res;
        }
        

        // var ref = firebase.database().ref();
    
});