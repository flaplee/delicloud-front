'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util','page/device/device'], function(module, kernel, util, device) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $editInfo = $dom.find('.form-group input.devicename'),
        $btnSave = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    return {
        onload: function(params) {
            console.log("params", params);
            var data = params.data;
            $editInfo.val(data.name);
            $btnSave.off('click').on('click',function(){
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/device/'+ data.devid +'/name',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        name: $editInfo.val()
                    },
                    success: function(res) {
                        kernel.hint('保存成功', 'success');
                        kernel.closePopup('editdevice');
                        device.getDeviceSub(userid, token, orgid, $('#device .dev-box').find('.dev-main .dev-installed .dev-wrap table.table tbody.tbody'));
                    },
                    error(res){
                        kernel.closePopup('editdevice');
                    }
                });
            });
            $btnClose.off('click').on('click',function(){
                kernel.closePopup('editdevice');
            });
        }
    };
});