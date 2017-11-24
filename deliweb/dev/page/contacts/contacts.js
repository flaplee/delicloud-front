'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    return {
        onload: function(force) {
            var userid = util.getCookie('userid'),
                token = util.getCookie('token'),
                orgid = '355671868335718400';
            kernel.appendCss(require.toUrl("common/ztree/css/metroStyle/metroStyle.css"));
            var $contacts = $('#contacts .contacts-box'),
                $contactsMenu = $contacts.find('.contacts-menu'),
                $contactsTeam = $contacts.find('.contacts-team'),
                $contactsDept = $contactsTeam.find('.contacts-dept'),
                $contactsInfo = $contacts.find('.contacts-info'),
                $searchUser = $contactsInfo.find('.search'),
                $addUser = $contactsInfo.find('.btn-user-add'),
                $addImport = $contactsInfo.find('.btn-user-import'),
                $editUser = $contactsInfo.find('.btn-user-edit'),
                $deleteUser = $contactsInfo.find('.btn-user-delete'),
                $contactsTable = $contactsInfo.find('.contacts-inner .table'),
                $tmp = $contactsTable.find('.tbody');
            var dataCache;

            // 成员
            $addUser.on('click', function() {
                kernel.openPanel('adduser', {
                    type: 'add',
                    data: {}
                });
            });

            /*$editUser.on('click',function(){
                kernel.openPanel('adduser');
            });*/

            $deleteUser.on('click', function() {
                // 将人员从团队组织中删除 /v1.0/org/user/delete
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/user/delete',
                    data: {
                        "user_ids": [350305795163815936],
                        "org_id": 350236083323142144
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });

            $tmp.find('>').remove();
            // 查看我的通讯录 /v1.0/address_book/my  //查看团队下所有成员信息 /v1.0/org/{org_id}/users?q={keyword}

            util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/org/' + orgid + '/users',
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {},
                success: function(res) {
                    //console.log("res",res);
                    var json = res.data.result;
                    dataCache = json;
                    for (var i = 0; i < res.data.result.length; i++) {
                        var userText = (json[i].is_department_admin == true) ? '部门管理员' : '普通用户';
                        var itemTpl = '<tr>\
                            <td><a class="item" href="javascript:;" data-uid="' + json[i].user_id + '"><i class="iconfont">&#xe76a;</i></a></td>\
                            <td>' + json[i].name + '</td>\
                            <td>' + json[i].nickname + '</td>\
                            <td>' + json[i].employee_num + '</td>\
                            <td>' + json[i].department + '</td>\
                            <td>' + json[i].title + '</td>\
                            <td>' + userText + '</td>\
                            <td>\
                                <button data-index="' + i + '" type="button" class="btn btn-primary btn-sm btn-user-edit">编辑</button>\
                                <button data-index="' + i + '" type="button" class="btn btn-default btn-sm btn-user-delete">删除</button>\
                            </td>\
                        </tr>';
                        $tmp.append($(itemTpl));
                    }
                    selectUserAll($contactsTable.find('.thead .select-all'));
                    selectUser($tmp.find('a.item'));
                    setUserEdit($tmp.find('.btn-user-edit'));
                    setUserDelete($tmp.find('.btn-user-delete'));
                }
            });

            function selectUserAll(dom) {
                dom.on('click', function(e) {
                    e.stopPropagation();
                    var c = $(this);
                    if (!c.hasClass('selected')) {
                        c.addClass('selected').find('i').html('&#xe63d;');
                        $tmp.find('tr td a.item').addClass('selected');
                        $tmp.find('tr td a.item').find('i').html('&#xe63d;');
                    } else {
                        c.removeClass('selected').find('i').html('&#xe76a;');
                        $tmp.find('tr td a.item').removeClass('selected');
                        $tmp.find('tr td a.item').find('i').html('&#xe76a;');
                    }
                });
            }

            function selectUser(dom) {
                dom.on('click', function(e) {
                    e.stopPropagation();
                    var c = $(this);
                    if (!c.hasClass('selected')) {
                        c.addClass('selected').find('i').html('&#xe63d;');
                        c.addClass('selected');
                        c.find('i').html('&#xe63d;');
                    } else {
                        c.removeClass('selected').find('i').html('&#xe76a;');
                        c.removeClass('selected');
                        c.find('i').html('&#xe76a;');
                    }
                });
            }

            function setUserEdit(dom) {
                dom.on('click', function() {
                    kernel.openPanel('adduser', {
                        type: 'edit',
                        data: dataCache[$(this).attr('data-index')]
                    });
                });
            }

            function setUserDelete(dom) {
                dom.on('click', function() {
                    // 将人员从团队组织中删除 /v1.0/org/user/delete
                    util.ajaxSubmit({
                        type: 'post',
                        url: '/v1.0/org/user/delete',
                        data: {
                            "user_ids": [350305795163815936],
                            "org_id": 350236083323142144
                        },
                        success: function(res) {
                            console.log("res", res);
                        }
                    });
                });
            }

            // 搜索我的通讯录 /v1.0/address_book/search?q={keyword}&org_id={org_id}


            // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
            /*util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/org/department/355671868335718401/users',
                data: {},
                success: function(res) {
                    console.log("res",res);
                }
            });*/
            // test api 查看团队一级部门信息 /v1.0/org/355671868335718401/departments  查看部门的下级部门： /v1.0/org/department/355671868335718401/departments
            /*util.ajaxSubmit({
        		type:'get',
	            url: '/v1.0/org/department/355671868335718401/departments',
	            data: {},
	            success: function(res) {
	                console.log("res",res);
	            }
	        });*/

            //部门
            // 添加部门 /v1.0/org/department
            $contactsDept.find('.btn-dept-add-item').on('click', function() {
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department',
                    data: {
                        "org_id": 350236083323142144,
                        "name": "研发部ios组",
                        "parent_id": 352479372986286080
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });

            //删除部门信息 /v1.0/org/department/delete
            $contactsDept.find('.btn-dept-delete-item').on('click', function() {
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/department/delete',
                    data: {
                        "department_id": 352480409545605120
                    },
                    success: function(res) {
                        console.log("res", res);
                    }
                });
            });

            //部门重命名 修改部门信息 /v1.0/org/department/{department_id}
            $contactsDept.find('.btn-dept-rename-item').on('click', function() {
                kernel.openPopup('editdept', {
                    type: 'editdept',
                    data: {
                        id: '123456'
                    }
                });

            });
            //设置部门主管 修改部门信息 /v1.0/org/department/{department_id}
            $contactsDept.find('.btn-dept-setadmin-item').on('click', function() {
                kernel.openPanel('editdept', {
                    type: 'editdept',
                    data: {

                    }
                });
                /*util.ajaxSubmit({
                    type:'post',
                    url: '/v1.0/org/department/{department_id}',
                    data: {
                        "director_ids":[349944153787858944]
                    },
                    success: function(res) {
                        console.log("res",res);
                    }
                });*/

            });

            //test treeMenu

            /*var data = {"code":0,"msg":null,"data":{"result":[{"id":355678628404527104,"update_time":1504841993201,"name":"得力iOS技术部","child_dept_cnt":3,"code":"355671868335718401_355678628404527104","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544]},{"id":355678749540220928,"update_time":1504842022082,"name":"得力iOS产品部","child_dept_cnt":4,"code":"355671868335718401_355678749540220928","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544,355672617635545088,362618666346348544]},{"id":355763306545283072,"update_time":1505898146223,"name":"得力人力资源部","child_dept_cnt":3,"code":"355763306545283072","org_id":355671868335718400,"parent_id":355671868335718401,"status":0},{"id":357224821521645568,"update_time":1505210634367,"name":"得力产品部","child_dept_cnt":3,"code":"355671868335718401_357224821521645568","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":357225954084388864,"update_time":1505210904391,"name":"得力财务部","child_dept_cnt":3,"code":"355671868335718401_357225954084388864","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":376070297540886528,"update_time":1509703745958,"name":"text1","child_dept_cnt":0,"code":"355671868335718401_376070297540886528","org_id":355671868335718400,"parent_id":355671868335718401,"status":1}]}};
	        var treeMenu = data.data.result;
            var zTreeObj;
            var setting = {};
            var zNodes = [
                {name:"test1", open:true, children:[{name:"test1_1"}, {name:"test1_2"}]},
                {name:"test2", open:true, children:[{name:"test2_1"}, {name:"test2_2"}]}
            ];
            zTreeObj = $.fn.zTree.init($("#treeMenu"), setting, treeMenu);*/

            var setTreeMenu = function(id) {
                var curStatus = "init",
                    curAsyncCount = 0,
                    goAsync = false;
                var setting = {
                    async: {
                        enable: true,
                        url: "/v1.0/org/department/" + id + "/departments",
                        autoParam: ["id", "name=n", "level=lv"],
                        otherParam: {
                            "otherParam": "zTreeAsyncTest"
                        },
                        dataFilter: filter,
                        type: "get"
                    },
                    callback: {
                        beforeAsync: beforeAsync,
                        onAsyncSuccess: onAsyncSuccess,
                        beforeClick: function(treeId, treeNode) {
                            console.log("treeNode", treeNode);
                            var zTree = $.fn.zTree.getZTreeObj("treeMenu");
                            if (treeNode.isParent) {
                                zTree.expandNode(treeNode);
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                };
                $.fn.zTree.init($("#treeMenu"), setting);

                function filter(treeId, parentNode, childNodes) {
                    if (!childNodes) return null;
                    var nodes = childNodes.data.result;
                    for (var i = 0, l = childNodes.length; i < l; i++) {
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

                function expandNodes(nodes) {
                    if (!nodes) return;
                    curStatus = "expand";
                    var zTree = $.fn.zTree.getZTreeObj("treeMenu");
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        zTree.expandNode(nodes[i], true, false, false); //展开节点就会调用后台查询子节点  
                        if (nodes[i].isParent && nodes[i].zAsync) {
                            expandNodes(nodes[i].children); //递归  
                        } else {
                            goAsync = true;
                        }
                    }
                }

                function asyncNodes(nodes) {
                    if (!nodes) return;
                    util.ajaxSubmit({
                        type: 'post',
                        url: '/v1.0/org/department/355671868335718401/departments',
                        data: {
                            "director_ids": [349944153787858944]
                        },
                        success: function(res) {
                            console.log("res", res);
                        }
                    });
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