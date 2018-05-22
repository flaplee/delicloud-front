'use strict';
define(['common/kernel/kernel', 'site/util/util',  'page/imports/member', 'common/text/text!page/imports/steps.html!strip'], function(kernel, util, member, html) {
    var loc = kernel.parseHash(location.hash), task_id = loc.args.id;
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
<<<<<<< HEAD
        scnt = 0, fcnt = 0, importStatus = 0, isImport = false, ws = [], timer = [], sid = [], supWebsocket = (!!window.WebSocket && window.WebSocket.prototype.send);
=======
        scnt = 0, fcnt = 0, importStatus = 0, isImport = false, ws;
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
    var $menuImport = $('#imports .imports-menu .menu-list .menu-manage-import'),
        $imports = $('#imports .imports-box'),
        $importsInfo = $imports.find('.imports-info'),
        $importsSteps = $imports.find('.imports-steps'),
        $importsCrumbs = $importsInfo.find('.imports-crumbs'),
        $importsCrumbsUser = $importsCrumbs.find('.imports-crumbs-user'),
        $importsCrumbsInfo = $importsCrumbs.find('.imports-crumbs-info'),
        $importsInner = $importsInfo.find('.imports-inner'),
        $importsNav = $importsInner.find('.imports-inner-data .imports-nav a'),
        $importsTable = $importsInner.find('.imports-inner-data .imports-table'),
        $reUploadBtn = $importsInner.find('.imports-upload button.btn-upload'),
        $scntBtn = $importsInner.find('.imports-nav a.nav-enable'),
        $fcntBtn = $importsInner.find('.imports-nav a.nav-unable'),
        $tableWrap = $importsInner.find('.imports-inner-data .imports-table .table-data-wrap'),
        $scntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-enable .table-data-wrap table.table-data tbody.tbody'),
        $fcntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-unable .table-data-wrap table.table-data tbody.tbody');
<<<<<<< HEAD
    var $dom = $(html),
        $downloadBtn = $dom.find('.btn-step-download'),
        $uploadBtn = $dom.find('.btn-step-upload'),
        $uploadForm = $dom.find('#upload-form'),
        $uploadHideBtn = $dom.find('#upload-file');
        $imports.append($dom);

    resetUploadFile();

    $menuImport.on('click', function(e){
        e.preventDefault();
        loc = {'id':'imports','args':{'type':'info'}};
        resetUploadFile();
/*        if(supWebsocket){
            if(ws){ws.close()};
        }else{
            if(timer){clearInterval(timer)};
        }*/
        kernel.replaceLocation(loc);
    });

    $uploadForm.on('change','#upload-file', function(){
        ajaxFileUpload();
        $tableWrap.height(document.body.clientHeight - 376);
        if(kernel.parseHash(location.hash).args.p && kernel.parseHash(location.hash).args.p != 1){
        }
    });

    $importsCrumbsUser.on('click', function(e){
        e.stopPropagation();
        loc = {'args':{},'id':'imports'};
        resetUploadFile();
        kernel.replaceLocation(loc);
    });

    $importsCrumbsInfo.on('click', function(e){
        e.stopPropagation();
        //loc.args.type = 'steps';
        loc.args.status = 'data';
        resetUploadFile();
        /*if(supWebsocket){
            if(ws){ws.close()};
        }else{
            if(timer){clearInterval(timer)};
        }*/
        kernel.replaceLocation(loc);
    });

    // 上传文件
    function ajaxFileUpload() {
        //kernel.showLoading();
        var loc = kernel.parseHash(location.hash);
        var userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid');
        var timestamp = (new Date().valueOf()).toString();
        $.ajaxFileUpload({
            url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'upload-file', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            beforeSend:function(xhr){
                xhr.setRequestHeader('Duagent', '_web');
                xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
            },
            ajaxSend:function(xhr){
                xhr.setRequestHeader('Duagent', '_web');
                xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
            },
            data: {
                org_id: orgid,
                Duagent: '_web',
                Dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp)
            },
            success: function (res, status)  //服务器成功响应处理函数
            {
                //kernel.hideLoading();
                if(res && res.responseText){
=======
    member(function(){
        var $dom = $(html),
            $downloadBtn = $dom.find('.btn-step-download'),
            $uploadBtn = $dom.find('.btn-step-upload'),
            $uploadForm = $dom.find('#upload-form'),
            $uploadHideBtn = $dom.find('#upload-file');
            $imports.append($dom);
        $menuImport.on('click', function(e){
            e.preventDefault();
            resetUploadFile();
            if(ws) ws.close();
            kernel.replaceLocation({'id':'imports','args':{'type':'info'}});
        });
        $importsNav.on('click', function(e){
            e.stopPropagation();
            var c = $(this),index = c.index();
            if(!c.hasClass('active')){
                c.addClass('active').siblings().removeClass('active');
                $importsTable.find('>div').eq(index).addClass('active').siblings().removeClass('active');
                $importsTable.find('>div').eq(index).find('.table-data-wrap').addClass('active');
                $importsTable.find('>div').eq(index).siblings().find('.table-data-wrap').removeClass('active');
            }
            loc.args.imports = (index == 0) ? 'enable' : 'unable';
            kernel.replaceLocation(loc);
        });

        $uploadForm.on('change','#upload-file', function(){
            ajaxFileUpload();
            $tableWrap.height(document.body.clientHeight - 376);
        });

        $importsCrumbsUser.on('click', function(){
            loc.args.type = 'info';
            loc.args.status = 'data';
            resetUploadFile();
            if(ws) ws.close();
            kernel.replaceLocation(loc);
        });

        $importsCrumbsInfo.on('click', function(){
            loc.args.type = 'steps';
            loc.args.status = 'data';
            resetUploadFile();
            if(ws) ws.close();
            kernel.replaceLocation(loc);
        });

        $reUploadBtn.on('click', function(e){
            e.stopPropagation();
            resetUploadFile();
            if(ws) ws.close();
            kernel.replaceLocation({'id':'imports','args':{}});
        });

       

        function ajaxFileUpload() {
            kernel.showLoading();
            var userid = util.getCookie('userid'),
                token = util.getCookie('token'),
                orgid = util.getCookie('orgid');
            var timestamp = (new Date().valueOf()).toString();
            $.ajaxFileUpload({
                url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'upload-file', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                beforeSend:function(xhr){
                    xhr.setRequestHeader('Duagent', '_web');
                    xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
                },
                ajaxSend:function(xhr){
                    xhr.setRequestHeader('Duagent', '_web');
                    xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
                },
                data: {
                    org_id: orgid,
                    Duagent: '_web',
                    Dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp)
                },
                success: function (res, status)  //服务器成功响应处理函数
                {
                    //kernel.hideLoading();
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        $('#upload-file').val('');
                        var data = json.data['result'];
                        if(data && data.ws_session_id){
                            webSocketInit(sid, data, $('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'), function(){
                                //kernel.hideLoading();
                                sid.splice($.inArray(data.ws_session_id, sid), 1);
                            });
                        }
                    }else{
                        //kernel.hideLoading();
                        isImport = false;
                        //loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                        kernel.replaceLocation(loc);
                    }
                }else{
                    kernel.hint('网络异常，请稍后再试', 'error');
                }
            },
            error: function (res, status, e)//服务器响应失败处理函数
            {
                //kernel.hideLoading();
                if(res && res.responseText){
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        $('#upload-file').val('');
                        var data = json.data['result'];
                        if(data && data.ws_session_id){
                            webSocketInit(sid, data, $('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'), function(){
                                //kernel.hideLoading();
                                sid.splice($.inArray(data.ws_session_id, sid), 1);
                            });
                        }
                    }else{
                        //kernel.hideLoading();
                        isImport = false;
                        //loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                        kernel.replaceLocation(loc);
                    }
                }else{
                    kernel.hint('网络异常，请稍后再试', 'error');
                }
            }
        });
        return false;
    }

    // 处理上传表格数据
    function setTargetHtml(o, type, status, data, count, callback){
        if(status == 0){
            o.find('>').remove();
            if(type == 'enable'){
                //util.setCookie('employee_count', (parseInt(util.getCookie('employee_count')) + scnt.length));
                kernel.hint('导入完成');
                //loc.args.type = 'steps';
                loc.args.status = 'success';
                kernel.replaceLocation(loc);
            }else{
                kernel.hint('导入失败', 'error');
                //loc.args.type = 'steps';
                loc.args.status = 'error';
                kernel.replaceLocation(loc);
            }
        }
        if(data && data.length > 0){
            if(typeof callback === 'function'){
                callback();
            }
            var targetHtml = '';
            if(data.length != 0){
                var iCount = count + data.length;
                (type == 'enable') ? $scntBtn.find('span.nav-enable-num').text(iCount) : $fcntBtn.find('span.nav-unable-num').text(iCount);
            }
            $.each(data, function(i, n){
                targetHtml += '<tr>\
                    <td class="user-index">'+ (i + count + 1) +'</td>\
                    <td class="user-name">'+ data[i].name +'</td>\
                    <td class="user-employeenum">'+ data[i].employee_num +'</td>\
                    <td class="user-deptname" title="'+ data[i].dept_name +'">'+ data[i].dept_name +'</td>\
                    <td class="user-title" title="'+ data[i].title +'">'+ data[i].title +'</td>\
                    <td class="user-mobile">'+ data[i].mobile +'</td>\
                    '+ ((type && type == 'unable') ? '<td class="user-error"><span class="red">'+ ((data[i].msg && data[i].msg != '') ? data[i].msg : '不可导入') +'</span></td>' : '') +'\
                </tr>';
            });
            o.append(targetHtml);
        }
    }

    // webSocket
    function webSocketInit(id, session, $target, callback){
        var wsid = session.ws_session.session_id, index = $.inArray(wsid, id), len = sid.length;
        if(index < 0){
            ws.push("");
            index = ws.length;
        };
        if (!!window.WebSocket && window.WebSocket.prototype.send){
            // 打开一个 web socket
            ws[index] = new WebSocket(session.ws_session.ws_url);
            ws[index].onopen = function(){
                //console.log("已连接上");
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws[index].send('{"cmd": "register","data": "'+ wsid +'"}');
            };
            ws[index].onmessage = function(evt){
                var json = JSON.parse(evt.data);
                console.log("json", json);
                if(json){
                    if($.inArray(wsid, sid) >= 0){
                        var wstype = (json.status) ? (($.inArray(wsid, sid) >= 0) ? 'push' : 'unpush') :'unpush';
                        if(($.inArray(wsid, sid) >= 0)) sid.push(wsid);
                        setRecordTask($target, json, wstype, (($.inArray(wsid, sid) >= 0) ? $.inArray(wsid, sid) : 0));
                        if(ws[index]){ws[index].close();sid.splice($.inArray(wsid, sid), 1);ws.splice(index, 1);};
                    }else{
                        var timestamp = (new Date().valueOf()).toString();
                        setRecordTask($target, session, 'increased');
                        sid.push(wsid);
                    }
                }
            };
            ws[index].onclose = function() {
                // 关闭 websocket
                //console.log("连接已关闭...")
                if(typeof callback === 'function'){
                    callback();
                }
<<<<<<< HEAD
            };
            ws[index].onerror = function (e) {
                //console.log('发生异常:', e);
                if(typeof callback === 'function'){
=======
                var targetHtml = '';
                if(data.length != 0){
                    var iCount = count + data.length;
                    (type == 'enable') ? $scntBtn.find('span.nav-enable-num').text(iCount) : $fcntBtn.find('span.nav-unable-num').text(iCount);
                }
                $.each(data, function(i, n){
                    targetHtml += '<tr>\
                        <td class="user-index">'+ (i + count + 1) +'</td>\
                        <td class="user-name">'+ data[i].name +'</td>\
                        <td class="user-employeenum">'+ data[i].employee_num +'</td>\
                        <td class="user-deptname" title="'+ data[i].dept_name +'">'+ data[i].dept_name +'</td>\
                        <td class="user-title" title="'+ data[i].title +'">'+ data[i].title +'</td>\
                        <td class="user-mobile">'+ data[i].mobile +'</td>\
                        '+ ((type && type == 'unable') ? '<td class="user-error"><span class="red">'+ ((data[i].msg && data[i].msg != '') ? data[i].msg : '通讯录中已存在该手机号码的员工') +'</span></td>' : '') +'\
                    </tr>';
                });
                o.append(targetHtml);
            }
        }

        // webSocket
        function webSocketInit(session, callback){
            if (!!window.WebSocket && window.WebSocket.prototype.send){
                // 打开一个 web socket
                ws = new WebSocket(session.ws_url);
                ws.onopen = function(){
                    //console.log("已连接上");
                    // Web Socket 已连接上，使用 send() 方法发送数据
                    ws.send('{"cmd": "register","data": "'+ session.session_id +'"}');
                };
                ws.onmessage = function(evt){
                    var json = JSON.parse(evt.data);
                    //console.log("json", json);
                    if(json){
                        if(json.fail_list){
                            setTargetHtml($fcntTarget, 'unable', importStatus, json.fail_list, fcnt, function(){
                                if(importStatus == 0)callback();
                            });
                            importStatus++;
                            fcnt += json.fail_list.length;
                        }
                        if(json.success_list){
                            setTargetHtml($scntTarget, 'enable', importStatus, json.success_list, scnt, function(){
                                if(importStatus == 0)callback();
                            });
                            importStatus++;
                            scnt += json.success_list.length;
                        }
                    }
                };
                ws.onclose = function() {
                    // 关闭 websocket
                    //console.log("连接已关闭...")
                    if(typeof callback === 'function'){
                        callback();
                    }
                };
                ws.onerror = function (e) {
                    //console.log('发生异常:', e);
                    if(typeof callback === 'function'){
                        callback();
                    }
                };
            }else{
                // 浏览器不支持 WebSocket
                var timer = setInterval(function(){pollInit('/ws/'+ session.session_id +'', timer, function(){
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
                    callback();
                }
            };
        }else{
            // 浏览器不支持 WebSocket
            timer[index] = setInterval(function(){pollInit('/ws/'+ wsid +'', index, $target, function(){
                callback();
            })}, 3000);
        }
<<<<<<< HEAD
    }
    // polling
    function pollInit(url, index, $target, callback) {
        util.ajaxSubmit({
            url: url,
            silent: true,
            type:'get',
            force: true,
            complete: function(res){
                if(res.status == 200){
                    var response = JSON.parse(res.responseText);
                    //console.log("response", response);
                    if(response){
                        $.each(response, function(i, n){
                            var wsid = n.ws_session_id;
                            if($.inArray(wsid, sid) >= 0){
                                var wstype = (n.status) ? (($.inArray(wsid, sid) >= 0) ? 'push' : 'unpush') :'unpush';
                                if(($.inArray(wsid, sid) >= 0)) sid.push(wsid), timer.push("");
                                if(timer[index]){clearInterval(timer[index]);sid.splice($.inArray(wsid, sid), 1);timer.splice(index, 1);};
                                setRecordTask($target, n, wstype, (($.inArray(wsid, sid) >= 0) ? $.inArray(wsid, sid) : 0));
                            }else{
                                var timestamp = (new Date().valueOf()).toString();
                                setRecordTask($target, n, 'increased');
                                sid.push(wsid), timer.push("");
                            }
                        });
=======
        // polling
        function pollInit(url, timer, callback) {
            util.ajaxSubmit({
                url: url,
                silent: true,
                type:'get',
                force: true,
                complete: function(res){
                    if(res.status == 200){
                        var response = JSON.parse(res.responseText);
                        //console.log("response", response);
                        if(response){
                            $.each(response, function(i, n){
                                if(n.fail_list && n.fail_list.length > 0){
                                    setTargetHtml($fcntTarget, 'unable', importStatus, n.fail_list, fcnt, function(){
                                        if(status == 0)callback();
                                    });
                                    fcnt += n.fail_list.length;
                                    importStatus++;
                                }
                                if(n.success_list && n.success_list.length > 0){
                                    setTargetHtml($scntTarget, 'enable', importStatus, n.success_list, scnt, function(){
                                        if(status == 0)callback();
                                    });
                                    scnt += n.success_list.length;
                                    importStatus++;
                                }
                            });
                        }
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
                    }
                }
            }
        });
    }

    return function(callback){
        //resetUploadFile();
        var loc = kernel.parseHash(location.hash), task_id = loc.args.id;

        if(!task_id){
            // 获取导入记录
            getTaskList({
                userid: util.getCookie('userid'),
                token: util.getCookie('token'),
                url: '/v1.0/importtask/task/byOrgAndUser',
                orgid: util.getCookie('orgid'),
                page: (loc.args.p ? loc.args.p : 1),
                size: 5,
                $target: $('.imports-steps .steps-record .record-list')
            });
        }

<<<<<<< HEAD
=======
    return function(callback){
        resetUploadFile();
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
        if(isImport && isImport == true){
            $importsInfo.show();
            $importsSteps.hide();
            /*member(function(){});
            if(typeof callback === 'function'){
                callback();
            }*/
        }
    };
<<<<<<< HEAD

=======
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
    function resetUploadFile(){
        $('#upload-file').val('');
        scnt = 0, fcnt = 0, importStatus = 0;
        $scntTarget.find('>').remove();
        $fcntTarget.find('>').remove();
        $scntBtn.find('span.nav-enable-num').text(0);
        $fcntBtn.find('span.nav-unable-num').text(0);
<<<<<<< HEAD
    }

    //查看历史导入任务
    function getTaskList(data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: data.url,
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                org_id: data.orgid,
                page: (data.page - 1),
                size: data.size
            },
            success: function(res) {
                data.$target.find('.record-list-table table.table tbody.tbody >').remove();
                console.log("getTaskList", res);
                if(res.code == 0){
                    var json = res.data['result'];
                    if(json.total >= 0 && (json.rows && json.rows.length > 0)){
                        $.each(json.rows, function(i, n){
                            setRecordTask(data.$target.find('.record-list-table table.table tbody.tbody') ,n ,'push');
                        });
                    }else{
                        if(data.$target.find('.record-list-table .record-item').length == 0){
                            data.$target.find('.record-list-table table.table tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无导入记录</td></tr>');
                        }
                    }
                    util.paging(data.$target.find('.record-list-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5);
                }else{
                    kernel.hint('查看历史导入任务失败', 'error');
                }
            }
        });
    }

    //导入记录
    function setRecordTask($target, data, type, index){
        var $targetHtml = $('<tr class="record-item '+ ((data.status != 1) ? 'record-importing': '') +'">\
            <td class="record-date">'+ util.formatTime(parseInt((data.finish_time ? data.finish_time : data.update_time)/1000)) +'</td>\
            <td class="record-imported">'+ data.success +'</td>\
            <td class="record-unimported">'+ data.fail +'</td>\
            <td class="record-operater">'+ (data.user_name ? data.user_name : '') +'</td>\
            <td class="record-status">'+ (data.status == 1 ? '导入完成' : ((data.status == 0) ? '正在导入' : '正在导入')) +'</td>\
            <td class="record-operate"><a class="operate-view" data-task_id="'+ data.id +'" href="javascript:;" title="查看">查看</a></td>\
        </tr>');
        switch(type){
            case 'increased':
                $target.prepend($targetHtml);
            break;
            case 'unpush':
                $target.prepend($targetHtml);
            break;
            case 'push':
                if(index >= 0){
                    $('.record-importing').eq(index ? index : 0).replaceWith($targetHtml);
                }else{
                    $target.append($targetHtml);
                }
            break;
            default:
                $target.append($targetHtml);
        }

        if(data.status == 0 && data.id){
            var timestamp = (new Date().valueOf()).toString();
            util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/importtask/task/sessionn',
                dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                data: {
                    id: data.id,
                    status: data.status
                },
                success: function(res) {
                    if(res.code == 0){
                        var json = res.data['result'];
                        //console.log("按照任务id获取websocket", json);
                    }else{
                        
                    }
                }
            });
        }

        $targetHtml.find('td.record-operate a.operate-view').on('click', function(e){
            e.stopPropagation();
            var c = $(this), task_id = c.attr('data-task_id');
            loc.args.id = task_id;
            if(task_id && task_id != 'undefined'){
                //loc.args.type = 'steps';
                loc.args.status = 'data';
                loc.args.imports = 'enable';
                getRecordInfo({
                    status: 1,
                    task_id: task_id,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    $target: $importsInner.find('.imports-inner-data')
                });

                getRecordInfo({
                    status: -1,
                    task_id: task_id,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    $target: $importsInner.find('.imports-inner-data')
                });

                kernel.replaceLocation(loc);
            }else{
                kernel.hint('暂无导入数据,请稍后再试', 'error');
            }
        });
    }

    //导入成员信息
    function getRecordInfo(data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: data.url,
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                task_id: data.task_id,
                status: data.status,
                size: 1000
            },
            success: function(res) {
                (data.status == 1) ? data.$target.find('.imports-table-enable table.table tbody.tbody >').remove() : data.$target.find('.imports-table-unable table.table tbody.tbody >').remove();
                console.log("getRecordInfo", res);
                if(res.code == 0){
                    var json = res.data['result'], targetHtml = '';
                    (data.status == 1) ? data.$target.find('span.nav-enable-num').text(json.total) : data.$target.find('span.nav-unable-num').text(json.total);
                    if(json.total >= 0 && (json.rows && json.rows.length > 0)){
                        $.each(json.rows, function(i, n){
                            targetHtml += '<tr>\
                                <td class="user-index">'+ (i + 1) +'</td>\
                                <td class="user-name">'+ n.name +'</td>\
                                <td class="user-employeenum">'+ n.employee_num +'</td>\
                                <td class="user-deptname" title="'+ n.dept_name +'">'+ n.dept_name +'</td>\
                                <td class="user-title" title="'+ n.title +'">'+ n.title +'</td>\
                                <td class="user-mobile">'+ n.mobile +'</td>\
                                '+ ((data.status && data.status != 1) ? '<td class="user-error"><span class="red">'+ ((n.msg && n.msg != '') ? n.msg : '不可导入') +'</span></td>' : '') +'\
                            </tr>';
                        });
                        (data.status == 1) ? data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append(targetHtml) : data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append(targetHtml);
                    }else{
                        if(data.status == 1){
                            if(data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">暂无已导入数据</td></tr>')
                            }
                        }else{
                            if(data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无不可导入数据</td></tr>')
                            }
                        }
                        //(data.status == 1) ? data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">暂无已导入数据</td></tr>') : data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无不可导入数据</td></tr>');
                    }
                    (data.status == 1) ? util.paging(data.$target.find('.imports-enable-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5) : util.paging(data.$target.find('.imports-unable-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5);
                }else{
                    kernel.hint('查看历史导入任务失败', 'error');
                }
            }
        });
=======
>>>>>>> ef4bf7aad474c2eadfeab6690fd5f9544ec9009a
    }
});