'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        dom = $('#' + thisPopup),
        form = dom.find('form'),
        uid = dom.find('.username'),
        pwd = dom.find('.password');
    form.on('submit', function() {
        // 登录 /v1.0/login
        util.ajaxSubmit({
            url: '/v1.0/login',
            type: 'post',
            data: {
                mobile_region:'86',
                mobile: uid.val(),
                pwd: hex_md5(pwd.val())
            },
            success: function(json) {
                util.setCookie('username', uid.val(), 9999);
                util.setCookie('password', pwd.val(), 9999);
                kernel.closePopup(thisPopup);
                kernel.hint('登录成功', 'success');
            }
        });
        return false;
    });

    return {
        onload: function() {
            uid.val(util.getCookie('username'));
            pwd.val(util.getCookie('password'));
        }
    };
});