'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    return {
        onload: function(force) {
        	kernel.appendCss(require.toUrl("common/ztree/css/metroStyle/metroStyle.css"));
        	var $dept = $('#department .department-box'),
        		$deptMenu = $dept.find('.department-menu'),
        		$deptTeam = $dept.find('.department-team'),
        		$deptInfo = $dept.find('.department-info'),
                $deptAddsub = $deptInfo.find('.btn-dept-addsub'),
                $deptDelete = $deptInfo.find('.btn-dept-delete'),
                $deptRename = $deptInfo.find('.btn-dept-rename'),
                $deptSetadmin = $deptInfo.find('.btn-dept-setadmin');
        	$deptAddsub.on('click',function(){
        		// 添加子部门 添加部门 /v1.0/org/department
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department',
                    data: {
                        "org_id":350236083323142144,
                        "name":"研发部ios组",
                        "parent_id":352479372986286080
                    },
                    success: function(res) {
                        console.log("res",res);
                    }
                });
        	});
           
            $deptDelete.on('click',function(){
                // 删除部门信息 /v1.0/org/department/delete
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/delete',
                    data: {
                        "department_id":35248040954560512011
                    },
                    success: function(res) {
                        console.log("res",res);
                    }
                });
            });

            $deptRename.on('click',function(){
                // param old name
                kernel.openPopup('renamedept', {
                    model: {
                        attr: 'renamedept'
                    }
                });
            });

            $deptSetadmin.on('click',function(){
                // 修改部门信息 /v1.0/org/department/{department_id} 352480409545605120
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/352480409545605120',
                    data: {
                        "director_ids":[349944153787858944],    // 选填，部门主管id数组
                    },
                    success: function(res) {
                        console.log("res",res);
                    }
                });
            });


            var setTreeMenu = function(id){
                var curStatus = "init", curAsyncCount = 0, goAsync = false;
                var setting = {
                    async: {
                        enable: true,
                        url:"/v1.0/org/department/"+ id +"/departments",
                        autoParam:["id", "name=n", "level=lv"],
                        otherParam:{"otherParam":"zTreeAsyncTest"},
                        dataFilter: filter,
                        type: "get"
                    },
                    callback: {
                        beforeAsync: beforeAsync,
                        onAsyncSuccess: onAsyncSuccess
                    }
                };
                $.fn.zTree.init($("#treeMenu"), setting);  
                setTimeout(function(){  
                    expandAll("treeMenu");  
                },1000);//延迟加载

                function filter(treeId, parentNode, childNodes) {
                    if (!childNodes) return null;
                    var nodes = childNodes.data.result;
                    for (var i = 0, l = childNodes.length; i<l; i++) {
                        nodes[i].name = nodes[i].name.replace(/\.n/g, '.');
                    }
                    return nodes;
                }
                function beforeAsync() {
                    curAsyncCount++;
                }
                function onAsyncSuccess(event, treeId, treeNode, msg) {  
                    //alert(treeNode);
                    curAsyncCount--;
                    if (curStatus == "expand") {
                        expandNodes(treeNode.children);
                    } else if (curStatus == "async") {
                        asyncNodes(treeNode.children);
                    }
                    if (curAsyncCount <= 0) {
                        curStatus = "";  
                    }
                }
                function expandAll() {
                    if (!check()) {  
                        return;  
                    }  
                    var zTree = $.fn.zTree.getZTreeObj("treeMenu");  
                    expandNodes(zTree.getNodes());  
                    if (!goAsync) {  
                        curStatus = "";  
                    }  
                }  
                function expandNodes(nodes) {  
                    if (!nodes) return;  
                    curStatus = "expand";  
                    var zTree = $.fn.zTree.getZTreeObj("treeMenu");  
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        zTree.expandNode(nodes[i], true, false, false);//展开节点就会调用后台查询子节点  
                        if (nodes[i].isParent && nodes[i].zAsync) {  
                            expandNodes(nodes[i].children);//递归  
                        } else {
                            goAsync = true; 
                        }
                    }
                }
                function asyncNodes(nodes){
                    if(!nodes) return;
                }
                function check() {  
                    if (curAsyncCount > 0) {  
                        return false;  
                    }  
                    return true;  
                }
            };
            setTreeMenu('355671868335718401');
        }
    };
});