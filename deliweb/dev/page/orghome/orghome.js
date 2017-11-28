'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var loc = util.clone(kernel.location);
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		orgid = util.getCookie('orgid');
        	console.log("orgid",orgid);
        	var loc = kernel.parseHash(location.hash),appid = loc.args.appid;
        	var $orgNavList = $('#header .user-head .nav-top-list .nav-item-team .sun-nav-list-team');
        	var $orgBox =  $('#orghome .org-box'),
        		$orgList = $orgBox.find('.org-wrap .org-inner .org-list');
        	/*util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/user/me',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {},
	            success: function(json) {
                	if(json.code == 0){
                		var orgInfo = json.data.organization, length = orgInfo.length, tempInfo = [];
                		$orgList.find('>').remove('');
                		$orgNavList.find('>').remove('');
						$.each(orgInfo, function(i, item) {
							if(item.type == 'group'){
								tempInfo = tempInfo.concat(item);
								$orgList.append($('<li class="list-item"><a class="list-item-inner" href="javascript:;" data-oid="'+ item.id +'">'+ item.name +'</a></li>'));
								$orgNavList.append($('<a class="sub-nav-item" data-oid="'+ item.id +'" href="javascript:;">'+ item.name +'</a>'));
							}
						});
						(tempInfo.length <= 3) ? $orgList.addClass('org-list-seldom') : $orgList.addClass('org-list-plenty');
						
						setTargetHome($orgList);
                	}else{
                		kernel.hint(json.msg);
                	}
                }
	        });*/
	        //查看我能管理的部门 org/{org_id}/department/admined
	        util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/admin/auth/my',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {
	            	type:'group'
	            },
	            success: function(json) {
                	if(json.code == 0){
                		var orgInfo = json.data.result, length = orgInfo.length, tempInfo = [];
                		$orgList.find('>').remove('');
                		$orgNavList.find('>').remove('');
						$.each(orgInfo, function(i, item) {
							$orgList.append($('<li class="list-item"><a class="list-item-inner" href="javascript:;" data-oid="'+ item.org_id +'">'+ item.org_name +'</a></li>'));
							$orgNavList.append($('<a class="sub-nav-item" data-oid="'+ item.org_id +'" href="javascript:;">'+ item.org_name +'</a>'));
						});
						(length <= 3) ? ((length == 1)? kernel.replaceLocation({'args':{orgid:orgInfo[0].org_id},'id':'contacts'}) : $orgList.addClass('org-list-seldom')): $orgList.addClass('org-list-plenty');
						setTargetHome($orgList);
                	}else{
                		kernel.hint(json.msg);
                	}
                }
	        });

        	function setOrgNav(o){
        		o.find('.sub-nav-item').on('click',function(){
        			var c = $(this);
	        		util.setCookie('orgid', c.attr('data-oid'));
        		});
        	}

	        function setTargetHome(o){
	        	o.find($orgList.find('.list-item a.list-item-inner')).on('click',function(e){
	        		e.stopPropagation();
	        		var c = $(this),index = c.parent('.list-item').index();
	        		util.setCookie('orgid', c.attr('data-oid'));
	        		if(!$orgNavList.find('a').eq(index).hasClass('current')){
	        			$orgNavList.find('a').removeClass('current');
	        			$orgNavList.find('a').eq(index).addClass('current');
	        		}
	        		//location.assign(kernel.buildHash(util.clone({'args':{},'id':'home'})));
	        		kernel.replaceLocation({'args':{},'id':'contacts'});
	        	});
	        }
        }
    };
});