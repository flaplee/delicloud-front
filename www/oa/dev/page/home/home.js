'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var loc, locid, userid, token, orgid, orgname, parentid, device_ids, app_ids, employee_count, orgindex;
    var $homeBox = $('#home .home-box'),
        $homeRecord = $homeBox.find('.home-record'),
        $homeLogo = $homeRecord.find('.record-top div.logo'),
        $homeName = $homeRecord.find('.record-top p.text'),
        $homeDev = $homeRecord.find('.record-main .device span em'),
        $homeApp = $homeRecord.find('.record-main .app span em'),
        $homeCount = $homeRecord.find('.record-main .count span em'),
        $homeIndex = $homeBox.find('.home-index'),
        $bn = $homeIndex.find('.banner'),
        $bnav = $homeIndex.find('.bannerNav');
    var loadHomeData = function(params){
        var timestamp = (new Date().valueOf()).toString(), data = {};//type: 'group'
        (params.orgid) ? (data.org_id = params.orgid ) : '';
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/user/me',
            dauth: params.userid + ' ' + timestamp + ' ' + kernel.buildDauth(params.userid, params.token, timestamp),
            data: data,
            success: function(res) {
                if(res.code == 0){
                    var json = res.data.organization;
                    if(json){
                        var getUserData = util.getUserData(), getOrgIndex = util.getCookie('orgindex');
                        if(!util.isEqual(getUserData.organization[getOrgIndex],json[getOrgIndex])){
                            getUserData.organization[getOrgIndex] = json[getOrgIndex];
                            util.setUserData(getUserData);
                        };
                        util.setCookie('orgname', json[getOrgIndex].name),
                        util.setCookie('orgtype', json[getOrgIndex].type),
                        //util.setCookie('device_ids', (json[getOrgIndex].device_ids ? json[getOrgIndex].device_ids.length : 0)),
                        //util.setCookie('app_ids', (json[getOrgIndex].app_ids ? json[getOrgIndex].app_ids.length : 0)),
                        util.setCookie('employee_count', json[getOrgIndex].employee_cnt);
                        $homeLogo.html((json[getOrgIndex].type == 'group' ? '<i class="iconfont">&#xe643;</i>' : '<i class="iconfont">&#xe642;</i>'))
                        $homeName.text(json[getOrgIndex].name);
                        //$homeDev.text((json[getOrgIndex].device_ids ? json[getOrgIndex].device_ids.length : 0));
                        //$homeApp.text((json[getOrgIndex].app_ids ? json[getOrgIndex].app_ids.length : 0));
                        $homeCount.text(json[getOrgIndex].employee_cnt);
                    }
                }
            }
        });
    }
    return {
        onload: function(force) {
            loc = kernel.parseHash(location.hash),
            locid = loc.id,
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid'),
            device_ids = util.getCookie('device_ids'),
            app_ids = util.getCookie('app_ids'),
            employee_count = util.getCookie('employee_count'),
            orgindex = util.getCookie('orgindex');
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                var json = {
                    userid: userid,
                    token: token
                }
                if(orgid) json.orgid = orgid;
                if(locid == 'home'){
                    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink-group').show();
                    $usermenu.find('a.navlink-user').hide();
                    $usermenu.find('a.navlink-admin').hide();
                    $usermenu.find('a.navlink.homeBtn').addClass('navlink-current');
                };
                loadHomeData(json);
            }
        }
    };
});