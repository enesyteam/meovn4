m_admin.controller('GeneralCtrl',
function($rootScope, $scope, $filter, $timeout, cfpLoadingBar, firebaseService, MFirebaseService) {
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
        area: false,
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

    // get data for chart
    MFirebaseService.getReportForChart().then(function(response){
        $scope.charts.reportData.data = response.system_report;
        $scope.fix($scope.charts.reportData.data);
        // console.log(response);
    })

    
});