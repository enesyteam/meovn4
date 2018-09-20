(function() {
    'use strict';

    angular.module('mUtilities', ['ngDialog']);

    angular.module('mUtilities')
        .service('MUtilitiesService', ['$document', '$timeout', '$filter', 'toastr', 'toastrConfig', 'ngDialog', 
            'firebaseStorageService', 'MFacebookService',
            function($document, $timeout, $filter, toastr, toastrConfig, ngDialog, firebaseStorageService, 
                MFacebookService) {
                // console.log(MFirebaseService);
                // TOASTR
                var configToastr = function() {
                    toastrConfig.closeButton = true;
                    toastrConfig.timeOut = 3000;
                    toastrConfig.toastClass = 'notice';
                    toastrConfig.containerId = 'global-notices';
                    toastrConfig.iconClasses = {
                        error: 'is-error',
                        info: 'is-info',
                        success: 'is-success',
                        warning: 'is-warning'
                      };
                    // toastrConfig.positionClass = 'toast-top-right';
                    toastrConfig.positionClass = "toast-bottom-right";
                }

                configToastr();

                function AlertError(c, d) {
                    toastr.error(c, d)
                };

                function AlertSuccessful(c, d) {
                    toastr.success(c, d)
                };

                function AlertWarning(c, d) {
                    toastr.warning(c, d)
                };


                // DATE TIME FUNCTIONS
                var formatDateTime = function(dateStr) {
                    var year, month, day, hour, minute, dateUTC, date, ampm, d, time;
                    var iso = (dateStr.indexOf(' ') == -1 && dateStr.substr(4, 1) == '-' && dateStr.substr(7, 1) == '-' && dateStr.substr(10, 1) == 'T') ? true : false;

                    year = dateStr.substr(0, 4);
                    month = parseInt((dateStr.substr(5, 1) == '0') ? dateStr.substr(6, 1) : dateStr.substr(5, 2)) - 1;
                    day = dateStr.substr(8, 2);
                    hour = dateStr.substr(11, 2);
                    minute = dateStr.substr(14, 2);
                    dateUTC = Date.UTC(year, month, day, hour, minute);
                    date = new Date(dateUTC);
                    var curDate = new Date();

                    var currentStamp = curDate.getTime();
                    var datesec = date.setUTCSeconds(0);
                    var difference = parseInt((currentStamp - datesec) / 1000);
                    return difference;
                }

                var showConfirmDialg = function(title, content, confirmButtonText, rejectButtonText) {
                    var html =
                        '<div class="Box-header">' +
                        '<h3 class="Box-title">' + title + '</h3>' +
                        '</div>' +
                        '<div class="Box-body">' +
                        '<div>' + content + '</div>' +
                        '</div>' +

                        '<div class="Box-footer">' +
                        '<button type="button" class="btn btn-sm btn-primary" ng-click="confirm(confirmValue)">' + confirmButtonText + '</button>' +
                        '<button type="button" class="btn btn-sm ml-2" ng-click="closeThisDialog()">' + rejectButtonText + '</button>' +
                        '</div>';

                    return new Promise(function(resolve, reject) {
                        ngDialog.openConfirm({
                                template: html,
                                disableAnimation : true,
                                plain: true
                            })
                            .then(function(confirm) {
                                resolve(true);
                            })
                            .catch(function(s) {
                                resolve(false);
                            })
                    })
                }

                var showDublicateConfirm = function(onOpenCallback) {
                    var html =
                        '<div class="Box-header">' +
                        '<h3 class="Box-title">Phát hiện trùng số</h3>' +
                        '</div>' +
                        '<div class="Box-body">' +
                        '<div>Tìm thấy {{orders.length}} order(s) có cùng số điện thoại: </div>'
                        + '<ul style="margin-left:15px;">'
                        +   '<li ng-repeat="order in orders">'
                        +       '<span>{{order.customer_name}} - {{order.customer_mobile}} - {{filterById(statuses, order.status_id).name}} - '
                        + '{{filterById(fanpages, order.page_id).name}} - (Tạo lúc: {{order.publish_date | date: "dd/MM hh:MM"}})</span>'
                        +   '</li>'
                        + '</ul>' +
                        '</div>' +

                        '<div class="Box-footer">' +
                        '<button type="button" class="btn btn-sm btn-primary" ng-click="confirm(true)">Tiếp tục</button>' +
                        '<button type="button" class="btn btn-sm ml-2" ng-click="reject()">Bỏ qua</button>' +
                        '</div>';

                    return new Promise(function(resolve, reject) {
                       var dlg = ngDialog.open({
                                template: html,
                                controller: ['$scope', '$filter', function($scope, $filter){
                                    console.log($filter);
                                  $scope.orders =  onOpenCallback().orders;
                                  $scope.fanpages =  onOpenCallback().fanpages;
                                  $scope.statuses =  onOpenCallback().statuses;
                                  console.log($scope.orders);
                                  $scope.filterById = function(sources, id) {
                                        if(!id) return null;
                                        return $filter("filter")(sources, {
                                            id: id
                                        })[0];
                                    }   
                                  $scope.confirm = function(){
                                    dlg.close();
                                    resolve(true);
                                  }
                                  $scope.reject = function(){
                                    dlg.close();
                                    resolve(false);
                                  }
                                }],
                                plain: true,
                                disableAnimation : true,
                                onOpenCallback: onOpenCallback,
                            })
                    })
                }

                 

                var showChatBox = function(onOpenCallback) {
                    return new Promise(function(resolve, reject) {
                        ngDialog.open({
                                template: 'src/admin/widgets/chat-box-dialog.html',
                                controller: ['$scope', function($scope) {
                                $scope.order = onOpenCallback().order;
                                // console.log($scope.order);
                                $scope.token = onOpenCallback().token;
                                $scope.fanpages = onOpenCallback().fanpages;
                                $scope.replies = onOpenCallback().replies;

                                var getToken = function(pageId){
                                    return new Promise(function(resolve, reject){
                                        var page = $filter("filter")($scope.fanpages, {id: pageId});
                                        if(page[0]){
                                            resolve(page[0].access_token);
                                        }
                                        else{
                                            reject('Page với ID ' + pageId + ' chưa được thêm vào danh sách quản lý.');
                                        }
                                    })
                                }

                                // console.log($scope.order);

                                MFacebookService.graphPage($scope.order.page_id, $scope.token).then(function(response){
                                  $scope.$apply(function(){
                                    $scope.pageData = response;
                                    // console.log($scope.pageData);
                                  })

                                  getToken(response.id).then(function(token){
                                    // console.log('token: ' + token);
                                        $scope.$apply(function(){
                                            $scope.currentAccessToken = token;
                                        })

                                        if($scope.order.type==1){
                                        // messages
                                        MFacebookService.graphMessages($scope.order.conversation_id, token).then(function(response){
                                            $scope.$apply(function(){
                                                // console.log(response);
                                                // chỉnh sửa thông tin chút
                                                angular.forEach(response.messages.data, function(mes){
                                                    // mes = 'sdfsdfsdf';
                                                    if(mes.shares && mes.shares.data){
                                                        if(mes.shares.data[0].link){
                                                            // mes = 'sdfds';
                                                            // console.log(mes.shares.data[0].link);
                                                            // var link = $scope.detectMessageSharesLink(mes.shares.data[0].link);

                                                            detectMessageSharesLink(mes.shares.data[0].link).then(function(result){
                                                                if(result.type == 'photo'){
                                                                    mes.link = result.link;
                                                                }
                                                                else if(result.type == 'post'){
                                                                    // console.log(result);
                                                                    // alert('share is post');
                                                                    MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, token)
                                                                    .then(function(response){
                                                                        // console.log(response);
                                                                        // mes.x = response.data;
                                                                        // return response.data.attachments.picture;
                                                                        $scope.$apply(function(){
                                                                            mes.post_share = response.data;
                                                                        })
                                                                    })
                                                                    .catch(function(err){
                                                                        // console.log(err);
                                                                        AlertError(err);
                                                                    });
                                                                }
                                                                else {
                                                                    return 'Trường hợp khác'
                                                                }
                                                            })

                                                            // console.log(link);
                                                            
                                                            
                                                        }
                                                    }
                                                })
                                                $scope.messageData = response;
                                            });

                                        })
                                        .catch(function(err){
                                            AlertError(err, 'Lỗi');
                                        })
                                    }
                                    else{
                                        // graph post
                                        MFacebookService.graphPost($scope.order.post_id, token).then(function(response){
                                            $scope.$apply(function(){
                                                // console.log(response);
                                                $scope.postData = response;
                                            })
                                        })
                                        .catch(function(err){
                                            AlertError(err, 'Lỗi');
                                        })

                                        // also graph comments
                                        MFacebookService.graphComments($scope.order.conversation_id, token).then(function(response){
                                            $scope.$apply(function(){
                                                // console.log(response);
                                                $scope.commentData = response;
                                            })
                                        })
                                        .catch(function(err){
                                            AlertError(err, 'Lỗi');
                                        })
                                    }
                                    })
                                })


                                var testMode = false;
                                $scope.messageContent = {
                                    text : null
                                };

                                function doReply(){
                                     if(!testMode){
                                        $scope.startReplying = true;
                                        if($scope.order.type == 1){
                                            // reply message
                                            MFacebookService.replyMessage($scope.order.conversation_id,
                                                $scope.currentAccessToken, null, $scope.messageContent.text).then(function(response){
                                                AlertSuccessful(response);
                                                $scope.$apply(function(){
                                                    // mục đích hiển thị
                                                    $scope.messageData.messages.data.unshift({
                                                        from: {
                                                            id: $scope.pageData.id,
                                                            name: $scope.pageData.name || 'Tên page',
                                                        },
                                                        message : $scope.messageContent.text,
                                                        created_time : Date.now(),
                                                    })

                                                    $scope.messageContent.text = null;
                                                    $scope.startReplying = false;
                                                });
                                            })
                                            .catch(function(err){
                                                AlertError(err, 'Lỗi')
                                            })
                                        }
                                        else{
                                            // reply comment
                                            MFacebookService.replyComment($scope.order.conversation_id,
                                                $scope.currentAccessToken, null, $scope.messageContent.text).then(function(response){
                                                AlertSuccessful(response);
                                                $scope.$apply(function(){
                                                    // mục đích hiển thị
                                                    $scope.commentData.comments.data.push({
                                                        from: {
                                                            id: $scope.pageData.id,
                                                            name: $scope.pageData.name || 'Tên page',
                                                        },
                                                        message : $scope.messageContent.text,
                                                        created_time : Date.now(),
                                                    })

                                                    $scope.messageContent.text = null;
                                                    $scope.startReplying = false;
                                                });
                                            })
                                            .catch(function(err){
                                                AlertError(err, 'Lỗi')
                                            })
                                        }
                                    }
                                    else{
                                        AlertError($scope.messageContent.text, 'Thông báo');
                                        AlertSuccessful($scope.currentAccessToken, 'Token');
                                    }

                                    $scope.shouldDisplayQuickReply = false;
                                }

                                $scope.shouldDisplayQuickReply = false;

                                $scope.onTyping = function(){
                                    if($scope.messageContent.text.startsWith("/")){
                                        $scope.shouldDisplayQuickReply = true;
                                    }
                                    else{
                                        $scope.shouldDisplayQuickReply = false;
                                    }
                                }



                                /*
                                * reply to customer
                                */
                                $scope.sendReply = function(){
                                    if(!$scope.messageContent.text || $scope.messageContent.text.length == 0){
                                        AlertError('Vui lòng nhập nội dung tin nhắn', 'Thông báo');
                                        return;
                                    }

                                    if($scope.messageContent.text.startsWith("/")){

                                        onOpenCallback().findReply($scope.messageContent.text.substr(1)).then(function(response){
                                            $scope.$apply(function(){
                                                $scope.messageContent.text = response.text;
                                                return;
                                            })
                                        })
                                        .catch(function(err){
                                            // không tìm thấy mẫu trả lời nhanh
                                            AlertError('Dường như bạn đang cố gắng thử một chuỗi trả lời nhanh bằng tổ hợp phím tắt.'+
                                                ' Tuy nhiên hệ thống không tìm thấy mẫu trả lời nhanh nào tương ứng với tổ hợp phím tắt này.', 'Lỗi');
                                            return;
                                        })
                                    }
                                    else{
                                        doReply();
                                    }
                                }
                            }],
                            // plain: true,
                            disableAnimation : true,
                            width: 800,
                            height: 600,
                            className: 'ngdialog-theme-default y-scroll',
                            onOpenCallback: onOpenCallback,
                            });
                            
                    })
                }

                var showManualOrderAdd = function(onOpenCallback) {

                    var template = '<div class="">' +
                        '<div class="Box-header">' +
                        '<h3 class="Box-title">Thêm Order thủ công</h3>' +
                        '</div>' +
                        '<div class="Box-body">' +
                        '<dl class="form-group width-full">' +
                        '<dt><label>Số điện thoại khách hàng</label></dt>' +
                        '<dd><input ng-model="orderData.customer_mobile" class="form-control" type="text" placeholder="e.g: 0943312354" >' +
                        '</dd>' +
                        '</dl>' +
                        '<dl class="form-group width-full">' +
                        '<dt><label>Facebook ID của khách hàng</label></dt>' +
                        '<dd><input ng-model="orderData.customer_id" class="form-control" type="text" placeholder="e.g: 1750056538577604" >' +
                        '</dd>' +
                        '</dl>' +
                        '<dl class="form-group width-full">' +
                        '<dt><label>Tên khách hàng</label></dt>' +
                        '<dd><input ng-model="orderData.customer_name" class="form-control" type="text" placeholder="Nhập tên" >' +
                        '</dd>' +
                        '</dl>' +
                        '<div class="form-group">' +
                        '<dt><label>Chọn trang</label></dt>' +
                        '<dd>' +
                        '<select class="form-control" chosen ng-model="orderData.page_id" ng-options="s.id as s.name for s in pages">' +
                        '<option value=""></option>' +
                        '</select>' +
                        '</dd>' +
                        '</div>' +
                        '<dl class="form-group width-full">' +
                        '<dt><label>ID bài viết</label></dt>' +
                        '<dd><input ng-model="orderData.post_id" class="form-control" type="text" placeholder="Nhập ID bài viết e.g: 291032108095856" >' +
                        '</dd>' +
                        '</dl>' +
                        '</div>' +
                        '<div class="Box-footer">' +
                        '<a ng-click="submit()" class="btn btn-primary">' +
                        'Tạo Order' +
                        '</a>' +
                        '</div>';



                    // <p class="note">Hoặc bấm <a href="" ng-click="goToAddHub()">vào đây</a> để thêm mới một Hub trên GHN</p>

                    return new Promise(function(resolve, reject) {
                        var dlg = ngDialog.open({
                            template: template,
                            controller: ['$scope', function($scope) {
                                $scope.pages = onOpenCallback().pages;
                                $scope.orderData = {
                                    customer_mobile: null,
                                    customer_name: null,
                                    customer_id: null,
                                    post_id: null,
                                    page_id: null

                                }
                                // console.log($scope.pages);
                                $scope.submit = function() {

                                    if (!$scope.orderData.customer_mobile || !$scope.orderData.customer_name ||
                                        $scope.orderData.customer_name.length == 0 ||
                                        $scope.orderData.customer_mobile.length == 0) {
                                        AlertError('Vui lòng nhập dữ liệu', 'Lỗi');
                                        // reject(false);
                                        return;
                                    }
                                    if (!$scope.orderData.post_id || $scope.orderData.post_id.length == 0) {
                                        AlertError('Vui lòng nhập id bài viết', 'Lỗi');
                                        return;
                                    } else {
                                        onOpenCallback().submitOrder({
                                            customer_mobile : $scope.orderData.customer_mobile,
                                            customer_name : $scope.orderData.customer_name,
                                            customer_id : $scope.orderData.customer_id,
                                            page_id: $scope.orderData.page_id,
                                            post_id: $scope.orderData.page_id + '_' + $scope.orderData.post_id
                                        }).then(function(response) {
                                            if (response == true) {
                                                dlg.close();
                                            }

                                        })
                                    }
                                }
                            }],
                            plain: true,
                            onOpenCallback: onOpenCallback,
                        });
                    })
                }

                var showUploadImage = function(onOpenCallback) {
                    var template = '<div class="Box-header">' +
                        '<h3 class="Box-title">Upload ảnh vào cơ sở dữ liệu</h3>' +
                        '</div>' +
                        '<div class="Box-body">' +

                                '<div class="mt-2 mb-2 upload-image-box">'+
                                      '<label class="position-relative btn button-change-avatar text-center">'+
                                        'Chọn ảnh...'+
                                       '<input id="upload-profile-picture" type="file" class="manual-file-chooser height-full ml-0 js-manual-file-chooser" ngf-select="onFileSelect($files)" multiple="" style="display:none;">'+
                                       '</label>'+
                                       '<div class="preview">'+
                                        '<img ng-src="{{imageData.fileName}}">'+
                                       '</div>'+
                                   '</div>'+
                                   '<hr />'+
                                   '<dl class="form-group">'+
                                      '<dt><label for="user_profile_email">Đặt tên cho ảnh</label></dt>'+
                                      '<dd>'+
                                         '<input type="text" class="form-control" ng-model="imageData.name">'+
                                      '</dd>'+
                                   '</dl>'+
                                   '<dl class="form-group">'+
                                      '<dt><label for="user_profile_email">Áp dụng cho giới tính</label></dt>'+
                                      '<dd class="ml-2">'+
                                         '<div class="d-inline-block mr-3" ng-repeat="gender in genders track by $index">'+
                                            '<label>'+
                                               '<input class="js-email-global-unsubscribe mr-2" id="gender-name-{{gender.id}}" name="gender" type="checkbox" value="marketing" ng-value="gender.id" ng-model="gender.selected">'+
                                            '{{gender.name}}'+
                                            '</label>'+
                                         '</div>'+
                                      '</dd>'+
                                   '</dl>'+
                                   '<dl class="form-group">'+
                                      '<dt><label for="user_profile_email">Áp dụng cho mệnh</label></dt>'+
                                      '<dd class="ml-2">'+
                                         '<div class="d-inline-block mr-3" ng-repeat="destiny in destinies track by $index">'+
                                            '<label>'+
                                               '<input class="js-email-global-unsubscribe mr-2" id="destiny-name-{{destiny.id}}" name="destiny" type="checkbox" value="marketing" ng-value="destiny.id" ng-model="destiny.selected">'+
                                            '{{destiny.name}}'+
                                            '</label>'+
                                         '</div>'+
                                      '</dd>'+
                                   '</dl>'+
                            '</div>' +
                            '<div class="Box-footer">' +
                            '<a ng-click="submit()" class="btn btn-primary">' +
                            'Thêm ảnh' +
                            '</a>' +
                            '</div>';

                    return new Promise(function(resolve, reject) {
                        var dlg = ngDialog.open({
                            template: template,
                            controller: ['$scope', function($scope) {
                                $scope.genders = [
                                    {
                                        id : 1,
                                        name : 'Nam',
                                        selected: false,
                                    },
                                    {
                                        id : 2,
                                        name : 'Nữ',
                                        selected: false,
                                    }
                                ]

                                $scope.destinies = [
                                    {
                                        id : 1,
                                        name : 'Kim',
                                        selected: false,
                                    },
                                    {
                                        id : 2,
                                        name : 'Thủy',
                                        selected: false,
                                    },
                                    {
                                        id : 3,
                                        name : 'Hỏa',
                                        selected: false,
                                    },
                                    {
                                        id : 4,
                                        name : 'Thổ',
                                        selected: false,
                                    },
                                    {
                                        id : 5,
                                        name : 'Mộc',
                                        selected: false,
                                    }
                                ]

                                $scope.imageData = {
                                    name: null,
                                    genders: $scope.genders,
                                    destinies: $scope.destinies,
                                    fileName: null
                                }

                                $scope.onFileSelect = function($files) {
                                    // console.log($files);
                                    angular.forEach($files, function(file) {
                                        // make file name
                                        var d = Date.now();
                                        var file_name = 'image_' + d;
                                        // console.log(file_name);
                                        firebaseStorageService.upload(file, 1, file_name).then(function(response) {
                                            // response = file link
                                            $scope.imageData.fileName = response;
                                            // console.log(response);
                                            // create image item on firebase
                                        })
                                        .catch(function(err){
                                            console.log(err);
                                        });
                                    });
                                    // $files = null;
                                };

                                $scope.submit = function() {
                                    if(!$scope.imageData.name || $scope.imageData.name.length == 0){
                                        AlertError('Vui lòng nhập tên ảnh', 'Lỗi');
                                        return;
                                    }
                                    onOpenCallback().submitImage($scope.imageData).then(function(response) {
                                        if (response == true) {
                                            dlg.close();
                                        }

                                    })
                                }
                            }],
                            plain: true,
                            onOpenCallback: onOpenCallback,
                        })

                    })
                }

                var showWaitingDialog = function(waitingMessage, onOpenCallback) {
                    var html = '<div class="ytp-spinner" data-layer="4" style="">' +
                        '<div>' +
                        '<div class="ytp-spinner-container">' +
                        '<div class="ytp-spinner-rotator">' +
                        '<div class="ytp-spinner-left">' +
                        '<div class="ytp-spinner-circle"></div>' +
                        '</div>' +
                        '<div class="ytp-spinner-right">' +
                        '<div class="ytp-spinner-circle"></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="ytp-spinner-message" style="display: block;">' +
                        waitingMessage +
                        '</div>' +
                        '</div>';

                    return new Promise(function(resolve, reject) {
                        var dlg = ngDialog.open({
                            template: html,
                            plain: true,
                            closeByDocument: false,
                            showClose: false,
                            onOpenCallback: onOpenCallback,
                        });
                        onOpenCallback().init().then(function(response) {
                            if (response == true) {
                                dlg.close();
                            }

                        })

                    })
                }

                // detect conversation link
                var getPageNameOrIdFromConversationLink = function(link) {
                    // các dạng Conversation link
                    // https://www.facebook.com/permalink.php?story_fbid=1429803833808729&id=1388036621318784
                    // https://www.facebook.com/DaQuyPhongThuyTrangAn/posts/143302139668476?comment_id=154101035255253
                    // https://business.facebook.com/DaQuyPhongThuyTrangAn/manager/messages/?threadid=144606886204668&folder=inbox
                    // message link = https://facebook.com/128910997779161/manager/messages/?threadid=141327656537495&folder=inbox
                    // comment link = https://facebook.com/188076085089506_142551766431653

                    if (link.indexOf('threadid') !== -1) {
                        // message
                        var l = link.split('/').pop(); // ?threadid=144606886204668&folder=inbox
                        var s = l.split('=');
                        var x = s[1]; //144606886204668&folder
                        var y = x.split('&');
                        var thread = y[0];
                        // page id
                        var page_name_or_id = link.split('/')[3];

                    } else {
                        // comment

                    }
                    return (link.indexOf('permalink') !== -1) ? link : link.split('/')[3];
                }

                var detectMessageSharesLink = function(shareLink) {
                    // "https://www.facebook.com/TrangSucPhongThuyHTShop/photos/a.1778042112208288.1073741827.1754290804583419/1803964422949390/?type=3"
                    // "https://www.facebook.com/TrangSucPhongThuyVici/posts/399665227145391"
                    return new Promise(function(resolve, reject) {
                        if (shareLink.indexOf('photos') !== -1) {
                            var l = shareLink.split('/');
                            resolve({
                                type: 'photo',
                                link: '//graph.facebook.com/' + l[l.length - 2] + '/picture?height=720&width=720'
                            });
                        }
                        if (shareLink.indexOf('posts') !== -1) {
                            // console.log('sdfsdfsdfsdfdsf');
                            var l = shareLink.split('/');
                            resolve({
                                type: 'post',
                                id: l[l.length - 1]
                            });
                        }
                    })
                }

                // Kiểm tra số điện thoại
                // var senderPhoneResult = CheckPhone9_10(false, "Điện thoại người gửi", orderData.ClientContactPhone, p_validPhone, p_validHomePhone);

                var p_validPhone = "86,88,89,90,91,92,93,94,96,97,98,99,120,121,122,123,124,125,126,127,128,129,161,162,163,164,165,166,167,168,169,186,188,199,868,70,79,77,76,78,83,84,85,81,82,32,33,34,35,36,37,38,39,56,58,59";
                var p_validHomePhone = "4,8,55,56,57,58,59,60,61,62,63,64,66,67,68,70,72,73,75,203,204,205,206,207,208,209,212,213,214,215,216,220,221,222,225,226,227,228,229,232,233,234,235,236,237,238,239,251,252,254,255,256,257,258,259,260,261,262,263,269,270,271,272,273,274,275,276,277,290,291,292,293,294,296,297,299,500,501,650,651,241,242,243,244,245,246,247,248,249,281,282,283,284,285,286,287,288,289";


                function IsNullOrEmpty(c) {
                    return !c || !/[^\s]+/.test(c)
                };
                // w = chuỗi mô tả số điện thoại cần kiểm tra
                // l = số điện thoại cần kiểm tra
                function validatePhoneNumber(m = false, w, l, q, y, j) {
                    q = p_validPhone;
                    y = p_validHomePhone;

                    console.log(l);
                    // console.log(j);

                    return new Promise(function(resolve, reject){
                        if(l.length == 0){
                            reject(w + ' bắt buộc');
                        }
                        var p, d, v, k, g;
                        if (m && IsNullOrEmpty(l)) {
                            reject(w + ' bắt buộc');
                        }
                        if (!IsNullOrEmpty(l)) {
                            resolve('Số điện thoại hợp lệ');
                            // if (l.indexOf("1800") === 0 || l.indexOf("1900") === 0) {
                            //     reject('Đây là đầu số 1800, 1900');
                            // }
                            // if (l[0] == "0" && (l = l.substr(1, l.length)), p = q.split(","), d = 0, p != null && p != undefined && p.length > 0) {
                            //     for (g = 0; g < p.length; g++) {
                            //         if (l.indexOf(p[g]) === 0) {
                            //             d = p[g];
                            //             break
                            //         }
                            //     }
                            //     if (g < p.length && !isNaN(l)) {
                            //         var result = d == "868" && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" && d.length == 2 && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" 
                            //         && d.length == 3 && l.length != 10 ? "Số điện thoại phải là 11 số" : ''

                            //         if(result !== ''){
                            //             reject(result);
                            //         }
                            //         else{
                            //             resolve('Số điện thoại hợp lệ');
                            //         }
                            //     }
                            //     if (j) {
                            //         reject("Số điện thoại di động không hợp lệ");
                            //     }
                            // }
                            // if (v = y.split(","), k = 0, v != null && v != undefined && v.length > 0) {
                            //     for (g = 0; g < v.length; g++) {
                            //         if (l.indexOf(v[g]) === 0) {
                            //             k = v[g];
                            //             break
                            //         }
                            //     }
                            //     if (g < v.length && !isNaN(l)) {
                            //         if ((k == "4" || k == "8") && l.length != 9) {
                            //             reject("Số điện thoại bàn phải là 10 số");
                            //         }
                            //         if (k != "4" && k != "8" && l.length - k.length != 7) {
                            //             reject("Số điện thoại bàn phải là " + (k.length + 8) + " số");
                            //         }
                            //     } else {
                            //         reject("Số điện thoại không hợp lệ");
                            //     }
                            // }
                        }
                        resolve('Số điện thoại hợp lệ');
                    })
                };

                var checkTwoDatesEqual = function(date1, date2){
                    date1 = new Date(date1);
                    date2 = new Date(date2);
                    return date1.getDate() == date2.getDate() && 
                        date1.getMonth() ==  date2.getMonth() && 
                        date1.getFullYear() ==  date2.getFullYear();
                }

                var buildUsersChartData = function(input_data){
                    console.log(input_data);
                    var seller_chart_data = {
                        102: 'dsf',
                        104: '111'
                    };
                    return new Promise(function(resolve, reject){
                        if(input_data.user_report){
                            angular.forEach(input_data.user_report, function(date_report){
                                var d = date_report.date;
                                angular.forEach(date_report.value, function(user_report){
                                    // console.log('date: ' + d + ' id: ' + user_report.id);
                                    if(seller_chart_data.hasOwnProperty(user_report.id)){
                                        console.log('record ' + user_report.id + ' đã tồn tại và không cần khởi tạo');
                                        // $rootScope.seller_chart_data.
                                        console.log('not');
                                        // seller_chart_data.push({
                                        //     id: user_report.id
                                        // })
                                    }   
                                })
                            })
                        }
                        resolve(seller_chart_data)
                    })
                }

                

                return {
                    AlertError: AlertError,
                    AlertSuccessful: AlertSuccessful,
                    AlertWarning: AlertWarning,
                    formatDateTime: formatDateTime,
                    showConfirmDialg: showConfirmDialg,
                    showWaitingDialog: showWaitingDialog,
                    showManualOrderAdd: showManualOrderAdd,
                    getPageNameOrIdFromConversationLink: getPageNameOrIdFromConversationLink,
                    detectMessageSharesLink: detectMessageSharesLink,
                    showUploadImage : showUploadImage,
                    validatePhoneNumber : validatePhoneNumber,
                    showChatBox : showChatBox,
                    showDublicateConfirm: showDublicateConfirm,
                    checkTwoDatesEqual: checkTwoDatesEqual,
                    buildUsersChartData: buildUsersChartData,
                    
                }
            }
        ]);
}());