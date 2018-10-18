'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var userid, token, orgid, orgname, parentid, loc, appid;
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid');
            loc = kernel.parseHash(location.hash), appid = loc.args.appid;
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                if(locid == 'appdetail'){
                    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink-group').show();
                    $usermenu.find('a.navlink-user').hide();
                    $usermenu.find('a.navlink-admin').hide();
                    $usermenu.find('a.navlink.appBtn').addClass('navlink-current');
                };
            }
        }
    };
});