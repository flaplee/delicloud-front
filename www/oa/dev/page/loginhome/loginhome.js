'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var $login = $('#loginhome'),
        $loginBox = $login.find('.login-box'),
        $loginQr = $loginBox.find('#loginQr'),
        $loginDoing = $loginQr.find('.login-doing'),
        $loginSuccess = $loginQr.find('.login-success'),
        $successBtn = $loginSuccess.find('.success-btn'),
        $loginFail = $loginQr.find('.login-fail'),
        $failBtn = $loginFail.find('.fail-btn'),
        $orgBox = $login.find('.org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list'),
        $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'),
        $orgNavList = $navTeam.find('.son-nav-list-team');;
    var stomp = null, userInfo = {}, tempInfo = {'data':{}, 'organization':{}};
    // init qrcode
    var initQrcode = function(o){
        o.addClass('login-loading');
        util.ajaxSubmit({
            url: '/v1.0/barcode_login/public?v=' + (new Date().getTime()),
            silent: true,
            type:'get',
            success: function(json) {
                o.removeClass('login-loading');
                if(json.code == 0){
                    var res = json.data['result'],
                        cid = res.cid,
                        url = res.data,
                        session = res.session;
                    if (url) {
                        o.html('');
                        new QRCode(document.getElementById('qrcode'), {
                            text: url,
                            width: 234,
                            height: 234,
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        webSocketInit(session);
                        //connect(cid, 'disconnect');
                    } else {
                        o.html('');
                    }
                }else{
                    kernel.hint(json.msg);
                }
            },
            error: function(json){
                o.removeClass('login-loading');
                kernel.hint('网络异常，请稍后再试', 'error');
            }
        });
    };

    initQrcode($loginBox.find('.loginQr'));

    $(document).on('click', '.loginQr', function() {
        var self = this,
            loginQr = $loginBox.find('.loginQr'),
            that = loginQr[this === loginQr[0] ? 1 : 0];
        if (this.childNodes.length === 0) {
            if (that && that.childNodes.length > 0) {
                this.innerHTML = that.innerHTML;
            } else {
                initQrcode($loginBox.find('.loginQr'));
            }
        }else{
            initQrcode($loginBox.find('.loginQr'));
        }
    });

    $successBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });

    $failBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });
    
    // webSocket
    function webSocketInit(session){
        if (typeof WebSocket != 'undefined'){
            // 打开一个 web socket
            var ws = new WebSocket(session.ws_url);
            ws.onopen = function(){
                //console.log("已连接上");
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send('{"cmd": "register","data": "'+ session.session_id +'"}');
            };
            ws.onmessage = function(evt){
                var json = JSON.parse(evt.data);
                if(json){
                    if(json.id){
                        tempInfo.data = json;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                        $loginSuccess.show();
                    }
                    if(json.user_id){
                        userInfo = json;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token,type: 'websocket'}, ws);
                    }
                }
            };
            ws.onclose = function() {
                // 关闭 websocket
                //console.log("连接已关闭...")
            };
            ws.onerror = function (e) {
                //console.log('发生异常:', e);
            };
        }else{
            // 浏览器不支持 WebSocket
            var timer = setInterval(function(){pollInit(session.http_url, timer)}, 3000);//'/ws/'+session.session_id
        }
    }
    // polling
    function pollInit(url, timer) {
        $.getJSON(url).done(function(res) {
            var response = res;
            if(response.length > 1){
                var jsonUser = response[0], jsonInfo = response[1];
                if(jsonUser && jsonInfo){
                    if(jsonUser.id){
                        tempInfo.data = jsonUser;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ jsonUser.avatar_url +'" title="'+ jsonUser.name +'">');
                        $loginSuccess.show();
                    }
                    if(jsonInfo.user_id){
                        userInfo = jsonInfo;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token, type: 'polling'}, function(){
                            clearInterval(timer);
                        });
                    }
                }
            }else if(response.length == 1){
                var json = response[0];
                if(json){
                    if(json.id){
                        tempInfo.data = json;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                        $loginSuccess.show();
                    }
                    if(json.user_id){
                        userInfo = json;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token, type: 'polling'}, function(){
                            clearInterval(timer);
                        });
                    }
                }
            }
        });
    }

    // select orgs
    function orgsCalls(o, data, ws){
        var timestamp = (new Date().valueOf()).toString();
        if(typeof data.userid !== 'undefined'){
            util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/user/me',
                dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
                data: {},
                success: function(json) {
                    if (json.code == 0) {
                        o.find('>').remove('');
                        var orgInfo = json.data.organization;
                        if(orgInfo && orgInfo.length && orgInfo.length > 0){
                            var targetData = [], targetLength = orgInfo.length, targetCurrent = 0;
                            $.each(orgInfo, function(i, item) {
                                targetCurrent = i;
                                var tempIcon =  (item.type == 'group' ? '<i class="iconfont icon-group">&#xe643;</i>' : '<i class="iconfont icon-user">&#xe642;</i>');
                                var $tempOrg = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" title="' + item.name + '" data-oid="' + item.id + '" data-pid="' + item.top_department_id + '"><span class="list-item-text">'+ tempIcon +'' + item.name + '</span></a></li>');
                                targetData.push(item);
                                o.append($tempOrg);
                                return function(){
                                    // 选择组织
                                    var json = {
                                        name: item.name,
                                        orgid: item.id,
                                        parentid: item.top_department_id,
                                        //app_ids: (item.app_ids ? item.app_ids.length : 0),
                                        //device_ids: (item.device_ids ? item.device_ids.length : 0),
                                        employee_count: item.employee_cnt,
                                        type: item.type
                                    };
                                    $tempOrg.find('a.list-item-inner').on('click', function(e) {
                                        e.stopPropagation();
                                        // 全局数据
                                        util.setCookie('orgid', json.orgid),
                                        util.setCookie('parentid', json.parentid),
                                        util.setCookie('orgname', json.name),
                                        util.setCookie('orgtype', json.type),
                                        //util.setCookie('device_ids', json.device_ids),
                                        //util.setCookie('app_ids', json.app_ids),
                                        util.setCookie('employee_count', json.employee_count),
                                        // update 20180306
                                        tempInfo.orgindex = $(this).parent('li.list-item').index();
                                        tempInfo.orgindexid = tempInfo.organization[tempInfo.orgindex].id;
                                        util.setCookie('orgindex', tempInfo.orgindex);
                                        util.setCookie('orgindexid', tempInfo.orgindexid);
                                        if(tempInfo.organization[tempInfo.orgindex].admin_id && tempInfo.organization[tempInfo.orgindex].admin_id == data.userid){
                                            util.setCookie('orgindexadmin', true);
                                            tempInfo.orgindexadmin = true;
                                            util.setUserData(tempInfo);
                                            kernel.replaceLocation({'args': {},'id': 'appentry'});
                                        }else{
                                            getAdminList({
                                                userid: data.userid,
                                                token: data.token,
                                                orgid: json.orgid,
                                                parentid: json.parentid
                                            }, function(res){
                                                console.log("orgindexadmin", res);
                                                util.setCookie('orgindexadmin', res);
                                                tempInfo.orgindexadmin = res;
                                                util.setUserData(tempInfo);
                                                kernel.replaceLocation({'args': {},'id': 'appentry'});
                                            });
                                        }
                                    });
                                }();
                            });
                            tempInfo.organization = targetData;
                            if(targetLength <= 0){
                                $loginBox.show();
                                $orgBox.hide();
                                //login status
                                $loginDoing.hide();
                                $loginSuccess.hide();
                                $loginSuccess.find('div.success-img >').remove();
                                $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                                $loginFail.show();
                            }else{
                                if(targetLength == 1){
                                    $loginBox.show();
                                    $orgBox.hide();
                                    //login status
                                    $loginDoing.show();
                                    $loginSuccess.hide();
                                    $loginFail.hide();
                                    //initQrcode($loginBox.find('.loginQr'))
                                    util.setCookie('orgid', orgInfo[targetCurrent].id),
                                    util.setCookie('parentid', orgInfo[targetCurrent].top_department_id),
                                    util.setCookie('orgname', orgInfo[targetCurrent].name),
                                    util.setCookie('orgtype', orgInfo[targetCurrent].type),
                                    //util.setCookie('device_ids', (orgInfo[targetCurrent].device_ids ? orgInfo[targetCurrent].device_ids.length : 0)),
                                    //util.setCookie('app_ids', (orgInfo[targetCurrent].app_ids ? orgInfo[targetCurrent].app_ids.length : 0)),
                                    util.setCookie('employee_count', orgInfo[targetCurrent].employee_cnt),
                                    // update 20181030
                                    tempInfo.orgindex = 0;
                                    tempInfo.orgindexid = tempInfo.organization[0].id;
                                    util.setCookie('orgindex', tempInfo.orgindex);
                                    util.setCookie('orgindexid', tempInfo.orgindexid);
                                    if(tempInfo.organization[tempInfo.orgindex].admin_id && tempInfo.organization[tempInfo.orgindex].admin_id == data.userid){
                                        util.setCookie('orgindexadmin', true);
                                        tempInfo.orgindexadmin = true;
                                        util.setUserData(tempInfo);
                                        kernel.replaceLocation({'args': {},'id': 'appentry'});
                                    }else{
                                        getAdminList({
                                            userid: data.userid,
                                            token: data.token,
                                            orgid: json.orgid,
                                            parentid: json.parentid
                                        }, function(res){
                                            console.log("orgindexadmin", res);
                                            util.setCookie('orgindexadmin', res);
                                            tempInfo.orgindexadmin = res;
                                            util.setUserData(tempInfo);
                                            kernel.replaceLocation({'args': {},'id': 'appentry'});
                                        });
                                    }
                                    kernel.replaceLocation({'args': {},'id': 'appentry'});
                                }else{
                                    $loginBox.hide();
                                    $orgBox.show();
                                    //login status
                                    $loginDoing.show();
                                    $loginSuccess.hide();
                                    $loginFail.hide();
                                    //initQrcode($loginBox.find('.loginQr'))
                                     if(targetLength <= 4){
                                        o.addClass('org-list-seldom');
                                    }else{
                                        o.addClass('org-list-plenty');
                                    }
                                }
                            }
                        }else{
                            $loginBox.show();
                            $orgBox.hide();
                            //login status
                            $loginDoing.hide();
                            $loginSuccess.hide();
                            $loginSuccess.find('div.success-img >').remove();
                            $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                            $loginFail.show();
                        }
                        if(data.type == 'websocket'){
                            //完成关闭websocket
                            ws.close();
                        }else if(data.type == 'polling'){
                            if(typeof ws === 'function'){
                                ws();
                            }
                        }
                    } else {
                        kernel.hint(json.msg);
                    }
                },
                error: function(res){
                    kernel.hint(res.msg);
                }
            });
        }
    }

    // 获取是否是子管理员
    function getAdminList(data, callback){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/group/'+ data.orgid +'',
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {},
            success: function(json) {
                if (json.code == 0) {
                    var admin_ids = []
                    if(json.data['result'].length > 0){
                        $.each(json.data['result'], function(i, item) {
                            $.each(item.admin_ids, function(j, inner) {
                                admin_ids.push(inner)
                            });
                        });
                    }
                    if(typeof callback === 'function'){
                        callback(($.inArray(data.userid, admin_ids) >= 0) ? true : false);
                    }
                } else {
                    kernel.hint(json.msg);
                }
            },
            error: function(res){
                kernel.hint(res.msg);
            }
        });
    }

    return {
        onload: function(force) {
            var h_userid, h_token, h_orgid, h_orgname, h_orgtype, h_parentid;
            h_userid = util.getCookie('userid'),
            h_token = util.getCookie('token'),
            h_orgid = util.getCookie('orgid'),
            h_orgname = util.getCookie('orgname'),
            h_orgtype = util.getCookie('orgtype'),
            h_parentid = util.getCookie('parentid');
            if(h_userid != 'undefined' && h_token != 'undefined' && h_orgid != 'undefined' && h_orgname != 'undefined' && h_orgtype != 'undefined' && h_parentid != 'undefined'){
                $loginBox.show();
                $orgBox.hide();
            }
        }
    };
});