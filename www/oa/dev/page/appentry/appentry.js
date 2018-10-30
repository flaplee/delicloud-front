'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid, token, orgid, orgindexadmin, orgname, parentid, loc, locid;
	var $appBox = $('#appentry .app-box'),
		$tmpIn = $appBox.find('.app-main .app-installed .app-list.app-installed-list');
	var loadHomeData = function(params){
        var timestamp = (new Date().valueOf()).toString(), data = {};
        //(params.orgid) ? (data.org_id = params.orgid ) : '';
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/user/me',
            dauth: params.userid + ' ' + timestamp + ' ' + kernel.buildDauth(params.userid, params.token, timestamp),
            data: data,
            success: function(res) {
                if(res.code == 0){
                    var json = res.data.organization;
                    if(json){
                        //切换组织时数据状态发生变化
                        var getUserData = util.getUserData(), getOrgIndex = util.getCookie('orgindex');
                        if(!util.isEqual(getUserData.organization[getUserData.orgindex], json[getOrgIndex])){
                            getUserData.orgindex = getOrgIndex;
                            getUserData.orgindexid = json[getOrgIndex].id;
                            util.setCookie('orgindex', getUserData.orgindex);
                            util.setCookie('orgindexid', getUserData.orgindexid);
                            if(getUserData.data.id == json[getOrgIndex].admin_id){
                                getUserData.orgindexadmin = true;
                                util.setCookie('orgindexadmin', true);
                                util.setUserData(getUserData);
                            }else{
                                getAdminList({
                                    userid: params.userid,
                                    token: params.token,
                                    orgid: params.orgid
                                }, function(res){
                                    console.log("orgindexadmin", res);
                                    getUserData.orgindexadmin = res;
                                    util.setCookie('orgindexadmin', res);
                                    util.setUserData(getUserData);
                                });
                            }
                        }
                        util.setCookie('orgname', json[getOrgIndex].name),
                        util.setCookie('orgtype', json[getOrgIndex].type),
                        util.setCookie('employee_count', json[getOrgIndex].employee_cnt);
                    }
                }
            }
        });
    }

    // 获取是否是子管理员
    function getAdminList(data, callback){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/group/'+ data.orgid +'',
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {},
            success: function(json) {
                if (json.code == 0) {
                    var admin_ids = []
                    if(json.data['result'].length > 0){
                        $.each(json.data['result'], function(i, item) {
                            $.each(item.admin_ids, function(j, inner) {
                                admin_ids.push(inner)
                            });
                        });
                    }
                    if(typeof callback === 'function'){
                        callback(($.inArray(data.userid, admin_ids) >= 0) ? true : false);
                    }
                } else {
                    kernel.hint(json.msg);
                }
            },
            error: function(res){
                kernel.hint(res.msg);
            }
        });
    }

    //获取应用列表
    function getAppList(o, w){
        o.find('>').remove();
        var timestamp = (new Date().valueOf()).toString();
        // 已安装应用
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/app/bind/' + w.orgid,
            dauth: w.userid + ' ' + timestamp + ' ' + kernel.buildDauth(w.userid, w.token, timestamp),
            data: {},
            success: function(res) {
                //console.log("res",res);
                console.log("res.data.result.length", res.data.result.length);
                var data = res.data.result;
                var dataInner = [], dataUsers = [], dataDepts = [];
                if(data.length > 0){
                    o.find('>').remove();
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
                }else{
                    var $emptyTpl = $('<div class="empty empty-app"><div class="empty-item"><div class="empty-img empty-img-app"></div><p class="empty-text">暂无应用</p></div></div>');
                    o.append($emptyTpl);
                }
            }
        });
    }

    //设置目标路径
    function setTargetApp(o, url){
        o.on('click',function(e){
            e.stopPropagation();
            window.location.href = ''+ url +'?user_id='+ userid +'&org_id='+ orgid +'&token='+ token +'&uuid=';
        });
    }

    return {
        onload: function(force) {
			userid = util.getCookie('userid'),
			token = util.getCookie('token'),
			orgid = util.getCookie('orgid'),
			orgname = util.getCookie('orgname'),
			parentid = util.getCookie('parentid'),
            orgindexadmin = util.getCookie('orgindexadmin');
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
            	if(locid == 'appentry'){
            		var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink-group').hide();
                    $usermenu.find('a.navlink-user').show();
                    $usermenu.find('a.navlink-admin').hide();
                    $usermenu.find('a.navlink.entryBtn').addClass('navlink-current');
                    if(orgindexadmin && orgindexadmin == 'true'){
                        $usermenu.find('a.navlink-admin').show();
                    }
                    getAppList($tmpIn, json);
            	};
                //loadHomeData(json);
            }
        }
    };
});