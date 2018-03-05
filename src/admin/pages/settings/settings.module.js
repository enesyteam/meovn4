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
    $urlRouterProvider.when('/admin/settings','/admin/settings/options');
    $stateProvider
      .state('home.settings',{
          url: '/settings',
              templateUrl: "src/admin/pages/settings/settings.html"
            })
      .state('home.settings.options',{
              url: '/options',
                  controller : 'OptionsCtrl',
                  templateUrl: "src/admin/pages/settings/options.html"
                })
      .state('home.settings.ghn',{
              url: '/ghn',
                  controller : 'GHNCtrl',
                  templateUrl: "src/admin/pages/settings/ghn/ghn.html",
                  resolve: {
                    ghn_token: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_ghn_token().then(function(response){
                        return response;
                      });
                    }
                  }
                });
  }

})();
