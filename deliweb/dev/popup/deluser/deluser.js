'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    return {
        onload: function(param) {
            var userid = util.getCookie('userid'),
                token = util.getCookie('token');
            console.log("param",param);
            $btnConfirm.on('click',function(){
                // 将人员从团队组织中删除 /v1.0/org/user/delete
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/user/delete',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "user_ids": param.ids,
                        "org_id": param.orgid
                    },
                    success: function(res) {
                        kernel.closePopup('deluser');
                        //console.log("res", res);
                        if(res.code == 0){
                            kernel.hintIcon('success',{
                                title: '成员信息已删除',
                                desc:''
                            }, 1000);
                        }else{
                            kernel.hintIcon('error',{
                                title: '彻底删除失败',
                                desc:'成员在其他部门任职，您可以选择将其从本部门移除'
                            }, 4000);
                        }
                    }
                });
            });

            $btnClose.on('click',function(){
                kernel.closePopup('deluser');
            });
        }
    };
});