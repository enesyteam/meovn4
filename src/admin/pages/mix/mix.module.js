/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.mix', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/admin/dashboard','/admin/dashboard/general');
    $stateProvider
        .state('home.mix',{
            url: '/mix',
            controller : 'MixCtrl',
            templateUrl: "src/admin/pages/mix/mix.html",
        })
  }

})();
