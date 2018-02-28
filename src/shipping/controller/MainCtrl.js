mShipping.controller('MainCtrl',
    function($rootScope, $scope, $http, $window, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook) {
        //GHN API
        $rootScope.ghnToken = '5a93de5d1070b06c97794a48';

        // setup pages and hub
        $rootScope.pages = [
          {
            id : 137428680255822,
            hubId : 1006532,
          },
          {
            id : 1754290804583419,
            hubId : 1006561,
          }
        ];

        // GetHubs
        $scope.getHubs = function(){
          var config = {
                      headers : {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                      }
                  }
              var data = {
                "token": $rootScope.ghnToken
            }

            $http.post('https://console.ghn.vn/api/v1/apiv3/GetHubs', data, config)
            .then(function (data) {
                  $rootScope.Hubs = data;
            });
        }.call(this);

        $rootScope.Hubs = [];

        $rootScope.windowsHeight = $window.innerHeight;
        $rootScope.windowsWidth = $window.innerWidth;

        // on windows resize
        var appWindow = angular.element($window);
        appWindow.bind('resize', function() {
            $scope.$apply(function() {
                $rootScope.windowsHeight = $window.innerHeight;
                $rootScope.windowsWidth = $window.innerWidth;
            });
        });

        $scope.shippingItems = [{
                id: 'sdfsdfsdffsd',
                customer_name: 'Nguyễn Văn Công',
                customer_mobile: '0943312354',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 559693391089902,
                ctype: 1,
            },
            {
                id: 'rt45654dfgd',
                customer_name: 'Nguyễn Văn Đức',
                customer_mobile: '0123456789',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 200267704041580,
                ctype: 1,
            },
            {
                id: 'sdf89897',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: '31sdfdf',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: '87887sdewr',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: 'sdfwe9871',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: 'saerwe778812',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: 'srwerw784465',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: 'xcserwer77',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: 'zsdfwerewew1112',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 137523543726909
            },
            {
                id: '-L4tY2tsC5-pW6Da-GPE',
                customer_name: 'Le Lê Trọc',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 559693391089902
            },
            {
                id: 'sdrwer7897',
                customer_name: 'Hà Thu',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 200267704041580
            },
            {
                id: 'sww8115w1w15',
                customer_name: 'Hoàng Bách',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 870758043108027
            },
            {
                id: '1a5as4e4ew',
                customer_name: 'Nguyễn Hoàng',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 2068502086759294
            },
            {
                id: 'e3893311s1',
                customer_name: 'Đặng Linh',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 989432991211876
            },
            {
                id: 'xdef48848',
                customer_name: 'Tran Bichthuy',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 2042510909322927
            },
            {
                id: 's8s8s8s8sd8f',
                customer_name: 'Lưu Thiên Minh',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 168369943804621
            },
            {
                id: 'sdw87e98w987',
                customer_name: 'Hoàng Thanh Sơn',
                customer_mobile: '0983479480',
                customer_address: 'Xóm 9 - Nghi Kiều - Nghi Lộc - Nghệ An',
                fbId: 1461451057294522,
                sender: {
                    mobile: '123456789',
                    name: 'Phong Thủy Tràng An',
                    address: 'Số 495 - đường Trần Hưng Đạo, p. Tiền An, Bắc Ninh'
                }
            }

        ];
    });