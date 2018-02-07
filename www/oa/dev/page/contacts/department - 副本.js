'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/contacts/department.html!strip'], function(module, kernel, util, html) {
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        orgname = util.getCookie('orgname'),
        parentid = util.getCookie('parentid');
    var dom = $(html),
        $contacts = $('#contacts .contacts-box'),
        $deptTitle = $(dom).find('.department-form .form-title'),
        $deptBtnAdd = $(dom).find('.department-form .form-btns .btn-dept-add'),
        $deptInner = $(dom).find('.department-inner'),
        $deptList = $deptInner.find('.department-list .department-list-inner');
    $contacts.append($(dom));

    //kernel.showForeign('', '600px', '400px',function(){});
    /*$deptList.find('.select-item').on('click',function(e){
        e.stopPropagation();
        var c = $(this);
        if(!c.hasClass('current')){
            $deptList.find('.select-item').removeClass('current');
            c.addClass('current');
        }
    });*/

    return function() {
        initTopDept($deptList, {
            status: 'onload',
            relation: 'parent',
            orgid: orgid,
            orgname: orgname,
            parentid: parentid, //'355671868335718401'
            index: 0
        });
    }

    //初始化组织
    function initTopDept(o, data){
        console.log("initTopDept");
        var status = data.status,
            relation = data.relation,
            parentid = data.parentid,
            orgid = data.orgid,
            index = data.index + 1,
            orgname = data.orgname;
        // status = 'onload/loaded',  relation = 'parent/son', parentid = 355671868335718401, orgid = 363677081407586304;
        var id = (relation == 'parent') ? parentid : orgid;
        o.find('>').remove();
        if(relation == 'parent'){
            $deptTitle.text(orgname);
        }else{
            relation = 'son'
        }
        initDeps(o, {
            orgid: data.orgid,
            title: data.orgname,
            index: index,
            relation: relation
        });

        //初始化团队 及 团队子部门信息
        function initDeps(o, data){
            util.ajaxSubmit({
                type:'get',
                url: '/v1.0/org/department/'+ data.orgid +'/departments',
                data: {},
                success: function(res) {
                    var json = res.data.result;
                    if(json.length > 0){
                        for(var i = 0;i < json.length; i++){
                            var directorHtml = (json[i].directors && json[i].directors[0].name) ? '<span class="item-admin">'+ json[i].directors[0].name +'(<em>主管</em>)</span>' : '<span class="null">空缺</span>';
                            var $temp = $('<li class="select-item clear" data-orgid="'+ json[i].id +'">\
                                <div class="item-info clear" data-status="onload">\
                                    <div class="item-text fl">\
                                        <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+ json[i].name +'</span><span class="item-count">(<em>10人</em>)</span></span>/'+ directorHtml +'\
                                    </div>\
                                    <div class="item-setup fr">\
                                        <a class="setup-admin" title="设置主管" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                        <a class="setup-rename" title="重命名" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                        <a class="setup-add" title="添加子部门" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                        <a class="setup-del" title="删除部门" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                                    </div>\
                                </div>\
                                <ul class="item-select-inner-son" data-index="'+ data.index +'" data-status="onload"></ul>\
                            </li>');
                            o.append($temp);
                            bindDeptSetup($temp, {
                                'orgid': json[i].id,
                                'title': '该部门有4名成员，请先移除部门成员！',
                                index: data.index,
                                relation: data.relation
                            });
                            
                            // 绑定部门操作 
                            function bindDeptSetup(o, data){
                                // 设置当前组织
                                o.on('click',function(e){
                                    e.stopPropagation();
                                    var event = e || window.event;
                                    var target = event.target || event.srcElement;
                                    console.log("e", e);
                                    var c = $(this).find('div.item-info');
                                    setCurrent($deptList, c, function(){
                                        initDeps($temp.find('ul.item-select-inner-son'),{
                                            orgid : data.orgid,
                                            title : data.name,
                                            index: data.index + 1 
                                        });
                                    });
                                });

                                //设置部门主管
                                o.on('click', '.item-setup .setup-admin', function (e) {
                                   var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('seluser', {
                                            type: 'seluser',
                                            data: {
                                                orgid: data.orgid
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            }
                                        });
                                    });
                                })

                                //部门重命名 
                                o.on('click', '.item-setup .setup-rename', function (e) {
                                    e.stopPropagation();
                                    var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('editdept', {
                                            type: 'rename',
                                            data: {
                                                id: data.orgid,
                                                pid: parentid,
                                                text:'请输入新的部门名称',
                                                name: data.name
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            }
                                        });
                                    });
                                });

                                // 添加部门
                                o.on('click', '.item-setup .setup-add', function (e) {
                                    e.stopPropagation();
                                    var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('editdept', {
                                            type: 'add',
                                            data: {
                                                id: data.orgid,
                                                pid: parentid,
                                                text:'请输入部门名称',
                                                name: data.name
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            }
                                        });
                                    });
                                });

                                //删除部门信息 /v1.0/org/department/delete
                                o.on('click', '.item-setup .setup-del', function (e) {
                                    e.stopPropagation();
                                    var c = $(this),$info = c.parent('.item-setup').parent('.item-info');
                                    var userLength, deptLength, id = c.parent('.item-setup').attr('data-id'),name = c.parent('.item-setup').siblings('a.item-info').find('.item-name').text();
                                    setCurrent($deptList, $info, function(){
                                        /*util.ajaxSubmit({
                                            type:'get',
                                            url: 'json/dept.json',
                                            data: {},
                                            success: function(resp) {
                                                console.log("resp",resp);
                                                if(resp.code == 0){
                                                    kernel.openPopup('deldept',{
                                                        type:'group', //both group none user
                                                        data:{
                                                            orgid: data.orgid,
                                                            name: data.name,
                                                            title:  '是否删除该部门？'
                                                        },
                                                        func: function(){
                                                            initTopDept($deptList,{
                                                                status: 'onload',
                                                                relation: 'parent',
                                                                orgid: orgid,
                                                                orgname: orgname,
                                                                parentid: parentid, //'355671868335718401'
                                                                index: 0
                                                            });
                                                        }
                                                    });
                                                }else{

                                                }
                                                
                                                
                                                if(resp.code == 0){
                                                    var oids = [], uids = [];
                                                    var json = resp.data.result;
                                                    deptLength = json.length;
                                                    for(var i = 0;i < json.length; i++){
                                                        (json[i].id) ? oids.push(json[i].id):'';
                                                    }
                                                    if(deptLength > 0){
                                                        // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                                                        util.ajaxSubmit({
                                                            type: 'get',
                                                            url: 'json/user.json',
                                                            data: {},
                                                            success: function(resuser) {
                                                                console.log("resuser",resuser);
                                                                if(resuser.code == 0){
                                                                    var jsonUser = resuser.data.result;
                                                                    userLength = jsonUser.length;
                                                                    console.log("deptLength", deptLength);
                                                                    console.log("userLength", userLength);
                                                                    for(var i = 0;i < jsonUser.length; i++){
                                                                        (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                                                    }
                                                                    kernel.openPopup('deldept',{
                                                                        type:((userLength > 0) ? 'both' : 'group'), //both group none user
                                                                        data:{
                                                                            orgid: data.orgid,
                                                                            name: name,
                                                                            title:((userLength > 0) ? '该部门有'+ oids.length +'个子部门和'+ uids.length +'名成员，请先移除部门和成员！' : '是否删除 '+ name +'，连同其子部门？'),
                                                                            oids: oids,
                                                                            uids: uids
                                                                        },
                                                                        func: function(){
                                                                            initTopDept($deptList,{
                                                                                status: 'onload',
                                                                                relation: 'parent',
                                                                                orgid: orgid,
                                                                                orgname: orgname,
                                                                                parentid: parentid, //'355671868335718401'
                                                                                index: 0
                                                                            });
                                                                        }
                                                                    });
                                                                }else{
                                                                    kernel.hint(resuser.msg, 3000);
                                                                }
                                                            }
                                                        });
                                                    }else{
                                                        // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                                                        util.ajaxSubmit({
                                                            type: 'get',
                                                            url: 'json/user.json',
                                                            data: {},
                                                            success: function(resuser) {
                                                                console.log("resuser",resuser);
                                                                if(resuser.code == 0){
                                                                    var jsonUser = resuser.data.result;
                                                                    userLength = jsonUser.length;
                                                                    console.log("deptLength", deptLength);
                                                                    console.log("userLength", userLength);
                                                                    for(var i = 0;i < jsonUser.length; i++){
                                                                        (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                                                    }
                                                                    kernel.openPopup('deldept',{
                                                                        type:((userLength > 0) ? 'user' : 'none'), //both group none user
                                                                        data:{
                                                                            orgid: data.orgid,
                                                                            name: name,
                                                                            title:((userLength > 0) ? '该部门有'+ uids.length +'名成员，请先移除部门成员！' : '是否删除 '+ name +'？'),
                                                                            oids: oids,
                                                                            uids: uids
                                                                        },
                                                                        func: function(){
                                                                            initTopDept($deptList,{
                                                                                status: 'onload',
                                                                                relation: 'parent',
                                                                                orgid: orgid,
                                                                                orgname: orgname,
                                                                                parentid: parentid, //'355671868335718401'
                                                                                index: 0
                                                                            });
                                                                        }
                                                                    });
                                                                }else{
                                                                    kernel.hint(resuser.msg, 3000);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }else{
                                                    kernel.hint(resp.msg, 3000);
                                                }
                                            }
                                        });*/
                                    });
                                });
                            }

                            //设置选择部门
                            function setCurrent(o, w, callback){
                                if(!w.hasClass('current')){
                                    o.find('li.select-item div.item-info').removeClass('current');
                                    w.addClass('current');
                                }
                                var $d = (data.relation == 'parent') ? o : w;
                                 if($d.attr('data-status') == 'onload'){
                                    callback();
                                    $d.attr('data-status','loaded');
                                }
                            }
                        }
                    }else{
                        // 无子部门时需要处理样式
                    }
                }
            });
        }
    }

    // 初始化组织数据
    function initDept(o, data){
        util.ajaxSubmit({
            type:'get',
            url: '/v1.0/org/department/'+ data.orgid +'/departments',
            data: {},
            success: function(res) {
                var json = res.data.result;
                if(json.length > 0){
                    o.append($('<ul class="item-select-inner-son"></ul>'));
                    for(var i = 0;i < json.length; i++){
                        var $temp  = $('<li class="select-item clear" data-orgid="'+ json[i].id +'">\
                            <div class="item-info clear" data-status="onload">\
                                <div class="item-text fl">\
                                    <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+ json[i].name +'</span><span class="item-count">(<em>10人</em>)</span></span>/<span class="item-admin">'+ json[i].directors[0].name +'(<em>主管</em>)</span>\
                                </div>\
                                <div class="item-setup fr">\
                                    <a class="setup-admin" title="设置主管" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                    <a class="setup-rename" title="重命名" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                    <a class="setup-add" title="添加子部门" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                    <a class="setup-del" title="删除部门" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                                </div>\
                            </div>\
                            <ul class="item-select-inner-son" data-status="onload">\
                            </ul>\
                        </li>');
                        o.find('ul.item-select-inner-son').append($(temp));
                        bindDept($(temp),{
                            'orgid':json[i].id
                        });
                        // 绑定组织数据
                        function bindDept(o, data){
                            o.find('a.item-info').on('click',function(e){
                                e.stopPropagation();
                                initDept(o, data.orgid);
                            });
                        }
                    }
                }else{

                }
            }
        });
    }

    // 重置组织数据
    function resetDept(o, data){
        $deptTitle.text(data.title);
         if(!o.hasClass('current')){
            o.addClass('current');
            $deptList.find('.select-item').removeClass('current');
        }
    }

    /*initDeptSetup($deptList, {
        status: 'onload',
        type: 'parent',
        parentid: '355671868335718401',
        orgid: orgid
    });*/

    // 初始化团队数据
    /*function initDeptSetup(o, data){
        var status = data.status,
            relation = data.type,
            parentid = data.parentid,
            orgid = data.orgid;
        // status = 'onload/loaded',  relation = 'parent/son', parentid = 355671868335718401, orgid = 363677081407586304;
        var id = (relation == 'parent') ? parentid : orgid;
        o.find('>').remove();
        console.log("initDeptSetup");
        util.ajaxSubmit({
            type:'get',
            url: '/v1.0/org/department/'+ id +'/departments',
            data: {},
            success: function(res) {
                var json = res.data.result;
                if(json.length > 0){
                    for(var i = 0;i < json.length; i++){
                        o.append($('<ul class="department-list-inner-son"></ul>'));
                        var $temp = $('<li class="select-item current clear" data-orgid="'+ json.org_id +'" data-status="onload">\
                            <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe661;</i><span class="item-name">'+ json.name +'</span><span class="item-count">(<em>'+ json.count +'人</em>)</span></span>/<span class="item-admin">'+ json.adminname +'(<em>主管</em>)</span></a>\
                            <div class="item-setup">\
                                <a class="setup-admin" title="设置主管" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                <a class="setup-rename" title="重命名" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                <a class="setup-add" title="添加子部门" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                <a class="setup-del" title="删除部门" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                            </div>\
                        </li>');
                        o.find('ul.department-list-inner-son').append($temp);
                        bindDeptSetup($temp,{
                            'orgid':json.org_id,
                        });

                        // 绑定部门操作 
                        function bindDeptSetup(o, data){
                            // 设置当前组织
                            o.on('click',function(e){
                                e.stopPropagation();
                                var event = e || window.event;
                                var target = event.target || event.srcElement;
                                console.log("e", e);
                                var c = $(this).find('div.item-info');
                                setCurrent($deptList, c, function(){
                                    initDeps($temp.find('ul.item-select-inner-son'),{
                                        orgid : data.orgid,
                                        title : data.name,
                                        index: data.index + 1 
                                    });
                                });
                            });

                            //设置部门主管
                            o.on('click', '.item-setup .setup-admin', function (e) {
                               var c = $(this).parent('.item-setup').parent('.item-info');
                                setCurrent($deptList, c, function(){
                                    kernel.openPopup('seluser', {
                                        type: 'seluser',
                                        data: {
                                            orgid: data.orgid
                                        },
                                        func: function(){
                                            initTopDept($deptList,{
                                                status: 'onload',
                                                relation: 'parent',
                                                orgid: orgid,
                                                orgname: orgname,
                                                parentid: parentid, //'355671868335718401'
                                                index: 0
                                            });
                                        }
                                    });
                                });
                            })

                            //部门重命名 
                            o.on('click', '.item-setup .setup-rename', function (e) {
                                e.stopPropagation();
                                var c = $(this).parent('.item-setup').parent('.item-info');
                                setCurrent($deptList, c, function(){
                                    kernel.openPopup('editdept', {
                                        type: 'rename',
                                        data: {
                                            id: data.orgid,
                                            pid: parentid,
                                            text:'请输入新的部门名称',
                                            name: data.name
                                        },
                                        func: function(){
                                            initTopDept($deptList,{
                                                status: 'onload',
                                                relation: 'parent',
                                                orgid: orgid,
                                                orgname: orgname,
                                                parentid: parentid, //'355671868335718401'
                                                index: 0
                                            });
                                        }
                                    });
                                });
                            });

                            // 添加部门
                            o.on('click', '.item-setup .setup-add', function (e) {
                                e.stopPropagation();
                                var c = $(this).parent('.item-setup').parent('.item-info');
                                setCurrent($deptList, c, function(){
                                    kernel.openPopup('editdept', {
                                        type: 'add',
                                        data: {
                                            id: data.orgid,
                                            pid: parentid,
                                            text:'请输入部门名称',
                                            name: data.name
                                        },
                                        func: function(){
                                            initTopDept($deptList,{
                                                status: 'onload',
                                                relation: 'parent',
                                                orgid: orgid,
                                                orgname: orgname,
                                                parentid: parentid, //'355671868335718401'
                                                index: 0
                                            });
                                        }
                                    });
                                });
                            });

                            //删除部门信息 /v1.0/org/department/delete
                            o.on('click', '.item-setup .setup-del', function (e) {
                                e.stopPropagation();
                                var c = $(this),$info = c.parent('.item-setup').parent('.item-info');
                                var userLength, deptLength, id = c.parent('.item-setup').attr('data-id'),name = c.parent('.item-setup').siblings('a.item-info').find('.item-name').text();
                                setCurrent($deptList, $info, function(){
                                    util.ajaxSubmit({
                                        type:'get',
                                        url: 'json/dept.json',
                                        data: {},
                                        success: function(resp) {
                                            console.log("resp",resp);
                                            if(resp.code == 0){
                                                kernel.openPopup('deldept',{
                                                    type:'group', //both group none user
                                                    data:{
                                                        orgid: data.orgid,
                                                        name: data.name,
                                                        title:  '是否删除该部门？'
                                                    },
                                                    func: function(){
                                                        initTopDept($deptList,{
                                                            status: 'onload',
                                                            relation: 'parent',
                                                            orgid: orgid,
                                                            orgname: orgname,
                                                            parentid: parentid, //'355671868335718401'
                                                            index: 0
                                                        });
                                                    }
                                                });
                                            }else{

                                            }
                                            
                                            
                                            if(resp.code == 0){
                                                var oids = [], uids = [];
                                                var json = resp.data.result;
                                                deptLength = json.length;
                                                for(var i = 0;i < json.length; i++){
                                                    (json[i].id) ? oids.push(json[i].id):'';
                                                }
                                                if(deptLength > 0){
                                                    // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                                                    util.ajaxSubmit({
                                                        type: 'get',
                                                        url: 'json/user.json',
                                                        data: {},
                                                        success: function(resuser) {
                                                            console.log("resuser",resuser);
                                                            if(resuser.code == 0){
                                                                var jsonUser = resuser.data.result;
                                                                userLength = jsonUser.length;
                                                                console.log("deptLength", deptLength);
                                                                console.log("userLength", userLength);
                                                                for(var i = 0;i < jsonUser.length; i++){
                                                                    (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                                                }
                                                                kernel.openPopup('deldept',{
                                                                    type:((userLength > 0) ? 'both' : 'group'), //both group none user
                                                                    data:{
                                                                        orgid: data.orgid,
                                                                        name: name,
                                                                        title:((userLength > 0) ? '该部门有'+ oids.length +'个子部门和'+ uids.length +'名成员，请先移除部门和成员！' : '是否删除 '+ name +'，连同其子部门？'),
                                                                        oids: oids,
                                                                        uids: uids
                                                                    },
                                                                    func: function(){
                                                                        initTopDept($deptList,{
                                                                            status: 'onload',
                                                                            relation: 'parent',
                                                                            orgid: orgid,
                                                                            orgname: orgname,
                                                                            parentid: parentid, //'355671868335718401'
                                                                            index: 0
                                                                        });
                                                                    }
                                                                });
                                                            }else{
                                                                kernel.hint(resuser.msg, 3000);
                                                            }
                                                        }
                                                    });
                                                }else{
                                                    // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                                                    util.ajaxSubmit({
                                                        type: 'get',
                                                        url: 'json/user.json',
                                                        data: {},
                                                        success: function(resuser) {
                                                            console.log("resuser",resuser);
                                                            if(resuser.code == 0){
                                                                var jsonUser = resuser.data.result;
                                                                userLength = jsonUser.length;
                                                                console.log("deptLength", deptLength);
                                                                console.log("userLength", userLength);
                                                                for(var i = 0;i < jsonUser.length; i++){
                                                                    (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                                                }
                                                                kernel.openPopup('deldept',{
                                                                    type:((userLength > 0) ? 'user' : 'none'), //both group none user
                                                                    data:{
                                                                        orgid: data.orgid,
                                                                        name: name,
                                                                        title:((userLength > 0) ? '该部门有'+ uids.length +'名成员，请先移除部门成员！' : '是否删除 '+ name +'？'),
                                                                        oids: oids,
                                                                        uids: uids
                                                                    },
                                                                    func: function(){
                                                                        initTopDept($deptList,{
                                                                            status: 'onload',
                                                                            relation: 'parent',
                                                                            orgid: orgid,
                                                                            orgname: orgname,
                                                                            parentid: parentid, //'355671868335718401'
                                                                            index: 0
                                                                        });
                                                                    }
                                                                });
                                                            }else{
                                                                kernel.hint(resuser.msg, 3000);
                                                            }
                                                        }
                                                    });
                                                }
                                            }else{
                                                kernel.hint(resp.msg, 3000);
                                            }
                                        }
                                    });
                                });
                            });
                        }

                        //设置选择部门
                        function setCurrent(o, w, callback){
                            if(!w.hasClass('current')){
                                o.find('li.select-item div.item-info').removeClass('current');
                                w.addClass('current');
                            }
                            var $d = (data.relation == 'parent') ? o : w;
                             if($d.attr('data-status') == 'onload'){
                                callback();
                                $d.attr('data-status','loaded');
                            }
                        }
                    }
                }else{
                }
            }
        });
    }*/

    // 重置组织数据
    function resetDeptSetup(o, data){
        $deptTitle.text(data.title);
         if(!o.hasClass('current')){
            o.addClass('current');
            $deptList.find('.select-item').removeClass('current');
        }
    }
});