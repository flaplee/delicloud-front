$(function() {
    var $login = $('#login'),
        $loginBox = $login.find('.login-box'),
        $loginQr = $loginBox.find('#loginQr'),
        $loginDoing = $loginQr.find('.login-doing'),
        $loginSuccess = $loginQr.find('.login-success'),
        $successBtn = $loginSuccess.find('.success-btn'),
        $loginFail = $loginQr.find('.login-fail'),
        $failBtn = $loginFail.find('.fail-btn');
        $orgBox = $login.find('.org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list'),
        $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'),
        $orgNavList = $navTeam.find('.son-nav-list-team');
    var userInfo = {}, stomp = null, orgNumNull = 0;
    // init
    initQrcode($loginBox.find('.loginQr'));

    $(document).on('click', '.loginQr', function() {
        var self = this,
            loginQr = $loginBox.find('.loginQr'),
            that = loginQr[this === loginQr[0] ? 1 : 0];
        if (this.childNodes.length === 0) {
            if (that && that.childNodes.length > 0) {
                this.innerHTML = that.innerHTML;
            } else {
                $.ajax({
                    url: '/web/v1.0/barcode_login/public',
                    type: 'get',
                    dataType: 'json',
                    success: function(json) {
                        if (json.code == 0) {
                            var res = json.data['result'],
                                cid = res.cid,
                                url = res.data;
                            if (url) {
                                loginQr.html('');
                                //self.appendChild(kernel.makeQr(url, 300));
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
                            }
                        } else {
                            alert(json.msg);
                        }
                    },
                    error: function(json) {
                        alert('网络或服务器错误');
                    }
                });
            }
        }
    });
    
    $successBtn.on('click', function() {
        initQrcode($loginBox.find('.loginQr'), 'disconnect');
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });;

    $failBtn.on('click', function() {
        initQrcode($loginBox.find('.loginQr'), 'disconnect');
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });;

    // init qrcode
    function initQrcode(o, status) {
        o.addClass('login-loading');
        setTimeout(function() {
            $.ajax({
                url: '/web/v1.0/barcode_login/public',
                type: 'get',
                dataType: 'json',
                success: function(json) {
                    o.removeClass('login-loading');
                    if (json.code == 0) {
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
                    } else {
                        alert(json.msg);
                    }
                },
                error: function(json) {
                    alert('网络或服务器错误');
                }
            });
        }, 0);
    };

    // webscoket 
    function connect(cid, status) {
        var sock = new SockJS('http://t.delicloud.com/web/web-gateway-websocket');
        stomp = Stomp.over(sock);
        stomp.connect({}, function(frame) {
            var url = "/user/" + cid + "/barcode/login";
            listenStomp(cid, url, status);
        });
    }

    function listenStomp(cid, url, status) {
        //qrcode
        stomp.subscribe('/user/' + cid + '/info', function(message) {
            var json = JSON.parse(message.body);
            console.log("json~~~~~~~~~~~", json);
            $loginDoing.hide();
            $loginFail.hide();
            $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'});
            $loginSuccess.find('div.success-img').attr('title', json.name);
            $loginSuccess.show();
        });

        //login
        stomp.subscribe(url, function(message) {
            var json = JSON.parse(message.body);
            //console.log("json",json);
            if (json && json.user_id) {
                userInfo = json;
                if (userInfo.type == '_user_') {
                    util.setCookie('token', userInfo.token);
                    util.setCookie('userid', userInfo.user_id);
                    util.setCookie('expire', userInfo.expire);
                }
                if (status && status == 'disconnect') {
                    disconnect();
                }
                orgsCalls($orgList, $orgNavList, {
                    userid: userInfo.user_id,
                    token: userInfo.token
                }, function(orgid) {
                    // set url redirect
                    var login = /\/login\b/, url = util.getQuery('redirect', true);
                    if (login.test(url)){
                        url = util.updateURLParameter(url, 'redirect', window.location.href);
                    }
                    //set app url cookies
                    util.setCookie('user_id', userInfo.user_id, 7, undefined, url),
                    util.setCookie('org_id',orgid, 7, undefined, url),
                    util.setCookie('token', userInfo.token, 7, undefined, url);
                    util.setCookie('uuid', '', 7, undefined, url);
                    window.location.href = url + '?user_id='+ userInfo.user_id +'&org_id='+ orgid +'&token='+ userInfo.token +'&uuid=';
                }, function() {
                    $loginDoing.hide();
                    $loginSuccess.hide();
                    $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'});
                    $loginSuccess.find('img.success-img').attr('title', json.name);
                    $loginFail.show();
                });
            } else {
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

    function orgsCalls(o, os, data, callbackGt, callbackLt) {
        $.ajax({
            url: '/web/v1.0/admin/auth/my',
            type: 'get',
            dataType: 'json',
            headers: {
                Dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + util.buildDauth(data.token),
            },
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    var orgInfo = json.data.result, length = orgInfo.length, tempInfo = [];
                    o.find('>').remove('');
                    os.find('>').remove('');
                    // 组织列表
                    (length <= 3) ? ((length == 1) ? kernel.replaceLocation({'args': {},'id': 'contacts'}) && (util.setCookie('orgid', orgInfo[0].org_id), util.setCookie('parentid', orgInfo[0].top_department_id), util.setCookie('orgname', orgInfo[0].org_name)) : o.addClass('org-list-seldom')) : o.addClass('org-list-plenty');
                    $.each(orgInfo, function(i, item) {
                        if(item.is_admin == true){
                            var idata = {
                                employee_count: item.employee_count,
                                app_ids: item.app_permission,
                                device_ids: item.device_permission,
                                department_ids: item.department_ids
                            };
                            var $tempOrg = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a></li>');
                            var $tempOrgNav = $('<a class="sub-nav-item noline"  href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a>');
                            o.append($tempOrg), os.append($tempOrgNav);
                            setOrgList($tempOrg), setOrgNav($tempOrgNav, o.parent('.nav-item-team'), {
                                name: item.org_name,
                                orgid : item.org_id
                            });
                            orgNumNull++;
                            // 切换组织
                            function setOrgNav(o, d, data) {
                                o.on('click', function(e) {
                                    var e= e || window.e;
                                    e.stopPropagation();
                                    var c = $(this), pid = c.attr('data-pid');
                                    if(!c.hasClass('current')){
                                        c.siblings().removeClass('current');
                                        c.addClass('current');
                                    }
                                    $(".son-nav-list-team").hide();
                                    util.setCookie('parentid', pid);
                                    d.find('a.nav-item-current .navlink-name').text(data.name);
                                });
                            }
                            // 选择组织
                            function setOrgList(o) {
                                o.find('a.list-item-inner').on('click', function(e) {
                                    e.stopPropagation();
                                    util.setCookie('orgid', item.org_id);
                                    util.setCookie('parentid', item.top_department_id);
                                    util.setCookie('orgname', item.org_name);
                                    util.setCookie('idata', JSON.stringify(idata));
                                    if (typeof callbackGt === 'function') {
                                        callbackGt(item.org_id);
                                    }
                                });
                            }
                        }
                    });
                    if(orgNumNull > 0){
                        $loginBox.hide();
                        $orgBox.show();
                    }else{
                        $loginBox.show();
                        $orgBox.hide();
                        if(typeof callbackLt === 'function'){
                            callbackLt();
                        }
                    }
                } else {
                    alert(json.msg);
                }
            },
            error: function(json) {
                alert('网络或服务器错误');
            }
        });
    }
});