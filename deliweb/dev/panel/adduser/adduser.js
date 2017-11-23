'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
	var thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		$dom = $('#' + thisPanel),
		$addInner = $dom.find('.add-user'),
		$addInfo  = $addInner.find('.add-form .add-form-base'),
		$addExtra = $addInner.find('.add-form .add-form-extra'),
		$addUser = $addInner.find('.btn-add-user'),
		$addDept = $addInner.find('.btn-add-dept');
		var userid = util.getCookie('userid'),
			token = util.getCookie('token'),
			orgid = '355671868335718400';
		$addUser.on('click',function(){
			// 添加人员到团队 /v1.0/org/user
			util.ajaxSubmit({
                url: '/v1.0/org/user',
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildHash(token),
                data: {
				    "user_id":350305795163815936,      // 选填，被添加的用户id，当用户id和用户手机号同时存在时，优先使用用户id
				    "mobile_region":"86",              // 选填，被添加的用户手机号区号，没有填被添加用户id的时候必须填这个
				    "mobile":"123456789",              // 选填，被添加的用户手机号，没有填被添加用户id的时候必须填这个
				    "department_ids":[350236083323142144, 123],       // 必填，被添加到的部门id数组
				    "titles":["组长",""],       // 必填，被添加到的部门职务数组,长度必须和id数组一致，不够的用空字符串补上
				    "nickname":"stone",                 // 选填，用户在团队中的名称
				    "employee_num":"123"                // 选填， 用户的工号
                },
                success: function(res) {
                    console.log("res",res);
                }
            });
		});
		$addDept.on('click', function() {
	        kernel.openPopup('adddept', {
	            model: {
	                attr: 'adddept'
	            }
	        });
	    });
	    // 修改人员在团队组织中的信息 /v1.0/org/user/{user_id}
	return {
		onload: function(param) {
			console.log('opening ' + thisPanel);
			console.log('param',param);
			var type = param.type,data = param.data;
			if(type == 'edit'){
				$addInner.find('h4').text('编辑成员');
				$addInfo.find('.username').val(data.name);
				$addInfo.find('.usermobile').val(data.mobile);
				$addInfo.find('.employee_num').val(data.employee_num);
				$addExtra.find('.department').val(data.department);
				$addExtra.find('.business').val(data.title);
			}else{
				$addInner.find('h4').text('添加成员');
				$addInfo.find('.username').val('');
				$addInfo.find('.usermobile').val('');
				$addInfo.find('.employee_num').val('');
				$addExtra.find('.department').val('');
				$addExtra.find('.business').val('');
			}
		},
		onunload: function() {
			//console.log('closing ' + thisPanel);
		},
		onloadend: function() {
			//console.log(thisPanel + ' is open');
		},
		onunloadend: function() {
			//console.log(thisPanel + ' is closed');
		},
		ondestory: function() {
			//console.log('do clean up stuff here');
		}
	};
});