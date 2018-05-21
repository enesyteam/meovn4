/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('mRealtime.orders', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/#/admin','/#/admin/dashboard/general');
    // $urlRouterProvider.when('/admin/dashboard','/admin/dashboard/general');
    $stateProvider
        .state('home.detail', {
                url: 'o/type=:type&:id&pa=:page_id&po=:post_id&c=:conversation_id&u=:customer_id',
                controller: 'OdersCtrl',
                templateUrl: "/src/realtime/pages/orders/detail.html",
                params     : { type: null, id : null, page_id: null, post_id: null, 
                  conversation_id: null, customer_id: null, status_id: null},
                resolve: {
                  activeItem : function(MFirebaseService, $stateParams){
                    MFirebaseService.set_firebase(firebase);
                    return MFirebaseService.getOrderItem($stateParams.id).then(function(response){
                      return response;
                    });
                  }

                },
            });
  }

})();
