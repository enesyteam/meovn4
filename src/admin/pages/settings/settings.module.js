/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.settings', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/settings','/settings/options');
    $stateProvider
      .state('home.settings',{
          url: '/settings',
              templateUrl: "src/admin/pages/settings/settings.html"
            });
  }

})();
