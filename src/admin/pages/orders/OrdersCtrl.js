m_admin.controller('OrdersCtrl',
function($rootScope, $scope, $filter, MFirebaseService, MUtilitiesService, telesales, statuses) {
	$rootScope.telesales = telesales;
	$rootScope.statuses = statuses;
	
	$rootScope.filterById = function(sources, id) {
        if(!id) return null;
        return $filter("filter")(sources, {
            id: id
        })[0];
    }	
});