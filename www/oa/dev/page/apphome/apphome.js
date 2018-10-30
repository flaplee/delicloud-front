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
                var json = {
                    userid: userid,
                    token: token,
                    parentid: parentid
                }
                if(orgid) json.orgid = orgid;
            	if(locid == 'apphome'){
				    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink-group').show();
                    $usermenu.find('a.navlink-user').hide();
                    $usermenu.find('a.navlink-admin').hide();
                    $usermenu.find('a.navlink.appBtn').addClass('navlink-current');
                    getAppList($tmpIn, json);
            	};
            }
        }
    };

    function getAppList(o, w){
    	o.find('>').remove();
    	var timestamp = (new Date().valueOf()).toString();
    	// 已安装应用
    	util.ajaxSubmit({
    		type: 'get',
            url: '/v1.0/app/bind/'+ w.orgid,
            dauth: w.userid + ' ' + timestamp + ' ' + kernel.buildDauth(w.userid, w.token, timestamp),
            data: {
				'org_id': w.orgid
            },
            success: function(res) {
                //console.log("res",res);
                var data = res.data.result;
                var dataInner = [], dataUsers = [], dataDepts = [];
                if(data.length > 0){
                    for (var i = 0;i < data.length; i++) {
                        var dataVisible = data[i].visibility;
                        if(dataVisible){
                            dataInner = data[i].app;
                            if(dataInner.status == 'y'){
                                var $itemTpl = $('<div class="app-item" data-app_id="' + dataInner.id + '" title="' + dataInner.name + '">\
                                    <div class="item-icon-wrap">\
                                        <img class="item-icon" src="' + (dataInner.icon ? dataInner.icon : '') + '">\
                                    </div>\
                                    <div class="item-title">' + dataInner.name + '</div>\
                                    <div class="item-info"></div>\
                                </div>');
                                switch(dataVisible){
                                    case 1:
                                        o.append($itemTpl);
                                        setTargetApp($itemTpl, dataInner.web_url);
                                        break;
                                    case 2:
                                        for (var n = 0;n < data[i].departments.length; n++) {
                                            dataDepts.push(data[i].departments[n].id)
                                        }
                                        //if($.inArray(w.parentid, dataDepts) >= 0){}
                                        o.append($itemTpl);
                                        setTargetApp($itemTpl, dataInner.web_url);
                                        break;
                                    case 3:
                                        for (var j = 0;j < data[i].users.length; j++) {
                                            dataUsers.push(data[i].users[j].id)
                                        }
                                        if($.inArray(w.userid, dataUsers) >= 0){
                                            o.append($itemTpl);
                                            setTargetApp($itemTpl, dataInner.web_url);
                                        }
                                        break;
                                    default:;
                                }
                            }
                        };
                    }
                }

                o.append('<a class="app-item app-item-add '+ ((dataInner.length >= 8 && ((dataInner.length + 1) % 4 == 0)) ? 'app-item-radius-right' : ((dataInner.length >= 8 && (dataInner.length% 4 == 0)) ? 'app-item-radius-left' : '')) +'" href="/oa/#!app" title="安装新应用">\
					<div class="item-icon-wrap"></div>\
					<div class="item-title">安装新应用</div>\
					<div class="item-info"></div>\
				</a>');
            }
        });
    }

    function setTargetApp(o, url){
    	o.on('click',function(e){
			e.stopPropagation();
			window.location.href = ''+ url +'?user_id='+ userid +'&org_id='+ orgid +'&token='+ token +'&uuid=';
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