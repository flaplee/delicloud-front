'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var loc = util.clone(kernel.location);
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		orgid = util.getCookie('orgid');
        	var loc = kernel.parseHash(location.hash),appid = loc.args.appid;
        	var $orgBox =  $('#orghome .org-box'),
        		$orgList = $orgBox.find('.org-wrap .org-inner .org-list');
        	util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/user/me',
	            data: {
	            	"dauth": userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token)
	            },
	           success: function(json) {
                	if(json.code == 0){
                		var orgInfo = json.data.organization, length = orgInfo.length, tempInfo = [];
                		$orgList.find('>').remove('');
						$.each(orgInfo, function(i, item) {
							if(item.type == 'group'){
								tempInfo = tempInfo.concat(item);
								$orgList.append($('<li class="list-item"><a class="list-item-inner" href="javascript:;" data-oid="'+ item.id +'">'+ item.name +'</a></li>'));
							}
						});
						(tempInfo.length <= 3) ? $orgList.addClass('org-list-seldom') : $orgList.addClass('org-list-plenty');
						setTargetHome($orgList);
                	}else{
                		kernel.hint(json.msg);
                	}
                }
	        });
	        function setTargetHome(dom){
	        	dom.find($orgList.find('.list-item a.list-item-inner')).on('click',function(e){
	        		e.stopPropagation();
	        		var c = $(this);
	        		util.setCookie('orgid', c.attr('data-oid'))
	        		//location.assign(kernel.buildHash(util.clone({'args':{},'id':'home'})));
	        		kernel.replaceLocation({'args':{},'id':'home'});
	        	});
	        }
        }
    };
});