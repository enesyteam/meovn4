(function() {
  'use strict';

  angular.module('mFacebook', []);

  angular.module('mFacebook')
        .service('MFacebookService', ["$http", "Facebook", function($http, Facebook) {

            var MFacebookServiceSetApp = function(app){
                // Facebook = app;
            }

            var graphUser = function(userId, access_token){
                return new Promise(function(resolve, reject) {
                    if(userId){
                        Facebook.api('/' + userId + '?access_token=' + access_token, function(response) {
                            // console.log(response);
                            if(response && !response.error){
                                resolve(response);
                            }
                            else{
                                reject(response.error);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                });
                
            }

            var graphPage = function(pageId, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(pageId){
                         Facebook.api('/' + pageId + '?fields=picture,name&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                            else{
                                console.log(response);
                                reject('Không tìm thấy thông tin page: ' + pageId);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu page id');
                    }
                });
            }

            var graphMessages = function(thread_id, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(thread_id){
                        Facebook.api('/' + thread_id + '?fields=messages.limit(100){message,from,created_time,attachments,sticker,shares{link,description,name}},snippet,link,participants&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                                 console.log(response);
                            }
                            else{
                                reject('Không tìm thấy thông tin hội thoại');
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu thread id');
                    }
                });
                
            }

            var graphComments = function(conversation_id, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(conversation_id){
                        Facebook.api('/' + conversation_id + '?fields=comments{from,message,created_time,id,attachment,message_tags,object},permalink_url,from,message,created_time,attachment,object,message_tags&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                            else{
                                // alert('lỗi');
                                reject('Cuộc hội thoại không tồn tại hoặc đã bị xóa');
                            }
                        })
                        .catch(function(err){
                            // alert('lỗi');
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu conversation id. Hội thoại không tồn tại hoặc có thể đã bị xóa.');
                    }
                });
            }

            var graphPost = function(post_id, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(post_id){
                        Facebook.api('/' + post_id + '?fields=full_picture,message,picture,attachments,story,permalink_url&date_format=U&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu post id');
                    }
                });
            }

            var graphPostAttachments = function(post_id, access_token){

                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(post_id){
                        Facebook.api('/' + post_id + '?fields=picture,attachments&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                // console.log(response)
                                 resolve({
                                    type : 'post',
                                    data : response,
                                });
                                // return;
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu post id');
                    }
                });
            }

            var graphPermalink = function(conversation_id, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(conversation_id){
                        Facebook.api('/' + conversation_id + '?fields=permalink_url&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                            else{
                                reject('Cuộc hội thoại không tồn tại hoặc đã bị xóa');
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu conversation id. Hội thoại không tồn tại hoặc có thể đã bị xóa.');
                    }
                });
            }

            /*
            * tìm thread id trong limit tin nhắn của một page id
            */
            var findThreadInPageId = function(pageId, thread_id, access_token, limit){
                // console.log(thread_id);
                return new Promise(function(resolve, reject){
                    // tìm trong 100 tin nhắn mới nhất
                    console.log('đang tìm trong ' + limit + ' tin nhắn mới nhất...');
                    Facebook.api('/' + pageId + '/conversations?fields=id,link&limit='+limit+'&access_token=' + access_token, function(response) {
                        if (response && !response.error) {
                            // console.log(response.data);
                            var found = null;
                            angular.forEach(response.data, function(data) {
                                // console.log(link.split('/'));
                                // console.log(data.link.split('/'));
                                if (data.link.indexOf(thread_id) !== -1) {
                                    // alert(data.id);
                                    found = data.id;
                                    return;
                                }
                                
                            });
                            if(found){
                                resolve(found);
                            }
                            else{
                                reject('Không tìm thấy');
                            }
                        }
                        else{
                            reject('Lỗi. Vui lòng kiểm tra lại');
                        }
                    });
                })
            }

            /*
            * tìm thread id trong limit tin nhắn của một page id từ user name
            */
            var findThreadByUserName = function(pageId, user_name, access_token, limit){
                console.log(user_name);
                return new Promise(function(resolve, reject){
                    // tìm trong 100 tin nhắn mới nhất
                    console.log('đang tìm trong ' + limit + ' tin nhắn mới nhất...');
                    Facebook.api('/' + pageId + '/conversations?fields=id,senders&limit='+limit+'&access_token=' + access_token, function(response) {
                        if (response && !response.error) {
                            console.log(response.data);
                            var found = [];
                            angular.forEach(response.data, function(data) {
                                // console.log(data)
                                // console.log(link.split('/'));
                                // console.log(data.link.split('/'));
                                angular.forEach(data.senders.data, function(sender){
                                    // console.log(sender);
                                    if (sender.name == user_name) {
                                        console.log('tìm thấy: ' + data.id);
                                        found.push({
                                            from: {
                                                id: sender.id,
                                                name: sender.name
                                            },
                                            threadId: data.id
                                        });
                                        // return;
                                    }
                                })
                                
                            });
                            if(found.length > 0){
                                resolve(found);
                            }
                            else{
                                reject('Không tìm thấy');
                            }
                        }
                        else{
                            reject('Lỗi. Vui lòng kiểm tra lại');
                        }
                    });
                })
            }

            /*
            * photoId: 1803964422949390
            */
            var graphPhoto = function(photoId, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(photoId){
                        Facebook.api('/' + photoId + '?fields=picture,link,images&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                            else{
                                reject('Cuộc hội thoại không tồn tại hoặc đã bị xóa');
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu conversation id');
                    }
                });
            }

        var replyComment = function(conversation_id, access_token, attachment_url, comment_text){
            // $scope.startReplying = true;
            return new Promise(function(resolve, reject){
                FB.api(
                    "/" + conversation_id + "/comments",
                    "POST",
                    {
                        "message": comment_text,
                        "attachment_url" : attachment_url,
                        "access_token" : access_token
                    },
                    function (response) {
                      if (response && !response.error) {
                        /* handle the result */
                        resolve('Gửi bình luận tới khách hàng thành công');
                      }
                      else{
                        reject('Không thể gửi bình luận tới khách hàng. Lỗi: ' + response.error);
                      }
                    }
                );
            })
        }
        var replyMessage = function(conversation_id, access_token, attachment_url, comment_text){
            return new Promise(function(resolve, reject){
                FB.api(
                    "/" + conversation_id + "/messages",
                    "POST",
                    {
                        "message": comment_text,
                        "attachment_url" : attachment_url,
                        "access_token" : access_token
                    },
                    function (response) {
                      if (response && !response.error) {
                        /* handle the result */
                        resolve('Gửi tin nhắn tới khách hàng thành công');
                      }
                      else{
                            reject('Không thể gửi tin nhắn tới khách hàng. Lỗi: ' + response.error);
                          }
                    }
                );
            })
        }

        var graphPageLikes = function(pageId, access_token){
                return new Promise(function(resolve, reject) {
                    if(!access_token){
                        reject('Thiếu access token');
                    }
                    if(pageId){
                        Facebook.api('/' + pageId + '?fields=fan_count&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
                            else{
                                reject('Page không tồn tại');
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        });
                    }
                    else{
                        reject('Thiếu page id');
                    }
                });
            }

            
        return {
            MFacebookServiceSetApp : MFacebookServiceSetApp,
            graphUser : graphUser,
            graphPage : graphPage,
            graphMessages : graphMessages,
            graphComments : graphComments,
            graphPost : graphPost,
            graphPermalink : graphPermalink,
            findThreadInPageId : findThreadInPageId,
            graphPhoto : graphPhoto,
            graphPostAttachments : graphPostAttachments,
            replyComment : replyComment,
            replyMessage : replyMessage,
            graphPageLikes : graphPageLikes,
            findThreadByUserName: findThreadByUserName
        }

    }]);
}());