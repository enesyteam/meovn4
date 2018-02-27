/*
* @author: Leandro Henrique Reis <emtudo@gmail.com>
* @date:   2016-10-04 16:05:33
* @last modified by:   Leandro Henrique Reis
* @last modified time: 2016-11-13 19:35:53
*/

(function () {
    'use strict';
    angular.module('ng-files-model', [])
    .directive('ngFilesModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            callback: '=',
            data: '=',
            model: '='
        },
        link: function (scope, element, attrs) {
            var isMultiple = attrs.multiple;
            element.bind('change', function (changeEvent) {
                if (isMultiple) {
                    scope.model=[];
                } else {
                    scope.model={};
                }
                angular.forEach(element[0].files, function (item, index) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            var data={
                                lastModified: changeEvent.target.files[index].lastModified,
                                lastModifiedDate: changeEvent.target.files[index].lastModifiedDate,
                                name: changeEvent.target.files[index].name,
                                size: changeEvent.target.files[index].size,
                                type: changeEvent.target.files[index].type,
                                file: loadEvent.target.result.replace('data:'+changeEvent.target.files[index].type+';base64,','')
                            }
                            if (typeof(scope.callback)=='function') {
                                scope.callback(data, scope.data);
                            }
                            if (isMultiple) {
                                scope.model.push(data);
                            } else {
                                scope.model=data;
                            }
                        });
                    }
                    reader.readAsDataURL(item);
                });
            });
        }
    };
    }]);
    if( typeof exports !== 'undefined' ) {
      exports['default'] = angular.module('ng-files-model');
      module.exports = exports['default'];
    }
})();