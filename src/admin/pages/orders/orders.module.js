/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.orders', [])
      .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.when('/admin/orders','/admin/orders/create');
        $urlRouterProvider.when('/admin/orders/create','/admin/orders/create/byComment');
        $stateProvider
          .state('home.orders',{
              url: '/orders',
                  templateUrl: "src/admin/pages/orders/orders.html"
                })
          .state('home.orders.list',{
              url: '/list',
                  controller : 'ListOrderCtrl',
                  templateUrl: "src/admin/pages/orders/list/list.html"
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
