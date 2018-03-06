(function() {
  'use strict';

  angular.module('mUtilities', []);

  // mUtilities.$inject = ['$animate', '$injector', '$document', '$rootScope', '$sce', 'toastrConfig', '$q'];

  // function mUtilities(){

  // }

  angular.module('mUtilities')
        .service('MUtilitiesService', ["$http", 'toastr', 'toastrConfig', function($http, toastr, toastrConfig) {
            // TOASTR
            var configToastr = function(){
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
            var formatDateTime = function(dateStr){
                var year, month, day, hour, minute, dateUTC, date, ampm, d, time;
                var iso = (dateStr.indexOf(' ')==-1&&dateStr.substr(4,1)=='-'&&dateStr.substr(7,1)=='-'&&dateStr.substr(10,1)=='T') ? true : false;
             
                year = dateStr.substr(0,4);
                month = parseInt((dateStr.substr(5,1)=='0') ? dateStr.substr(6,1) : dateStr.substr(5,2))-1;
                day = dateStr.substr(8,2);
                hour = dateStr.substr(11,2);
                minute = dateStr.substr(14,2);
                dateUTC = Date.UTC(year, month, day, hour, minute);                 
                date = new Date(dateUTC);
                var curDate = new Date();
         
                var currentStamp = curDate.getTime();                   
                var datesec = date.setUTCSeconds(0);
                var difference = parseInt((currentStamp - datesec)/1000);
                return difference;                              
            }



            return {
                AlertError : AlertError,
                AlertSuccessful : AlertSuccessful,
                AlertWarning : AlertWarning,
                formatDateTime : formatDateTime,
            }
        }]);
}());