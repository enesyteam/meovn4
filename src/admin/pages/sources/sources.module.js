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
              templateUrl: "src/admin/pages/sources/pages/pages.html",
              resolve: {
                  fanpages: function(MFirebaseService){
                      MFirebaseService.set_firebase(firebase);
                      // console.log(MFirebaseService);
                      return MFirebaseService.get_fanpages().then(function(response){
                        // console.log(response);
                        return response;
                      });
                    },
                    ghn_hubs: function(MGHNService, ghn_token){
                      MGHNService.setAccessToken(ghn_token);
                      return MGHNService.getHubs().then(function(response){
                          return response.data.data;
                      })
                    }
                  }
                  
            })
      .state('home.sources.upload',{
          url: '/uploads',
              controller : 'UploadCtrl',
              templateUrl: "src/admin/pages/sources/upload/upload.html"
            });
  }

})();
