'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
	var userid = util.getCookie('userid'),
		token = util.getCookie('token'),
		//orgid = '355671868335718400';
		orgid = util.getCookie('orgid');
	var $devBox = $('#device .dev-box'),
		$tmp = $devBox.find('.dev-main .dev-installed .dev-wrap table.table tbody.tbody');
	;
	$tmp.find('>').remove();
	// 我可管理的设备
	util.ajaxSubmit({
		type: 'get',
        url: '/v1.0/app',
        dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
        data: {},
        success: function(res) {
            //console.log("res",res);
            var json = res.data.result;
            for (var i = 0; i < json.length; i++) {
            	var itemTpl = '<tr class="dev-item" data-dev_id="123456">\
					<td class="item-desc">\
						<div class="item-img fl">\
							<img src="dev/page/device/images/device.png" width="30px" height="30px" />\
						</div>\
						<div class="item-text fl">\
							<p>指纹考勤机396</p>\
							<p>0w-234</p>\
						</div>\
					</td>\
					<td class="item-title">得力指纹考勤机1代</td>\
					<td class="item-status"><span class="status-online">在线</span></td>\
					<td class="item-app">\
						<span class="app-name">智能考勤</span>\
						<span class="app-name">智能门禁</span>\
					</td>\
					<td class="item-delact">\
					<a href="javascript:;" class="button button-red btn-dev-delete-item">删除设备</a>\
					<a href="javascript:;" class="button button-orange btn-dev-rename-item">修改设备名称</a>\
						<a href="javascript:;" class="button btn-dev-bind-item">绑定其他应用</a>\
					</td>\
				</tr>';
                $tmp.append($(itemTpl));
            }
            setOperates($tmp.find('.dev-item'), $tmp.find('.dev-item').attr('data-dev_id'));
        }
    });
    function setOperates(o, devid){
    	// setbindApp
    	o.find('.btn-dev-bind-item').on('click',function(){
    		util.ajaxSubmit({
        		type: 'get',
	            url: '/v1.0/bind/device',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {
	            	"org_id":orgid,
					"dev_id":devid
	            },
	            success: function(res) {
	            	//kernel.hint('添加成功');
	            }
	        });
    	});
    	// setEditDevice
    	o.find('.btn-dev-rename-item').on('click',function(){
    		kernel.openPopup('editdevice', {
				type:'editdevice',
            	data:{
            		id:'123456',
            		name:'指纹考勤机396 0w-234'
            	}
			});
			/*util.ajaxSubmit({
        		type: 'get',
	            url: '/v1.0/device/edit',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {
	            	"org_id":orgid,
					"dev_id":devid
	            },
	            success: function(res) {
	            	//kernel.hint('添加成功');
	            }
	        });*/
    	});

    	// setDelDevice
    	o.find('.btn-dev-delete-item').on('click',function(){
    		kernel.confirm('删除设备后该设备将从所有已绑定应用中解绑，你确定要删除吗',function(sure){
    			if(sure){
    				util.ajaxSubmit({
		        		type: 'get',
			            url: '/v1.0/device/delete',
			            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
			            data: {
			            	"org_id":orgid,
							"dev_id":devid
			            },
			            success: function(res) {
			            	//kernel.hint('添加成功');
			            }
			        });
    			}
    		});
    	});
    }
    return {
        onload: function(force) {
        }
    };
});