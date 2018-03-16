mRealtime.controller('OdersCtrl',
    function($rootScope, $scope, $state, $stateParams, $filter, $timeout, cfpLoadingBar, ngDialog, 
        cfpLoadingBar, Facebook, firebaseService, ProductPackService,
         activeItem, fanpages, MFacebookService, MFirebaseService, MUtilitiesService) {

        var isTestMode = true;

        $scope.showImageDialog = function(imageUrl){
            ngDialog.open({
                disableAnimation : true,
                template: '<img src="' + imageUrl + '" class="pt-3" style="width:100%">',
                plain: true
            });
        }

        $scope.activeOrder = activeItem;
        $rootScope.activeStatusId = activeItem.status_id;

        var page = $filter("filter")(fanpages, {id: $stateParams.page_id});
        $scope.conversation_type = $stateParams.type;
        $scope.page_id = $stateParams.page_id;
        // console.log(page);
        $scope.currentAccessToken = page ? page[0].access_token : null;
        if(!$scope.currentAccessToken){
            MUtilitiesService.AlertError('Chưa khai báo Fanpage', 'Lỗi');
        }

        $scope.isShowFullPost = false;
        $scope.showFullPost = function(){
          $scope.isShowFullPost = true;  
        }
    	$scope.filterById = function(sources, id){
            return $filter("filter")(sources, {
                id: id
            })[0];
        }

        $scope.activeLog = [];
        let activeLogRef = firebase.database().ref().child('newOrders/' + $stateParams.id + '/activeLog');
        activeLogRef.on('child_added', snapshot => {
            $scope.activeLog.push(snapshot.val());
        });


        $scope.noteContent = {};
        /*
        * add a note to order
        */
        $scope.addNote = function(){
            if(!$scope.noteContent.text || $scope.noteContent.text.length == 0){
                MUtilitiesService.AlertError('Vui lòng nhập nội dung', 'Lỗi');
                return;
            }
            var activeLogItem = {
                uid : $rootScope.currentMember.id,
                uname : $rootScope.currentMember.last_name,
                type: 2, //note,
                status_after : null,
                content: $scope.noteContent.text,
                updated_at: firebase.database.ServerValue.TIMESTAMP
            }
            firebase.database().ref().child('newOrders/' + $stateParams.id).child('activeLog').push(activeLogItem);
            $scope.noteContent.text = '';
            // update comment count for this order
            firebase.database().ref().child('newOrders/' + $stateParams.id).child('commentCount').transaction(function(oldValue){
                  return oldValue + 1;
              });
            // update
            var itemChanged = $filter('filter')($rootScope.availableOrders, {'id':$stateParams.id})[0];
            itemChanged.commentCount = 1;
        }


        // GRAPH FACEBOOK
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
        // graph page
        MFacebookService.graphPage($stateParams.page_id, $scope.currentAccessToken).then(function(response){
            // console.log(response);
            $scope.$apply(function(){
                $scope.pageData = response;
            })
        })
        .catch(function(err){
            MUtilitiesService.AlertError(err, 'Lỗi');
        })

        //
        if($stateParams.type==1){
            // messages
            MFacebookService.graphMessages($stateParams.conversation_id, $scope.currentAccessToken).then(function(response){
                $scope.$apply(function(){
                    // console.log(response);
                    $scope.messageData = response;
                })
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi');
            })
        }
        else{
            // graph post
            MFacebookService.graphPost($stateParams.post_id, $scope.currentAccessToken).then(function(response){
                $scope.$apply(function(){
                    // console.log(response);
                    $scope.postData = response;
                })
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi');
            })

            // also graph comments
            MFacebookService.graphComments($stateParams.conversation_id, $scope.currentAccessToken).then(function(response){
                $scope.$apply(function(){
                    // console.log(response);
                    $scope.commentData = response;
                })
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi');
            })
        }

        /*
        * Detect shares link
        * there're two types of links: "link": "https://www.facebook.com/DaQuyPhongThuyTrangAn/posts/143302139668476"
        * and: "link": "https://www.facebook.com/DaQuyPhongThuyTrangAn/photos/a.141134469885243.1073741828.137428680255822/145291292802894/?type=3"
        */
        $scope.detectSharesLink = function(sharesLink){
            // console.log('detecting link...');
            var l = sharesLink.split('/').pop(); // ?type=3
            // alert(l);
            if (l.indexOf('?type=3') !== -1){
                // photos
                var k = sharesLink.split('/');
                // {{detectSharesLink(m.shares.data[0].link)}}/picture?height=720&width=720
                return '//graph.facebook.com/' + k[k.length - 2] + '/picture?height=720&width=720';
            }
            else{
                return sharesLink;
                // return '//graph.facebook.com/' + $stateParams.page_id + '_' + l + '?fields=picture' + '&access_token=' + $rootScope.access_token;
            }
        }
        
        // test reply comment
        $scope.comentText = null;
        $scope.replyToComment = function(){
            if(!$scope.comentText || $scope.comentText.length==0){
                // snackbar('Vui lòng nhập nội dung!');
                MUtilitiesService.AlertError('Vui lòng nhập nội dung', 'Lỗi');
                return;
            } 
            if($stateParams.type == 1){
                replyMessage();
            }
            else{
                replyComment();
            }
            
        }

        var replyComment = function(){
            $scope.startReplying = true;
            FB.api(
                "/" + $stateParams.conversation_id + "/comments",
                "POST",
                {
                    "message": $scope.comentText,
                    // "attachment_url" : "http://pluspng.com/img-png/github-octocat-logo-vector-png-octocat-icon-1600.png",
                    "access_token" : $scope.currentAccessToken
                },
                function (response) {
                  if (response && !response.error) {
                    /* handle the result */
                    $scope.$apply(function(){
                        $scope.comentText = null;
                        graphComments();
                        $scope.startReplying = false;
                        // snackbar('Gửi bình luận thành công!');
                        MUtilitiesService.AlertSuccessful('Gửi bình luận thành công', 'Thông báo');
                    });
                  }
                }
            );
        }
        var replyMessage = function(){
            $scope.startReplying = true;
            FB.api(
                "/" + $stateParams.conversation_id + "/messages",
                "POST",
                {
                    "message": $scope.comentText,
                    // "attachment_url" : "https://storage.googleapis.com/content.pages.fm/2017/12/24/33e1abe1858d07830ab3f53b2b2c08988c507b5a.jpg",
                    "access_token" : $scope.currentAccessToken
                },
                function (response) {
                  if (response && !response.error) {
                    /* handle the result */
                    $scope.$apply(function(){
                        $scope.comentText = null;
                        graphMessages();
                        $scope.startReplying = false;
                        // snackbar('Gửi tin nhắn thành công đến khách hàng!');
                        MUtilitiesService.AlertSuccessful('Gửi tin nhắn thành công', 'Thông báo');
                    });
                  }
                }
            );
        }

        /**
        * Check before user change status
        * @param  {user}  user who changing status
        * @return {data}  data
        */
        function validationBeforChangeStatus(status){
            if($rootScope.currentMember.is_admin == 1){
               return true;
            }
            if($scope.activeOrder.seller_will_call_id !== $rootScope.currentMember.id){
                MUtilitiesService.AlertError('Không cho phép thay đổi trạng thái Order của người khác', 'Thông báo');
                return false;
            }

            if($scope.activeOrder.status_id == status.id){
                MUtilitiesService.AlertError('Trạng thái không thay đổi', 'Thông báo');
                return false;
            }
            return true;
        }

        function updateStatus(status){
            return new Promise(function(resolve, reject){
                if(!validationBeforChangeStatus(status)){
                    return;
                }

                if(status.id == 6){
                    if(validateCustomerData()){
                        $scope.customerData.products = $scope.selectedProducts;
                    }
                    else{
                        return;
                    }
                }

                
                MFirebaseService.onChangeOrderStatus($stateParams.id, $rootScope.currentMember, status.id, 
                    $rootScope.sellers)
                .then(function(response){
                    $scope.$apply(function(){
                        $rootScope.activeStatusId = status.id;
                    })

                    // thêm activeLogItem
                    var activeLogItem = {
                        uid : $rootScope.currentMember.id,
                        uname : $rootScope.currentMember.last_name,
                        type: 1, //change status,
                        status_after : status.id,
                        updated_at: firebase.database.ServerValue.TIMESTAMP
                    }
                    firebase.database().ref().child('newOrders/' + $stateParams.id).child('activeLog').push(activeLogItem);

                    if(status.id == 6){
                        // thêm shipping item
                        addShippingItem().then(function(response){
                            resolve('Cập nhật trạng thái thành công. Order đã sẵn sàng để tạo đơn');
                            // reset shipping data
                            $scope.customerData = {
                                realName: $scope.activeOrder.customer_name,
                                recievedPhone: $scope.activeOrder.customer_mobile,
                                birthDay: '',
                                addresss: '',
                            }
                            // reset products
                            $scope.selectedProducts = [];
                        })
                    }
                    else{
                        resolve('Cập nhật trạng thái thành công');
                    }
                })
                .catch(function(err){
                    reject(err);
                });
            })
        }

        function addShippingItem(){
            return new Promise(function(resolve, reject){
                var data = {
                    customerData : $scope.customerData,
                    orderData : {
                        conversation_id : $scope.activeOrder.conversation_id,
                        customer_id : $scope.activeOrder.customer_id,
                        customer_name : $scope.activeOrder.customer_name,
                        id : $scope.activeOrder.id,
                        page_id: $scope.activeOrder.page_id,
                        post_id : $scope.activeOrder.post_id || null,
                        publish_date : $scope.activeOrder.publish_date,
                        status_id : $scope.activeOrder.status_id,
                        type :  $scope.activeOrder.type || null
                    },
                    customer_name: $scope.activeOrder.customer_name,
                    customer_mobile: $scope.activeOrder.customer_mobile,
                    created_time : firebase.database.ServerValue.TIMESTAMP
                }
                firebaseService.addNewShippingItem(data).then(function(response){
                    // khởi tạo báo cáo ngày cho shipping nếu cần
                    var today = new Date();
                    var reportDateString = MFirebaseService.convertDate(today);

                    MFirebaseService.prepareEmptyShippingReport(reportDateString).then(function(response){
                        console.log(response);
                        // cập nhật báo cáo, tăng 1 đơn vị trong tổng số shipping items
                        MFirebaseService.onCreateShippingItem(reportDateString).then(function(response){
                            console.log(response);
                            resolve('Tạo shipping item và cập nhật báo cáo thành công');
                        })

                    })
                    // resolve(response);
                })
                .catch(function(err){
                    reject(err);
                })
            })
        }

        $scope.changeStatus = function(status){
            updateStatus(status).then(function(response){
                MUtilitiesService.AlertSuccessful(response,'Thông báo');
                // gửi tin nhắn đến khách hàng nếu không nghe máy
                if(status.id == 9){ // chưa nghe máy
                    if(!isTestMode){
                        if($stateParams.type == 1){
                            MFacebookService.replyMessage($stateParams.conversation_id,
                                    $scope.currentAccessToken, null, 'Chào Anh/chị, nhân viên CSKH đã liên hệ với anh/chị nhưng anh/chị chưa nghe máy. Anh/chị vui lòng để ý điện thoại ạ!').then(function(response){
                                    MUtilitiesService.AlertSuccessful(response)
                                })
                                .catch(function(err){
                                    MUtilitiesService.AlertError(err, 'Lỗi')
                                })
                        }
                        else{
                            MFacebookService.replyComment($stateParams.conversation_id,
                                $scope.currentAccessToken, null, 'Chào Anh/chị, nhân viên CSKH đã liên hệ với anh/chị nhưng anh/chị chưa nghe máy. Anh/chị vui lòng để ý điện thoại ạ!').then(function(response){
                                MUtilitiesService.AlertSuccessful(response)
                            })
                            .catch(function(err){
                                MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                        }
                    }
                    else{
                        MUtilitiesService.AlertSuccessful('Bạn đang sử dụng ở chế độ Test. Ở chế độ hoạt động hệ thống sẽ gửi một thông báo nhắc nhở khách hàng nghe máy!')
                    }
                }

                // if(status.id == 6){
                //     if(!isTestMode){
                //         if($stateParams.type == 1){
                //             MFacebookService.replyMessage($stateParams.conversation_id,
                //                     $scope.currentAccessToken, null, 'Đơn hàng của!').then(function(response){
                //                     MUtilitiesService.AlertSuccessful(response)
                //                 })
                //                 .catch(function(err){
                //                     MUtilitiesService.AlertError(err, 'Lỗi')
                //                 })
                //         }
                //         else{
                //             MFacebookService.replyComment($stateParams.conversation_id,
                //                 $scope.currentAccessToken, null, 'Chào Anh/chị, nhân viên CSKH đã liên hệ với anh/chị nhưng anh/chị chưa nghe máy. Anh/chị vui lòng để ý điện thoại ạ!').then(function(response){
                //                 MUtilitiesService.AlertSuccessful(response)
                //             })
                //             .catch(function(err){
                //                 MUtilitiesService.AlertError(err, 'Lỗi')
                //             })
                //         }
                //     }
                //     else{
                //         MUtilitiesService.AlertSuccessful('Bạn đang sử dụng ở chế độ Test. Ở chế độ hoạt động hệ thống sẽ gửi một thông báo nhắc nhở khách hàng nghe máy!')
                //     }
                // }
                
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi');
            })
        }
        $scope.reportBadNumber = function(){
            MUtilitiesService.showConfirmDialg('Thông báo',
                'Hệ thống sẽ ghi nhận sai số và gửi một tin nhắn báo sai số đến khách hàng.', 'Tiếp tục', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                    // cập nhật database
                    MFirebaseService.updateBadNumber(activeItem.id).then(function(response){
                        MUtilitiesService.AlertSuccessful(response, 'Thông báo');
                    })
                    .catch(function(err){
                        MUtilitiesService.AlertError(err, 'Lỗi');
                    })

                    // gửi thông báo sai số đến khách hàng
                    if($stateParams.type == 1){
                        MFacebookService.replyMessage($stateParams.conversation_id,
                                $scope.currentAccessToken, null, 'Chào Anh/chị, anh/chị vui lòng kiểm tra lại số điện thoại giúp em ạ!').then(function(response){
                                MUtilitiesService.AlertSuccessful(response)
                            })
                            .catch(function(err){
                                MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                    }
                    else{
                        MFacebookService.replyComment($stateParams.conversation_id,
                            $scope.currentAccessToken, null, 'Chào Anh/chị, anh/chị vui lòng kiểm tra lại số điện thoại giúp em ạ!').then(function(response){
                            MUtilitiesService.AlertSuccessful(response)
                        })
                        .catch(function(err){
                            MUtilitiesService.AlertError(err, 'Lỗi')
                        })
                    }
                }
                else{

                }
            })
        }
        function checkIfUserExists(userId) {
          var usersRef = new Firebase(USERS_LOCATION);
          usersRef.child(userId).once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            userExistsCallback(userId, exists);
          });
        }

        // get all products
        $scope.aProducts = [];
        var getAllAvailableProducts = function(){
          var ref = firebase.database().ref();
          let productsRef = ref.child('products');
          productsRef.on('child_added', snapshot => {
            $scope.aProducts.push(snapshot.val());
          });
        }
        getAllAvailableProducts();
        $scope.selectedProducts = [];
        
        $scope.addProduct = function(){
            $scope.selectedProducts.push({
                id : null,
                count : 1,
                note : ''
            });
        }
        $scope.deleteProduct = function(index){
            console.log('xóa ' + index);
            $scope.selectedProducts.splice(index, 1);
        }
        $scope.customerData = {
            realName: $scope.activeOrder.customer_name,
            recievedPhone: $scope.activeOrder.customer_mobile,
            birthDay: '',
            addresss: '',
            products: [],
            customerNote: '',
            orderNote: '',
            cod: 0,
        }
        $scope.newProduct = {
            name: ''
        };
        $scope.onAddNewProduct = function(){
            console.log($scope.newProduct.name);
            if($scope.newProduct.name == ''){
                MUtilitiesService.AlertError('Vui lòng nhập tên sản phẩm', 'Thông báo');
                return false;
            }
            firebaseService.addNewProduct($scope.newProduct.name).then(function(response){
                // console.log(response);
                MUtilitiesService.AlertSuccessful('Thêm sản phẩm thành công', 'Thông báo');
                $scope.newProduct = {
                    name: ''
                };
            })
        }
        function validateCustomerData(){

                if(!$scope.customerData.birthDay || $scope.customerData.birthDay.length < 1){
                    MUtilitiesService.AlertError('Vui lòng nhập năm sinh', 'Lỗi');
                    return false;
                }
                if(!angular.isNumber($scope.customerData.birthDay)){
                    MUtilitiesService.AlertError('Năm sinh không đúng', 'Lỗi');
                    return false;
                }
                if(!angular.isNumber($scope.customerData.cod)){
                    MUtilitiesService.AlertError('Số tiền không đúng', 'Lỗi');
                    return false;
                }
                if($scope.customerData.cod <= 10000){
                    MUtilitiesService.AlertError('Số tiền không đúng', 'Lỗi');
                    return false;
                }
                if(!$scope.customerData.addresss || $scope.customerData.addresss.length < 1){
                    MUtilitiesService.AlertError('Vui lòng nhập địa chỉ nhận hàng', 'Lỗi');
                    return false;
                }
                if(!$scope.selectedProducts || $scope.selectedProducts.length == 0){
                    MUtilitiesService.AlertError('Vui lòng thêm sản phẩm', 'Lỗi');
                    return false;
                }
                if($scope.selectedProducts.length > 0){

                    var pass = true;
                    var countProductPass = true;
                    angular.forEach($scope.selectedProducts, function(product){
                        pass = pass && product.id;
                        if(!angular.isNumber(product.count)){
                            MUtilitiesService.AlertError('Số lượng không đúng', 'Thông báo');
                            return false;
                        }
                        if(product.count < 1){
                            countProductPass = false;
                        }
                    })
                    if(!countProductPass){
                        MUtilitiesService.AlertError('Số lượng không đúng', 'Lỗi');
                        return false;
                    }
                    if(!pass){
                        MUtilitiesService.AlertError('Vui lòng chọn sản phẩm', 'Lỗi');
                        return false;
                    }
                }
                return true;

        }
        $scope.onSubmitOrder = function(){
            var successStatus = $rootScope.filterById($rootScope.statuses, 6);
            if(successStatus){
                updateStatus(successStatus).then(function(response){
                    MUtilitiesService.AlertSuccessful(response,'Thông báo');
                })
                .catch(function(err){
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })
            }
        }

        //  EDIT ORDER

        $scope.showEditOrderForm = false;
        $scope.finishedLoadOrderToEdit = true;

        /*
        * Show edit form for success order (order with status id == 6)
        *
        */
        $scope.showEditOrder = function(){
            firebaseService.getShippingItemByOrderId($scope.activeOrder.id).then(function(snapshot){
                $scope.$apply(function(){
                    angular.forEach(snapshot.val(), function(value, key){
                        $scope.editData = value;
                    });
                    $scope.showEditOrderForm = true;
                })
            });
        }
	});