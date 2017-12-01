'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
	var thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		$dom = $('#' + thisPanel),
		$addInner = $dom.find('.add-user'),
		$addInfo  = $addInner.find('.add-form .add-form-base'),
		$addExtra = $addInner.find('.add-form .add-form-extra'),
		$addBtn = $addInner.find('.add-form-btn'),
		$addFromDept = $addInfo.find('.btn-to-dept'),
		$addBtns = $addInner.find('.add-btns'),
		$addDeptMore = $addBtn.find('.btn-add-more'),
		$addUser = $addBtns.find('.btn-add-user'),
		$addUserGo = $addBtns.find('.btn-add-user-go'),
		$addUserCancel = $addBtns.find('.btn-add-cancel');

	return {
		onload: function(param) {
			var userid = util.getCookie('userid'),
			token = util.getCookie('token'),
			orgid = util.getCookie('orgid');
/*			console.log("userid",userid);
			console.log('opening ' + thisPanel);
			console.log('param',param);*/
			var type = param.type,data = param.data;
			console.log("data.uid",data);
			if(type == 'edit'){
				$addInner.find('h4').text('编辑成员');
				$addInfo.find('.username').val(data.name);
				$addInfo.find('.usermobile').val(data.mobile);
				$addInfo.find('.employee_num').val(data.employee_num);
				$addExtra.find('.extra-item-index .department').val(data.department);
				$addExtra.find('.extra-item-index .business').val(data.title);
				$addFromDept.hide();
			}else{
				$addInner.find('h4').text('添加成员');
				$addInfo.find('.username').val('');
				$addInfo.find('.usermobile').val('');
				$addInfo.find('.employee_num').val('');
				$addExtra.find('.extra-item-index .department').val('');
				$addExtra.find('.extra-item-index .business').val('');
				$addFromDept.show();
			}

			// 从其他部门添加
			$addFromDept.on('click', function() {
		        // 从部门中选择
		        kernel.openPopup('adduser', {
		            type: 'adduser'
		        });
		    });

			// 继续增加部门及职务
			$addDeptMore.on('click',function(e){
				e.stopPropagation();
				var $temp = $('<li class="extra-item">\
					<a href="javascript:;" class="extra-item-del">删除</a>\
					<div class="form-group">\
						<label class="col-sm-2 control-label" for="formGroupInputDefault">部门:</label>\
						<div class="col-sm-8">\
							<input class="form-control username" type="text" placeholder="" require>\
						</div>\
					</div>\
					<div class="form-group">\
						<label class="col-sm-2 control-label" for="formGroupInputDefault">职务:</label>\
						<div class="col-sm-8">\
							<input class="form-control username" type="text" placeholder="" require>\
						</div>\
					</div>\
				</li>');
				$addExtra.find('ul.extra-list').append($temp);
				setDelDept($temp);
			});

			var setDelDept = function(dom){
				dom.find('.extra-item-del').on('click',function(e){
					e.stopPropagation();
					var c = $(this),index = c.parent('li.extra-item').index();
					c.parent('li.extra-item').remove();
				});
			}

			setDelDept($addExtra.find('ul.extra-list li.extra-item'));
			
			// save & cancel
			$addUser.on('click',function(){
				// 添加人员到团队 /v1.0/org/user
				util.ajaxSubmit({
	                url: '/v1.0/org/user',
	                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	                data: {
					    "user_id":data.user_id,
					    "mobile_region":data.mobile_region,
					    "mobile":$addInfo.find('.usermobile').val(),
					    "department_ids":[data.department_id],
					    "nickname":$addInfo.find('.username').val(),
					    "employee_num":$addInfo.find('.employee_num').val()
	                },
	                success: function(res) {
	                    console.log("res",res);
	                }
	            });
			});

			// save & no cancel
			$addUserGo.on('click',function(){
				// 添加人员到团队 /v1.0/org/user
				util.ajaxSubmit({
	                url: '/v1.0/org/user',
	                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	                data: {
					    "user_id":data.user_id,
					    "mobile_region":data.mobile_region,
					    "mobile":$addInfo.find('.usermobile').val(),
					    "department_ids":[data.department_id],
					    "nickname":$addInfo.find('.username').val(),
					    "employee_num":$addInfo.find('.employee_num').val()
	                },
	                success: function(res) {
	                	$addUserCancel.trigger('click');
	                    console.log("res",res);
	                }
	            });
			});

			//cancel
			$addUserCancel.on('click',function(){
				kernel.closePanel('adduser');
			});
			
			
		    // 修改人员在团队组织中的信息 /v1.0/org/user/{user_id}
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