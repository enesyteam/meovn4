m_admin.directive('graphEnter', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.graphEnter);
                    scope.graph();
                });
                event.preventDefault();
            }
            else if(event.which === 27){
                scope.$apply(function (){
                    scope.$eval(attrs.graphEnter);
                    // scope.clearCommentData();
                });
            }
        });
    };
});