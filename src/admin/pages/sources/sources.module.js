/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.sources', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/settings','/settings/options');
    $urlRouterProvider.when('/admin/sources','/admin/sources/pages');
    $stateProvider
      .state('home.sources',{
          url: '/sources',
              templateUrl: "src/admin/pages/sources/sources.html"
            })
      .state('home.sources.pages',{
          url: '/pages',
              controller : 'SourcePageCtrl',
              templateUrl: "src/admin/pages/sources/pages/pages.html"
            })
      .state('home.sources.upload',{
          url: '/uploads',
              controller : 'UploadCtrl',
              templateUrl: "src/admin/pages/sources/upload/upload.html"
            });
  }

})();
