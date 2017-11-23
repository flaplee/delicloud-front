'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    $btnConfirm.on('click',function(){
        util.ajaxSubmit({
            type: 'get',
            // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
            url: '/v1.0/org/department/355671868335718401/users',
            data: {},
            success: function(res) {
                console.log("res",res);
                setTimeout(function(){
                    kernel.closePopup('adddept', {
                        model: {
                            attr: 'adddept'
                        }
                    });
                },1000);
            }
        });
    }); 
    $btnClose.on('click',function(){
        kernel.closePopup('adddept', {
            model: {
                attr: 'adddept'
            }
        });
    });
    //test treeMenu
    var data = {"code":0,"msg":null,"data":{"result":[{"id":355678628404527104,"update_time":1504841993201,"name":"得力iOS技术部","child_dept_cnt":3,"code":"355671868335718401_355678628404527104","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544]},{"id":355678749540220928,"update_time":1504842022082,"name":"得力iOS产品部","child_dept_cnt":4,"code":"355671868335718401_355678749540220928","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544,355672617635545088,362618666346348544]},{"id":355763306545283072,"update_time":1505898146223,"name":"得力人力资源部","child_dept_cnt":3,"code":"355763306545283072","org_id":355671868335718400,"parent_id":355671868335718401,"status":0},{"id":357224821521645568,"update_time":1505210634367,"name":"得力产品部","child_dept_cnt":3,"code":"355671868335718401_357224821521645568","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":357225954084388864,"update_time":1505210904391,"name":"得力财务部","child_dept_cnt":3,"code":"355671868335718401_357225954084388864","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":376070297540886528,"update_time":1509703745958,"name":"text1","child_dept_cnt":0,"code":"355671868335718401_376070297540886528","org_id":355671868335718400,"parent_id":355671868335718401,"status":1}]}};
    var addDeptMenu = data.data.result;
    var zTreeObj;
    var setting = {};
    var zNodes = [
        {name:"test1", open:true, children:[{name:"test1_1"}, {name:"test1_2"}]},
        {name:"test2", open:true, children:[{name:"test2_1"}, {name:"test2_2"}]}
    ];
    zTreeObj = $.fn.zTree.init($("#addDeptMenu"), setting, addDeptMenu);

    return {
        onload: function() {
        }
    };
});