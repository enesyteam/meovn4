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

        function getShippingItemByDateRange() {
          $scope.gettingShippings = true;
          MFirebaseService.getShippingItemByDateRange( $stateParams.fromDate, $stateParams.toDate ).then( function( response ) {
            $scope.$apply( function() {
              console.log(response);
              $scope.gettingShippings = false;
              $scope.shippings = response;
            } )
          } );
        }
        getShippingItemByDateRange();

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
                note: order.admin_note,

              } )
            });
          // console.log( res );
          return res;
        }

        $scope.getShippingCSV = function(){
            
            if(!$scope.shippings || $scope.shippings.length == 0){
                MUtilitiesService.AlertError('Không có dữ liệu', 'Lỗi');
                return null;
            }
            
            var res = [];
            angular.forEach($scope.shippings, function( shipping ){
              var time = new Date( shipping.data.orderData.publish_date );
              // var time = time.getTime();

              var theyear = time.getFullYear();
              var themonth = time.getMonth() + 1;
              var thetoday = time.getDate();
              res.push( {
                date: thetoday + '/' + themonth,
                cod: shipping.data.customerData.cod,
                name: shipping.data.customerData.realName,
                mobile: shipping.data.customerData.recievedPhone,
                birthday: shipping.data.customerData.birthDay,
                address: shipping.data.customerData.addresss,
                page: $filter('filter')(fanpages, {id: shipping.data.orderData.page_id})[0].name,
                comment: shipping.data.customerData.customerNote + shipping.data.customerData.orderNote,
                wish: shipping.data.customerData.wish || '',
              } )
            });
          // console.log( res );
          return res;
        }

        $scope.orderData = [];
          $http.get('../../../assets/orders.json').
            then(function onSuccess(response) {
               angular.forEach( response.data, ( order, key ) => {
                  if ( order.customer_mobile ) {
                      // console.log( order.customer_mobile );
                      $scope.orderData.push( {
                        mobile: order.customer_mobile, page: order.page_id
                      } )
                  }
               } )
               // console.log( $scope.orderData );
            }).
            catch( function( error ) {
              console.log( error )
            } );
        
      $scope.getOrdersCSV = function(){
         return $scope.orderData;
      }

        // var ref = firebase.database().ref();
    
});