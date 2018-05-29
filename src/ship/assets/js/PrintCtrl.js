mShip.controller('PrintCtrl', ['$q',  '$timeout', '$scope', '$rootScope', '$filter', 'MFirebaseService', 
	'utils', 'MUtilitiesService', 'pages', 'products', 'telesales',
	function ($q, $timeout, $scope, $rootScope, $filter, 
        MFirebaseService, utils, MUtilitiesService, pages, products, telesales) {
		// console.log(pages);
    	var vm = this;
    	vm.preConfirm = function () {
	        return new Promise(function(resolve, reject){

	            // validateOrderData().then(function(){
	            //     rebuild_received_name();
	            //     MVIETTELService.create_order({
	            //         data: $scope.orderData, 
	            //         token: $scope.viettel_login_data.TokenKey
	            //     }).then(function(response){
	            //         // console.log(response);
	            //         resolve({
	            //             data: $scope.orderData,
	            //             result: response
	            //         })
	            //     })
	            //     .catch(function(err){
	            //         console.log(err);
	            //         reject(err);
	            //     })
	            // })
	            // .catch(function(err){
	            //     swal.showValidationError(err);
	            //     swal.hideLoading();
	            // })
	            $timeout(function() {
	            	resolve('Khởi tạo thành công!');
	            }, 10);
	        })
	    };

	    vm.printConfirm = function(){
	    	return new Promise(function(resolve, reject){

	            // validateOrderData().then(function(){
	            //     rebuild_received_name();
	            //     MVIETTELService.create_order({
	            //         data: $scope.orderData, 
	            //         token: $scope.viettel_login_data.TokenKey
	            //     }).then(function(response){
	            //         // console.log(response);
	            //         resolve({
	            //             data: $scope.orderData,
	            //             result: response
	            //         })
	            //     })
	            //     .catch(function(err){
	            //         console.log(err);
	            //         reject(err);
	            //     })
	            // })
	            // .catch(function(err){
	            //     swal.showValidationError(err);
	            //     swal.hideLoading();
	            // })

	            printElement(document.getElementById("printSection")); 
			    window.print();

			    if($scope.mask_as_printed == true){
			    	var items_to_update = [];
	            	angular.forEach($rootScope.availableShippingItems, function(shipping_item){
	            		if(shipping_item.printed == true){
	            			items_to_update.push(shipping_item.key);
	            			addComment('[Auto log] Thao tác in phiếu xuất kho.', shipping_item.key);
	            		}
	            	})
	            	MFirebaseService.maskShippingItemsPrinted(items_to_update).then(function(){
	            		resolve('SUCCESS');
	            		// MUtilitiesService.AlertSuccessful(items_to_update.length + ' đơn hàng được đánh dấu là đã in.')
	            	})
	            	.catch(function(err){
	            		reject(err);
	            		// MUtilitiesService.AlertError(err);
	            	})
			    }
			    resolve('SUCCESS');
	            
	        })
	    }

	    function addComment(text, item_id){
            var data = {
                text: text,
                uid: $rootScope.currentMember ? $rootScope.currentMember.id : 2,
                created_at: Date.now()
            }

            MFirebaseService.addShippingNote(item_id, data)
            .then(function(response){
                MUtilitiesService.AlertSuccessful(response);
            })
            .catch(function(err){
                MUtilitiesService.AlertError(err, 'Lỗi')
            })
        }

	    function printElement(elem) {
	    	console.log(elem);
		    var domClone = elem.cloneNode(true);
		    var $printSection = document.getElementById("printSection");
		    if (!$printSection) {
		        var $printSection = document.createElement("div");
		        $printSection.id = "print";
		        document.body.appendChild($printSection);
		    }
		    $printSection.innerHTML = "";
		    $printSection.appendChild(domClone);
		}

	    $scope.mask_as_printed = true;
	    $scope.onPrintOrder = function(order){
            order.printed = !order.printed;
            $scope.getSelectedOrders();
	    }
	    $scope.pages = pages;
	    $scope.products = products;
	    $scope.findProduct = function(id){
            return $filter("filter")($scope.products, {id: id})[0];
        }
        $scope.findTelesale = function(id){
            return $filter("filter")(telesales, {id: id})[0];
        }
        $scope.currentTime = Date.now();

}])