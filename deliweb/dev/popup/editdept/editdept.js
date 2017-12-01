'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var oid, pid, text, type, name;
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
        $btnConfirm.on('click',function(){
            if(type == 'rename' || type == 'edit'){
                //部门重命名  修改部门信息 /v1.0/org/department/{department_id}
                util.ajaxSubmit({
                    type:'post',
                    url: '/v1.0/org/department/'+ $editInfo.attr('data-id') +'',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "org_id": oid,
                        "name" : $editInfo.val(),
                        "parent_id": pid 
                    },
                    success: function(res) {
                        console.log("res",res);
                    },
                    error(res){
                        kernel.closePopup('editdept');
                    }
                });
            }else if(type == 'add'){
                // 添加部门 /v1.0/org/department
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                    data: {
                        "org_id": oid,
                        "name" : $editInfo.val(),
                        "parent_id": pid
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            }
        });
        $btnClose.on('click',function(){
            kernel.closePopup('editdept');
        });
    return {
        onload: function(param) {
            var data = param.data;
            type = param.type, oid = data.id, pid = data.pid, text = data.text, name = data.name;
            $editInfo.attr('data-id', oid);
            $editInfo.val(name);
            $formText.text(text);
        }
    };
});