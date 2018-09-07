m_admin.controller('GeneralCtrl',
function($rootScope, $scope, $filter, $timeout, cfpLoadingBar, firebaseService, MFirebaseService, reportData,
    MUtilitiesService) {

    $rootScope.cancelReasons = [
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

    $rootScope.loadMore = function(){
        // console.log('test');
        for (var i = 1; i < 5; i++) {
            $rootScope.todayPagesReport.push({
                id: '261147674417633',
                name: 'test scroll',
                totalCustomers: 150,
                totalsuccess: 50
            });
        }
        console.log('added 5 items...');
    }

	var ref = firebase.database().ref();
    firebaseService.getStatuses().then(function(snapshot){
        $scope.$apply(function(){
            $rootScope.statuses = snapshot.val();
        });
    });

    $rootScope.getSourceColor = function(statusId){
        if(!$rootScope.statuses) return;
        return $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0].color;
    }
     $rootScope.getStatusById = function(statusId){
        if(!$rootScope.statuses) return "null";
        return $filter("filter")($rootScope.statuses, {
            id: statusId
        })[0];
    }    

     $scope.charts = {
      reportData: {
        data: null,
        title: 'Thống kê 30 ngày qua',
        // description: 'Dữ liệu bán hàng 30 ngày qua trên hệ thống',
        x_accessor: 'date',
        y_accessor: 'value',
        legend: ['Số mới','Đã chốt'],
        legend_target: 'div#custom-color-key',
        colors: ['blue', '#28a745'],
        aggregate_rollover: true,
        show_secondary_x_label: false,
        interpolate: d3.curveLinear,
        animate_on_load: true,
        y_extended_ticks: true,
        x_extended_ticks: true,
        // area: false,
      }
    };

    $scope.fix = function (data) {
      if (Array.isArray(data) && Array.isArray(data[0])) {
        data.forEach(function(element) {
          $scope.fix(element);
        });
      } else {
        MG.convert.date(data, 'date');
      }
    };

    

    // new dashboard

    var hist1 = fake_data(30, 60).map(function(d){
        d.value = Math.round(d.value);
        return d;
    });
    // console.log(hist1);

     var hist2 = fake_data(30, 100).map(function(d){
        d.value = Math.round(d.value);
        return d;
    });

     var color = "rgba(0,0,0,1)";
    var highlight = "rgba(255,0,0,0.8)";

    $scope.userChartsData = {
        // title: "KHÁCH HÀNG MỚI 30 NGÀY QUA",
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        // missing_is_zero: true,
        // target: '#dashboard-chart-user',
        // missing_is_zero: true,
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15,
        show_tooltips:true,
        x_rug:true,
        // full_width: true
    }

    // đã gọi
    $scope.calledChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }

    $scope.successChartsData = {
        data: null,
        width: 220,
        height: 50,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:0
    }

    $scope.notCalledChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }
    $scope.missCallChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }
    $scope.callLaterChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }
    $scope.penddingChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }
    $scope.cancelChartsData = {
        data: null,
        width: 220,
        height: 75,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15
    }

    var test_data = fake_data(30, 100).map(function(d){
        d.value = Math.round(d.value);
        return d;
    });
    $scope.userTest = {
        data: test_data,
        // chart_type: 'missing-data',
        // missing_text: 'Đang tải dữ liệu',
        show_missing_background: false,
        width: 200,
        height: 50,
        interpolate: d3.curveLinear,
        missing_is_hidden: true,
        missing_is_hidden_accessor: 'dead',
        x_accessor: 'date',
        y_accessor: 'value',
        x_axis: false,
        y_axis: false,
        left:0,
        right:0,
        bottom:0,
        top:15,
        area: false,

    }

    $scope.userMissingChart = {
        // title: "Missing Data",
        // description: "This is an example of a graphic whose data is currently missing. We've also set the error option, which appends an error icon to the title and logs an error to the browser's console.",
        // error: 'This data is blocked by Lorem Ipsum. Get your **** together, Ipsum.',
        chart_type: 'missing-data',
        missing_text: 'Chưa đủ dữ liệu để hiển thị đồ thị',
        // target: '#missing-data',
        width: 200,
        height: 50
    }

    $scope.missingChart = {
        // title: "Missing Data",
        // description: "This is an example of a graphic whose data is currently missing. We've also set the error option, which appends an error icon to the title and logs an error to the browser's console.",
        // error: 'This data is blocked by Lorem Ipsum. Get your **** together, Ipsum.',
        chart_type: 'missing-data',
        missing_text: 'The current selected date does not contains any data to display',
        // target: '#missing-data',
        width: 600,
        height: 200
    }

// get data for chart
    $scope.successChartsData.data = reportData.success;
    $scope.userChartsData.data = reportData.new_customer;
    $scope.calledChartsData.data = reportData.called;
    $scope.notCalledChartsData.data = reportData.notCalled;
    $scope.missCallChartsData.data = reportData.missCall;
    $scope.callLaterChartsData.data = reportData.callLater;
    $scope.penddingChartsData.data = reportData.pendding;
    $scope.cancelChartsData.data = reportData.cancel;
    $scope.userTest.data = reportData.cancel;


    function fake_data(length, seconds) {
        var d = new Date();
        var v = 100000;
        var data=[];
        for (var i = 0; i < length; i++){
            v += (Math.random() - 0.5) * 10000;
            data.push({date: MG.clone(d), value: v});
            d = new Date(d.getTime() + seconds * 1000);
        }
        return data;
    }

    $scope.slickConfig = {
        // nextArrow : '<a class="slider-list--course-nav-btn--1sFHw slider-list--next--38ruk"' +
        //         ' aria-label="Next" type="button">' +
        //         '<span class="udi udi-next"></span>' +
        //         '<span class="sr-only">Next items</span>' +
        //         '</a>',
        // prevArrow : '<a class="slider-list--course-nav-btn--1sFHw slider-list--prev--W_hEf"' +
        //         ' aria-label="Previous" type="button">' +
        //         '<span class="udi udi-previous"></span>' +
        //         '<span class="sr-only">Previous items</span>' +
        //         '</a>',
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
                autoplay: true,
                autoplaySpeed: 4000,
                // fade: true
    }

    $scope.onSelectDateOpen = false;
    $scope.$watch('onSelectDateOpen', function() {
        if($scope.onSelectDateOpen == true){
            // MUtilitiesService.AlertError('Đã mở');
            $rootScope.isShowOverlay = true;
        }
        else{
           $rootScope.isShowOverlay = false;
        }
    });

    $rootScope.seller_chart_data = {
        102: 'dsf',
        104: '111'
    };

    function buildUsersChartData(){
        $rootScope.isBuildingUsersChartData = true;

        // console.log(reportData.user_report);
        // if(reportData.user_report){
        //     angular.forEach(reportData.user_report, function(date_report){
        //         var d = date_report.date;
        //         angular.forEach(date_report.value, function(user_report){
        //             // console.log('date: ' + d + ' id: ' + user_report.id);

        //             if($rootScope.seller_chart_data.hasOwnProperty(user_report.id)){
        //                 console.log('record ' + user_report.id + ' đã tồn tại và không cần khởi tạo');
        //                 // $rootScope.seller_chart_data.
        //                 console.log('not');
        //             }   
        //         })
        //     })
        //     $rootScope.isBuildingUsersChartData = false;
        // }
        // console.log($rootScope.seller_chart_data);

        // reportData
        // $timeout(function() {
        //     $rootScope.isBuildingUsersChartData = false;
        //     $scope.userTest.chart_type = 'line';
        //     // $scope.userTest.data = test_data;
        //     console.log('succcess....');
        //     console.log($rootScope.seller_chart_data);
        // }, 3000);

        MUtilitiesService.buildUsersChartData(reportData.user_report).then(function(response){

            console.log(response);
            angular.forEach(response, function(user_report, key){
                console.log('key: ' + key + ' value: ' + user_report)
            })
            $scope.$apply(function(){
                $rootScope.isBuildingUsersChartData = false;
            })
        })
    }
    // buildUsersChartData();

    $rootScope.finishLoadFullData = true;

});