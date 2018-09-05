/**
 * @author congnvc@gmail.com
 * created on 26.12.2017
 */
(function () {
  'use strict';

  angular.module('m_admin.dashboard', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/#/admin','/#/admin/dashboard/general');
    $urlRouterProvider.when('/admin/dashboard','/admin/dashboard/general');
    $stateProvider
        .state('home.dashboard',{
            url: '/dashboard',
            controller : 'DashboardCtrl',
            templateUrl: "src/admin/pages/dashboard/dashboard.html",
        })
        .state('home.dashboard.general',{
            url: '/general',
            controller : 'GeneralCtrl',
            templateUrl: "src/admin/pages/dashboard/general/general.html",
            // resolve : {
            //   chart_data: function(MFirebaseService){
            //     return MFirebaseService.getReportForChart().then(function(response){
            //       return response;
            //     });
            //   }
            // }
        })
        .state('home.dashboard.realtime',{
            url: '/realtime',
            controller : 'RealtimeCtrl',
            templateUrl: "src/admin/pages/dashboard/realtime/realtime.html"
        })
        .state('home.download', {
            url: '/download/fromDate=:fromDate/todate=:toDate/statusId=:statusId',
            controller: 'DashboardCtrl',
            templateUrl: "src/admin/pages/dashboard/download.html"
        })
  }

})();
