'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var $loginBox =  $('#loginhome .login-box'),
        		$loginQr =$loginBox.find('#loginQr'),
        		$loginDoing = $loginQr.find('.login-doing'),
        		$loginSuccess = $loginQr.find('.login-success');
        	var stomp = null;
        	var userData = {};
        	// webscoket 
	        function connect(cid, status){
	        	var sock = new SockJS('http://192.168.0.201:9002/web-gateway-websocket');
	        	stomp = Stomp.over(sock);
		        stomp.connect({}, function (frame) {
		            var url = "/user/"+ cid +"/barcode/login";
		            listenStomp(cid, url, status);
		        });
		    }

	        function listenStomp(cid, url, status){
	        	//qrcode
				stomp.subscribe('/user/'+ cid +'/info', function(message){
					var json = JSON.parse(message.body);
					console.log("json", json);
					$loginDoing.hide();
					$loginSuccess.find('img.success-img').attr('src', json.avatar_url);
					$loginSuccess.find('img.success-img').attr('title', json.name);
		            $loginSuccess.show();
				});

				//login
	            stomp.subscribe(url, function (message) {
	                var json = JSON.parse(message.body);
	                //console.log("json",json);
	                if(json && json.user_id){
	                	userData = json;
	                	if(userData.type == '_user_'){
	                		util.setUserData(userData);
	                		util.setCookie('token',userData.token);
			            	util.setCookie('userid',userData.user_id);
			            	util.setCookie('expire',userData.expire);
	                	}
	                	if(status&& status == 'disconnect'){
							disconnect();
	                	}
		            	kernel.replaceLocation({'args':{},'id':'orghome'});
	                }else{
	                	setTimeout(initQrcode($loginBox.find('.loginQr')), 1000);
	                }
	            });    
	        }

	        function disconnect() {
	            if (stomp != null) {
	                stomp.disconnect();
	            }
	            //console.log("Disconnected");
	        }

	        // init qrcode
	        function initQrcode(dom, status){
	        	util.ajaxSubmit({
                    url: '/v1.0/barcode_login/public',
                    silent: true,
                    type:'get',
                    success: function(json) {
                    	if(json.code == 0){
							var res = json.data['result'],
								cid = res.cid,
								url = res.data;
                    		if (url) {
                    			dom.html('').append(kernel.makeQr(url, 300));
	                            connect(cid, 'disconnect');
	                        } else {
	                        	loginQr.html('');
	                        	//更新user
	                            //util.updateUserData();
	                        }
                    	}else{
                    		kernel.hint(json.msg);
                    	}
                    }
                });
	        }

	        initQrcode($loginBox.find('.loginQr'));

        	$(document).on('click', '.loginQr', function() {
		        var self = this,
		            loginQr = $loginBox.find('.loginQr'),
		            that = loginQr[this === loginQr[0] ? 1 : 0];
		        if (this.childNodes.length === 0) {
		            if (that && that.childNodes.length > 0) {
		                this.innerHTML = that.innerHTML;
		            } else {
		                util.ajaxSubmit({
		                    url: '/v1.0/barcode_login/public',
		                    silent: true,
		                    type:'get',
		                    success: function(json) {
		                    	if(json.code == 0){
									var res = json.data['result'],
										cid = res.cid,
										url = res.data;
		                    		if (url) {
		                    			loginQr.html('');
			                            self.appendChild(kernel.makeQr(url, 300));
			                            connect(cid);
			                        } else {
			                        	loginQr.html('');
			                        	//更新user
			                            //util.updateUserData();
			                        }
		                    	}else{
		                    		kernel.hint(json.msg);
		                    	}
		                    }
		                });
		            }
		        }
		    });

		    $loginSuccess.find('.success-btn').on('click',function(){
		    	initQrcode($loginBox.find('.loginQr'), 'disconnect');
		    	$loginSuccess.hide();
		    	$loginDoing.show();
		    });
        }
    };
});