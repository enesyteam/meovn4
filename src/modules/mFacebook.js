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
                        Facebook.api('/' + thread_id + '?fields=messages.limit(100){message,from,created_time,attachments,sticker,shares{link,description,name}},snippet,link&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
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
                        Facebook.api('/' + conversation_id + '?fields=comments{from,message,created_time,id,attachment},permalink_url,from,message,created_time,attachment&access_token=' + access_token, function(response) {
                            if(response && !response.error){
                                 resolve(response);
                            }
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
                        });
                    }
                    else{
                        reject('Thiếu post id');
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
            }

        }]);
}());