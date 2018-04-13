m_admin.controller('CreateOrderByCommentCtrl',
    function($rootScope, $window, $scope, $http, $filter, $rootScope, $timeout, cfpLoadingBar, Facebook, firebaseService,
        MFirebaseService, MFacebookService, MUtilitiesService, fanpages, statuses) {


        // https://business.facebook.com/TrangSucPhongThuyVici/manager/messages/?threadid=422153718229875&folder=inbox

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
        $scope.conversationLink = null;
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

        $scope.onConversationLinkChangeg = function(){
            if(!$scope.conversationLink || $scope.conversationLink.length < 5 || $scope.conversationLink.indexOf('facebook.com') == -1){
                return;
            }
            else{
                beginGraph();
            }
        }

        //////////// GRAPH
        var beginGraph = function(){
            $scope.usersCount = 1;
            // if(!$scope.conversationLink || $scope.conversationLink.length==0){
            //     return;
            // }
            $scope.pageData = null;
            $scope.postData = null;
            $scope.messageData = null;
            $scope.commentData = null;
            $scope.isGraphing = true;
            $scope.orderData.customer_mobile = null;
            // graph page
            if($scope.conversationLink.indexOf('threadid') !== -1){
                // message
                var l = $scope.conversationLink.split('/').pop(); // ?threadid=144606886204668&folder=inbox
                var s = l.split('=');
                var x = s[1]; //144606886204668&folder
                var y = x.split('&');
                var thread_id = y[0];
                // page id
                var page_name_or_id = $scope.conversationLink.split('/')[3];

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
                var l = $scope.conversationLink.split('/');
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
            $scope.conversationLink = null;
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
        $scope.reset = function(){
            resetOrderData();
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
                    }
                    else{
                        MUtilitiesService.AlertSuccessful('Bạn đang sử dụng ở chế độ Test. Ở chế độ hoạt động hệ thống sẽ gửi một tin nhắn cảm ơn khách hàng!')
                    }
                    // reset order
                    resetOrderData();
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
        $scope.graphPhoto = function(photoId){
            MFacebookService.graphPhoto(photoId, $scope.current_token).then(function(response){
                console.log(response);
                return response;
            })
            .catch(function(err){
                return err;
            })
        }
        
        //////////// #GRAPH

        // facebookService.graphOriginalConversation('326410367763204_326415471096027').then(function(data){
        //  console.log(data);
        // });

        // graph original conversation
        // params: conversationId = Conversation ID; e.g: 326410367763204_326415471096027
        var graphOriginalConversation = function(conversationId) {
            // first we need find page

            Facebook.api('/' + conversationId + '?fields=permalink_url&access_token=' + $rootScope.access_token, function(response) {
                var link = response.permalink_url;
                // console.log(response.permalink_url);
                if (link.indexOf('permalink') !== -1) {
                    Facebook.api('/' + link + '&access_token=' + $rootScope.access_token, function(r) {
                        $scope.pageInfo = r;

                        // get page access token
                        if (!$rootScope.access_token_arr) return;
                        var token = $scope.filterById($rootScope.access_token_arr, $scope.pageInfo.id);
                        if (token) {
                            $scope.$apply(function() {
                                $scope.currentAccessToken = token.acess_token;
                                graphConver(conversationId);
                            });
                        }
                    });
                } else {
                    var s = link.split('/');
                    // alert(s[3]);
                    Facebook.api('/' + s[3] + '?access_token=' + $rootScope.access_token, function(r) {
                        // console.log(r);
                        // console.log($rootScope.access_token_arr);
                        // get page access token
                        if (!$rootScope.access_token_arr) return;
                        var token = $scope.filterById($rootScope.access_token_arr, r.id);
                        if (token) {
                            // console.log(token.acess_token);
                            $scope.$apply(function() {
                                $scope.pageInfo = r;
                                $scope.currentAccessToken = token.acess_token;
                                graphConver(conversationId);
                            });
                        }
                    });
                }
            });

            // alert($scope.currentAccessToken);
        }

        function graphConver(conversationId) {
            Facebook.api('/' + conversationId + '?fields=comments{from,message,created_time,id},permalink_url,from,message,created_time,admin_creator&access_token=' + $scope.currentAccessToken, function(response) {
                // console.log(response);
                // console.log($scope.currentAccessToken );
                var p = conversationId.split('_');

                $scope.orderData.conversation_id = conversationId; //

                $scope.$apply(function() {
                    $scope.originalMessage = response;
                    // console.log(response);
                    $scope.orderData.customer_id = response.from.id; //
                    $scope.orderData.customer_name = response.from.name; //
                    // find owner post
                    var link = response.permalink_url;
                    // console.log(link);
                    if (link.indexOf('permalink') !== -1) {
                        Facebook.api('/' + link + $rootScope.access_token, function(r) {
                            $scope.pageInfo = r;
                            // console.log(r);

                            $scope.orderData.page_id = r.id; //

                            var post_id = $scope.pageInfo.id + "_" + p[0];
                            $scope.orderData.post_id = post_id; //

                            Facebook.api('/' + post_id + '?access_token=' + $rootScope.access_token, function(r) {
                                // console.log(r);
                                $scope.post_data = r;
                            })
                        })
                    } else {
                        var temp = link.split('/');
                        var pageUsername = temp[3];
                        Facebook.api('/' + pageUsername + '?access_token=' + $rootScope.access_token, function(r) {
                            $scope.pageInfo = r;
                            $scope.orderData.page_id = r.id; //

                            var post_id = $scope.pageInfo.id + "_" + p[0];
                            $scope.orderData.post_id = post_id; //
                            Facebook.api('/' + post_id + '?fields=picture,message,created_time&access_token=' + $rootScope.access_token, function(r) {
                                // console.log(r);
                                $scope.post_data = r;

                            })
                        })
                    }

                    //
                    $scope.subMessages = null;
                    if (response.comments) {
                        $scope.subMessages = [];
                        angular.forEach(response.comments.data, function(item) {

                            Facebook.api('/' + item.from.id + '/picture?height=100&width=100', function(r) {
                                Facebook.api('/' + item.from.id + '?access_token=' + $rootScope.access_token, function(res) {
                                    $scope.subMessages.push({
                                        'avar': r.data.url,
                                        'id': item.from.id,
                                        'name': res.name,
                                        'content': item.message,
                                        'created_time': item.created_time,
                                    });

                                });
                            });
                        });
                        // $scope.subMessages = response.data;
                    }
                    $scope.finishedGraph = true;
                });

            });
        }
        var graphUserAvatar = function(userId) {
            Facebook.api('/' + userId + '/picture?height=100&width=100', function(response) {
                $scope.$apply(function() {
                    $scope.userAvatar = response.data.url;
                });

            });
        }
        // var graphUserName = function(userId) {
        //     Facebook.api('/' + userId + '?access_token=' + $rootScope.access_token, function(response) {
        //         $scope.$apply(function(){
        //           $scope.userName = response.name;
        //         });

        //     });
        // }
        $scope.filterById = function(sources, id) {
            return $filter("filter")(sources, {
                id: id
            })[0];
        }
        // TODO: SUBMIT NEW ORDER
        $scope.graph = function() {
            beginGraph();
        }

        // functions
        var findSource = function() {

        }

        $scope.selectedSource = null;
        $scope.sourceChanged = function() {
            // console.log($scope.selectedSource);
            // alert('sdf');
        }

        


    });