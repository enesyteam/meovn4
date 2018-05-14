/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.orders', [])
      .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.when('/admin/orders','/admin/orders/push');
        $urlRouterProvider.when('/admin/orders/create','/admin/orders/create/byComment');
        $urlRouterProvider.when('/admin/orders/push','/admin/orders/push/all');
        $stateProvider
          .state('home.orders',{
              url: '/orders',
                  controller : 'OrdersCtrl',
                  templateUrl: "src/admin/pages/orders/orders.html",
                  resolve: {
                    can_release_statuses: function(MFirebaseService){
                      // MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.getCanReleaseStatusIds().then(function(response){
                        return response
                      });
                    },
                    replies: function(MFirebaseService){
                      return MFirebaseService.getReplies().then(function(response){
                        return response;
                      })
                    }
                  }
                })
          .state('home.orders.list',{
              url: '/list',
                  controller : 'ListOrderCtrl',
                  templateUrl: "src/admin/pages/orders/list/list.html"
                })
          .state('home.orders.push',{
              url: '/push',
                  controller : 'PushOrderCtrl',
                  templateUrl: "src/admin/pages/orders/push/list.html"
                })
          .state('home.orders.push.all',{
              url: '/all',
                  controller : 'PushOrderCtrl',
                  templateUrl: "src/admin/pages/orders/push/list-all.html"
                })
          .state('home.orders.push.uid',{
              url: '/id=:uid',
                  params: {uid: null},
                  controller : 'PushOrderCtrl',
                  templateUrl: "src/admin/pages/orders/push/list-by-user.html"
                })
          .state('home.orders.create',{
                url: '/create',
                controller : 'CreateOrderCtrl',
                templateUrl: "src/admin/pages/orders/create/create-order.html"
            })
          .state('home.orders.create.byComment',{
                url: '/byComment',
                controller : 'CreateOrderByCommentCtrl',
                templateUrl: "src/admin/pages/orders/create/create-order-by-comment.html"
                
            });
      });

  /** @ngInject */
  // function routeConfig($stateProvider, $urlRouterProvider) {
  //   $urlRouterProvider.when('/orders','/orders/create');
  //   $urlRouterProvider.when('/orders/create','/orders/create/byComment');
  //   $stateProvider
  //     .state('home.orders',{
  //         url: 'orders',
  //             templateUrl: "src/pages/orders/orders.html"
  //           })
  //     .state('home.orders.create',{
  //           url: '/create',
  //           controller : 'CreateOrderCtrl',
  //           templateUrl: "src/pages/orders/create/create-order.html"
  //       })
  //     .state('home.orders.create.byComment',{
  //           url: '/byComment',
  //           controller : 'CreateOrderByCommentCtrl',
  //           templateUrl: "src/pages/orders/create/create-order-by-comment.html"
  //       });
  // }

})();
