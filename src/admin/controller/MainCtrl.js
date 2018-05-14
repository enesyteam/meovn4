m_admin.controller('MainCtrl',
    function($rootScope, $window, $scope, $http, $filter, $timeout, firebaseService,  
        cfpLoadingBar, Facebook, MFirebaseService, MFacebookService, MUtilitiesService, fanpages, telesales, statuses, access_token) {
// checkTwoDatesEqual
        // listen for order change
        // $rootScope.todayReport = [];
        // console.log(telesales);
        $rootScope.sellers = [];
        $rootScope.telesales = telesales;
        $rootScope.statuses = statuses;

        var date = new Date();

        var dateToDisplay = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
        // alert(dateToDisplay);
        // GET REPORT FOR TODAY
        $rootScope.finishLoading = false;
        var getReport = function(date){
            $rootScope.todayReport = null;
            $rootScope.todayUsersReport = null;
            $rootScope.finishLoading = false;
            MFirebaseService.getReportForDate(date).then(function(snapshot){
                $scope.$apply(function(){
                    $rootScope.todayReport = snapshot.val();
                });
            })
            MFirebaseService.getUsersReportForDate(date).then(function(snapshot){
                $scope.$apply(function(){
                    // $rootScope.finishLoading = true;
                    $rootScope.todayUsersReport = snapshot.val();
                    // console.log(snapshot.val());
                });
            })
            MFirebaseService.getPagesReportForDate(date).then(function(snapshot){
                $rootScope.todayPagesReport = [];
                $scope.$apply(function(){
                    // $rootScope.finishLoading = true;
                    angular.forEach(snapshot.val(), function(value, key){

                        var page = {
                            id: key,
                            totalCustomers : value.totalCustomers,
                            totalsuccess : value.totalsuccess
                        }
                        // console.log(page);
                        $rootScope.todayPagesReport.push(page);
                    })
                    // console.log($rootScope.todayPagesReport);
                });
            })

            MFirebaseService.getShippingReportForDate(date).then(function(snapshot){
                $scope.$apply(function(){
                    $rootScope.finishLoading = true;
                    $rootScope.todayShippingReport = snapshot.val();
                });
            })
        }
        getReport(dateToDisplay);
        
        $rootScope.isUpdating = false;
        function isUpdateReport(){
            $rootScope.isUpdating = true;
            $timeout(function() {
                $rootScope.isUpdating = false;
            }, 3000);
        }
        $rootScope.toggleUpdating = function(){
            isUpdateReport();
        }
        $rootScope.lastUpdateReport = Date.now();
        $rootScope.currentDate = Date.now();
        var todayDateString = MFirebaseService.convertDate(new Date());
        firebase.database().ref().child('report/' + todayDateString).on('child_changed', snapshot => {
            if(MUtilitiesService.checkTwoDatesEqual($rootScope.currentDate, new Date())){
                // console.log();
                // console.log('key: ' + snapshot.key + ' - value:' + snapshot.val());
                if(snapshot.key == 'successCount'){
                    // console.log('THÔNG BÁO: SỐ ĐƠN CHỐT ĐÃ THAY ĐỔI THÀNH ' + snapshot.val());
                    $rootScope.todayReport.successCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }

                if(snapshot.key == 'today'){
                    $rootScope.todayReport.today = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'calledCount'){
                    $rootScope.todayReport.calledCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'notCalledCount'){
                    $rootScope.todayReport.notCalledCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'missedCount'){
                    $rootScope.todayReport.missedCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'callLaterCount'){
                    $rootScope.todayReport.callLaterCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'penddingCount'){
                    $rootScope.todayReport.penddingCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'cancelCount'){
                    $rootScope.todayReport.cancelCount = snapshot.val();
                    $rootScope.lastUpdateReport = Date.now();
                    isUpdateReport();
                }
                if(snapshot.key == 'lastSuccessAt'){
                    $rootScope.todayReport.lastSuccessAt = snapshot.val();
                    // $rootScope.lastUpdateReport = Date.now();
                    // isUpdateReport();
                }
            }
            else{
                console.log('Something changing...');
            }
        });

        // listen for user report add
        firebase.database().ref().child('report/' + todayDateString + '/userReport')
        .on('child_added', snapshot => {
            
            // check if report for this user is exist?
            // var keepGoing = true;
            // $rootScope.telesales_arr.forEach(function(tls){
            //     if(snapshot.key == tls.id){
                    
            //     }
            // })

            // if(keepGoing){
            //     // console.log('sdsfsdfsd')
            //     $scope.$apply(function(){
            //         $rootScope.telesales_arr.indexOf()
            //         var changed_tls = $scope.filterById($rootScope.telesales_arr, snapshot.key);
            //         if(changed_tls){
            //            changed_tls.report =  snapshot.val();
            //         }
            //     })
            // }

            angular.forEach($rootScope.telesales_arr, function(seller) {
                if (snapshot.key == seller.id) {
                    // console.log(report);
                    seller.report = snapshot.val();
                }
            })
        })



        // listen for user report change
        angular.forEach($rootScope.telesales, function(seller){
            firebase.database().ref().child('report/' + todayDateString + '/userReport/' + seller.id)
                .on('child_changed', snapshot => {
                    if(MUtilitiesService.checkTwoDatesEqual($rootScope.currentDate, new Date())){
                        console.log('báo cáo của ' + seller.last_name + ' đã thay đổi:')
                        console.log('key: ' + snapshot.key + ' - value:' + snapshot.val());
                        var s = $scope.filterById($rootScope.telesales_arr, seller.id);
                        if(s){
                            // console.log(s);
                            if(snapshot.key == 'successCount'){
                                // console.log('THÔNG BÁO: SỐ ĐƠN CHỐT ĐÃ THAY ĐỔI THÀNH ' + snapshot.val());
                                if(s.report)
                                s.report.successCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            
                            if(snapshot.key == 'calledCount'){
                                if(s.report)
                                s.report.calledCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'notCalledCount'){
                                if(s.report)
                                s.report.notCalledCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'missedCount'){
                                if(s.report)
                                s.report.missedCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'callLaterCount'){
                                if(s.report)
                                s.report.callLaterCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'penddingCount'){
                                if(s.report)
                                s.report.penddingCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'cancelCount'){
                                if(s.report)
                                s.report.cancelCount = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                            if(snapshot.key == 'lastSuccessAt'){
                                if(s.report)
                                s.report.lastSuccessAt = snapshot.val();
                                // $rootScope.lastUpdateReport = Date.now();
                                // isUpdateReport();
                            }
                        }
                    }
                })
            });

        // listen for page report change
        angular.forEach(fanpages, function(page){
            firebase.database().ref().child('report/' + todayDateString + '/pageReport/' + page.id)
                .on('child_changed', snapshot => {
                    if(MUtilitiesService.checkTwoDatesEqual($rootScope.currentDate, new Date())){

                        var s = $scope.filterById($rootScope.todayPagesReport, page.id);
                        if(s){
                            // console.log(s);
                            if(snapshot.key == 'totalCustomers'){
                                s.totalCustomers = snapshot.val();
                            }
                            if(snapshot.key == 'totalsuccess'){
                                s.totalsuccess = snapshot.val();
                            }
                        }
                    }
                })
            });


        $rootScope.signout = function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }, function(error) {
                // An error happened.
            });
        }

        
        firebase.auth().onAuthStateChanged(function(user) {
            // console.log(user);
            // alert('change user');
            if (!user) {
                console.log('Bạn chưa đăng nhập!');
                $window.location = '/login';
            } else {

                // console.log(user.email);
                $rootScope.firebaseUser = user;
                firebaseService.getAllMembers().then(function(members) {

                        angular.forEach(members.val(), function(member){
                            if(member.is_seller == 1){
                                $scope.$apply(function(){
                                    $rootScope.sellers.push(member);
                                });
                            }
                            

                            if(member.email == user.email){
                                if(member.is_admin !== 1 && member.is_mod !== 1){
                                    // console.log(member);
                                    $window.location = '/permissions';
                                }
                                // console.log(value);
                                 $scope.$apply(function(){
                                    $rootScope.currentMember = member;
                                });
                            }
                        })
                });
            }
        });
        // // get access token
        // var getAccessToken = function(){
        //     $http.get('../assets/access_token.json').
        //       then(function onSuccess(response) {
        //          $rootScope.access_token_arr = response.data;
        //       }).
        //       catch(function onError(response) {
        //        // console.log(response);
        //       });
        // }
        // getAccessToken();

        ///////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        

        $rootScope.selectedDate = dateToDisplay;

        $scope.getReportForSelectedDate = function(date){
            if(!date){
                getReport(dateToDisplay);
                return;
            }
            var d = new Date(date);
            var dd = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
            getReport(dd);
        }

        $scope.onAssignMoreForUser = function(userId){
            MUtilitiesService.AlertError('Chức năng này sẽ được bổ sung trong phiển bản release tiếp theo', 'Thông báo');
        }
        $scope.onReleaseMoreForUser = function(userId){
            MUtilitiesService.AlertError('Chức năng này sẽ được bổ sung trong phiển bản release tiếp theo', 'Thông báo');
        }  

        $rootScope.currentDate = new Date();
        $rootScope.onCurrentDateChange = function(newDate, oldDate){
            // Nếu currentDate khác với ngày hiện tại
            // var today = new Date();
            $rootScope.currentDate = new Date(newDate);

            // if(checkTwoDatesEqual((new Date(newDate)), new Date())){
            //     alert('Ngày không thay đổi');
            //     return;
            // }
            // alert('Date changed from: ' + oldDate + ' to: ' + newDate)
            if(!date){
                getReport(dateToDisplay);
                return;
            }
            var d = new Date(newDate);
            var dd = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
            getReport(dd);
        }
        $rootScope.toggleUpdating();


        $rootScope.alert = function(message){
            if(!message || message.length < 3) return;
            MUtilitiesService.AlertSuccessful(message, 'Thông báo')
        }

        $rootScope.getSelectedSellers = function(){
            var selected = [];
            $rootScope.telesales_arr.forEach((item) => {
                if(item.selected == true){
                    selected.push(item);
                }
            })
            return selected;
        }

        $rootScope.isShowAddOrderOverlay = false;
        $rootScope.toggleAddOrder = function(){
            $rootScope.isShowAddOrderOverlay = !$rootScope.isShowAddOrderOverlay;
            if($rootScope.isShowAddOrderOverlay){
                $rootScope.isShowOverlay = true;
            }
            else{
                $rootScope.isShowOverlay = false;
            }
        }
        $rootScope.closeAddOrderOverlay = function(){
            $rootScope.isShowAddOrderOverlay = false; 
            $rootScope.isShowOverlay = false;  
        }

        /////////////////////////////////////////////////////////////////////////////////////////////
        //  ADD ORDER
        var isTestMode = false;
        // console.log(fanpages);
        // get token
        var getToken = function(pageId){
            return new Promise(function(resolve, reject){
                var page = $filter("filter")(fanpages, {id: pageId});
                if(page[0]){
                    resolve(page[0].access_token);
                }
                else{
                    reject('Page với ID ' + pageId + ' chưa được thêm vào danh sách quản lý.');
                }
            })
        }
        

        ////

        $scope.originalMessage = null;
        $scope.subMessages = null;
        $rootScope.conversationLink = {
            text: null
        };
        $scope.userAvatar = 'assets/images/default-avatar-contact.svg';
        $scope.userName = '';
        $scope.pageInfo = null;
        $scope.post_data = null;

        $scope.customer = null;

        $scope.finishedGraph = null;

        $scope.selectedSeller = null;

        $scope.orderData = {
            type: null,
            id: null,
            page_id: null,
            post_id: null,
            conversation_id: null,
            customer_id: null,
            customer_name: null,
            customer_mobile: null,
            customer_message: null,
            admin_note: null,
            seller_will_call_id: null,
            status_id: 1,
            publish_date: null,
        };

        $rootScope.onConversationLinkChange = function(){
            if(!$rootScope.conversationLink.text || $rootScope.conversationLink.text.length < 5 || $rootScope.conversationLink.text.indexOf('facebook.com') == -1){
                return;
            }
            else{
                beginGraph();
            }
        }

        //////////// GRAPH
        var beginGraph = function(){
            $scope.usersCount = 1;
            // if(!$rootScope.conversationLink || $rootScope.conversationLink.length==0){
            //     return;
            // }
            $scope.pageData = null;
            $scope.postData = null;
            $scope.messageData = null;
            $scope.commentData = null;
            $scope.isGraphing = true;
            $scope.orderData.customer_mobile = null;
            // alert($rootScope.conversationLink);
            // graph page
            if($rootScope.conversationLink.text.indexOf('threadid') !== -1){
                // message
                var l = $rootScope.conversationLink.text.split('/').pop(); // ?threadid=144606886204668&folder=inbox
                var s = l.split('=');
                var x = s[1]; //144606886204668&folder
                var y = x.split('&');
                var thread_id = y[0];
                // page id
                var page_name_or_id = $rootScope.conversationLink.text.split('/')[3];

                MFacebookService.graphPage(page_name_or_id, $rootScope.access_token).then(function(response){
                    // console.log(response);
                    $scope.$apply(function(){
                        $scope.pageData = response;
                    })
                    getToken(response.id).then(function(token){
                        $scope.$apply(function(){
                                $scope.current_token = token;
                            })
                        // console.log(token);
                        // tìm kiếm trong 100 tin nhắn mới nhất
                        var t_id = null;
                        var limit = 10;
                        MFacebookService.findThreadInPageId(response.id, thread_id, token, limit).then(function(r){
                            MFacebookService.graphMessages(r, token).then(function(response){
                                console.log(response);
                                $scope.$apply(function(){
                                    $scope.messageData = response;
                                    // make order Data
                                    makeOrderDataFromMessage(response);
                                    $scope.orderData.conversation_id = response.id;
                                    $scope.isGraphing = false;
                                })
                            })
                        })
                        .catch(function(err){
                            console.log(err);
                            // tìm trong 50 tin nhắn mới nhất
                            limit = 50;
                            MFacebookService.findThreadInPageId(response.id, thread_id, token, limit).then(function(r){
                                MFacebookService.graphMessages(r, token).then(function(response){
                                    console.log(response);
                                    $scope.$apply(function(){
                                        $scope.messageData = response;
                                        // make order Data
                                        makeOrderDataFromMessage(response);
                                        $scope.orderData.conversation_id = response.id;
                                        $scope.isGraphing = false;
                                    })
                                })
                            })
                            .catch(function(err){
                                console.log(err);
                                limit = 100;
                                MFacebookService.findThreadInPageId(response.id, thread_id, token, limit).then(function(r){
                                    MFacebookService.graphMessages(r, token).then(function(response){
                                        console.log(response);
                                        $scope.$apply(function(){
                                            $scope.messageData = response;
                                            // make order Data
                                            makeOrderDataFromMessage(response);
                                            $scope.orderData.conversation_id = response.id;
                                            $scope.isGraphing = false;
                                        })
                                    })
                                })
                                .catch(function(err){
                                    console.log(err);
                                    MUtilitiesService.showWaitingDialog('Đang tìm trong 1000 tin nhắn mới nhất...', function(){
                                        var init = function(){
                                            return new Promise(function(resolve, reject){
                                                var not_found = true;
                                                limit = 1000;

                                                MFacebookService.findThreadInPageId(response.id, thread_id, token, limit).then(function(r){
                                                    MFacebookService.graphMessages(r, token).then(function(response){
                                                        console.log(response);
                                                        $scope.$apply(function(){
                                                            $scope.messageData = response;
                                                            // make order Data
                                                            makeOrderDataFromMessage(response);
                                                            $scope.orderData.conversation_id = response.id;
                                                            $scope.isGraphing = false;
                                                        })
                                                    })
                                                    resolve(true);
                                                })
                                                .catch(function(err){
                                                    // console.log(err);
                                                    MUtilitiesService.AlertError(err);
                                                    resolve(false);
                                                })
                                            })
                                        }
                                        return {
                                            init : init,
                                        }
                                    });
                                })
                            })
                        })

                    })
                    .catch(function(err){
                        MUtilitiesService.AlertError(err);
                        return;
                    });
                })
                .catch(function(err){
                    console.log(err);
                });
            }
            else{
                // comment
                // console.log('This conversation is comment');
                var l = $rootScope.conversationLink.text.split('/');
                var conversationId = l[l.length - 1];

                MFacebookService.graphPermalink(conversationId, $rootScope.access_token).then(function(response){
                    // console.log(response);
                    var link = response.permalink_url;
                    // console.log(response.permalink_url);
                    var page_name = (link.indexOf('permalink') !== -1) ? link : link.split('/')[3];

                    // graph page
                    MFacebookService.graphPage(page_name, $rootScope.access_token).then(function(response){
                        // console.log(response);
                        $scope.$apply(function(){
                            $scope.pageData = response;
                        })
                        getToken(response.id).then(function(token){
                            $scope.$apply(function(){
                                $scope.current_token = token;
                            })
                            // console.log(token);
                            // graph post
                            var p = conversationId.split('_');
                            var post_id = response.id + "_" + p[0];
                            MFacebookService.graphPost(post_id, token).then(function(response){
                                $scope.$apply(function(){
                                    $scope.postData = response;
                                    $scope.orderData.post_id = post_id;
                                })
                            })

                            MFacebookService.graphComments(conversationId, token).then(function(response){
                                $scope.$apply(function(){
                                    // console.log(response);
                                    // var phoneExp = /(09|01[2|6|8|9])+([0-9]{8})\b/;
                                    // for (var i = 0; i < response.comments.data.length; i++) {
                                    //     console.log(response.comments.data[i].message);
                                    //     response.comments.data[i].message.replace(phoneExp, 'sdt');
                                    // }
                                    $scope.commentData = response;
                                    // for (var i = $scope.commentData.comments.data.length - 1; i >= 0; i--) {
                                    //      $scope.commentData.comments.data[i].message.replace('*', 'sdfsdf');
                                    // }
                                    makeOrderDataFromComment(response);
                                    $scope.orderData.conversation_id = conversationId;
                                    $scope.isGraphing = false;
                                })
                            })
                            .catch(function(err){
                                MUtilitiesService.AlertError(err);

                            });
                        })
                        .catch(function(err){
                            MUtilitiesService.AlertError(err);

                            return;
                        });
                        
                    })
                    .catch(function(err){
                        // console.log(err);
                        MUtilitiesService.AlertError(err);
                    });

                })
                .catch(function(err){
                    // console.log(err);
                    // Cuộc hội thoại đã xóa hoặc không tồn tại
                    // hiển thị hộp thoại yêu cầu nhập thủ công
                    MUtilitiesService.AlertError(err);
                    MUtilitiesService.showConfirmDialg('Cuộc hội thoại không tồn tại hoặc đã bị xóa',
                                    'Bạn có muốn thêm Order thủ công?', 'Đồng ý', 'Bỏ qua')
                    .then(function(response) {
                        if (response) {
                            console.log('...Bắt đầu thêm');
                            $rootScope.addOrderManual();
                            $scope.isGraphing = false;
                        }
                        else{
                            console.log('Bỏ qua thêm thủ công');
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                        $scope.isGraphing = false;
                    })
                });
                
                // end graph
            }
            
        }

        $scope.usersCount = 1;
        var makeOrderDataFromMessage = function(data){
            angular.forEach(data.participants.data, function(p) {
                if (p.id !== $scope.pageData.id) {
                    
                    $scope.customer = p;
                    // order data
                    $scope.orderData.page_id = $scope.pageData.id;
                    $scope.orderData.customer_id = p.id;
                    $scope.orderData.customer_name = p.name;
                    $scope.orderData.type = 1; // message
                }
            });
        }
        var makeOrderDataFromComment = function(data){
            // console.log(data);
            $scope.orderData.page_id = $scope.pageData.id;
            $scope.orderData.customer_id = data.from.id;
            $scope.orderData.customer_name = data.from.name;
            if(data.comments && data.comments.length > 0){
                angular.forEach(data.comments.data, function(p){
                    if (p.from.id !== $scope.pageData.id) {
                        $scope.usersCount++;
                    }
                })
            }
        }
        $scope.setCustomer = function(customer){
            if(customer.id == $scope.pageData.id || $scope.orderData.customer_id == customer.id){
                return;
            }
            if(customer.id){
                $scope.orderData.customer_id = customer.id;
                $scope.orderData.customer_name = customer.name;
                MUtilitiesService.AlertSuccessful('Chọn ' + customer.name + ' là khách hàng.', 'Thông báo');
            }
            else{
                MUtilitiesService.AlertError('Không thể chọn khách hàng này', 'Lỗi');
            }
            
        }
        $rootScope.addOrderManual = function(){
            MUtilitiesService.showManualOrderAdd(function(){
                var submitOrder = function(orderData){
                    return new Promise(function(resolve, reject){
                        if(orderData){
                            console.log(orderData);
                            $scope.orderData = orderData;
                            $scope.submitOrder();
                            resolve(true);
                        }
                        else{
                            resolve(false);
                        }
                    })
                }

                var pages = fanpages;

                return {
                    submitOrder : submitOrder,
                    pages : pages
                }
            })
            .then(function(response){
                // console.log(response);
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err);
            })
        }

        var validateOrderData = function(orderData){
            if(!orderData.customer_id){
                MUtilitiesService.AlertError('Vui lòng nhập ID khách hàng', 'Lỗi');
                return false;
            }
            if(!orderData.customer_name){
                MUtilitiesService.AlertError('Vui lòng nhập tên khách hàng', 'Lỗi');
                return false;
            }
            if(!orderData.customer_mobile){
                MUtilitiesService.AlertError('Vui lòng nhập số điện thoại khách hàng', 'Lỗi');
                return false;
            }
            if(!orderData.page_id){
                MUtilitiesService.AlertError('Vui lòng nhập page id', 'Lỗi');
                return false;
            }
            return true;
        }

        function resetOrderData(){
            $rootScope.conversationLink = {text: null};
            $scope.orderData = {
                type: null,
                id: null,
                page_id: null,
                post_id: null,
                conversation_id: null,
                customer_id: null,
                customer_name: null,
                customer_mobile: null,
                customer_message: null,
                admin_note: null,
                status_id: 1,
                publish_date: null,
            }
            $scope.usersCount = 1;
        }
        $scope.resetOrder = function(){
            resetOrderData();
            // also reset graph data:
            $scope.pageData = null;
            $scope.postData = null;
            $scope.messageData = null;
            $scope.commentData = null;
            $scope.pageInfo = null;
        }
        $scope.sendThanks = true;
        $scope.submitOrder = function() {
            if(!validateOrderData($scope.orderData)){
                // MUtilitiesService.AlertError('Không thể thêm Order. Vui lòng xem lại dữ liệu', 'Thông báo');
                return;
            }

            // kiểm tra số điện thoại
            MUtilitiesService.validatePhoneNumber(false, 'Số điện thoại khách hàng', 
                $scope.orderData.customer_mobile).then(function(response){
                var newOrderKey = firebase.database().ref().child('newOrders').push().key;
                $scope.orderData.id = newOrderKey;
                $scope.orderData.status_id = 1;
                $scope.orderData.publish_date = Date.now();

                MFirebaseService.findDuplicateOrerByPhone($scope.orderData.customer_mobile)
                .then(function(response){
                    if(response.length > 0){
                        MUtilitiesService.showDublicateConfirm(function(){
                            return {
                                orders: response,
                                fanpages: fanpages,
                                statuses: statuses
                            }
                        })
                        .then(function(response){
                            if(response == true){
                                // alert('Vẫn thêm số trùng');
                                // tuy nhiên sẽ bổ sung thêm ghi chú phần admin note
                                $scope.orderData.admin_note = 'Khách hàng đã từng để lại số ĐT, vui lòng sử dụng chức năng tìm kiếm để xem lịch sử để lại số.';
                                doSubmitOrder();
                            }
                            else{
                                $scope.$apply(function(){
                                    resetOrderData();
                                })
                            }
                        })
                    }
                    else{
                        // do Submit
                        doSubmitOrder();
                    }
                });
            })
            .catch(function(err){
               MUtilitiesService.AlertError(err, 'Lỗi');
                return false; 
            })
        }
        function doSubmitOrder(){
            $rootScope.isSubmittingOrder = true;
            MFirebaseService.onAddNewOrder($rootScope.currentMember, $scope.orderData, $rootScope.sellers)
                .then(function(response) {
                    MUtilitiesService.AlertSuccessful(response, 'Thông báo');
                    if(!isTestMode && $scope.sendThanks){
                        // $scope.current_token
                        if($scope.orderData.type == 1){
                            // reply message
                            MFacebookService.replyMessage($scope.orderData.conversation_id,
                                $scope.current_token, null, 'Cảm ơn anh/chị đã để lại số điện thoại. Nhân viên CSKH sẽ liên hệ với anh/chị trong thời gian sớm nhất. Anh/chị vui lòng để ý điện thoại ạ!').then(function(response){
                                MUtilitiesService.AlertSuccessful(response)
                            })
                            .catch(function(err){
                                MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                        }
                        else{
                            // reply comment
                            MFacebookService.replyComment($scope.orderData.conversation_id,
                                $scope.current_token, null, 'Cảm ơn anh/chị đã để lại số điện thoại. Nhân viên CSKH sẽ liên hệ với anh/chị trong thời gian sớm nhất. Anh/chị vui lòng để ý điện thoại ạ!').then(function(response){
                                MUtilitiesService.AlertSuccessful(response)
                            })
                            .catch(function(err){
                                MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                        }

                        $scope.$apply(function(){
                            $rootScope.isSubmittingOrder = false;
                        })
                    }
                    else{
                        if(!$scope.sendThanks){
                            MUtilitiesService.AlertSuccessful('Bạn đang sử dụng ở chế độ Test. Ở chế độ hoạt động hệ thống sẽ gửi một tin nhắn cảm ơn khách hàng!')
                        }
                    }
                    // reset order
                    $scope.resetOrder();

                }).catch(function(err){
                    MUtilitiesService.AlertError(err, 'Thông báo');
                })
        }
        $scope.resetSelectedSeller = function(){
            $scope.orderData.seller_will_call_id = null;
        }
        
        $scope.detectMessageSharesLink = function(link){
            MUtilitiesService.detectMessageSharesLink(link).then(function(result){
                if(result.type == 'photo'){
                    return result;
                }
                else if(result.type == 'post'){
                    // alert('share is post');
                    MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, $scope.current_token)
                    .then(function(response){
                        console.log(response);
                        return response.data.attachments.picture;
                    })
                    .catch(function(err){
                        // console.log(err);
                        MUtilitiesService.AlertError(err);
                    });
                }
                else {
                    return 'Trường hợp khác'
                }
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err);
            });
            
        }

        $scope.filterById = function(sources, id) {
            var res = $filter("filter")(sources, {
                id: id
            });
            return res ? res[0] : null;
        }
        // TODO: SUBMIT NEW ORDER
        $scope.graph = function() {
            beginGraph();
        }
        /////////////////////////////////////////////////////////////////////////////////////////////
        // $timeout(function() {
        //     console.log($rootScope.telesales_arr);
        // }, 5000);

    });