'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/orghome/orghome'], function(module, kernel, util, orghome) {
    var userid, token, orgid, orgname, parentid, idata;
    userid = util.getCookie('userid'),
    token = util.getCookie('token'),
    orgid = util.getCookie('orgid'),
    orgname = util.getCookie('orgname'),
    parentid = util.getCookie('parentid'),
    idata = util.getCookie('idata');
    var $homeBox = $('#home .home-box'),
        $homeRecord = $homeBox.find('.home-record'),
        $homeDev = $homeRecord.find('.record-main .device span em'),
        $homeApp = $homeRecord.find('.record-main .app span em'),
        $homeCount = $homeRecord.find('.record-main .count span em'),
        $homeIndex = $homeBox.find('.home-index'),
        $bn = $homeIndex.find('.banner'),
        $bnav = $homeIndex.find(' .bannerNav');
    var $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'), $orgNavList = $navTeam.find('.son-nav-list-team');
    orghome.switchOrgs($orgNavList, {
        userid: userid,
        token: token,
        orgid: orgid,
        orgname: orgname
    });
    return {
        onload: function(force) {
            if(userid === undefined || token === undefined || orgid === undefined || idata === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                if(idata){
                    var data = JSON.parse(idata);
                    $homeDev.text(data.device_ids);
                    $homeApp.text(data.app_ids);
                    $homeCount.text(data.employee_count);
                }
                util.getUserData();
            }
        }
    };
});