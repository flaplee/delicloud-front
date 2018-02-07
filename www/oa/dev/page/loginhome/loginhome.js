'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var $userlist = $('#header .user-head .nav-top .nav-top-list'),
        $userteam = $userlist.find('.nav-item-team'),
        $userpanel = $userlist.find('.nav-item-login'),
        $userlogout = $userpanel.find('.nologin'),
        $userlogin = $userpanel.find('.login');
    var $loginBox =  $('#loginhome .login-box'),
        $loginQr = $loginBox.find('#loginQr'),
        $loginDoing = $loginQr.find('.login-doing'),
        $loginSuccess = $loginQr.find('.login-success'),
        $successBtn = $loginSuccess.find('.success-btn'),
        $loginFail = $loginQr.find('.login-fail'),
        $failBtn = $loginFail.find('.fail-btn');
    var $orgBox = $('#orghome .org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list'),
        orgNumNull = 0;
    var stomp = null;
    var userInfo = {}, tempInfo = {};

    // init qrcode
    var initQrcode = function(o, status){
        o.addClass('login-loading');
        setTimeout(function(){
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
                            o.html('').append(kernel.makeQr(url, 300));
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
        }, 0);
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
                                self.appendChild(kernel.makeQr(url, 300));
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
        var sock = new SockJS('http://t.delicloud.com/web/web-gateway-websocket'); // http://192.168.0.202:9002
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
            tempInfo = json;
            util.setUserData(tempInfo);
            util.setCookie('tempInfo', JSON.stringify(tempInfo));
            $loginDoing.hide();
            $loginFail.hide();
            $loginSuccess.find('img.success-img').attr('src', json.avatar_url);
            $loginSuccess.find('img.success-img').attr('title', json.name);
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
                orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token}, function(){
                    $userlogin.show();
                    $userlogout.hide();
                    kernel.replaceLocation({'args':{},'id':'orghome'});
                }, function(){
                    $loginDoing.hide();
                    $loginSuccess.hide();
                    $loginSuccess.find('img.success-img').attr('src', json.avatar_url);
                    $loginSuccess.find('img.success-img').attr('title', json.name);
                    $loginFail.show();
                });
            }else{
                setTimeout(initQrcode($loginBox.find('.loginQr')), 1000);
            }
        });
    }

    function disconnect() {
        if (stomp != null) {
            stomp.disconnect();
        }
        //console.log("Disconnected");
    }

    function orgsCalls(o, data, callbackGt, callbackLt){
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/auth/my',
            dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.token),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    o.find('>').remove('');
                    var info = json.data.result,
                        length = info.length;
                    if(length == 1){
                        // 全局数据
                        util.setCookie('orgid', info[0].org_id),
                        util.setCookie('parentid', info[0].top_department_id),
                        util.setCookie('orgname', info[0].org_name);
                        // 获取组织adminid
                        /*util.ajaxSubmit({
                            type: 'get',
                            url: '/v1.0/org/'+ info[0].org_id +'',
                            dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.token),
                            success: function(json) {
                                if (json.code == 0) {
                                    util.setCookie('adminid', json.data.result['admin_id']);
                                }
                            }
                        });*/
                        // 首页数据
                        var newIdata = {
                            employee_count: info[0].employee_count,
                            app_ids: info[0].app_permission,
                            device_ids: info[0].device_permission,
                            department_ids: info[0].department_ids
                        };
                        util.setCookie('idata', JSON.stringify(newIdata));
                        kernel.replaceLocation({'args': {},'id': 'home'});
                    }
                    $.each(info, function(i, item) {
                        if(item.is_admin != undefined){
                            var $temp = $('<a class="sub-nav-item"  href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a>');
                            o.append($temp);
                            setOrgNav($temp, o.parent('.nav-item-team'), {
                                name: item.org_name,
                                orgid : item.org_id
                            });
                            // 切换组织
                            function setOrgNav(o, d, data) {
                                d.find('a.nav-item-current .navlink-name').text(data.name);
                                o.on('click', function() {
                                    var c = $(this);
                                    //util.setCookie('orgid', c.attr('data-oid'));
                                    util.setCookie('parentid', c.attr('data-pid'));
                                });
                            }
                            orgNumNull++;
                        }
                    });
                    if(orgNumNull > 0){
                        callbackGt();
                    }else{
                        callbackLt();
                    }
                } else {
                    kernel.hint(json.msg);
                }
            }
        });
    }
    return {
        onload: function(force) {
        }
    };
});