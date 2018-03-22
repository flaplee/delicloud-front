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
    var initQrcode = function(o, status){
        o.addClass('login-loading');
        util.ajaxSubmit({
            url: '/v1.0/barcode_login/public',
            silent: true,
            type:'get',
            success: function(json) {
                o.removeClass('login-loading');
                if(json.code == 0){
                    var res = json.data['result'],
                        cid = res.cid,
                        url = res.data;
                    if (url) {
                        o.html('');
                        new QRCode(document.getElementById('qrcode'), {
                            text: url,
                            width: 234,
                            height: 234,
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        connect(cid, 'disconnect');
                    } else {
                        o.html('');
                    }
                }else{
                    kernel.hint(json.msg);
                }
            },
            error: function(json){
                o.removeClass('login-loading');
                kernel.hint('网络或服务器错误~', 'error');
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
                util.ajaxSubmit({
                    url: '/v1.0/barcode_login/public',
                    silent: true,
                    type:'get',
                    success: function(json) {
                        if(json.code == 0){
                            var res = json.data['result'],
                                cid = res.cid,
                                url = res.data;
                            if (url) {
                                loginQr.html('');
                                new QRCode(document.getElementById('qrcode'), {
                                    text: url,
                                    width: 234,
                                    height: 234,
                                    correctLevel: QRCode.CorrectLevel.L
                                });
                                connect(cid);
                            } else {
                                loginQr.html('');
                                //更新user
                                //util.updateUserData();
                            }
                        }else{
                            kernel.hint(json.msg);
                        }
                    }
                });
            }
        }
    });

    $successBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'), 'disconnect');
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });

    $failBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'), 'disconnect');
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });
    
    // webscoket 
    function connect(cid, status){
        var sock = new SockJS(''+ (location.protocol == 'https:' ? 'https:' : 'http:') +'//t.delicloud.com/web/web-gateway-websocket');
        stomp = Stomp.over(sock);
        stomp.connect({}, function (frame) {
            var url = "/user/"+ cid +"/barcode/login";
            listenStomp(cid, url, status);
        });
    }

    function listenStomp(cid, url, status){
        //qrcode
        stomp.subscribe('/user/'+ cid +'/info', function(message){
            var json = JSON.parse(message.body);
            tempInfo.data = json;
            //util.setUserData(tempInfo.data);
            //util.setCookie('tempInfo.data', JSON.stringify(tempInfo.data));
            $loginDoing.hide();
            $loginFail.hide();
            $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'}).attr('title', json.name);
            $loginSuccess.show();
        });

        //login
        stomp.subscribe(url, function (message) {
            var json = JSON.parse(message.body);
            //console.log("json",json);
            if(json && json.user_id){
                userInfo = json;
                if(userInfo.type == 'web'){
                    //util.setUserData(userInfo);
                    util.setCookie('token', userInfo.token);
                    util.setCookie('userid', userInfo.user_id);
                    util.setCookie('expire', userInfo.expire);
                }
                if(status && status == 'disconnect'){
                    disconnect();
                }
                orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token});
            }else{
                initQrcode($loginBox.find('.loginQr'));
            }
        });
    }

    function disconnect() {
        if (stomp != null) {
            stomp.disconnect();
        }
    }

    function orgsCalls(o, data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/auth/my',
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    o.find('>').remove('');
                    var orgInfo = json.data.result;
                    if(orgInfo && orgInfo.length && orgInfo.length > 0){
                        var targetData = [], targetLength = orgInfo.length, targetCurrent = 0;
                        $.each(orgInfo, function(i, item) {
                            if((item.is_admin && item.is_admin == true) || item.department_ids || item.app_ids || item.device_ids){
                                targetCurrent = i;
                                var $tempOrg = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" title="' + item.org_name + '" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a></li>');
                                targetData.push(item);
                                o.append($tempOrg);
                                return function(){
                                    // 选择组织
                                    var data = {
                                        name: item.org_name,
                                        orgid: item.org_id,
                                        parentid: item.top_department_id,
                                        app_ids: (item.app_ids ? item.app_ids.length : 0),
                                        device_ids: (item.device_ids ? item.device_ids.length : 0),
                                        employee_count: item.employee_count
                                    };
                                    $tempOrg.find('a.list-item-inner').on('click', function(e) {
                                        e.stopPropagation();
                                        // 全局数据
                                        util.setCookie('orgid', data.orgid),
                                        util.setCookie('parentid', data.parentid),
                                        util.setCookie('orgname', data.name),
                                        util.setCookie('device_ids', data.device_ids),
                                        util.setCookie('app_ids', data.app_ids),
                                        util.setCookie('employee_count', data.employee_count),
                                        // update 20180306
                                        tempInfo.orgindex = $(this).parent('li.list-item').index();
                                        util.setCookie('orgindex', tempInfo.orgindex);
                                        util.setUserData(tempInfo);
                                        kernel.replaceLocation({'args': {},'id': 'home'});
                                    });
                                }();
                            }else{
                                targetLength--;
                            }
                        });
                        tempInfo.organization = targetData;
                        if(targetLength <= 0){
                            $loginBox.show();
                            $orgBox.hide();
                            //login status
                            $loginDoing.hide();
                            $loginSuccess.hide();
                            $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'}).attr('title', json.name);
                            $loginFail.show();
                        }else{
                            if(targetLength == 1){
                                $loginBox.show();
                                $orgBox.hide();
                                //login status
                                $loginDoing.show();
                                $loginSuccess.hide();
                                $loginFail.hide();
                                initQrcode($loginBox.find('.loginQr'))
                                util.setCookie('orgid', orgInfo[targetCurrent].org_id),
                                util.setCookie('parentid', orgInfo[targetCurrent].top_department_id),
                                util.setCookie('orgname', orgInfo[targetCurrent].org_name),
                                util.setCookie('device_ids', (orgInfo[targetCurrent].device_ids ? orgInfo[targetCurrent].device_ids.length : 0)),
                                util.setCookie('app_ids', (orgInfo[targetCurrent].app_ids? orgInfo[targetCurrent].app_ids.length : 0)),
                                util.setCookie('employee_count', orgInfo[targetCurrent].employee_count),
                                // update 20180306
                                tempInfo.orgindex = targetCurrent;
                                util.setUserData(tempInfo);
                                kernel.replaceLocation({'args': {},'id': 'home'});
                            }else{
                                $loginBox.hide();
                                $orgBox.show();
                                //login status
                                $loginDoing.show();
                                $loginSuccess.hide();
                                $loginFail.hide();
                                initQrcode($loginBox.find('.loginQr'))
                                 if(targetLength<=4){
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
                        $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'}).attr('title', json.name);
                        $loginFail.show();
                    }
                } else {
                    kernel.hint(json.msg);
                }
            }
        });
    }
    return {
        onload: function(force) {
            var h_userid, h_token, h_orgid, h_orgname, h_parentid;
            h_userid = util.getCookie('userid'),
            h_token = util.getCookie('token'),
            h_orgid = util.getCookie('orgid'),
            h_orgname = util.getCookie('orgname'),
            h_parentid = util.getCookie('parentid');
            if(h_userid != 'undefined' && h_token != 'undefined' && h_orgid != 'undefined' && h_orgname != 'undefined' && h_parentid != 'undefined'){
                $loginBox.show();
                $orgBox.hide();
            }
        }
    };
});