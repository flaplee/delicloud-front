'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $editInfo = $dom.find('.form-group input.devicename'),
        $btnSave = $dom.find('.btn-save'),
        $btnClose = $dom.find('.btn-close');
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = '355671868335718400';
    return {
        onload: function(param) {
            var data = param.data;
            $editInfo.val(data.name);
            $btnSave.on('click',function(){
                util.ajaxSubmit({
                    type: 'get',
                    url: '/v1.0/devicev/rename',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        devid:data.id,
                        devname:$editInfo.val()
                    },
                    success: function(res) {
                        //kernel.hint('添加成功');
                    },
                    error(res){
                        kernel.closePopup('editdevice');
                    }
                });
            });
            $btnClose.on('click',function(){
                kernel.closePopup('editdevice');
            });
        }
    };
});