'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var loc = util.clone(kernel.location);
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		orgid = util.getCookie('orgid');
        	console.log("userid",userid);
        	var loc = kernel.parseHash(location.hash),appid = loc.args.appid;
        	var $orgNavList = $('#header .user-head .nav-top-list .nav-item-team .sun-nav-list-team');
        	var $orgBox =  $('#orghome .org-box'),
        		$orgList = $orgBox.find('.org-wrap .org-inner .org-list');
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
						(length <= 3) ? ((length == 1)? kernel.replaceLocation({'args':{},'id':'contacts'}) && util.setCookie('orgid', orgInfo[0].org_id) : $orgList.addClass('org-list-seldom')): $orgList.addClass('org-list-plenty');
						setOrgNav($orgList);
						setOrgList($orgList);
                	}else{
                		kernel.hint(json.msg);
                	}
                }
	        });

	        // 切换组织
        	function setOrgNav(o){
        		o.find('.sub-nav-item').on('click',function(){
        			var c = $(this);
	        		util.setCookie('orgid', c.attr('data-oid'));
	        		//getOrgInfo(c.attr('data-oid'));
        		});
        	}

        	// 选择组织
	        function setOrgList(o){
	        	o.find('.list-item a.list-item-inner').on('click',function(e){
	        		e.stopPropagation();
	        		var c = $(this),index = c.parent('.list-item').index();
	        		util.setCookie('orgid', c.attr('data-oid'));
	        		//getOrgInfo(c.attr('data-oid'));
	        		if(!$orgNavList.find('a').eq(index).hasClass('current')){
	        			$orgNavList.find('a').removeClass('current');
	        			$orgNavList.find('a').eq(index).addClass('current');
	        		}
	        		kernel.replaceLocation({'args':{},'id':'contacts'});
	        	});
	        }

	        // 获取跟组织的 parentid
	        function getOrgInfo(orgid){
	        	util.ajaxSubmit({
	        		type:'get',
		            url: '/v1.0/org/' + orgid,
		            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
		            data: {},
		            success: function(json) {
	                	if(json.code == 0){
	                		var data = json.data.result;
	                		//util.setCookie('parentid', data.id);
	                		util.setCookie('parentid', '355671868335718401');
	                	}else{
	                		kernel.hint(json.msg);
	                	}
	                }
		        });
	        }
        }
    };
});