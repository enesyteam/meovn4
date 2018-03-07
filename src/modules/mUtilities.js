(function() {
  'use strict';

  angular.module('mUtilities', ['ngDialog']);

  angular.module('mUtilities')
        .service('MUtilitiesService', ['$timeout', 'toastr', 'toastrConfig', 'ngDialog', 
            function($timeout, toastr, toastrConfig, ngDialog) {
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

            var showConfirmDialg = function(title, content, confirmButtonText, rejectButtonText){
                var html = 
                            '<div class="ngdialog-message">' +
                              '  <div class="confirmation-title"><i class="fa fa-exclamation-triangle orange"></i>' + title + '</div>' +
                              '  <div>' + content + '</div>' +
                              '  </div>' +
                              ' <div class="ngdialog-buttons">' +
                              '    <div class="mt-2 float-right">' +
                              '      <button type="button" class="btn btn-sm btn-primary" ng-click="confirm(confirmValue)">' + confirmButtonText + '</button>' +
                              '      <button type="button" class="btn btn-sm" ng-click="closeThisDialog()">' + rejectButtonText + '</button>' +
                              '    </div>' +
                              '</div>';

                return new Promise(function(resolve, reject){
                    ngDialog.openConfirm({
                        template: html,
                        plain: true
                    })
                    .then(function (confirm) {
                      resolve(true);
                    })
                    .catch(function(s){
                        resolve(false);
                    })
                })

            }

            var showWaitingDialog = function(waitingMessage, onOpenCallback){
                var html = '<div class="ytp-spinner" data-layer="4" style="">'
                            + '<div>'
                            +  '<div class="ytp-spinner-container">'
                            +     '<div class="ytp-spinner-rotator">'
                            +        '<div class="ytp-spinner-left">'
                            +           '<div class="ytp-spinner-circle"></div>'
                            +        '</div>'
                            +        '<div class="ytp-spinner-right">'
                            +           '<div class="ytp-spinner-circle"></div>'
                            +        '</div>'
                            +     '</div>'
                            +  '</div>'
                            +'</div>'
                            +'<div class="ytp-spinner-message" style="display: block;">'
                            +    waitingMessage
                            +'</div>'
                        +'</div>';

                return new Promise(function(resolve, reject){
                    var dlg = ngDialog.open({
                      template: html,
                      plain: true,
                      closeByDocument: false,
                      showClose: false,
                      onOpenCallback : onOpenCallback,
                    });
                    onOpenCallback().init().then(function(response){
                        if(response == true){
                             dlg.close();
                        }

                    })
                    
                })
            }

            return {
                AlertError : AlertError,
                AlertSuccessful : AlertSuccessful,
                AlertWarning : AlertWarning,
                formatDateTime : formatDateTime,
                showConfirmDialg : showConfirmDialg,
                showWaitingDialog : showWaitingDialog,
            }
        }]);
}());