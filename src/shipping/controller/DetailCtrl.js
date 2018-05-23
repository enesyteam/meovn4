mShipping.controller('DetailCtrl',
    function($rootScope, $scope, $http, $window, $state, $stateParams, $document, $filter, $timeout, cfpLoadingBar,
        cfpLoadingBar, Facebook, toastr, toastrConfig, moment, ProductPackService,
        firebaseService, GiaoHangNhanhService, MGHNService, activeItem, ghn_hubs, ghn_token, MFacebookService, MFirebaseService, 
        MUtilitiesService, current_hub, fanpages, ghn_districs, ngDialog) {
        // console.log(ghn_token);

        // console.log(firebase.utils);
        // alert($stateParams.cv_id);
        // $scope.activedItem = activeItem;
        // console.log($scope.activedItem);

        // if(!ghn_districs || !ghn_hubs){
        //     MUtilitiesService.AlertError('Lỗi kết nối tới hệ thống GHN', 'Lỗi');
        //     return;
        // }

        $scope.activeId = $stateParams.id;

        $scope.statuses = [
            {
                id: 101,
                code: 'ReadyToPick',
                text: 'Mới tạo',
                description : 'Trạng thái ReadyToPick là trạng thái đơn hàng mới được tạo ra và chờ nhân viên lấy hàng đến lấy. Khi đơn hàng được tạo ra mặc định sẽ nằm trong trạng thái này.'
            },
            {
                id: 0,
                code: 'Cancel',
                text: 'Hủy',
                description : 'Là trạng thái đơn hàng bị hủy'
            },
            {
                id: 201,
                code: 'Storing',
                text: 'Đã lấy',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đã nhận được và chuyển hàng hóa về kho lưu trữ'
            },
            {
                id: 202,
                code: 'Delivering',
                text: 'Đang giao',
                description : 'Là trạng thái nhân viên giao nhận của giaohangnhanh đang đi giao hàng cho người nhận'
            },
            {
                id: 203,
                code: 'Delivered',
                text: 'Thành công',
                description : 'Là trạng thái đơn hàng đã được giao thành công'
            },
            {
                id: 301,
                code: 'Return',
                text: 'Trả hàng',
                description : 'Là trạng thái đơn hàng trả lại cho người bán sau 3 lần giao hàng không thành công'
            },
            {
                id: 302,
                code: 'Returned',
                text: 'Đã trả',
                description : 'Là trạng thái đơn hàng đã được trả lại cho người bán'
            },
            {
                id: 204,
                code: 'WaitingToFinish',
                text: 'Chờ hoàn tất',
                description : 'Là trạng thái đơn hàng đang được xử lý để hoàn thành (ví dụ chuyển tiền thu hộ)'
            },
            {
                id: 310,
                code: 'Finish',
                text: 'Hoàn tất',
                description : 'Đơn hàng đã hoàn thành'
            },
            {
                id: 111,
                code: 'LostOrder',
                text: 'Thất lạc',
                description : 'Trạng thái đơn hàng bị thất lạc'
            },
        ];

        $scope.getStatusByCode = function(code){
            var status = $filter("filter")($scope.statuses, {
                code: code
            });

            return status && status[0] ? status[0] : null
        }

        $scope.showImageDialog = function(imageUrl){
            ngDialog.open({
                disableAnimation : true,
                template: '<img src="' + imageUrl + '" class="pt-3" style="width:100%">',
                plain: true
            });
        }

        $scope.conversation_type = $stateParams.ctype;

        $scope.detectSharesLink = function(sharesLink) {
            // console.log('detecting link...');
            var l = sharesLink.split('/').pop(); // ?type=3
            // alert(l);
            if (l.indexOf('?type=3') !== -1) {
                // photos
                var k = sharesLink.split('/');
                // {{detectSharesLink(m.shares.data[0].link)}}/picture?height=720&width=720
                return '//graph.facebook.com/' + k[k.length - 2] + '/picture?height=720&width=720';
            } else {
                return sharesLink;
                // return '//graph.facebook.com/' + $stateParams.page_id + '_' + l + '?fields=picture' + '&access_token=' + $rootScope.access_token;
            }
        }

        $scope.formatDate = function(d) {
            return moment(d).format("DD/MM/YYYY hh:mm");
        }

        // $scope.tessttt = activeItem[$stateParams.id];
        angular.forEach(activeItem, function(value, key) {
            // console.log(value);
            $rootScope.activeKey = key;
            $rootScope.activedItem = value;
            $scope.activedItem = value;
        });

        var products = [];

        //
        if ($scope.activedItem.orderCode) {
            // console.log($scope.activedItem);
            MGHNService.getOrderLog($scope.activedItem.orderCode, $scope.activedItem.push_to_ghn_at, ghn_token).then (function(response){
                console.log(response.data.data.Logs);
            })
            GiaoHangNhanhService.trackingOrder($scope.activedItem.orderCode).then(function(response) {
                $scope.$apply(function() {
                    // console.log(response);
                    $scope.trackingData = response;
                })
            })
        }

        if (current_hub) {
            // console.log($scope.currentHub);
        } else {
            AlertError('Không tìm thấy hub. Có thể bạn chưa khai báo HubID cho page này', 'Thông báo');
        }

        var page = $filter("filter")(fanpages, {
            id: $stateParams.page_id
        });
        $scope.currentAccessToken = page ? page[0].access_token : null;
        if (!$scope.currentAccessToken) {
            MUtilitiesService.AlertError('Chưa khai báo Fanpage', 'Lỗi');
        }

        // GRAPH FACEBOOK nếu đơn hàng chưa tạo thành công
        var getToken = function(pageId) {
            return new Promise(function(resolve, reject) {
                var page = $filter("filter")(fanpages, {
                    id: pageId
                });
                if (page[0]) {
                    resolve(page[0].access_token);
                } else {
                    reject('Page với ID ' + pageId + ' chưa được thêm vào danh sách quản lý.');
                }
            })
        }
        // graph page
        MFacebookService.graphPage($stateParams.page_id, $scope.currentAccessToken).then(function(response) {
                // console.log(response);
                $scope.$apply(function() {
                    $scope.pageData = response;
                })
            })
            .catch(function(err) {
                MUtilitiesService.AlertError(err, 'Lỗi');
            })

        //
        if ($stateParams.ctype == 1) {
            // messages
            // alert($stateParams.cv_id);
            MFacebookService.graphMessages($stateParams.cv_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        angular.forEach(response.messages.data, function(mes){
                            // mes = 'sdfsdfsdf';
                            if(mes.shares && mes.shares.data){
                                if(mes.shares.data[0].link){
                                    // mes = 'sdfds';
                                    // console.log(mes.shares.data[0].link);
                                    // var link = $scope.detectMessageSharesLink(mes.shares.data[0].link);

                                    MUtilitiesService.detectMessageSharesLink(mes.shares.data[0].link).then(function(result){
                                        if(result.type == 'photo'){
                                            mes.link = result.link;
                                        }
                                        else if(result.type == 'post'){
                                            // console.log(result);
                                            // alert('share is post');
                                            MFacebookService.graphPostAttachments($scope.pageData.id + '_' + result.id, $scope.currentAccessToken)
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
                                                MUtilitiesService.AlertError(err);
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
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })
        } else {
            // graph post
            MFacebookService.graphPost($stateParams.post_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        $scope.postData = response;
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })

            // also graph comments
            // alert($stateParams.cv_id);
            MFacebookService.graphComments($stateParams.cv_id, $scope.currentAccessToken).then(function(response) {
                    $scope.$apply(function() {
                        // console.log(response);
                        $scope.commentData = response;
                    })
                })
                .catch(function(err) {
                    MUtilitiesService.AlertError(err, 'Lỗi');
                })
        }
        

        $scope.packageSize = {
            width: 12,
            height: 12,
            length: 6,
            weight: 100,
        }


        // data to submit giao hang nhanh
        


        $scope.selectedProducts = [];
        // add to products list
        

        // get all products
        $scope.aProducts = [];
        var getAllAvailableProducts = function() {
            var ref = firebase.database().ref();
            let productsRef = ref.child('products');
            productsRef.on('child_added', snapshot => {
                $scope.aProducts.push(snapshot.val());
            });
        }
        getAllAvailableProducts();

        // $scope.selectedProducts.push({
        //         id : 1,
        //         count : 0,
        //         note : ''
        //     });

        $scope.addProduct = function() {
            $scope.selectedProducts.push({
                id: 1,
                count: 0,
                note: ''
            });
        }


        $scope.deleteProduct = function(index) {
            console.log('xóa ' + index);
            $scope.selectedProducts.splice(index, 1);
        }

        $scope.$watch('selectedProducts', function() {
            // console.log('need to recalculate');
        });

        $scope.recalculateProductPacks = function() {

        }
        // console.log($scope.aProducts);
        // console.log(moment);
        toastrConfig.closeButton = true;
        toastrConfig.timeOut = 3000;

        $scope.NoteCodes = [{
                code: 'CHOTHUHANG',
                text: 'Cho thử hàng'
            },
            {
                code: 'CHOXEMHANGKHONGTHU',
                text: 'Cho xem hàng không cho thử'
            },
            {
                code: 'KHONGCHOXEMHANG',
                text: 'Không cho xem hàng'
            }
        ];

        $scope.paymentTypes = [{
                id: 1,
                text: 'Người gửi thanh toán'
            },
            {
                id: 2,
                text: 'Người nhận thanh toán'
            }
        ];

        function AlertError(c, d) {
            toastr.error(c, d)
        };

        function AlertSuccessful(c, d) {
            toastr.success(c, d)
        };

        function AlertWarning(c, d) {
            toastr.warning(c, d)
        };

        function CheckPhone9_10(m, w, l, q, y, j) {
            var p, d, v, k, g;
            if (m && IsNullOrEmpty(l)) {
                return w + " bắt buộc."
            }
            if (!IsNullOrEmpty(l)) {
                if (l.indexOf("1800") === 0 || l.indexOf("1900") === 0) {
                    return ""
                }
                if (l[0] == "0" && (l = l.substr(1, l.length)), p = q.split(","), d = 0, p != null && p != undefined && p.length > 0) {
                    for (g = 0; g < p.length; g++) {
                        if (l.indexOf(p[g]) === 0) {
                            d = p[g];
                            break
                        }
                    }
                    if (g < p.length && !isNaN(l)) {
                        return d == "868" && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" && d.length == 2 && l.length != 9 ? "Số điện thoại phải là 10 số" : d != "868" && d.length == 3 && l.length != 10 ? "Số điện thoại phải là 11 số" : ""
                    }
                    if (j) {
                        return "Số điện thoại di động không hợp lệ"
                    }
                }
                if (v = y.split(","), k = 0, v != null && v != undefined && v.length > 0) {
                    for (g = 0; g < v.length; g++) {
                        if (l.indexOf(v[g]) === 0) {
                            k = v[g];
                            break
                        }
                    }
                    if (g < v.length && !isNaN(l)) {
                        if ((k == "4" || k == "8") && l.length != 9) {
                            return "Số điện thoại bàn phải là 10 số"
                        }
                        if (k != "4" && k != "8" && l.length - k.length != 7) {
                            return "Số điện thoại bàn phải là " + (k.length + 8) + " số"
                        }
                    } else {
                        return "Số điện thoại không hợp lệ"
                    }
                }
            }
            return ""
        };
        // test
        // this.AlertWarning('Hello world!', 'Toastr fun!');

        $scope.ctype = $stateParams.type;
        $scope.cm = $stateParams.cm;

        $scope.Districts = ghn_districs;

        // $scope.selectedDistrict = null;
        // $scope.shippingData.FromDistrictID = 2114;
        $scope.$watch('shippingData.FromDistrictID', function() {
            if ($scope.shippingData.FromDistrictID) {
                GetWards();
                $scope.FindAvailableServices();
                // $scope.calculateFee();
            }
        });
        // $scope.shippingData.ToDistrictID = null;
        $scope.$watch('shippingData.ToDistrictID', function() {
            if ($scope.shippingData.ToDistrictID) {
                GetToWards();
                $scope.FindAvailableServices();
                // $scope.calculateFee();
            }
        });

        function GetWards() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            var data = {
                "token": $rootScope.ghnToken,
                "DistrictID": $scope.shippingData.FromDistrictID
            }
            $http.post('https://console.ghn.vn/api/v1/apiv3/GetWards', data, config)
                .then(function(data) {
                    // console.log(data);
                    $scope.Wards = data.data.data.Wards
                });
        }
        $scope.toWards = null;

        function GetToWards() {
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            var data = {
                "token": $rootScope.ghnToken,
                "DistrictID": $scope.shippingData.ToDistrictID
            }
            $http.post('https://console.ghn.vn/api/v1/apiv3/GetWards', data, config)
                .then(function(data) {
                    // console.log(data);
                    $scope.toWards = data.data.data.Wards
                });
        }

        $scope.FindAvailableServices = function() {
            if (!$scope.shippingData.FromDistrictID) {
                // AlertError('Chưa chọn khu vực gửi hàng', 'Thông báo');
                return;
            }
            if (!$scope.shippingData.ToDistrictID) {
                // AlertError('Chưa chọn khu vực nhận hàng', 'Thông báo');
                return;
            }
            
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            var data = {
                "token": $rootScope.ghnToken,
                "Weight": $scope.shippingData.Weight,
                "Length": $scope.shippingData.Length,
                "Width": $scope.shippingData.Width,
                "Height": $scope.shippingData.Height,
                "FromDistrictID": $scope.shippingData.FromDistrictID,
                "ToDistrictID": $scope.shippingData.ToDistrictID,
                "CouponCode": "",
                "InsuranceFee": 0,
            }
            $http.post('https://console.ghn.vn/api/v1/apiv3/FindAvailableServices', data, config)
                .then(function(data) {
                    // console.log(data.data.data);
                    $scope.availableServices = data.data.data;
                    $scope.calculateFee();
                })
                .catch(function(err) {
                    if (err.status == -1) {
                        console.log(err);
                        AlertError('Lỗi chọn khu vực', err.xhrStatus);
                    }
                    console.log(err);
                    AlertError(err.data.msg, err.statusText);
                });
        }

        

        $scope.selectedMainService = function(service){
            $scope.shippingData.ShippingOrderCosts = [];
            $scope.extraServices = [];

            angular.forEach(service.Extras, function(childService){

                if(childService.ServiceID !== 16){
                    childService.selected = false;
                    $scope.extraServices.push(childService);
                }
            })

            $scope.calculateFee();
        }

        $scope.checkIfExtraServiceIsSelected = function(extraService){
            var found = $filter("filter")($scope.shippingData.ShippingOrderCosts, {ServiceID: extraService.ServiceID});
            if(found[0]){
                return true;
            }
            else{
                return false;
            }
        }

        $scope.selectExtraService = function(extraService){
            console.log(extraService);
            var found = $filter("filter")($scope.shippingData.ShippingOrderCosts, {ServiceID: extraService.ServiceID});
                if(found && found[0]){
                    if(extraService.selected == true){
                        // không làm gì cả
                    }
                    else{
                        // bỏ service này khỏi danh sách
                        var index = $scope.shippingData.ShippingOrderCosts.indexOf(found[0]);
                        $scope.shippingData.ShippingOrderCosts.splice(index, 1)
                    }
                }
                else{
                    // thêm service này vào
                    $scope.shippingData.ShippingOrderCosts.push({
                        "ServiceID": extraService.ServiceID
                    })
                }

                $scope.calculateFee();
        }

        ///////////////////////
        $scope.shippingData = {
            "token": $rootScope.ghnToken,
            "PaymentTypeID": 1,
            "FromDistrictID": current_hub ? current_hub.DistrictID : '',
            "FromWardCode": null,
            "ToDistrictID": null,
            "ToWardCode": null,
            "Note": $scope.activedItem ? $scope.activedItem.data.customerData.orderNote : '',
            "SealCode": "",
            "ExternalCode": "",
            "ClientContactName": current_hub ? current_hub.ContactName : '',
            "ClientContactPhone": current_hub ? current_hub.ContactPhone : '',
            "ClientAddress": current_hub ? current_hub.Address : '',
            "CustomerName": $scope.activedItem ? $scope.activedItem.data.customerData.realName : null,
            "CustomerPhone": $scope.activedItem ? $scope.activedItem.data.customerData.recievedPhone : null,
            "ShippingAddress": $scope.activedItem ? $scope.activedItem.data.customerData.addresss : null,
            "CoDAmount": $scope.activedItem ? $scope.activedItem.data.customerData.cod : 0,
            "NoteCode": "CHOTHUHANG",
            "InsuranceFee": 0,
            "ClientHubID": 0,
            "ServiceID": null,
            "ToLatitude": 1.2343322,
            "ToLongitude": 10.54324322,
            "FromLat": 1.2343322,
            "FromLng": 10.54324322,
            "Content": "",
            "CouponCode": "",
            "Weight": $scope.packageSize.weight,
            "Length": $scope.packageSize.length,
            "Width": $scope.packageSize.width,
            "Height": $scope.packageSize.height,
            "CheckMainBankAccount": false,
            "ShippingOrderCosts": [],
            "ReturnContactName": "",
            "ReturnContactPhone": "",
            "ReturnAddress": "",
            "ReturnDistrictCode": "",
            "ExternalReturnCode": "",
            "IsCreditCreate": true
        }

        /////////////////////

        // console.log($scope.activedItem.data.customerData);

        /*
         * submit data to giao hang nhanh
         *
         */
        function validateShippingData(){
            if (!$scope.shippingData.FromDistrictID) {
                AlertError('Chưa chọn khu vực gửi hàng', 'Thông báo');
                return false;
            }
            if (!$scope.shippingData.ToDistrictID) {
                AlertError('Chưa chọn khu vực nhận hàng', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.ClientContactName || $scope.shippingData.ClientContactName.length == 0){
                AlertError('Vui lòng nhập tên người gửi', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.ClientContactPhone || $scope.shippingData.ClientContactPhone.length == 0){
                AlertError('Vui lòng nhập số điện thoại người gửi', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.CustomerName || $scope.shippingData.CustomerName.length == 0){
                AlertError('Vui lòng nhập tên người nhận', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.CustomerPhone || $scope.shippingData.CustomerPhone.length == 0){
                AlertError('Vui lòng nhập số điện thoại người nhận', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.CoDAmount || $scope.shippingData.CoDAmount < 10000){
                AlertError('Vui lòng nhập số tiền', 'Thông báo');
                return false;
            }
            if(!$scope.shippingData.ServiceID){
                AlertError('Vui lòng chọn gói cước vận chuyển', 'Thông báo');
                return false;
            }
            return true;

        }
        $scope.isSubmitingGHN = false;
        // $scope.shippingItem = null;
        $scope.submitGHN = function() {
            // console.log($scope.shippingData);
            // cập nhật dữ liệu của shipping item này
            var itemKey = null;
            $scope.shippingItem = null;

            MFirebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                angular.forEach(snapshot.val(), function(value, key) {
                    if(value){
                        $scope.$apply(function(){
                            itemKey = key;
                            $scope.shippingItem = value;
                        })
                    }
                    
                });

                if(!itemKey){
                    MUtilitiesService.AlertError('Không tìm thấy dữ liệu đơn hàng', 'Lỗi');
                    return;
                }
                if($scope.shippingItem.data.is_cancel == true){
                   MUtilitiesService.AlertError('Không cho phép tạo đơn hàng đã bị hủy trên hệ thống', 'Lỗi');
                    return; 
                }


                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                if (!validateShippingData()) return;

                $scope.isSubmitingGHN = true;
                $http.post('https://console.ghn.vn/api/v1/apiv3/CreateOrder', $scope.shippingData, config)
                    .then(function(data) {
                        $scope.isSubmitingGHN = false;


                        var dataToUpdate = {
                            shipping_item_id : $stateParams.id,
                            order_code: data.data.data.OrderCode,
                            service_fee: $scope.feeData.data.data.ServiceFee,
                            cod_amount : $scope.shippingData.CoDAmount
                        }

                        if(!data.data.data.OrderCode || data.data.data.OrderCode.length == 0){
                            MUtilitiesService.AlertError('Có lỗi khi tạo đơn GHN (Lỗi phát sinh từ hệ thống GHN)', 'Lỗi');
                            return;
                        }

                        firebaseService.onUpdateShippingItemAfterPushGHN(dataToUpdate).then(function(response){
                            // console.log(response);
                            // tìm shipping item và cập nhật
                            // angular.forEach($rootScope.availableShippingItems, function(item){
                            //     if(item.data.id == $stateParams.id){
                            //         item.data.orderCode = data.data.data.OrderCode;
                            //         item.data.orderCode = data.data.data.OrderCode;;
                            //         item.data.push_to_ghn_at = new Date();
                            //     }
                            // })
                            // var a = $rootScope.filterById($rootScope.availableShippingItems, $stateParams.id);
                            // a.orderCode = data.data.data.OrderCode;
                            // tracking this order
                            GiaoHangNhanhService.trackingOrder(data.data.data.OrderCode).then(function(response) {
                                $scope.$apply(function() {
                                    $scope.trackingData = response;
                                    $scope.activedItem.orderCode = data.data.data.OrderCode;
                                })
                            })
                        })

                        AlertSuccessful('Tạo đơn GHN thành công với mã: ' + data.data.data.OrderCode, 'Thông báo');

                        // cập nhật báo cáo tạo đơn
                        // tăng số đơn tạo thành công lên 1
                        // giảm số đơn chưa tạo xuống 1
                        // tăng tổng số tiền cod lên $scope.shippingData.CoDAmount
                        // tăng chi phí gửi hàng lên $scope.feeData.data.data.ServiceFee
                        // var today = new Date();
                        // var reportDateString = MFirebaseService.convertDate(today);

                        var date = new Date($scope.shippingItem.created_time);
                        var reportDateString = MFirebaseService.convertDate(date);

                        MFirebaseService.onUpdateShippingReport(reportDateString, $scope.shippingData.CoDAmount,
                            $scope.feeData.data.data.ServiceFee).then(function(response){
                                // console.log(response);
                        })
                        .catch(function(err){
                            MUtilitiesService.AlertError('Không thể cập nhật báo cáo shipping. Lỗi ' + err, 'Lỗi');
                        });

                        // Gửi tin nhắn cảm ơn khách hàng
                        var message = 'Cảm ơn anh/chị đã đặt hàng trên hệ thống ' +
                        page[0].name +  
                        '. Đơn hàng của Anh/chị đã được tạo thành công với mã vận đơn: ' + data.data.data.OrderCode +
                        '. Khi cần bất cứ trợ giúp nào anh/chị vui lòng nhắn tin tại đây, nhân viên CSKH sẽ gọi lại hỗ trợ ' +
                        ' anh/chị ngay ạ'+
                        '. ' + page[0].name + ' Kính chúc anh/chị may mắn và hạnh phúc trong cuộc sống!';

                        // gửi tin nhắn cảm ơn khách hàng
                        if($stateParams.ctype == 1){
                            // reply message
                            MFacebookService.replyMessage($stateParams.cv_id,
                                $scope.currentAccessToken, null, message
                                ).then(function(response){
                                MUtilitiesService.AlertSuccessful('Đã gửi tin nhắn thông báo đặt hàng thành công tới khách hàng.', 'Thông báo')
                            })
                            .catch(function(err){
                                console.log(err);
                                // MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                        }
                        else{
                            // reply comment
                            MFacebookService.replyComment($stateParams.cv_id,
                                $scope.currentAccessToken, null, message).then(function(response){
                                MUtilitiesService.AlertSuccessful('Đã gửi tin nhắn thông báo đặt hàng thành công tới khách hàng.', 'Thông báo')
                            })
                            .catch(function(err){
                                console.log(err);
                                // MUtilitiesService.AlertError(err, 'Lỗi')
                            })
                        }

                    })
                    .catch(function(err) {
                        console.log(err);
                        if (err.data) {
                            AlertError(err.data.msg, err.statusText);
                        } else {
                            AlertError('Đã có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu nhập', err.xhrStatus);
                        }
                    });
            })
        }

        /*
        * Hủy đơn hàng trên hệ thống
        */
        $scope.cancelCurrentShippingItem = function(){
            MUtilitiesService.showConfirmDialg('Thông báo',
                'Bạn có chắc muốn hủy đơn hàng này trên hệ thống không.', 'Tiếp tục', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                    MFirebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                        
                        var itemKey = null;
                        var shippingItem = null;
                        angular.forEach(snapshot.val(), function(value, key) {
                            itemKey = key;
                            shippingItem = value;
                        });
                        if(!itemKey){
                            MUtilitiesService.AlertError('Không tìm thấy dữ liệu đơn hàng', 'Lỗi');
                            return;
                        }
                        else{
                            // cập nhật trạng thái đã hủy cho shipping item
                            var date = new Date(shippingItem.created_time);
                            // console.log('Shipping Item tạo lúc: ' + shippingItem.created_time);
                            var reportDateString = MFirebaseService.convertDate(date);
                            // console.log('Cần cập nhật báo cáo cho ngày: ' + reportDateString);

                            MFirebaseService.onCancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                shippingItem.service_fee, itemKey).then(function(response){
                                    // $scope.activedItem.orderCode = null;
                                // console.log(response);
                                // tìm và cập nhật item này trong danh sách

                                angular.forEach($rootScope.availableShippingItems, function(item){
                                    if(item.data.id == $stateParams.id){
                                        item.data.is_cancel = true;
                                    }
                                });

                                MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng trên hệ thống thành công. Vui lòng Reload (F5) để cập nhật thay đổi.');

                                // Kiểm tra nếu đơn hàng chưa hủy trên GHN => hủy đơn trên GHN
                                if(shippingItem.orderCode){
                                    $scope.cancelOrder(shippingItem.orderCode);
                                }

                            })
                        }

                    })
                }
                else{

                }
            })
            // hủy đơn trên GHN nếu được phép
        }

        // var onCancelShippingItem = function(date, cod, shipping_cod){

        function validateFeeRequestData(data){
            if(!data.token){
                console.log('Chưa có token');
                return false;
            }
            if(!data.FromDistrictID){
                console.log('Vui lòng chọn nơi gửi');
                return false;
            }
            if(!data.ToDistrictID){
                console.log('Vui lòng chọn nơi nhận');
                return false;
            }
            if(!data.ServiceID){
                console.log('Vui lòng chọn gói cước');
                return false;
            }
            return true;
        }

        $scope.calculateFee = function(){
            $scope.feeData = null;

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            var data = {
                            "token": $rootScope.ghnToken,
                            "Weight": $scope.shippingData.Weight,
                            "Length": $scope.shippingData.Length,
                            "Width": $scope.shippingData.Width,
                            "Height": $scope.shippingData.Height,
                            "FromDistrictID": $scope.shippingData.FromDistrictID,
                            "ToDistrictID": $scope.shippingData.ToDistrictID,
                            "ServiceID": $scope.shippingData.ServiceID,
                            "OrderCosts": $scope.shippingData.ShippingOrderCosts,
                            "CouponCode": "",
                            "InsuranceFee": 0
                        }

            if(validateFeeRequestData(data)){
                $http.post('https://console.ghn.vn/api/v1/apiv3/CalculateFee', data, config)
                .then(function(response) {
                    console.log(response);
                    $scope.feeData = response;
                })
                .catch(function(err) {
                    console.log(err);
                    if (err.data) {
                        AlertError(err.data.msg, err.statusText);
                    } else {
                        AlertError('Đã có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu nhập', err.xhrStatus);
                    }
                });
            }
        }

        /*
        * Hủy đơn trên GHN
        */
        $scope.cancelOrder = function(orderCode) {
            return MGHNService.cancelOrder(orderCode, ghn_token).then(function(response) {
                // cập nhật báo cáo
                MFirebaseService.getShippingItem($stateParams.id).then(function(snapshot){
                        
                        var itemKey = null;
                        var shippingItem = null;
                        angular.forEach(snapshot.val(), function(value, key) {
                            itemKey = key;
                            shippingItem = value;
                        });
                        if(!itemKey){
                            MUtilitiesService.AlertError('Không tìm thấy dữ liệu đơn hàng', 'Lỗi');
                            return;
                        }
                        else{
                            if(!shippingItem.push_to_ghn_at){
                                MUtilitiesService.AlertError('Đơn hàng chưa tạo trên GHN', 'Lỗi');
                                return;
                            }
                            // cập nhật trạng thái đã hủy cho shipping item
                            var date = new Date(shippingItem.push_to_ghn_at);
                            var reportDateString = MFirebaseService.convertDate(date);

                            MFirebaseService.cancelShippingItem(reportDateString, shippingItem.cod_amount, 
                                    shippingItem.service_fee, itemKey).then(function(response){
                                console.log(response);
                                // tìm và cập nhật Order này trong danh sách

                                angular.forEach($rootScope.availableShippingItems, function(item){
                                    if(item.data.orderCode == $stateParams.id){
                                        item.data.cancel_ghn_at = new Date();;
                                    }
                                })

                                MUtilitiesService.AlertSuccessful('Đã hủy đơn hàng ' + orderCode + ' trên GHN thành công', 'Thông báo');
                                
                            })
                        }

                    })
                // AlertSuccessful('Hủy đơn hàng ' + orderCode + ' thành công', 'Thông báo');
            });
        }

        //
        function validateOrder(orderData) {
            if (orderData.externalOrderCode != null && orderData.externalOrderCode != "") {
                if (orderData.externalOrderCode.length > 50) {
                    AlertError("Mã đơn hàng khách hàng không được vượt quá 50 ký tự", "Thông báo");
                    return false;
                }
            }
            var senderPhoneResult = CheckPhone9_10(false, "Điện thoại người gửi", orderData.ClientContactPhone, p_validPhone, p_validHomePhone);
            if (senderPhoneResult != "" && orderData.orderCode == null && orderData.ClientHubID != null) {
                AlertError(senderPhoneResult, "Thông báo");
                return false;
            }
            return true;
        }

        function IsNullOrEmpty(c) {
            return !c || !/[^\s]+/.test(c)
        };

        $scope.formatDate = function(d) {
            return moment(d).format("DD/MM/YYYY");
        }

        var p_validPhone = "86,88,89,90,91,92,93,94,96,97,98,99,120,121,122,123,124,125,126,127,128,129,161,162,163,164,165,166,167,168,169,186,188,199,868";
        var p_validHomePhone = "4,8,55,56,57,58,59,60,61,62,63,64,66,67,68,70,72,73,75,203,204,205,206,207,208,209,212,213,214,215,216,220,221,222,225,226,227,228,229,232,233,234,235,236,237,238,239,251,252,254,255,256,257,258,259,260,261,262,263,269,270,271,272,273,274,275,276,277,290,291,292,293,294,296,297,299,500,501,650,651,241,242,243,244,245,246,247,248,249,281,282,283,284,285,286,287,288,289";

        $scope.testLostFocus = function() {
            AlertError('test lost focus', 'test');
        }

        $scope.isShowFullPost = false;
        $scope.showFullPost = function(){
          $scope.isShowFullPost = true;  
        }   

        $scope.noteData = {
            text: null,
            uid: 2,
            created_at: Date.now()
        }

        $scope.submitNote = function(id){
            if(!$scope.noteData.text || $scope.noteData.text.length == 0){
                MUtilitiesService.AlertError('Vui lòng nhập nội dung ghi chú', 'Lỗi');
                return;
            }
            MFirebaseService.addShippingNote(id, $scope.noteData)
            .then(function(response){
                MUtilitiesService.AlertSuccessful(response, 'Thông báo');
                $rootScope.activedItem.note = $scope.noteData;
                $scope.noteData = {
                    text: null,
                    uid: 2,
                    created_at: Date.now()
                }
            })
            .catch(function(err){
                console.log(err);
                MUtilitiesService.AlertError(err, 'Lỗi')
            })
        }

    });