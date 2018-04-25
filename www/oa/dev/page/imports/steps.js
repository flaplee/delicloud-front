'use strict';
define(['common/kernel/kernel', 'site/util/util',  'page/imports/member', 'common/text/text!page/imports/steps.html!strip'], function(kernel, util, member, html) {
    var loc = kernel.parseHash(location.hash);
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        scnt = 0, fcnt = 0, importStatus = 0, isImport = false, ws;
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
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        var res = json.data['result'];
                        if(res && res.session_id){
                            webSocketInit(res, function(){
                                kernel.hideLoading();
                            });
                        }
                    }else{
                        kernel.hideLoading();
                        isImport = false;
                        loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        setTimeout(function(){
                            loc.args.type = 'steps';
                            loc.args.status = 'data';
                            loc.args.imports = 'unable';
                            kernel.replaceLocation(loc);
                        }, 1000);
                    }
                    kernel.replaceLocation(loc);
                },
                error: function (res, status, e)//服务器响应失败处理函数
                {
                    //kernel.hideLoading();
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        var res = json.data['result'];
                        if(res && res.session_id){
                            webSocketInit(res, function(){
                                kernel.hideLoading();
                            });
                        }
                    }else{
                        kernel.hideLoading();
                        isImport = false;
                        loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                    }
                    kernel.replaceLocation(loc);
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
                    kernel.hint('导入成功~');
                    loc.args.type = 'steps';
                    loc.args.status = 'success';
                    kernel.replaceLocation(loc);
                }else{
                    kernel.hint('导入失败~', 'error');
                    loc.args.type = 'steps';
                    loc.args.status = 'error';
                    kernel.replaceLocation(loc);
                }
                setTimeout(function(){
                    loc.args.type = 'steps';
                    loc.args.status = 'data';
                    loc.args.imports = (type && type == 'enable') ? 'enable' : 'unable';
                    kernel.replaceLocation(loc);
                }, 1000);
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
                    callback();
                })}, 3000);
            }
        }
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
                    }
                }
            });
        }
    });

    return function(callback){
        resetUploadFile();
        if(isImport && isImport == true){
            $importsInfo.show();
            $importsSteps.hide();
            /*member(function(){});
            if(typeof callback === 'function'){
                callback();
            }*/
        }
    };
    function resetUploadFile(){
        $('#upload-file').val('');
        scnt = 0, fcnt = 0, importStatus = 0;
        $scntTarget.find('>').remove();
        $fcntTarget.find('>').remove();
        $scntBtn.find('span.nav-enable-num').text(0);
        $fcntBtn.find('span.nav-unable-num').text(0);
    }
});