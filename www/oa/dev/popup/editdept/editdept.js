'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
    var oid, pid, text, type, name, callFunc;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        parentid = util.getCookie('parentid');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $formText = $dom.find('.form-group p.form-text'),
        $editInfo = $dom.find('.form-group .form-name input.deptname'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');

    return {
        onload: function(params) {
            console.log("params", params);
            var data = params.data;
            type = params.type, oid = data.id, pid = data.pid, text = data.text, name = data.name, callFunc = params.func;
            $editInfo.attr('data-id', oid);
            $editInfo.val(name);
            $formText.text(text);

            $btnConfirm.off('click').on('click',function(){
                if(type == 'rename' || type == 'edit'){
                    var msg = '部门重命名成功~';
                    //部门重命名  修改部门信息 /v1.0/org/department/{department_id}
                    util.ajaxSubmit({
                        type:'post',
                        url: '/v1.0/org/department/'+ $editInfo.attr('data-id') +'/name',
                        dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                        data: {
                            "org_id": oid,
                            "name" : $editInfo.val(),
                            "parent_id": pid 
                        },
                        success: function(res) {
                            console.log("res",res);
                            if(res && res.code == 0){
                                kernel.closePopup('editdept');
                                kernel.hint(msg, 3000);
                                if(callFunc && typeof callFunc === 'function'){
                                    callFunc();
                                }
                            }else{
                                kernel.hint(res.msg, 3000);
                            }
                        },
                        error(res){
                            kernel.hint(res.msg, 3000);
                            kernel.closePopup('editdept');
                        }
                    });
                }else if(type == 'add'){
                    var msg = '添加部门成功~';
                    // 添加部门 /v1.0/org/department
                    util.ajaxSubmit({
                        type: 'post',
                        url: '/v1.0/org/department',
                        dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                        data: {
                            "org_id": pid, // update 2017-12-12 pid、oid 两个值交换
                            "name" : $editInfo.val(),
                            "parent_id": oid
                        },
                        success: function(res) {
                            console.log("res",res);
                            if(res && res.code == 0){
                                kernel.closePopup('editdept');
                                kernel.hint(msg, 3000);
                                if(callFunc && typeof callFunc === 'function'){
                                    callFunc();
                                }
                            }else{
                                kernel.hint(res.msg, 3000);
                            }
                        },
                        error(res){
                            kernel.hint(res.msg, 3000);
                            kernel.closePopup('editdept');
                        }
                    });
                }
            });
            $btnClose.off('click').on('click',function(){
                kernel.closePopup('editdept');
            });
        }
    };
});