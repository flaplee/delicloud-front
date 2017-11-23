'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		orgid = util.getCookie('orgid');
        	console.log("orgid", util.getCookie('orgid'));
        	//kernel.openPanel('adduser');
        	util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/user/me',
	            data: {
	            	"dauth": userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token)
	            },
	           success: function(json) {
                	//console.log("json", json);
                	if(json.code == 0){
                	}else{
                		kernel.hint(json.msg);
                	}
                }
	        });
        }
    };
});