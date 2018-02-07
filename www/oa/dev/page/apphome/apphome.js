'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/orghome/orghome'], function(module, kernel, util, orghome) {
	var userid, token, orgid, orgname, parentid, loc, locid;
	userid = util.getCookie('userid'),
	token = util.getCookie('token'),
	orgid = util.getCookie('orgid'),
	orgname = util.getCookie('orgname'),
	parentid = util.getCookie('parentid');
	var $appBox = $('#apphome .app-box'),
		$tmpIn = $appBox.find('.app-main .app-installed .app-list.app-installed-list');
	var $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'), $orgNavList = $navTeam.find('.son-nav-list-team');
	orghome.switchOrgs($orgNavList, {
        userid: userid,
        token: token,
        orgid: orgid,
        orgname: orgname
    });
    return {
        onload: function(force) {
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
    	// 已安装应用
    	util.ajaxSubmit({
    		type: 'get',
            url: '/v1.0/app/bind/'+ orgid,
            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
            data: {},
            success: function(res) {
                //console.log("res",res);
                var data = res.data.result;
                for (var i = 0; i < data.length; i++) {
                	var $itemTpl = $('<div class="app-item" data-app_id="' + data[i].id + '" title="' + data[i].app.name + '">\
						<div class="item-icon-wrap">\
							<img class="item-icon" src="' + data[i].app.icon + '">\
						</div>\
						<div class="item-title">' + data[i].app.name + '</div>\
						<div class="item-info"></div>\
					</div>');
                    o.append($itemTpl);
                    setTargetApp($itemTpl, data[i].app.web_url);
                    function setTargetApp(o, url){
			        	o.on('click',function(e){
			        		e.stopPropagation();
			        		window.location.href = ''+ url +'?user_id='+ userid +'&org_id='+ orgid +'&token='+ token +'&uuid=';
			        	});
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

	// 跳转至应用详情
	function setTargetUrl(o){
		o.on('click',function(){
			loc.id = 'appdetail';
			loc.args.appid = $(this).attr('data-app_id');
			window.location.href = kernel.buildHash(loc);
		});
	}
});