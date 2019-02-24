mRealtime.controller('OdersCtrl',
    function($rootScope, $scope, $state, $stateParams, $filter, $timeout, cfpLoadingBar, ngDialog, 
        cfpLoadingBar, Facebook, firebaseService, ProductPackService,
         activeItem, fanpages, MFacebookService, MFirebaseService, MUtilitiesService, sweetAlert) {

        console.log(activeItem);

        var isTestMode = false;

        $scope.showImageDialog = function(imageUrl){
            ngDialog.open({
                disableAnimation : true,
                template: '<img src="' + imageUrl + '" class="pt-3" style="width:100%">',
                plain: true
            });
        }

        $scope.detectMessageSharesLink = function(link){
            MUtilitiesService.detectMessageSharesLink(link).then(function(result){
                if(result.type == 'photo'){
                    // console.log(result);
                    return result;
                }
                else if(result.type == 'post'){
                    // alert('share is post');
                    MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, $scope.current_token)
                    .then(function(response){
                        // console.log(response);
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

        $rootScope.activeOrder = activeItem;
        // console.log(activeItem);
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
            // // messages
            // MFacebookService.graphMessages($stateParams.conversation_id, $scope.currentAccessToken).then(function(response){
            //     $scope.$apply(function(){
            //         // console.log(response);
            //         // chỉnh sửa thông tin chút
            //         angular.forEach(response.messages.data, function(mes){
            //             // mes = 'sdfsdfsdf';
            //             if(mes.shares && mes.shares.data){
            //                 if(mes.shares.data[0].link){
            //                     // mes = 'sdfds';
            //                     // console.log(mes.shares.data[0].link);
            //                     // var link = $scope.detectMessageSharesLink(mes.shares.data[0].link);

            //                     MUtilitiesService.detectMessageSharesLink(mes.shares.data[0].link).then(function(result){
            //                         if(result.type == 'photo'){
            //                             mes.link = result.link;
            //                         }
            //                         else if(result.type == 'post'){
            //                             // console.log(result);
            //                             // alert('share is post');
            //                             MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, $scope.currentAccessToken)
            //                             .then(function(response){
            //                                 // console.log(response);
            //                                 // mes.x = response.data;
            //                                 // return response.data.attachments.picture;
            //                                 $scope.$apply(function(){
            //                                     mes.post_share = response.data;
            //                                 })
            //                             })
            //                             .catch(function(err){
            //                                 // console.log(err);
            //                                 MUtilitiesService.AlertError(err);
            //                             });
            //                         }
            //                         else {
            //                             return 'Trường hợp khác'
            //                         }
            //                     })

            //                     // console.log(link);
                                
                                
            //                 }
            //             }
            //         })
            //         $scope.messageData = response;
            //     });

            // })
            // .catch(function(err){
            //     MUtilitiesService.AlertError(err, 'Lỗi');
            // })
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
            $scope.startReplying = true;
            if($stateParams.type == 1){
                // replyMessage();
                MFacebookService.replyMessage($stateParams.conversation_id,
                    $scope.currentAccessToken, null,
                    $scope.comentText).then(function(response){
                    MUtilitiesService.AlertSuccessful(response);
                    $scope.$apply(function(){
                        // mục đích hiển thị
                        $scope.messageData.messages.data.unshift({
                            from: {
                                id: $stateParams.page_id,
                                name: page[0].name || 'Tên page',
                            },
                            message : $scope.comentText,
                            created_time : Date.now(),
                        })

                        $scope.comentText = null;
                        $scope.startReplying = false;
                    });
                    

                })
                .catch(function(err){
                    MUtilitiesService.AlertError(err, 'Lỗi')
                })
            }
            else{
                // replyComment();
                MFacebookService.replyComment($stateParams.conversation_id,
                    $scope.currentAccessToken, null, 
                    $scope.comentText).then(function(response){
                    MUtilitiesService.AlertSuccessful(response);
                    $scope.$apply(function(){
                        // mục đích hiển thị
                        $scope.commentData.comments.data.push({
                            from: {
                                id: $stateParams.page_id,
                                name: page[0].name || 'Tên page',
                            },
                            message : $scope.comentText,
                            created_time : Date.now(),
                        })

                        $scope.comentText = null;
                        $scope.startReplying = false;
                    });

                    

                })
                .catch(function(err){
                    MUtilitiesService.AlertError(err, 'Lỗi')
                })
            }
            
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
            if($rootScope.activeOrder.seller_will_call_id !== $rootScope.currentMember.id){
                MUtilitiesService.AlertError('Không cho phép thay đổi trạng thái Order của người khác', 'Thông báo');
                return false;
            }

            if($rootScope.activeOrder.status_id == status.id){
                MUtilitiesService.AlertError('Trạng thái không thay đổi', 'Thông báo');
                return false;
            }
            return true;
        }

        function updateStatus(status){
            // cần thay đổi, nếu trạng thái là chốt thì phải tạo shipping item trước khi thay đổi trạng thái
            // tạo shipping item thành công mới cho phép thay đổi trạng thái

            return new Promise(function(resolve, reject){
                if(!validationBeforChangeStatus(status)){
                    return;
                }

                if(status.id == 6){
                    if(validateCustomerData($scope.customerData, $scope.selectedProducts)){
                        $scope.is_submitting = true;
                        $scope.customerData.products = $scope.selectedProducts;

                        addShippingItem().then(function(response){
                            // reset shipping data
                            $scope.customerData = {
                                realName: $rootScope.activeOrder.customer_name,
                                recievedPhone: $rootScope.activeOrder.customer_mobile,
                                birthDay: '',
                                addresss: '',
                                wish: '',
                                combo: null
                            }
                            // reset products
                            $scope.selectedProducts = [];
                            
                            // change order status
                            changeOrderStatus(status)
                            .then(function(res){
                                $scope.$apply(function(){
                                    $rootScope.activeStatusId = status.id;
                                })
                                resolve('Chúc mừng bạn đã chốt đơn thành công!');
                            })
                            .catch(function( err ){
                                console.log( err );
                                reject('Đã có lỗi xảy ra trong quá trình chốt đơn. Đơn hàng đã được khởi tạo thành công tuy nhiên trạng thái Order không thể thay đổi được.');
                            })
                        })
                        .catch(function(err){
                            console.log( err );
                            reject('Đã có lỗi xảy ra trong quá trình khởi tạo đơn hàng. Vui lòng thử lại!');
                            // MUtilitiesService.AlertError('Order đã thay đổi trạng thái nhưng chưa cập nhật được thông tin đơn hàng.', 'Lỗi')
                        })
                    }
                    else{
                        return;
                    }
                }
                else{
                    changeOrderStatus(status)
                    .then(function(res){
                        resolve(res);
                    })
                    .catch(function(err){
                        reject(err);
                    })
                }
            })
        }

        $scope.cancelReason = function() {
            alert('working');
        }

        var cancelReasons = [
            {
                id: 1,
                reason: "Giá cao quá"
            },
            {
                id: 2,
                reason: "Sản phẩm không phù hợp"
            },
            {
                id: 3,
                reason: "Chưa có nhu cầu"
            },
            {
                id: 4,
                reason: "Không liên lạc được"
            },
            {
                id: 5,
                reason: "Lý do khác"
            },
        ]

        function changeOrderStatus(status){
            return new Promise(function(resolve, reject){
                if( status.id == 7 ) {
                    // hiển thị hộp thoại lý do từ chối
                    sweetAlert.open({
                        title: "Vui lòng cung cấp lý do từ chối",
                        htmlTemplate: "src/realtime/pages/orders/widgets/cancel_reason.html",
                        confirmButtonText: 'Tiếp tục',
                        // customClass: 'swal-wide',
                        showCancelButton: true,
                        showCloseButton: true,
                        allowOutsideClick: false,
                        preConfirm: 'cancelReason',
                        showLoaderOnConfirm: true,
                        controller: 'CancelCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            cancelReasons: function() {
                                return cancelReasons;
                            },
                            orderId: function() {
                                return $stateParams.id;
                            },
                            pageId: function() {
                                return $stateParams.page_id;
                            }
                        }
                    
                    })
                    .then(function( response ){
                        console.log( response );
                        doChangeStatus( status )
                        .then( function(response) {
                            resolve( response );
                        })
                        .catch( function( error ) {
                            reject( error )
                        } )
                    })
                    .catch(function(err){
                        console.log(err);
                        sweetAlert.alert(err, {title: 'Lỗi!'});
                        return;
                    });
                }
                else {
                    doChangeStatus( status )
                        .then( function(response) {
                            resolve( response );
                        })
                        .catch( function( error ) {
                            reject( error )
                        } )
                }

                
            })
        }

        function doChangeStatus( status ) {
            return new Promise( function( resolve, reject ) {
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
                    firebase.database().ref().child('newOrders/' + $stateParams.id).child('activeLog')
                    .push(activeLogItem);

                    resolve('Thay đổi trạng thái thành công');
                })
                .catch(function(err){
                    reject(err);
                });
            } )
        }

        function addShippingItem(){
            return new Promise(function(resolve, reject){
                var data = {
                    customerData : $scope.customerData,
                    orderData : {
                        conversation_id : $rootScope.activeOrder.conversation_id || 'null',
                        customer_id : $rootScope.activeOrder.customer_id || 123456789,
                        customer_name : $rootScope.activeOrder.customer_name,
                        seller_will_call_id : $rootScope.activeOrder.seller_will_call_id,
                        id : $rootScope.activeOrder.id,
                        page_id: $rootScope.activeOrder.page_id,
                        post_id : $rootScope.activeOrder.post_id || null,
                        publish_date : $rootScope.activeOrder.publish_date,
                        status_id : $rootScope.activeOrder.status_id,
                        type :  $rootScope.activeOrder.type || null
                    },
                    customer_name: $rootScope.activeOrder.customer_name,
                    customer_mobile: $rootScope.activeOrder.customer_mobile,
                    created_time : firebase.database.ServerValue.TIMESTAMP,
                }
                firebaseService.addNewShippingItem(data).then(function(response){
                    // khởi tạo báo cáo ngày cho shipping nếu cần
                    var today = new Date();
                    var reportDateString = MFirebaseService.convertDate(today);

                    MFirebaseService.prepareEmptyShippingReport(reportDateString).then(function(response){
                        // console.log(response);
                        // cập nhật báo cáo, tăng 1 đơn vị trong tổng số shipping items
                        MFirebaseService.onCreateShippingItem(reportDateString).then(function(response){
                            // console.log(response);
                            MFirebaseService.updateCodReport( 
                                reportDateString, 
                                $scope.customerData.cod,
                                $rootScope.activeOrder.seller_will_call_id,
                                $rootScope.activeOrder.page_id )
                            .then( function( response ) {
                                console.log( response );
                            } )
                            .catch( function( error ) {
                                console.log( error );
                            } );

                            resolve('Tạo shipping item và cập nhật báo cáo thành công');
                            // cập nhật báo cáo về tiền ở đây

                        })

                    })
                    // resolve(response);
                })
                .catch(function(err){
                    reject(err);
                })
            })
        }

        $scope.alertToCustomer = function(){
            if(!isTestMode){
                if($stateParams.type == 1){
                    MFacebookService.replyMessage($stateParams.conversation_id,
                            $scope.currentAccessToken, null, 'Chào Anh/chị, nhân viên CSKH đã liên hệ với anh/chị nhưng anh/chị chưa nghe máy. Anh/chị vui lòng để ý điện thoại giúp bên em ạ!').then(function(response){
                            MUtilitiesService.AlertSuccessful(response)
                        })
                        .catch(function(err){
                            MUtilitiesService.AlertError(err, 'Lỗi')
                        })
                }
                else{
                    MFacebookService.replyComment($stateParams.conversation_id,
                        $scope.currentAccessToken, null, 'Chào Anh/chị, nhân viên CSKH đã liên hệ với anh/chị nhưng anh/chị chưa nghe máy. Anh/chị vui lòng để ý điện thoại giúp bên em ạ!').then(function(response){
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

        $scope.changeStatus = function(status){
            updateStatus(status).then(function(response){
                MUtilitiesService.AlertSuccessful(response,'Thông báo');
                // gửi tin nhắn đến khách hàng nếu không nghe máy
                if(status.id == 9){ // chưa nghe máy
                    $scope.alertToCustomer();
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
                console.log(err);
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
            realName: $rootScope.activeOrder.customer_name,
            recievedPhone: $rootScope.activeOrder.customer_mobile,
            birthDay: '',
            addresss: '',
            products: [],
            customerNote: '',
            orderNote: '',
            wish: '',
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
        function validateCustomerData(customerData, products){
                MUtilitiesService.validatePhoneNumber(false, 'Số điện thoại khách hàng', 
                customerData.recievedPhone).then(function(response){

                })  
                .catch(function(err){
                    MUtilitiesService.AlertError(err, 'Lỗi');
                    return false;
                })

                if(!customerData.birthDay || customerData.birthDay.length < 1){
                    MUtilitiesService.AlertError('Vui lòng nhập năm sinh', 'Lỗi');
                    return false;
                }
                if(!angular.isNumber(parseInt(customerData.birthDay))){
                    MUtilitiesService.AlertError('Vui lòng kiểm tra lại năm sinh', 'Lỗi');
                    return false;
                }
                else if (angular.isNumber(parseInt(customerData.birthDay))) {

                    var text = /^[0-9]+$/;
                    if ((customerData.birthDay != "") && (!text.test(customerData.birthDay))) {
                        console.log(customerData.birthDay);
                        MUtilitiesService.AlertError('Năm sinh phải nhập dạng số', 'Lỗi');
                        return false;
                    }

                    // if (customerData.birthDay.length != 4) {
                    //     MUtilitiesService.AlertError('Năm sinh phải gồm 4 chữ số', 'Lỗi');
                    //     return false;
                    // }
                    var current_year=new Date().getFullYear();
                    if((customerData.birthDay < 1920) || 
                        (customerData.birthDay > current_year))
                        {
                        MUtilitiesService.AlertError('Năm sinh thuộc khoảng từ 1920 đến ' + current_year, 'Lỗi');
                        return false;
                        }
                }

                if(!angular.isNumber(customerData.cod)){
                    MUtilitiesService.AlertError('Số tiền không đúng', 'Lỗi');
                    return false;
                }
                if(customerData.cod <= 10000){
                    MUtilitiesService.AlertError('Số tiền không đúng', 'Lỗi');
                    return false;
                }
                if(!customerData.addresss || customerData.addresss.length < 1){
                    MUtilitiesService.AlertError('Vui lòng nhập địa chỉ nhận hàng', 'Lỗi');
                    return false;
                }
                if(!products || products.length == 0){
                    MUtilitiesService.AlertError('Vui lòng thêm sản phẩm', 'Lỗi');
                    return false;
                }

                if(products.length > 0){

                    var pass = true;
                    var countProductPass = true;
                    angular.forEach(products, function(product){
                        // if(!product.note){
                        //     MUtilitiesService.AlertError('Vui lòng nhập ghi chú sản phẩm', 'Thông báo');
                        //     return false;
                        // }
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
                if(!customerData.combo){
                    MUtilitiesService.AlertError('Vui lòng cho biết nếu đơn hàng là COMBO', 'Lỗi');
                    return false;
                }
                return true;

        }
        $scope.onSubmitOrder = function(){
            
            var successStatus = $rootScope.filterById($rootScope.statuses, 6);
            if(successStatus){
                updateStatus(successStatus).then(function(response){
                    $scope.$apply(function(){
                        $scope.is_submitting = false;
                    })
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
            if(!canEditOrder()){
                MUtilitiesService.AlertError('Bạn không có quyền chỉnh sửa Order này', 'Thông báo');
                return;
            }
            firebaseService.getShippingItemByOrderId($rootScope.activeOrder.id).then(function(snapshot){
                $scope.$apply(function(){
                    angular.forEach(snapshot.val(), function(value, key){
                        $scope.editData = value;
                        $scope.editKey = key;
                    });
                    $scope.showEditOrderForm = true;
                })
            });
        }

        var canEditOrder = function(){
            if($rootScope.currentMember.is_admin == 1 || $rootScope.currentMember.is_mod == 1){
                return true;
            }
            else if($rootScope.currentMember.id == $rootScope.activeOrder.seller_will_call_id){
                return true;
            }
            else{
                return false;
            }
        }

        $scope.addProductOnEdit = function(){
            $scope.editData.data.customerData.products.push({
                id : null,
                count : 1,
                note : ''
            });
        }
        $scope.deleteProductOnEdit = function(index){
            // console.log('xóa ' + index);
            $scope.editData.data.customerData.products.splice(index, 1);
        }

        $scope.submitEditOrder = function(){
            // console.log($scope.editData.data);
            if(!validateCustomerData($scope.editData.data.customerData, $scope.editData.data.customerData.products)){
                return;
            }

            MUtilitiesService.showConfirmDialg('Thông báo',
                'Bạn có muốn thay đổi thông tin Order đã chốt không.', 'Thay đổi', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                    // console.log('bắt đầu update dữ liệu');
                    MFirebaseService.updateShippingItemCustomerData($scope.editKey, $scope.editData.data.customerData).then(function(response){
                        MUtilitiesService.AlertSuccessful(response, 'Thông báo');
                    })
                    .catch(function(err){
                        MUtilitiesService.AlertError(err, 'Lỗi');
                    })
                }
                else{

                }
            });
            // begin update
            
        }

        $scope.success_coppied = function(){
            MUtilitiesService.AlertSuccessful('Coppied to clipboard!');
        }
        $scope.fail_coppied = function(err){
            MUtilitiesService.AlertError('Can not coppy to clipboard. Error: ' + err);
        }

	});