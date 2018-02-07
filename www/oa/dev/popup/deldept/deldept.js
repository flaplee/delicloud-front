'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var data, title, func;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $delTitle = $dom.find('.del-title'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
        
    return {
        onload: function(params) {
            console.log("params", params);
            data = params.data, func = params.func;
            $delTitle.text(data.title);
            $btnConfirm.off('click').on('click',function(){
                if(func && typeof func === 'function'){
                    func();
                }
                //删除部门信息 /v1.0/org/department/delete
               /* util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/delete',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "department_id": data.orgid
                    },
                    success: function(res) {
                        console.log("res", res);
                        if(res.code == 0){
                            kernel.hint('部门删除成功~', 3000);
                            kernel.closePopup('deldept');
                            if(func && typeof func === 'function'){
                                func();
                            }
                        }else{
                            kernel.hint(res.msg, 3000);
                            kernel.closePopup('deldept');
                        }
                    }
                });*/
                // 将人员从团队组织中删除 /v1.0/org/user/delete
                /*util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/user/delete',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "user_ids": data.uids,
                        "org_id": data.oids
                    },
                    success: function(res) {
                        kernel.closePopup('deldept');
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
                });*/
            });

            $btnClose.off('click').on('click',function(){
                kernel.closePopup('deldept');
            });
        }
    };
});