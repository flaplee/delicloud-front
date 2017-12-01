'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    var uids, oid;
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
        
    $btnConfirm.on('click',function(){
        util.ajaxSubmit({
            type: 'post',
            url: '/v1.0/org/department/'+ oid +'/move',
            data: {
                user_ids: uids
            },
            success: function(res) {
                console.log("res",res);
                setTimeout(function(){
                    kernel.closePopup('adddept');
                },1000);
            }
        });
    });

    $btnClose.on('click',function(){
        kernel.closePopup('adddept');
    });

    return {
        onload: function(params) {
            oid = params.data.org_id, uids = params.data.user_ids;
            console.log("params", params);
        }
    };
});