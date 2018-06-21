mNavigation.controller('MainCtrl',
    function($rootScope, $scope, $http, $filter, $timeout,
    	MFirebaseService, MUtilitiesService) {
    	// $http.get('../assets/meo4-f0335-newOrders-export.json').
     //          then(function onSuccess(response) {
     //          	var res = [];
     //             angular.forEach(response.data, (item) => {
     //               if(item.customer_mobile){
					// // console.log('Tên: ' + item.customer_name + ' / SĐT:' + item.customer_mobile);
					// res.push({
					// 	"Số ĐT": '84-' + item.customer_mobile
					// });
     //               }
     //             })
     //             $timeout(function() {
     //             	$scope.$apply(function(){
	    //              	$scope.data = res;
	    //              })
     //             }, 1000);
     //          }).
     //          catch(function onError(response) {
     //           // console.log(response);
     //          });


        function convertArrayOfObjectsToCSV(args) {
	        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

	        data = args.data || null;
	        if (data == null || !data.length) {
	            return null;
	        }

	        columnDelimiter = args.columnDelimiter || ',';
	        lineDelimiter = args.lineDelimiter || '\n';

	        keys = Object.keys(data[0]);

	        result = '';
	        result += keys.join(columnDelimiter);
	        result += lineDelimiter;

	        data.forEach(function(item) {
	            ctr = 0;
	            keys.forEach(function(key) {
	                if (ctr > 0) result += columnDelimiter;

	                result += item[key];
	                ctr++;
	            });
	            result += lineDelimiter;
	        });

	        return result;
	    }

	    $rootScope.downloadCSV = function() {
	        var data, filename, link;

	        var csv = convertArrayOfObjectsToCSV({
	            data: $scope.data
	        });
	        if (csv == null) return;

	        filename = 'export.csv';

	        if (!csv.match(/^data:text\/csv/i)) {
	            csv = 'data:text/csv;charset=utf-8,\uFEFF,' + csv;
	        }
	        data = encodeURI(csv);

	        link = document.createElement('a');
	        link.setAttribute('href', data);
	        link.setAttribute('download', filename);
	        link.click();
	    }
    })