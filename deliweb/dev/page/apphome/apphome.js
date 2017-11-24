'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    return {
        onload: function(force) {
        	var loc = kernel.parseHash(location.hash);
        	var userid = util.getCookie('userid'),
        		token = util.getCookie('token'),
        		orgid = '355671868335718400';
        	var $appBox = $('#apphome .app-box'),
        		$tmpIn = $appBox.find('.app-main .app-installed .app-list.app-installed-list'),
        		$tmpRe = $appBox.find('.app-main .app-recommend .app-list.app-recommend-list');
        	;
        	$tmpIn.find('>').remove();
        	$tmpRe.find('>').remove();
        	// 已安装应用 /v1.0/app/bind/list
        	util.ajaxSubmit({
        		type: 'get',
	            url: '/v1.0/app',
	            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
	            data: {},
	            success: function(res) {
	                //console.log("res",res);
	                for (var i = 0; i < res.data.result.length; i++) {
	                	var itemTpl = '<div class="app-item" data-app_id="' + res.data.result[i].id + '" title="' + res.data.result[i].name + '">\
							<div class="item-icon-wrap">\
								<img class="item-icon" src="' + res.data.result[i].icon + '">\
							</div>\
							<div class="item-title">' + res.data.result[i].name + '</div>\
							<div class="item-operate">\
								<i class="icon icon-slide operate-slide"></i>\
								<div class="operate-inner">\
									<button class="app-btn-setting btn-default" type="button">添加</button>\
									<button class="app-btn-stop btn-default hide" type="button">停用</button>\
								</div>\
							</div>\
						</div>';
                        $tmpIn.append($(itemTpl));
                    }
                    $tmpIn.append('<a class="app-item app-item-add" href="javascript:;">\
						<div class="item-icon-wrap"></div>\
						<div class="item-title">安装新应用</div>\
					</a>');
                    setAddApp($tmpIn.find('.app-item'), $tmpIn.find('.app-item').attr('data-app_id'));
                    for (var i = 0; i < 2; i++) {
	                	var itemTpl = '<div class="app-item" data-app_id="' + res.data.result[i].id + '">\
							<div class="item-icon-wrap">\
								<img class="item-icon" src="' + res.data.result[i].icon + '">\
							</div>\
							<div class="item-title">' + res.data.result[i].name + '</div>\
							<div class="item-operate">\
								<i class="icon icon-slide operate-slide"></i>\
								<div class="operate-inner">\
									<button class="app-btn-setting btn-default" type="button">添加</button>\
									<button class="app-btn-stop btn-default hide" type="button">停用</button>\
								</div>\
							</div>\
						</div>';
                        $tmpRe.append($(itemTpl));
                    }
                    setAddApp($tmpRe.find('.app-item'), $tmpRe.find('.app-item').attr('data-app_id'));
                    setTargetUrl($('.app-item'));
	            }
	        });

	        function setAddApp(dom, appid){
	        	dom.find('.app-btn-setting').on('click',function(e){
	        		e.stopPropagation();
	        		util.ajaxSubmit({
		        		type: 'get',
			            url: '/v1.0/app/bind',
			            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
			            data: {
			            	"org_id":orgid,
							"app_id":appid
			            },
			            success: function(res) {
			            	//kernel.hint('添加成功');
			            }
			        });
	        	});
	        }

	        function setTargetUrl(dom){
	        	dom.on('click',function(){
	        		loc.id = 'appdetail';
	        		loc.args.appid = $(this).attr('data-app_id');
	        		window.location.href = kernel.buildHash(loc);
	        	});
	        }
        }
    };
});