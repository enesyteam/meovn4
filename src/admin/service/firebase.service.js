/**
 * @author congnvc@gmail.com
 * created on 07.01.2018
 */
(function () {
  'use strict';

  angular.module('m_admin')
  .service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter, scope) { 

	var ref = firebase.database().ref();
    var ordersArr = $firebaseArray(ref.child('orders'));
    // commentsArr = $firebaseArray(ref.child('comments'));
    var sourcesArr = $firebaseArray(ref.child('sources'));
    var statusesArr = $firebaseArray(ref.child('statuses'));
    var membersArr = $firebaseArray(ref.child('members'));
    var packsArr = $firebaseArray(ref.child('packs'));

 	 var getAllOrders = function(){
		return ordersArr.$loaded();
	};

	var getDashboardOrders = function(){
		return $firebaseArray(ref.child('orders').limitToLast(500)).$loaded();
	}
	// var getAllComments = function(){
	// 	return commentsArr.$loaded();
	// };
    var getAllSources = function(){
		return sourcesArr.$loaded();
	};
	var getAllStatuses = function(){
		return statusesArr.$loaded();
	};
	var getAllPacks = function(){
		return packsArr.$loaded();
	};
	var getAllMembers = function(){
		return membersArr.$loaded();
	};

	// var getOrder = function(id){
	// 	return ordersArr.$getRecord(id);
	// }
	

	var getMember = function(id){
		return membersArr.$getRecord(id);
	}
	var getMemberByEmail = function(email){
		membersArr.$loaded().then(function(){
			angular.forEach(membersArr, function(value) {
				if(value.email == email){
					return value;
				}
				return null;
            });
            return null;
		});
		
	}

	var getCommentForOrder = function(order){
		var comments = [];
		ref.child('comments').orderByChild('order_id').equalTo(order.id).once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				comments.push(value);
				// console.log(value);
			});
		 	// return res;
		 });
		return comments;
	}
	var updateOrder = function(order){
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		seller_will_call_id : order.seller_will_call_id
	        	});
	    });
	 });
	};
	var releaseOrder = function(oid){
		 return	ref.child('orders').orderByChild('id').equalTo(oid).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		seller_will_call_id : null
	        	});
		    });
		 });
	};
	var pushOrder = function(oid, uid, statusBefore){
		var d	= Date.now();
		// if seller get this order, we need to store seller id
		var assign_data = {};
		if(uid){
			assign_data = {
				'uid' 			: uid,
				'assigned_date'	: Date.now(),
				'status_before' : statusBefore,
				// 'status_after' is null that's mean seller not change status
  			};
		}
		 return	ref.child('orders').orderByChild('id').equalTo(oid).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
		 		// append
		 		if(child.val().seller_will_call_id) return;
		 		child.ref.child('assign_data').push(assign_data);
	        	return child.ref.update({
	        		seller_will_call_id : uid,
	        		updated_at			: d,
		        	});
		    });
		 });
	};
	var updateOrderSellerWillCall = function(order){
		// update_at
		order.updated_at	= Date.now();
		// if seller get this order, we need to store seller id
		var assign_data = {};
		if(order.seller_will_call_id){
			assign_data = {
				'uid' 			: order.seller_will_call_id,
				'assigned_date'	: Date.now(),
				'status_before' : order.status_id,
				// 'status_after' is null that's mean seller not change status
  			};
  			// store to order
  			order.assign_data = assign_data;
		}
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
		 		// append
		 		child.ref.child('assign_data').push(assign_data);
	        	return child.ref.update({
	        		seller_will_call_id : order.seller_will_call_id,
	        		updated_at			: order.updated_at,
	        	});
	    });
	 });
	};
	var updateOrderStatus = function(order){
		// update_at
		order.updated_at	= Date.now();
		return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		status_id : order.status_id,
	        		checked_by : order.checked_by,
	        		checked_at : order.checked_at,
	        		updated_at			: order.updated_at,
	        	});
	        	// find assign_data and update
	        	// if order.seller_will_call_id == null => allow admin or mod change status
	        	if(order.seller_will_call_id){
	        		// seller change
	        		child.ref.child('assign_data').orderByChild('uid').equalTo(order.seller_will_call_id).limitToLast(1)
	        		.once('value', function(ss){
	        			ss.forEach(function(c){
	        				c.ref.update({
	        					'status_after' : order.status_id
	        				});
	        			});
	        		});
	        	}
	        	else{
	        		// admin change
	        		child.ref.child('assign_data').orderByChild('uid').limitToLast(1)
	        		.once('value', function(ss){
	        			ss.forEach(function(c){
	        				c.ref.update({
	        					'status_after' : order.status_id
	        				});
	        			});
	        		});
	        	}
		    });
		 });
	};
	var findOrderById = function(id){
		var orders = [];
		ref.child('orders').orderByChild('id').equalTo(id).once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				orders.push(value);
			});
		 	// return res;
		 });
		return orders;
	};
	var findOrder = function(id){
		return ref.child('orders').orderByChild('id').equalTo(id).once('value', function(snapshot){
			return snapshot;
		 });
	}
	// var addComment = function(comment){
	// 	return commentsArr.$add(comment);
	// };

	var addComment = function(r){
		 var re = ref.child('comments');
		 return re.push(r);
	};

	/*add a mobile number to blocks list*/
	var submitBlockNumber = function(n){
		var re = ref.child('blocks');
		return re.push(n);
	}

	// var updateComment = function(comment){
	// 	return commentsArr.$save(comment);
	// };
	var removeComment = function(comment){
		return	ref.child('comments').orderByChild('id').equalTo(comment.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};

	// user manager
	var updateUserName = function(newName){
		var user = firebase.auth().currentUser;
		user.updateProfile({
		  displayName: newName,
		}).then(function() {
			console.log('success');
		  // Update successful.
		}).catch(function(error) {
		  // An error happened.
		  console.log('error');
		});
	}
	var updateUserPassword = function(newPassword){
		var user = firebase.auth().currentUser;
		var newPassword = getASecureRandomPassword();

		user.updatePassword(newPassword).then(function() {
		  // Update successful.
		}).catch(function(error) {
		  // An error happened.
		});
	}
	var updateUserAvatar = function(newAvatarURL){
		var user = firebase.auth().currentUser;
			user.updateProfile({
			  photoURL: newAvatarURL,
			}).then(function() {
				console.log('success');
			  // Update successful.
			}).catch(function(error) {
			  // An error happened.
			  console.log('error');
			});
	}
	
	var getChartData = function(days){
		// get list of sellers
		var res = [];
		var sellers = [];

		getAllOrders().then(function(){
			console.log(ordersArr);
			getAllMembers().then(function(sls){
				angular.forEach(sls, function(s){
					if(s.is_seller == 1 && s.status==1){
						sellers.push(s)
					}
				});
				angular.forEach(sellers, function(s){
					//get seller orders
					res.push({
						'seller' : s.last_name,
						'data'  : getUserOrders(s.id, days, ordersArr)
					});
				});
				
			});
		});
		
		
		// console.log(res);
		return res;
	}

	var getOrdersDays = function(days){
		var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        // first we need to get all orders related to this seller within days
        var orderDays = [];

        startTime.setDate(startTime.getDate() - days);
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();
 		
 		// may be problem when orders is very big       
        ref.child('orders')
        .orderByChild('created_at')
        .startAt(startTime)
        .endAt(endTime)
        .once('value', function(snap) {
           snap.forEach(function(item){
               orderDays.push(item.val());
           });
           
        });
        return orderDays;
	}

	var getOrdersToday = function(){
		 var endTime = new Date(); // today
        // var startTime = new Date(); // yesterday
        // first we need to get all orders related to this seller within days
        var orderDays = [];

        // startTime.setDate(startTime.getDate() - 1);
        // endTime.setDate(endTime.getDate());
        // startTime = startTime.getTime();
        // endTime = endTime.getTime();
 		
 		// may be problem when orders is very big       
        ref.child('orders')
        .orderByChild('created_at')
        .limitToLast(1000)
        .once('value', function(snap) {
           snap.forEach(function(item){
           		var cd = new Date(item.val().created_at);
           		if(cd.getDate() >= endTime.getDate() - 3){
		               orderDays.push(item.val());
		           }
           });
           
        });
        return orderDays;
	}

	var getSuccessOrdersToday = function(){
	 	var endTime = new Date(); // today
	 	var orderDays = [];

	 	ref.child('orders')
        .orderByChild('status_id')
        .equalTo(6)
        .limitToLast(1000)
        .once('value', function(snap) {
           snap.forEach(function(item){
           		var cd = new Date(item.val().checked_at);
           		if(cd.getDate() == endTime.getDate() && cd.getMonth() == endTime.getMonth()){
           			orderDays.push(item.val());
           		}
           });
           
        });
        return orderDays;
 		
	}
	var getSuccessOrdersMonth = function(m){
	 	// var endTime = new Date(); // today
	 	var ordersMonth = [];

	 	ref.child('orders')
        .orderByChild('status_id')
        .equalTo(6)
        .once('value', function(snap) {
           snap.forEach(function(item){
           		var cd = new Date(item.val().checked_at);
           		if(cd.getMonth() == m){
           			ordersMonth.push({
           				'mobile' : item.val().buyer_mobile,
           				'name' : item.val().buyer_name,
           				'seller_id' : item.val().checked_by,
           				'checked_at' : item.val().checked_at,
           			});
           		}
           });
           
        });

        // also get in old data
        ref.child('oldData')
        .child('orders')
        .once('value', function(snap) {
           snap.forEach(function(item){
           	// console.log(item.val());
           		var cd = new Date(item.val().updated_at);
           		if(cd.getMonth() == m){
           			ordersMonth.push({
           				'mobile' : item.val().buyer_mobile,
           				'name' : item.val().buyer_name,
           				'seller_id' : item.val().checked_by,
           				'checked_at' : item.val().updated_at,
           			});
           		}
           });
        });
        return ordersMonth;
	}
	/*
		uid: user id
		m: month (0-11)
	*/
	var getCalledMonthByUid = function(uid, m){
		var dCalledArr = [];

	 	ref.child('orders')
        .once('value', function(snap) {
           snap.forEach(function(item){
           		var cd = new Date(item.val().updated_at);
           		if(cd.getMonth() == m){
           			angular.forEach(item.val().assign_data, function(a){
						var ad = new Date(a.assigned_date);
						// NOTE: NEED TO CHECK DUPLICATE

						if(a.status_after && (a.status_before != a.status_after && a.uid == uid)){
							if(dCalledArr.indexOf(item.val()) == -1 && item.val().status_id != 1) dCalledArr.push(item.val());
						}

					});
           		}
           });
        });

        return dCalledArr.length;

	}

	var reportUserOrders = function(uid, days){
		var res = [];

        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        // first we need to get all orders related to this seller within days
        var orderDays = [];

        startTime.setDate(startTime.getDate() - days);
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();
 		
 		// may be problem when orders is very big       
        ref.child('orders')
        .once('value', function(snap) {
           snap.forEach(function(item){
                // we look in assign_data to detect if order ever assign to this seller
        		item.ref.child('assign_data').orderByChild('uid').equalTo(uid)
        		.once('value', function(ss){
        			// console.log(ss.val());
        			if(ss.val() && ss.assign_data){
        				ss.ref.orderByChild('assigned_date')
        				.startAt(startTime)
			            .endAt(endTime)
			            .once('value', function(sn) {
			            	orderDays.push(item.val());
			            });
        			}
        		})
           });
           
        });
        console.log(orderDays);
        return;
        // find in orderDays array
        var calledArr = [], successArr = [], failedArr = [], otherArr = [], notCalled = [];
        var dateArr = [];

    	for (var i = 0; i < days; i++) {
    		// first get all orders of this day
	        var d = new Date();
    		d.setDate(d.getDate() - i);
    		// d = d.getTime();
    		var dCalledArr = [], dSuccessArr = [], dFailedArr = [], dOtherArr = [], dNotCalled = [];
    		// get
    		angular.forEach(orderDays, function(v){
    			if(v.assign_data)
    			angular.forEach(v.assign_data, function(a){
    				var ad = new Date(a.assigned_date);
    				// NOTE: NEED TO CHECK DUPLICATE
    				if(ad.getDate() == d.getDate() && ad.getMonth() == d.getMonth()){
    					if(a.status_after && (a.status_before != a.status_after && a.uid == uid)){
    						if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
    					}

    					if(v.status_id == 6 && a.status_after == 6 && v.checked_by == uid 
    						&& v.seller_will_call_id == uid  && a.uid == uid){
    						if(dSuccessArr.indexOf(v) == -1){
    							// if admin => order checked in assign day
    							var cd = new Date(v.checked_at);
    							if(cd.getDate() == d.getDate() && cd.getMonth() == d.getMonth()){
    								dSuccessArr.push(v);
    							}
    						}
    					}
    					else if(a.status_after && (a.status_after == 2 || a.status_after == 3 || a.status_after == 7) 
    						&&  a.uid == uid ){
    						if(dFailedArr.indexOf(v) == -1) dFailedArr.push(v);
    					}
    					else if(!a.status_after && v.status_id == 1 && v.seller_will_call_id == uid  && a.uid == uid){
    						if(dNotCalled.indexOf(v) == -1) dNotCalled.push(v);
    					} 
    					else{
    						if(dOtherArr.indexOf(v) == -1 && (a.uid == uid && (a.status_after == 9
    							|| a.status_after == 5 || a.status_after == 8))) dOtherArr.push(v);
							// if(v.status_id == 6){
    			// 				var cd = new Date(v.checked_at);
    			// 				if(dCalledArr.indexOf(v) == -1 && cd.getDate() != d.getDate()) dOtherArr.push(v);
    			// 			}
    					}
    				}
    				else if(v.status_id == 6 && a.status_after == 6 && v.checked_by == uid 
    						&& v.seller_will_call_id == uid  && a.uid == uid){

							// if admin => order checked in assign day
							var cd = new Date(v.checked_at);
							if(cd.getDate() == d.getDate() && cd.getMonth() == d.getMonth()){
								if(dSuccessArr.indexOf(v) == -1) dSuccessArr.push(v);
								if(dCalledArr.indexOf(v) == -1) dCalledArr.push(v);
							}

    				}
    				//
    			});

    			if(v.status_id == 6 &&  v.checked_by == uid 
					){
					// if admin => order checked in assign day
					var cd = new Date(v.checked_at);
					if(cd.getDate() == d.getDate() && cd.getMonth() == d.getMonth()){
						// if(dSuccessArr.indexOf(v) == -1) dSuccessArr.push(v);
						if(checkDuplicate(dSuccessArr, v)){
							dSuccessArr.push(v);
						}
						if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
					}
				}
				// 

    		});

    		// date array
    		dateArr.push(d.getDate() + '-' + (d.getMonth()+1));

    		calledArr.push(dCalledArr);
    		successArr.push(dSuccessArr);
    		failedArr.push(dFailedArr);
    		notCalled.push(dNotCalled);
    		otherArr.push(dOtherArr);
    		//
    	}
    	res.push(dateArr);
    	res.push(calledArr);
		res.push(successArr);
		res.push(failedArr);
		res.push(notCalled);
		res.push(otherArr);
    	// console.log(res);
    	return res;
    }

	// get seller orders for display chart
	var getUserOrders = function(uid, days, orderDays){
		// console.log(uid + '/' + days + '/' + orderDays.length);
		var res = [];
        // find in orderDays array
        var calledArr = [], successArr = [], failedArr = [], otherArr = [], notCalled = [];
        var dateArr = [];

    		// first get all orders of this day
	        var d = new Date();

    		// d = d.getTime();
    		var dCalledArr = [], dSuccessArr = [], dFailedArr = [], dOtherArr = [], dNotCalled = [];
    		// get

    		angular.forEach(orderDays, function(v){
    			angular.forEach(v.assign_data, function(a){
    				var ad = new Date(a.assigned_date);
    				// NOTE: NEED TO CHECK DUPLICATE
    				if(ad.getDate() == d.getDate() && ad.getMonth() == d.getMonth()){
    					if(a.status_after && (a.status_before != a.status_after && a.uid == uid)){
    						if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
    					}

    					if(a.status_after && (a.status_after == 2 || a.status_after == 3 || a.status_after == 7) 
    						&&  a.uid == uid ){
    						if(dFailedArr.indexOf(v) == -1) dFailedArr.push(v);
    					}
    					else if(!a.status_after && v.status_id == 1 && v.seller_will_call_id == uid  && a.uid == uid){
    						if(dNotCalled.indexOf(v) == -1) dNotCalled.push(v);
    					} 
    				}
    				else if(v.status_id == 6 && a.status_after == 6 && v.checked_by == uid 
    						&& v.seller_will_call_id == uid  && a.uid == uid){

							// if admin => order checked in assign day
							var cd = new Date(v.checked_at);
							if(cd.getDate() == d.getDate()){
								if(dSuccessArr.indexOf(v) == -1) dSuccessArr.push(v);
								if(dCalledArr.indexOf(v) == -1) dCalledArr.push(v);
							}

    				}
    			});
    			if(v.status_id == 6 
					&& v.checked_by == uid){
					if(dSuccessArr.indexOf(v) == -1){
						// if admin => order checked in assign day
						var cd = new Date(v.checked_at);
						if(cd.getDate() == d.getDate()){
							dSuccessArr.push(v);
							if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
						}
					}
				}

    		});

    		calledArr.push(dCalledArr.length);
    		successArr.push(dSuccessArr.length);
    		failedArr.push(dFailedArr.length);
    		notCalled.push(dNotCalled.length);
    		otherArr.push(dOtherArr.length);
    		//

    	// res.push(dateArr);
    	res.push(calledArr[0]);
		res.push(successArr[0]);
		res.push(0 - failedArr[0]);
		res.push(notCalled[0]);
		res.push(otherArr[0]);
    	return res;
    }
    // for report
    var getUserOrdersByDate = function(date, uid, days, orderDays){
    	var rd = new Date(date);
		// console.log(uid + '/' + new Date(date).getDate() + '/' + days + '/' + orderDays.length);
		var res = [];
        // find in orderDays array
        var calledArr = [], successArr = [], failedArr = [], otherArr = [], notCalled = [];
        var dateArr = [];

        var c = 0, s = 0, o = 0, n = 0, f = 0;
		// first get all orders of this day
		// d = d.getTime();
		var dCalledArr = [], dSuccessArr = [], dFailedArr = [], dOtherArr = [], dNotCalled = [];
		// get
		angular.forEach(orderDays, function(v){
			angular.forEach(v.assign_data, function(a){
				var ad = new Date(a.assigned_date);
				// NOTE: NEED TO CHECK DUPLICATE

				if(ad.getDate() == rd.getDate() && ad.getMonth() == rd.getMonth()){
					if(a.status_after && (a.status_before != a.status_after && a.uid == uid)){
						if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
					}

					// if(v.status_id == 6 && v.seller_will_call_id == uid){
					// 	if(dSuccessArr.indexOf(v) == -1){
					// 		// if admin => order checked in assign day
					// 		var cd = new Date(v.checked_at);
					// 		if(cd.getDate() == d.getDate()){
					// 			dSuccessArr.push(v);
					// 		}
					// 	}
					// }
					if(a.status_after && (a.status_after == 2 || a.status_after == 3 || a.status_after == 7) 
						&&  a.uid == uid ){
						if(dFailedArr.indexOf(v) == -1) dFailedArr.push(v);
					}
					else if(!a.status_after && v.status_id == 1 && v.seller_will_call_id == uid  && a.uid == uid){
						if(dNotCalled.indexOf(v) == -1) dNotCalled.push(v);
					} 
					else{
						if(dOtherArr.indexOf(v) == -1 && (a.uid == uid && (a.status_after == 9
							|| a.status_after == 5 || a.status_after == 8))) dOtherArr.push(v);
						// if(v.status_id == 6){
			// 				var cd = new Date(v.checked_at);
			// 				if(dCalledArr.indexOf(v) == -1 && cd.getDate() != d.getDate()) dOtherArr.push(v);
			// 			}
					}
				}
			});
			if(v.status_id == 6 
				&& v.checked_by == uid){
				var cd = new Date(v.checked_at);
					if(cd.getDate() == rd.getDate() && cd.getMonth() == rd.getMonth()){
						dSuccessArr.push(v);
						if(dCalledArr.indexOf(v) == -1 && v.status_id != 1) dCalledArr.push(v);
					}
			}

		});

		c += dCalledArr.length;
		s += dSuccessArr.length;

    		

    	// res.push(dateArr);
    	res.push(c);
		res.push(s);
		res.push(0 - failedArr[0]);
		res.push(notCalled[0]);
		res.push(otherArr[0]);
    	return res;
    }

    function checkDuplicate(arr, item){
    	var matches = arr.filter(function(d) {
	      return 
      		 d.buyer_mobile == item.buyer_mobile &&
      		 d.buyer_name == item.buyer_name
	    });
    }

     var getUserRequests = function(){
        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        startTime.setDate(startTime.getDate() - 1);
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();
        var res = [];

        ref.child('requests')
        .once('value', function(snap) {
           // console.log(startTime);
           snap.forEach(function(item){
           		// console.log(item.val().created_at);
           		if(item.val().created_at > startTime){
					res.push(item.val());
           		}
           });
           
        });
        return res;
    }

    var updateRequest = function(r, isChecked){
		 return	ref.child('requests').orderByChild('id').equalTo(r.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
		 		var s = isChecked ? 2 : 1;
	        	child.ref.update({
	        		'status' : s
	        	});
	    });
	 });
	};

	var rejectRequest = function(r){
	 return	ref.child('requests').orderByChild('id').equalTo(r.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		'status' : 3
	        	});
	    });
	 });
	}

    function getAvailableOrders(dates){
        if(!dates) dates = 2;
        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        startTime.setDate(startTime.getDate() - dates);
        endTime.setDate(endTime.getDate());
        // console.log('get orders from: ' + startTime + ' to ' + endTime);
        startTime = startTime.getTime();
        endTime = endTime.getTime();
        var res = [];
        // var res = [];
        ref.child('orders').orderByChild('created_at')
        .startAt(startTime)
        .endAt(endTime)
        .once('value', function(snap) {
           
       	snap.forEach(function(item){
                res.push(item.val());
           });
        });
        return res.reverse();
    }

    var orders = [];
    function getListOrders(dates){
		if(!dates) dates = 2;
        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        startTime.setDate(startTime.getDate() - dates);
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();
        var res = [];
        // var res = [];
        ref.child('orders').orderByChild('created_at')
        .startAt(startTime)
        .endAt(endTime)
        .once('value', function(snap) {
           snap.forEach(function(item){
                orders.push(item.val());
           });
        });
        // console.log(orders);
       return orders;
    }

    var removeOrder = function(order){
		return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};
	var saveOrder = function(data, order){
		return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update(data);
		    });
		 });
	}

    // users
    var addUser = function(r){
		 var re = ref.child('members');
		 return re.push(r);
	}
	var removeUser = function(user){
		return	ref.child('members').orderByChild('id').equalTo(user.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};
	var updateUser = function(data, user){
		return	ref.child('members').orderByChild('id').equalTo(user.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update(data);
		    });
		 });
	}

	var newUserId = function(){
		var id = 0;
		ref.child('members').orderByChild('id')
        .once('value', function(snap) {
           snap.forEach(function(item){
                if(item.val().id >= id){
                	id = item.val().id;
                	id++;
                }
           });
        });
        return id;
	}
	var newPackId = function(){
		var id = 0;
		ref.child('packs').orderByChild('id')
        .once('value', function(snap) {
           snap.forEach(function(item){
                if(item.val().id >= id){
                	id = item.val().id;
                	id++;
                }
           });
        });
        return id;
	}
    var addPack = function(r){
		 var re = ref.child('packs');
		 return re.push(r);
	}
	var removePack = function(pack){
		return	ref.child('packs').orderByChild('id').equalTo(pack.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};
	var addSource = function(r){
		 var re = ref.child('sources');
		 return re.push(r);
	}
	var newSourceId = function(){
		var id = 0;
		ref.child('sources').orderByChild('id')
        .once('value', function(snap) {
           snap.forEach(function(item){
                if(item.val().id >= id){
                	id = item.val().id;
                	id++;
                }
           });
        });
        return id;
	}
	var removeSource = function(source){
		return	ref.child('sources').orderByChild('id').equalTo(source.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};
	var deleteTestData = function(){
		return	ref.child('oldData').child('orders').once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	}
	var deleteBlacklist = function(){
		return	ref.child('blocks').once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	}

	var deleteDemoData = function(){
		ref.child('orders').once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
		ref.child('comments').once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	}

	var getOldOrderHistory = function(mobile){
		var res = [];
		ref.child('orders').child('oldData').orderByChild('buyer_mobile').equalTo(mobile).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
        		res.push(child.val());
		    });
		 });
		return res;
	}
	var checkBlacklist = function(m){
		return ref.child('blocks').orderByChild('mobile').equalTo(m).once('value', function(snapshot){
			return snapshot;
		 });
	}

	//authientication
	var createFirebaseUser = function(email, password){
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		});
	}

	// report
  //   function getListOrders(dates){
		// if(!dates) dates = 2;
  //       var endTime = new Date(); // today
  //       var startTime = new Date(); // yesterday
  //       startTime.setDate(startTime.getDate() - dates);
  //       endTime.setDate(endTime.getDate());
  //       startTime = startTime.getTime();
  //       endTime = endTime.getTime();
  //       var res = [];
  //       // var res = [];
  //       ref.child('orders').orderByChild('created_at')
  //       .startAt(startTime)
  //       .endAt(endTime)
  //       .once('value', function(snap) {
  //          snap.forEach(function(item){
  //               orders.push(item.val());
  //          });
  //       });
  //       // console.log(orders);
  //      return orders;
  //   }


	return{
		getSuccessOrdersToday : getSuccessOrdersToday,
		createFirebaseUser : createFirebaseUser,
		deleteBlacklist : deleteBlacklist,
		removeOrder : removeOrder,
		saveOrder : saveOrder,
		findOrder : findOrder,
		deleteTestData : deleteTestData,
		deleteDemoData : deleteDemoData,
		checkBlacklist : checkBlacklist,
		getOldOrderHistory : getOldOrderHistory,
		getListOrders : getListOrders,
		pushOrder : pushOrder,
		releaseOrder : releaseOrder,
		getAllOrders    : getAllOrders,
		// getAllComments	: getAllComments,
		getCommentForOrder: getCommentForOrder,
		addComment		: addComment,
		// updateComment	: updateComment,
		removeComment	: removeComment,
		// getOrder    	: getOrder,
		findOrderById   : findOrderById,
		getAllStatuses	: getAllStatuses,
		updateOrder		: updateOrder,
		updateOrderStatus: updateOrderStatus,
		updateOrderSellerWillCall: updateOrderSellerWillCall,
		getAllSources	: getAllSources,
		getAllPacks		: getAllPacks,
		getAllMembers	: getAllMembers,
		getMember		: getMember,
		getMemberByEmail:getMemberByEmail,
		submitBlockNumber : submitBlockNumber,
		// getUserOrders : getUserOrders ,
		getAvailableOrders : getAvailableOrders,
		getUserRequests : getUserRequests ,
		updateRequest : updateRequest,
		rejectRequest : rejectRequest,
		getChartData : getChartData,
		getOrdersDays : getOrdersDays,
		getOrdersToday : getOrdersToday,
		addUser : addUser,
		newUserId : newUserId,
		removeUser : removeUser,
		updateUser : updateUser,
		newPackId: newPackId,
		addPack : addPack,
		removePack : removePack,
		newSourceId : newSourceId,
		addSource : addSource,
		removeSource : removeSource,
		reportUserOrders : reportUserOrders,
		getUserOrders : getUserOrders ,
		getDashboardOrders: getDashboardOrders,
		getSuccessOrdersMonth : getSuccessOrdersMonth,
		getCalledMonthByUid : getCalledMonthByUid,
		getUserOrdersByDate : getUserOrdersByDate,
		// getDailyReportData : getDailyReportData,
	}

}]);

})();