(function() {
    'use strict';

    angular.module('mUtilities', ['ngDialog']);

    angular.module('mUtilities')
        .service('MUtilitiesService', ['$document', '$timeout', 'toastr', 'toastrConfig', 'ngDialog',
            function($document, $timeout, toastr, toastrConfig, ngDialog) {
                // TOASTR
                var configToastr = function() {
                    toastrConfig.closeButton = true;
                    toastrConfig.timeOut = 3000;
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
                        '<button type="button" class="btn btn-sm" ng-click="closeThisDialog()">' + rejectButtonText + '</button>' +
                        '</div>';

                    return new Promise(function(resolve, reject) {
                        ngDialog.openConfirm({
                                template: html,
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

                var showManualOrderAdd = function(onOpenCallback) {

                    var template = '<div class="">' +
                        '<div class="Box-header">' +
                        '<h3 class="Box-title">Thêm Order thủ công</h3>' +
                        '</div>' +
                        '<div class="Box-body">' +
                        '<dl class="form-group width-full">' +
                        '<dt><label>Số điện thoại khách hàng</label></dt>' +
                        '<dd><input ng-model="orderData.customer_phone" class="form-control" type="number" placeholder="e.g: 0943312354" >' +
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
                        '<dt><label>Post Id</label></dt>' +
                        '<dd><input ng-model="orderData.post_id" class="form-control" type="number" placeholder="Nhập ID bài viết" >' +
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
                                    customer_phone: null,
                                    customer_name: null,
                                    customer_id: null,
                                    post_id: null,
                                    page_id: null

                                }
                                // console.log($scope.pages);
                                $scope.submit = function() {

                                    if (!$scope.orderData.customer_phone || !$scope.orderData.customer_name ||
                                        $scope.orderData.customer_name.length == 0 ||
                                        $scope.orderData.customer_phone.length == 0) {
                                        AlertError('Vui lòng nhập dữ liệu', 'Lỗi');
                                        // reject(false);
                                        return;
                                    }
                                    if (!$scope.orderData.post_id || $scope.orderData.post_id.length == 0) {
                                        AlertError('Vui lòng nhập id bài viết', 'Lỗi');
                                        return;
                                    } else {
                                        onOpenCallback().submitOrder($scope.orderData).then(function(response) {
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
                            console.log('sdfsdfsdfsdfdsf');
                            var l = shareLink.split('/');
                            resolve({
                                type: 'post',
                                id: l[l.length - 1]
                            });
                        }
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
                }
            }
        ]);
}());