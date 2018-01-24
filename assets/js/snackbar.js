// (c) 2016 Flavio Colonna Romano
// This code is licensed under MIT license (see license.txt for details)
angular.module("snackbar", ['ngAnimate']).service('$snackbar', function($http, $log, $animate, $q) {
  var timeout = {};
  var template = $http({
    method: 'GET',
    url: './snackbar.html'
  }).then(function(result) {
    var body = document.getElementsByTagName("body")[0];
    var previousSnackbar = document.getElementsByClassName('snackbar-wrapper');
    if (previousSnackbar.length === 0) {
      if(navigator.userAgent.indexOf('Mobile') == -1) {
        var head = document.getElementsByTagName('head');
        angular.element(head).append('<link href="./snackbar-tablet.css" rel="stylesheet">');
      }
      angular.element(body).append(result.data);
    }
    return result.data;
  }, function(err) {
    $log.log("Error getting html template", JSON.stringify(err))
  });
  this.show = function(options) {
    return $q(function(resolve, reject) {
      clearTimeout(timeout);
      var wrapper = document.getElementsByClassName("snackbar-wrapper");
      $animate.removeClass(wrapper[0], "active").then(function() {
        if (!options.message) {
          $log.error("Message in the snackbar not defined");
          reject("Message in the snackbar not defined");
          return;
        }
        var buttonName = options.buttonName ? options.buttonName.trim() : false;
        var buttonFunction = options.buttonFunction ? options.buttonFunction : this.hide;
        var buttonColor = options.buttonColor ? options.buttonColor : '#a1c2fa';
        var messageColor = options.messageColor ? options.messageColor : 'white';
        var time = options.time ? options.time : 'SHORT';
        var timeMs;
        switch(time) {
            case 'SHORT':
                timeMs = 2000;
                break;
            case 'LONG':
                timeMs = 5000;
                break;
            case 'INDETERMINATE':
                timeMs = 500;
                break;
            default:
                timeMs = 2000;
        }
        template.then(function(res) {
          angular.element(document.getElementsByClassName("snackbar-btn")).remove();
          if(buttonName && buttonName.length > 0) {
            var button = angular.element(document.createElement("a"));
            button.addClass("snackbar-btn")
            button.text(buttonName);
            button.css('color', buttonColor);
            button.bind("click", buttonFunction)
            var content = document.getElementsByClassName("snackbar-content");
            angular.element(content).append(button)
          }
          angular.element(wrapper).find('span').text(options.message);
          angular.element(wrapper).find('span').css('color', messageColor);
          angular.element(wrapper).addClass("active");
        });
        if(timeMs > 0){
            timeout = setTimeout(function() {
              angular.element(wrapper).removeClass("active");
              resolve("1");
            }, timeMs);
        }else{
            angular.element(wrapper).on('snackbar-closed', function(){
                if(timeMs == 0){
                    resolve("1");
                }
            })
        }
      });
    });
  };
  this.hide = function() {
    clearTimeout(timeout);
    var wrapper = document.getElementsByClassName("snackbar-wrapper");
    angular.element(wrapper).triggerHandler('snackbar-closed');
    angular.element(wrapper).removeClass("active");
  };
})
