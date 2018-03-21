'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var loc, locid, userid, token, orgid, orgname, parentid, device_ids, app_ids, employee_count;
    var $homeBox = $('#home .home-box'),
        $homeRecord = $homeBox.find('.home-record'),
        $homeName = $homeRecord.find('.record-top p.text'),
        $homeDev = $homeRecord.find('.record-main .device span em'),
        $homeApp = $homeRecord.find('.record-main .app span em'),
        $homeCount = $homeRecord.find('.record-main .count span em'),
        $homeIndex = $homeBox.find('.home-index'),
        $bn = $homeIndex.find('.banner'),
        $bnav = $homeIndex.find(' .bannerNav');
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
            employee_count = util.getCookie('employee_count');
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                if(locid == 'home'){
                    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink.homeBtn').addClass('navlink-current');
                };
                if(orgname && device_ids && app_ids && employee_count){
                    $homeName.text(orgname);
                    $homeDev.text(device_ids);
                    $homeApp.text(app_ids);
                    $homeCount.text(employee_count);
                }
            }
        }
    };
});