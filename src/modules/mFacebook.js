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
                        reject('Thiếu conversation id');
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
                        reject('Thiếu conversation id');
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
            }

        }]);
}());