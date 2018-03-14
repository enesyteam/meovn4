m_admin.controller('UploadCtrl',
function($rootScope, $scope, $http, $rootScope, $timeout, cfpLoadingBar, firebaseService, Facebook,
	MFirebaseService, MUtilitiesService ) {

    var pageSize = 10;
    $scope.imageFiles = [];
    $scope.newlyOrderKey = null;
    $scope.lastImageKey = null;
    $scope.canLoadMore = true;
    $scope.isLoaddingImages = true;

    // tét
    // MFirebaseService.getOrdersByStatusId(9, 15).then(function(response) {
    //     console.log(response);
    // })

    MFirebaseService.getPhotos(pageSize).then(function(response) {
        response.reverse().map(function(image) {
        	// console.log(image.data)
            $scope.$apply(function() {
                $scope.imageFiles.push({
                    key: image.key,
                    data: image.data
                });
            })
        })
        $scope.$apply(function() {
            $scope.newlyOrderKey = response[0].key;
            $scope.lastImageKey = response[response.length - 1].key;
            $scope.isLoaddingImages = false;
        })
    })

    let newOrdersRef = firebase.database().ref().child('uploads').child('products').child('images').limitToLast(1);
    newOrdersRef.on('child_added', snapshot => {
      if(snapshot.key !== $scope.newlyOrderKey){
        $timeout(function() {
            $scope.$apply(function(){
              $scope.newlyOrderKey = snapshot.key;
              $scope.imageFiles.unshift({
                key: snapshot.key,
                data: snapshot.val()
              })
            });
        }, 10);
      }
    });

    newOrdersRef.on('child_removed', snapshot => {
        console.log(snapshot.val());
      if(snapshot.key !== $scope.newlyOrderKey){
       
      }
    });

    $scope.getNextPhotos = function() {
        $scope.isLoaddingImages = true;
        MFirebaseService.getNextPhotos($scope.lastImageKey, pageSize).then(function(response) {
            response.reverse().slice(1).map(function(image) {
                $scope.$apply(function() {
	                $scope.imageFiles.push({
                        key: image.key,
                        data: image.data
                    });
                })
            })
            $scope.$apply(function() {
                $scope.lastImageKey = response[response.length - 1].key;
                $scope.isLoaddingImages = false;
                // console.log(response);
                if(response.length == 1){ // item bị trùng
                  $scope.canLoadMore = false;
                }
            })
        })
    }

    $scope.genders = [
    	{
    		id : 1,
    		name : 'Nam'
    	},
    	{
    		id : 2,
    		name : 'Nữ'
    	}
    ]

    $scope.destinies = [
    	{
    		id : 1,
    		name : 'Kim'
    	},
    	{
    		id : 2,
    		name : 'Thủy'
    	},
    	{
    		id : 3,
    		name : 'Hỏa'
    	},
    	{
    		id : 4,
    		name : 'Thổ'
    	},
    	{
    		id : 5,
    		name : 'Mộc'
    	}
    ];

    $scope.deleteImage = function(image){
        MUtilitiesService.showConfirmDialg('Thông báo',
                                            'Bạn có chắc muốn xóa ảnh này không?', 'Tiếp tục xóa', 'Bỏ qua')
            .then(function(response) {
                if (response) {
                    MFirebaseService.deleteFileItem(image.key).then(function(response){
                        MUtilitiesService.AlertSuccessful(response, 'Thông báo');
                        image.deleled = true;
                    })
                    .catch(function(err){
                        MUtilitiesService.AlertError(err, 'Lỗi');
                    })
                }
            })
            .catch(function(err){

            })
    }


    $scope.addImage = function(){
        MUtilitiesService.showUploadImage(function(){
            var submitImage = function(imageData){
                return new Promise(function(resolve, reject){
                    if(imageData){
                        imageData.uploadBy = 2;
                        imageData.date = Date.now();
                        // cập nhật firebase
                        MFirebaseService.submitFileItem(imageData).then(function(){
                        	resolve(true);
                        });
                        
                    }
                    else{
                        resolve(false);
                    }
                })
            }

            return {
                submitImage : submitImage
            }
        })
        .then(function(response){
            // console.log(response);
        })
        .catch(function(err){
            MUtilitiesService.AlertError(err);
        })
    }
});