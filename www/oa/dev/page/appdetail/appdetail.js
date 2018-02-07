'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/orghome/orghome'], function(module, kernel, util, orghome) {
    var userid, token, orgid, orgname, parentid, loc, appid;
    userid = util.getCookie('userid'),
    token = util.getCookie('token'),
    orgid = util.getCookie('orgid'),
    orgname = util.getCookie('orgname'),
    parentid = util.getCookie('parentid');
    var $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'), $orgNavList = $navTeam.find('.son-nav-list-team');
    orghome.switchOrgs($orgNavList, {
        userid: userid,
        token: token,
        orgid: orgid,
        orgname: orgname
    });
    return {
        onload: function(force) {
            loc = kernel.parseHash(location.hash),appid = loc.args.appid;
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }
            util.ajaxSubmit({
                type:'get',
                url: '/v1.0/cd/app/'+ appid +'',
                "dauth": userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {},
                success: function(res) {
                    console.log("res",res);
                }
            });
        }
    };
});