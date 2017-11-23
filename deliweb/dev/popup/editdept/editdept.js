'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $editInfo = $dom.find('.form-group input.deptname'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnCancel = $dom.find('.btn-cancel');
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = '355671868335718400';
    return {
        onload: function(param) {
            var data = param.data;
            $editInfo.val(data.name);
            $btnConfirm.on('click',function(){
                util.ajaxSubmit({
                    type:'post',
                    url: '/v1.0/org/department/'+ data.id +'',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "name" : $editInfo.val()
                    },
                    success: function(res) {
                        console.log("res",res);
                    },
                    error(res){
                        kernel.closePopup('editdept');
                    }
                });
            });
            $btnCancel.on('click',function(){
                kernel.closePopup('editdept');
            });
        }
    };
});