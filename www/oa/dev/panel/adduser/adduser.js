'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
	var thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		$dom = $('#' + thisPanel),
		$addWrap = $dom.find('.add-user'),
		$addInner = $addWrap.find('.add-inner'),
		$addInfo  = $addInner.find('.add-form .add-form-base'),
		$addExtra = $addInner.find('.add-form .add-form-extra'),
		$addExtraList = $addExtra.find('.extra-list'),
		$addBtn = $addInner.find('.add-form-btn'),
		$addFromUser = $addInfo.find('.btn-to-user'),
		$addBtns = $addInner.find('.add-btns'),
		$addDeptMore = $addBtn.find('.btn-add-more'),
		$addUser = $addBtns.find('.btn-add-user'),
		$addUserGo = $addBtns.find('.btn-add-user-go'),
		$addUserCancel = $addBtns.find('.btn-add-cancel');
	return {
		onload: function(params) {
			console.log("contacts", contacts);
			var userid = util.getCookie('userid'),
				token = util.getCookie('token'),
				parentid = util.getCookie('parentid');
			var type = params.type,data = params.data;
			console.log("data.uid", data);
			if(type && type == 'edit'){
				var departmentText = (data.departmentid == data.orgid) ? '' : data.department;
				$addWrap.find('h4').text('编辑成员');
				$addInfo.find('.username').val($.trim(data.nickname));
				$addInfo.find('.usermobile').attr('disabled','disabled').val($.trim(data.mobile));
				$addInfo.find('.employee_num').val($.trim(data.employee_num));
				$addExtra.find('.extra-item-index .department').val($.trim(departmentText));
				$addExtra.find('.extra-item-index .departmentId').val($.trim(data.departmentid));
				$addExtra.find('.extra-item-index .business').val($.trim(data.title));
				$addFromUser.hide();
				$addUserGo.hide();
			}else{
				var departmentId = (data.isParentid.length > 0) ? data.isParentid : '';
				$addWrap.find('h4').text('添加成员');
				$addInfo.find('.username').val('');
				$addInfo.find('.usermobile').attr('disabled', false).val('');
				$addInfo.find('.employee_num').val('');
				$addExtra.find('.extra-item-index .department').val('');
				$addExtra.find('.extra-item-index .departmentId').val(departmentId);
				$addExtra.find('.extra-item-index .business').val('');
				$addFromUser.show();
				$addUserGo.show();
			}

			// 默认部门 和 职务
			$addExtraList.find('li.extra-item-index.extra-item a.btn-to-dept').off('click').on('click',function(e){
				e.stopPropagation();
				var c = $(this), index = c.parents('li.extra-item').index();
				// 选择部门
	            kernel.openPopup('adddept', {
	                type: 'seldept',
	                data: {
	                	index: index,
	                    "org_id": data.orgid,
	                    "parentid": parentid
	                }
	            });
			});

			// 从其他部门添加
			$addFromUser.off('click').on('click', function() {
		        // 从部门中选择
		        kernel.openPopup('finduser', {
		            type: 'finduser',
		            data: {
	                    "orgid": data.orgid,
	                    "orgname": data.orgname,
	                    "parentid": parentid
	                }
		        });
		    });

			// 继续增加部门及职务
			$addDeptMore.off('click').on('click',function(e){
				e.stopPropagation();
				var $temp = $('<li class="extra-item">\
					<a href="javascript:;" class="extra-item-del">删除</a>\
					<div class="form-group">\
						<label class="col-sm-2 control-label" for="formGroupInputDefault">部门:</label>\
						<div class="col-sm-8">\
							<input class="form-control department" name="department" type="text" placeholder="" require>\
							<input class="form-control departmentId" name="departmentId" type="hidden">\
							<a class="btn-to-dept" href="javascript:;"></a>\
						</div>\
					</div>\
					<div class="form-group">\
						<label class="col-sm-2 control-label" for="formGroupInputDefault">职务:</label>\
						<div class="col-sm-8">\
							<input class="form-control business" name="business" type="text" placeholder="" require>\
						</div>\
					</div>\
				</li>');
				$addExtra.find('ul.extra-list').append($temp);

				setToDept($temp);

				function setToDept(o){
					o.find('a.btn-to-dept').on('click',function(e){
						e.stopPropagation();
						var c = $(this), index = c.parents('li.extra-item').index();
						// 选择部门
			            kernel.openPopup('adddept', {
			                type: 'seldept',
			                data: {
			                	index: index,
			                    "org_id": data.orgid,
			                    "parentid": parentid
			                }
			            });
					});
					o.find('a.extra-item-del').on('click',function(e){
						e.stopPropagation();
						var c = $(this), index = c.parents('li.extra-item').index();
						c.parent('li.extra-item').remove();
					});
				}
			});

			//setToDept($addExtra.find('ul.extra-list li.extra-item'));
			
			// save & cancel
			$addUser.off('click').on('click',function(){
				var titles = [], dids = [], temp = {
					"mobile_region":data.mobile_region,
				    "mobile":$addInfo.find('.usermobile').val(),
				    "nickname":$addInfo.find('.username').val(),
				    "employee_num":$addInfo.find('.employee_num').val()
				};
				$addExtra.find('ul.extra-list li.extra-item').each(function(i, o){
					dids.push($(o).find('.form-group input.departmentId').val());
					titles.push($(o).find('.form-group input.business').val());
				});
				temp.titles = titles,
				temp.department_ids = (dids && dids.length > 0) ? dids : data.parentids,
				(type && type == 'edit') ? temp.user_id = ((data.userid && data.userid.length > 0) ? data.userid : $addInner.attr('data-userid')) : '';
				// 添加人员到团队 /v1.0/org/user
				util.ajaxSubmit({
	                url: '/v1.0/org/user' + ((type && type == 'edit')? '/'+ ((data.userid && data.userid.length > 0) ? data.userid : $addInner.attr('data-userid')) +'':''),
	                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	                data: temp,
	                success: function(res) {
	                    if(res && res.code == 0){
	                    	$addUserCancel.trigger('click');
	                    	kernel.hint(res.msg || ((type && type == 'edit') ? '编辑成员信息成功~' : '添加成员成功~'), 3000);
	                    	contacts.initContacts($('#contacts .contacts-box .contacts-inner tbody.tbody'), {
		                        orgid: data.orgid, //data.id
		                        type: data.type,
		                        title: data.orgname
		                    });
	                    }
	                }
	            });
			});

			// save & no cancel
			$addUserGo.off('click').on('click',function(){
				var titles = [], dids = [], temp = {
					"mobile_region":data.mobile_region,
				    "mobile":$addInfo.find('.usermobile').val(),
				    "nickname":$addInfo.find('.username').val(),
				    "employee_num":$addInfo.find('.employee_num').val()
				};
				$addExtra.find('ul.extra-list li.extra-item').each(function(i, o){
					dids.push($(o).find('.form-group input.departmentId').val());
					titles.push($(o).find('.form-group input.business').val());
				});
				temp.titles = titles,
				temp.department_ids = (dids && dids.length > 0) ? dids : data.parentids,
				(type && type == 'edit') ? temp.user_id = ((data.userid && data.userid.length > 0) ? data.userid : $addInner.attr('data-userid')) : '';
				// 添加人员到团队 /v1.0/org/user
				util.ajaxSubmit({
	                url: '/v1.0/org/user' + ((type && type == 'edit')? '/'+ ((data.userid && data.userid.length > 0) ? data.userid : $addInner.attr('data-userid')) +'':''),
	                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	                data: temp,
	                success: function(res) {
	                    if(res && res.code == 0){
	                    	$addUserCancel.trigger('click');
	                    	kernel.hint(res.msg || ((type && type == 'edit') ? '编辑成员信息成功~' : '添加成员成功~'), 3000);
	                    	contacts.initContacts($('#contacts .contacts-box .contacts-inner tbody.tbody'), {
		                        orgid: data.orgid, //data.id
		                        type: data.type,
		                        title: data.orgname
		                    });
	                    }
	                }
	            });
			});

			//cancel
			$addUserCancel.off('click').on('click',function(){
				kernel.closePanel('adduser');
			});
		
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