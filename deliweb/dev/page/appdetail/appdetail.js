'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		//orgid = '355671868335718400';
                orgid = util.getCookie('orgid');
        	var loc = kernel.parseHash(location.hash),appid = loc.args.appid;
        	util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/cd/app/'+ appid +'',
                "dauth": userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {},
	            success: function(res) {
	                console.log("res",res);
	            }
	        });
        }
    };
});