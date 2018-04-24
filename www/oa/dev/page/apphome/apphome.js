'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid, token, orgid, orgname, parentid, loc, locid;
	var $appBox = $('#apphome .app-box'),
		$tmpIn = $appBox.find('.app-main .app-installed .app-list.app-installed-list');
    return {
        onload: function(force) {
			userid = util.getCookie('userid'),
			token = util.getCookie('token'),
			orgid = util.getCookie('orgid'),
			orgname = util.getCookie('orgname'),
			parentid = util.getCookie('parentid');
        	loc = kernel.parseHash(location.hash), locid = loc.id;
        	if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
            	if(locid == 'apphome'){
            		var $usermenu = $('#header .user-head .nav-top .nav-item');
				    $usermenu.find('a.navlink').removeClass('navlink-current');
				    $usermenu.find('a.navlink.appBtn').addClass('navlink-current');
            	};
            	getAppList($tmpIn);
            }
        }
    };

    function getAppList(o){
    	o.find('>').remove();
    	var timestamp = (new Date().valueOf()).toString();
    	// 已安装应用
    	util.ajaxSubmit({
    		type: 'get',
            url: '/v1.0/admin/app/my', // '/v1.0/app/bind/'+ orgid
            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
            data: {
				'org_id':orgid
            },
            success: function(res) {
                //console.log("res",res);
                var data = res.data.result;
                if(data.length > 0){
	                for (var i = 0;i < data.length; i++) {
	                	var dataInner = data[i].binds; 
	                	for(var j = 0;j < dataInner.length; j++){
	                		var $itemTpl = $('<div class="app-item" data-app_id="' + dataInner[j].id + '" title="' + dataInner[j].app.name + '">\
								<div class="item-icon-wrap">\
									<img class="item-icon" src="' + (dataInner[j].app.icon ? dataInner[j].app.icon : '') + '">\
								</div>\
								<div class="item-title">' + dataInner[j].app.name + '</div>\
								<div class="item-info"></div>\
							</div>');
		                    o.append($itemTpl);
		                    setTargetApp($itemTpl, dataInner[j].app.web_url);
		                    function setTargetApp(o, url){
					        	o.on('click',function(e){
					        		e.stopPropagation();
					        		window.location.href = ''+ url +'?user_id='+ userid +'&org_id='+ orgid +'&token='+ token +'&uuid=';
					        	});
					        }
	                	}
	                }
                }

                o.append('<a class="app-item app-item-add" href="/oa/#!app" title="安装新应用">\
					<div class="item-icon-wrap"></div>\
					<div class="item-title">安装新应用</div>\
					<div class="item-info"></div>\
				</a>');
                //setAddApp(o.find('.app-item'), o.find('.app-item').attr('data-app_id'));
                //setTargetUrl(o.find('.app-item'));
            }
        });
    }

	// 添加应用
	function setAddApp(o, appid){
		o.find('.app-btn-setting').on('click',function(e){
			e.stopPropagation();
			var timestamp = (new Date().valueOf()).toString();
			util.ajaxSubmit({
	    		type: 'get',
	            url: '/v1.0/app/bind',
	            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
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

	// 跳转至应用详情
	function setTargetUrl(o){
		o.on('click',function(){
			loc.id = 'appdetail';
			loc.args.appid = $(this).attr('data-app_id');
			window.location.href = kernel.buildHash(loc);
		});
	}
});