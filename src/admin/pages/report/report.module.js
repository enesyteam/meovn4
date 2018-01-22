/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.report', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/settings','/settings/options');
    $stateProvider
      .state('home.report',{
          url: 'report',
              templateUrl: "src/pages/report/report.html"
            });
  }

})();
