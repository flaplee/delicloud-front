'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/slider/slider'], function(module, kernel, util, slider) {
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var $homeBox = $('#home .home-box'),
        $homeRecord = $homeBox.find('.home-record'),
        $homeIndex = $homeBox.find('.home-index'),
        $bn = $homeIndex.find('.banner'),
        $bnav = $homeIndex.find(' .bannerNav'),
        banner = slider($bn, undefined, undefined, $bnav);
    banner.startPlay(10000);
    return {
        onload: function(force) {
            /*util.ajaxSubmit({
                type:'get',
                url: '/v1.0/user/me',
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {},
                success: function(json) {
                    if(json.code == 0){
                    }else{
                        kernel.hint(json.msg);
                    }
                }
            });*/
        }
    };
});