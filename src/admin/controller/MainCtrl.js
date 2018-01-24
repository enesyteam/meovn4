m_admin.controller('MainCtrl',
    function($rootScope, $scope, $http, $filter, $timeout, cfpLoadingBar, firebaseService, cfpLoadingBar, Facebook) {
        // get access token
        var getAccessToken = function(){
            $http.get('../access_token.json').
              then(function onSuccess(response) {
                 $rootScope.access_token_arr = response.data;
              }).
              catch(function onError(response) {
               // console.log(response);
              });
        }
        getAccessToken();


        $scope.start = function() {
            cfpLoadingBar.start();
        };

        $scope.complete = function() {
            cfpLoadingBar.complete();
        }
        // load all sources
        $rootScope.sources = [];

        var init = function() {
            var t0 = performance.now();
            $scope.start();
            firebaseService.getAllSources().then(function(sources) {
                $rootScope.sources = sources;

                // $rootScope.pages = [];
                // angular.forEach(sources, function(source){
                //  console.log(source.page_id);
                //  Facebook.api('/' + source.page_id + '?fields=picture,name,new_like_count,fan_count&access_token=' + access_token, function(response) {
                //         $scope.$apply(function(){
                //           $scope.pages.push(response);
                //         })
                //        });
                // });

                // get members
                firebaseService.getAllMembers().then(function(members) {
                    $rootScope.members = members;
                    firebaseService.getAllStatuses().then(function(statuses) {
                        $rootScope.statuses = statuses;
                        firebaseService.getAllMembers().then(function(sls) {
                            angular.forEach(sls, function(s) {
                                if (s.is_seller == 1 && s.status == 1) {
                                    // $scope.test += s.last_name;
                                    $rootScope.chartData.push({
                                        'id': s.id,
                                        'name': s.last_name,
                                        'fullName': s.first_name + ' ' + s.last_name,
                                        'data': {
                                            'called': [],
                                            'success': [],
                                            'failed': [],
                                            'miss': [],
                                            'busy': [],
                                            'cancel': [],
                                            'notCalled': [],
                                            'bad': [],
                                        }
                                    });
                                }
                            });
                            getData();
                        });
                    });
                    // $scope.complete();
                    var t1 = performance.now();
                    console.log("Finished after " + (t1 - t0) / 1000 + " seconds.")
                    $scope.complete();
                    $rootScope.finishLoading = true;
                });
                // $scope.complete();
            });
        }
        // find status by ID
        function getStatusById(statusId) {
            var found = $filter('filter')($rootScope.statuses, {
                id: statusId
            }, true);
            if (found.length) {
                return found[0];
            } else {
                return null;
            }
        }

        var ref = firebase.database().ref();
        // rootScope
        $rootScope.successArr = [];
        $rootScope.notCalledArr = [];
        $rootScope.notAssignedArr = [];
        $rootScope.calledArr = [];
        $rootScope.todayArr = [];
        $rootScope.othersArr = [];
        $rootScope.failedArr = [];
        $rootScope.badArr = []; // 8
        $rootScope.busyArr = []; // 9
        $rootScope.missArr = []; // 5
        $rootScope.cancelArr = []; // 7
        $rootScope.badArr = [];
        $rootScope.chartData = [];
        // prepare chart data


        $rootScope.finishLoading = false;

        $scope.sortArr = [{
                'id': 1,
                'name': 'Số đơn chốt',
                'property': 'data.success',
            },
            {
                'id': 2,
                'name': 'Số lượng cuộc gọi',
                'property': 'data.called',
            },
            {
                'id': 3,
                'name': 'Thất bại',
                'property': 'data.failed',
            },
            {
                'id': 4,
                'name': 'Số chưa gọi',
                'property': 'data.notCalled',
            }
        ];

        // $scope
        $scope.sellers = [];
        $scope.sortProperty = $scope.sortArr[0].property;
        $scope.changeSortProperty = function(sortItem) {
            $scope.sortProperty = sortItem.property;
        }

        // Main Nav
        $scope.start = function() {
            cfpLoadingBar.start();
        };

        $scope.complete = function() {
            cfpLoadingBar.complete();
        }


        // get orders
        var d = new Date();

        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday

        startTime.setDate(startTime.getDate() - 4); // get 4 recent days
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();

        var getData = function() {
            ref.child('orders').orderByChild('created_at').startAt(startTime).endAt(endTime).once('value', function(snapshot) {
                // console.log(snapshot.val());
                snapshot.forEach(function(child) {
                    var ad = new Date(child.val().created_at);
                    if (ad.getDate() == d.getDate() && ad.getMonth() == d.getMonth() && d.getFullYear() == ad.getFullYear()) {
                        $rootScope.todayArr.push(child.val());
                    }
                    // orders successed
                    if (child.val().status_id == 6) {
                        var cd = new Date(child.val().checked_at);
                        if (cd.getDate() == d.getDate() && cd.getMonth() == d.getMonth() && d.getFullYear() == cd.getFullYear()) {
                            $rootScope.successArr.push(child.val());
                            $rootScope.todayArr.push(child.val());
                            //update value
                            angular.forEach($rootScope.chartData, function(sellerData) {
                                if (sellerData.id == child.val().checked_by) {
                                    sellerData.data.success.push(child.val());
                                    sellerData.data.called.push(child.val());
                                    $rootScope.calledArr.push(child.val());
                                }
                            });
                        }
                    }
                    // not called
                    else if (child.val().status_id == 1) {
                        $rootScope.notCalledArr.push(child.val());

                        if (!child.val().seller_will_call_id) {
                            $rootScope.notAssignedArr.push(child.val());
                        }
                        //update value for seller
                        angular.forEach($rootScope.chartData, function(sellerData) {
                            if (sellerData.id == child.val().seller_will_call_id) {
                                sellerData.data.notCalled.push(child.val());
                            }
                        });
                    } else if (child.val().status_id == 2 || child.val().status_id == 3 || child.val().status_id == 7) {
                        // $rootScope.othersArr.push(child.val());
                        if (child.val().assign_data) {
                            angular.forEach(child.val().assign_data, function(a) {
                                var ad = new Date(a.assigned_date);
                                if (ad.getDate() == d.getDate() && ad.getMonth() == d.getMonth() && ad.getFullYear() == d.getFullYear()) {
                                    if (a.status_after && (a.status_after == 2 || a.status_after == 3 || a.status_after == 7)) {
                                        $rootScope.failedArr.push(child.val());
                                        //update value for seller
                                        angular.forEach($rootScope.chartData, function(sellerData) {
                                            if (sellerData.id == a.uid) {
                                                sellerData.data.failed.push(child.val());
                                                sellerData.data.called.push(child.val());
                                                $rootScope.calledArr.push(child.val());
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        if (!child.val().seller_will_call_id && child.val().status_id != 7) {
                            $rootScope.notAssignedArr.push(child.val());
                        }
                    }
                    // bad
                    else {
                        if (!child.val().seller_will_call_id && child.val().status_id != 7) {
                            $rootScope.notAssignedArr.push(child.val());
                        }

                        if (child.val().status_id == 8) {
                            $rootScope.badArr.push(child.val());
                        } else if (child.val().status_id == 5) {
                            $rootScope.missArr.push(child.val());
                        } else if (child.val().status_id == 9) {
                            $rootScope.busyArr.push(child.val());
                        } else if (child.val().status_id == 7) {
                            $rootScope.cancelArr.push(child.val());
                        } else {
                            console.log('Cuộc gọi chưa ghi nhận trạng thái');
                        }

                        if (child.val().assign_data) {
                            angular.forEach(child.val().assign_data, function(a) {
                                var ad = new Date(a.assigned_date);
                                if (ad.getDate() == d.getDate() && ad.getMonth() == d.getMonth() && ad.getFullYear() == d.getFullYear()) {
                                    if (a.status_after) {

                                        //update value for seller
                                        angular.forEach($rootScope.chartData, function(sellerData) {
                                            if (sellerData.id == a.uid) {
                                                sellerData.data.called.push(child.val());
                                                $rootScope.calledArr.push(child.val());

                                                if (a.status_after == 8) {
                                                    sellerData.data.bad.push(child.val());
                                                } else if (a.status_after == 5) {
                                                    sellerData.data.miss.push(child.val());
                                                } else if (a.status_after == 9) {
                                                    sellerData.data.busy.push(child.val());
                                                } else if (a.status_after == 7) {
                                                    sellerData.data.cancel.push(child.val());
                                                } else {
                                                    console.log('Cuộc gọi chưa ghi nhận trạng thái');
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });

                angular.forEach($rootScope.chartData, function(sellerData) {
                    if (sellerData.data.called.length > 0) {
                        $scope.activedSellers++;
                    }
                });

                // make chart
            });
        }

        $rootScope.activedSellers = 0;

        init();

    });