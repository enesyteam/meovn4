/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('mShipping')
  .service('firebaseStorageService', ["$q", function ($q) { 
  	var root = firebase.database().ref();
   	var storageRef = firebase.storage().ref();

   	function upload(file, uid, fileName) {
		var deferred = $q.defer();
		var fileRef = storageRef.child('uploads').child('products').child(fileName);
		// var storageRef = firebase.storage().ref('avatars/' + file.name);
		var uploadTask = fileRef.put(file);

		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
		  function(snapshot) {
		     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		     console.log('Upload is ' + progress + '% done');
		     switch (snapshot.state) {
		        case firebase.storage.TaskState.PAUSED:
		          console.log('Upload is paused');
		          break;
		        case firebase.storage.TaskState.RUNNING:
		          console.log('Upload is running');
		          break;
		     }
		 }, 
		 function(error) {
		    switch (error.code) {
		       case 'storage/unauthorized':
		           deferred.reject('User does not have permission to access the object.');
		           break;
		       case 'storage/canceled':
		           deferred.reject('User canceled the upload.');
		           break;
		       case 'storage/unknown':
		           deferred.reject(' Unknown error occurred, Please try later.');
		           break;
		     }
		  }, function() {
		        deferred.resolve(uploadTask.snapshot.downloadURL);
		  });

		return deferred.promise;
	}

	return {
		upload : upload,
	}

  }])
})();