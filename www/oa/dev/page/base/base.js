'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
	var userid = util.getCookie('userid'),
		token = util.getCookie('token'),
		orgid = util.getCookie('orgid');
    return {
        onload: function(force) {
        	if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }
        	util.ajaxSubmit({
        		type: 'get',
	            url: '/v1.0/device/my',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {},
	            success: function(res) {
	                console.log("res",res);
	            }
	        });
        }
    };
});