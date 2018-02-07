/**
    create delicloud-web-sdk.js for js_sdk api
    @author tianlun
    @param deli is a object, deli.method to use in the page
*/
(function(window) {
    'use strict';
    //方法列表
    var regMethods = [
        'getLoginStatus',
        'logout'
    ];
    var JSSDK_VERSION = '0.0.1';
    var version = '0.0.1';
    var already = false; //是否已初始化
    var config = null; //缓存config参数
    var errorHandle = null; //缓存error 回调
    var readyHandle = null; //缓存ready 回调
    var domReady = false;
/**
*    deli.config 配置签名对象
*    deli.ready 初始化完成
*    deli.error 权限校验失败时
*/
    var deli = {
        version: version,
        init: function(obj){
            var self = this;
            //第一次初始化后要做的事情
            if (already === false) {
                already = true;
                //to do: 判断config，处理PC端权限验证
                if(config === null || !config.sign){
                    console.log("配置错误，请重新填写配置", config);
                }else{
                    self.api({
                        type:"get",
                        url: "/web/v1.0/app/premission/check/public",
                        data: config,
                        success:function(res){
                            if(res.code == 0){
                                if(self.util.getQuery('user_id') === undefined && self.util.getCookie('user_id') == 'undefined' && self.util.getQuery('token') === undefined && self.util.getCookie('token') == 'undefined'){
                                    // 未登录
                                    alert('用户未登录或者登录信息已经过期，请重新登录');
                                    window.location.href = '/pc/?redirect='+location.href;
                                }else{
                                    self.prefixLoadTpl(self.util.getQuery('user_id') || self.util.getCookie('user_id'), self.util.getQuery('token')|| self.util.getCookie('token'));
                                    //self.prefixLoadTpl('36218627908278681611', '398cee2f-0b13-4b09-ac9f-0376cad0d75f');
                                }
                                readyHandle && readyHandle({
                                    data: res.data
                                });
                            }else{
                                var msg = '无效的appId';
                                alert('配置错误，请重新填写配置:' + msg);
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: -1
                                    });
                                });
                            }
                        },
                        error:function(res){
                            var msg = '无效的appId';
                            alert(msg);
                            setTimeout(function() {
                                errorHandle && errorHandle({
                                    message: '权限校验失败 ' + msg,
                                    errorCode: -1
                                });
                            });
                        }
                    });
                }
            }
        },
        config: function(obj) {
            var self = this;
            //这里对用户传进来的参数进行过滤
            if (!obj) {
                return;
            }
            //to do: 参数名待统一
            config = {
                appId: obj.appId || -1,
                timestamp: obj.timestamp,
                noncestr: obj.noncestr,
                sign: obj.signature
            };
            if (obj.appId) {
                config.appId = obj.appId;
            }
            self.init(obj);
        },
        api: function(param){
            var xhr = new XMLHttpRequest(),
            type = param.type || 'post',
            url = param.url;
            if (type === 'get' && param.data) {
                var strArr = []
                for (var key in param.data) {
                    if (param.data.hasOwnProperty(key)) {
                        strArr.push(key + '=' + param.data[key])
                    }
                }
                url = url + '?' + strArr.join('&')
            }
            xhr.open(type, url, true);
            if (!param.data) {
                param.data = {};
            }
            xhr.onreadystatechange = function() {
                var s;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            s = JSON.parse(xhr.responseText);
                        } catch (e) {}
                        if (s) {
                            if (s.code == 0) {
                                if (typeof param.success === 'function') {
                                    param.success(s);
                                }
                            } else {
                                if (typeof param.error === 'function') {
                                    param.error(s);
                                } else if (!param.silent) {
                                    alert(s.msg);
                                }
                                if (s.code == 9102112) {
                                    // 未登录
                                    alert(s.msg);
                                    window.location.href = '/pc/?redirect='+location.href;
                                }
                            }
                        } else {
                            if (typeof param.error === 'function') {
                                param.error(xhr, 'parse_error');
                            } else if (!param.silent) {
                                alert('数据解析失败: ' + xhr.responseText);
                            }
                        }
                    } else {
                        if (typeof param.error === 'function') {
                            param.error(xhr, 'network_error');
                        } else if (!param.silent) {
                            alert('网络或服务器错误: ' + xhr.status);
                        }
                    }
                    if (typeof param.complete === 'function') {
                        param.complete(xhr);
                    }
                }
            };
            if (param.data instanceof FormData) {
                //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                if(param.dauth){
                    xhr.setRequestHeader('Dauth', param.dauth);
                }
                xhr.send(param.data);
            } else {
                xhr.setRequestHeader('content-type', 'application/json');
                if(param.dauth){
                    xhr.setRequestHeader('Dauth', param.dauth);
                }
                xhr.send(JSON.stringify(param.data));
            }
        },
        error: function(fn) {
            errorHandle = fn;
        },
        ready: function(callback) {
            readyHandle = callback;
        },
        prefixLoadTpl: function(userid, token){
            var self = this;
            self.api({
                type:"get",
                url: "/web/v1.0/login/"+ userid +"",//362186279082786816
                data: {},
                success:function(res){
                    if(res.code == 0){
                        var connect =  (res.data.result.token && res.data.result.token.length > 0) ? 'connect' : 'noconnect';
                        if(connect == 'connect'){
                            //self.util.buildHash({args:{user_id:"",org_id:"",token:"",uuid:""}});
                        }else{
                            self.logout(userid, token);
                        }
                        // user_id token 
                        readyHandle && readyHandle({
                            data: connect
                        });
                    }
                },
                error:function(res){
                    if(res.code == 9102112 && res.code !=0){
                        setTimeout(function() {
                            errorHandle && errorHandle({
                                message: res.msg,
                                errorCode: -1
                            });
                        });
                    }else{
                        //alert('用户未登录或者登录信息已经过期，请重新登录');
                    }
                }
            });
            var _WrapPrivate = {
                //初始化
                init: function () {
                    //插入样式
                    document.head.innerHTML = document.head.innerHTML + "<style>.deli-wrap-header{width:100%;min-height:62px;margin-bottom:20px;background-color:#FDFDFD;box-shadow:0 2px 4px 0 rgba(0,0,0,.04)}.deli-wrap-footer{background-color: #cfd2d7;margin:0 auto}.deli-wrap-header.wrap-top{background:#fff}.deli-wrap-header.wrap-top.wrap-top-shadow{-webkit-box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}.deli-wrap-header .user-head{height:80px;background-color:#fff}.deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2)}.deli-wrap-header #head{height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px}.deli-wrap-header #head .logo-box{display:inline-block;float:left;width:235px;height:80px}.deli-wrap-header #head .logo-box .logo{display:inline-block;float:left;width:235px;height:38px;line-height:80px;background:url(http://192.168.0.101:4001/dev/site/index/images/logo.png) no-repeat;background-size:100% 100%;margin:20px 0}.deli-wrap-header #head .nav-top{height:40px;float:right;margin:20px 0}.deli-wrap-header #head .nav-top .user-center-btn{display:inline-block;margin-right:20px}.deli-wrap-header #head .nav-top .nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}.deli-wrap-header #head .nav-top .nav-item.nav-item-team{display:none}.deli-wrap-header #head .nav-top .nav-item a.navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}.deli-wrap-header #head .nav-top .nav-item a.navlink.nav-item-current{width:120px;padding:0 10px;color:#00d8d6;border:1px solid #00d8d6;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.deli-wrap-header #head .nav-top .nav-item a.navlink.nav-item-current.larget{width:140px;padding:0 20px}.deli-wrap-header #head .nav-top .nav-item a.navlink.nav-item-current .navlink-icon{font-size:12px;color:#00d8d6;position:absolute;right:10px}.deli-wrap-header #head .nav-top .nav-item a.navlink:hover{-background-color:#55BEBF;color:#00d8d6}.deli-wrap-header #head .nav-top .nav-item a.navlink-current{-background-color:#55BEBF;color:#00d8d6}.deli-wrap-header #head .nav-top .nav-item .awardapr{position:absolute;top:-4px;right:-10px;width:28px;height:19px;animation:newAni 1s infinite linear;background-image:url(http://192.168.0.101:4001/dev/site/index/images/awardapr.png)}.deli-wrap-header #head .nav-top .nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}.deli-wrap-header #head .nav-top .nav-item .son-nav-list a.sub-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.deli-wrap-header #head .nav-top .nav-item .son-nav-list a.sub-nav-item.current,.deli-wrap-header #head .nav-top .nav-item .son-nav-list a.sub-nav-item:hover{color:#00d8d6}.deli-wrap-header #head .nav-top .nologin{display:block;font-size:16px;margin-left:5px;width:100px}.deli-wrap-header #head .nav-top .nologin a{color:#00d8d6}.deli-wrap-header #head .nav-top .userBtn.hasLogin:hover{position:relative}.deli-wrap-header #head .nav-top .userBtn.hasLogin:hover>.user-panel{display:block}.deli-wrap-header #head .nav-top .user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}.deli-wrap-header #head .nav-top .user-panel .user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}.deli-wrap-header #head .nav-top .user-panel .user-info .user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}.deli-wrap-header #head .nav-top .user-panel .user-info i{display:none;position:absolute;top:8px;right:8px}.deli-wrap-header #head .nav-top .user-panel .user-info.visited i,.deli-wrap-header #head .nav-top .user-panel .user-info:hover i{display:block}.deli-wrap-header #head .nav-top .user-panel .user-asset{display:none;border:1px solid #d9d9d9;border-top:0}.deli-wrap-header #head .nav-top .user-panel .user-asset .user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}.deli-wrap-header #head .nav-top .user-panel .user-asset .user-asset-link:hover{color:#00d8d6}.deli-wrap-footer{background-color:#cfd2d7}.footer{padding-top:25px;-border-top:1px solid #ecf0f1}.footer-link{-height:100px}.footer-link dl{width:155px;float:left;-height:100px;margin-right:100px;margin-bottom:0}.footer-link dl.attus{position:relative;width:170px;margin-right:0}.footer-link dl.attus .icon-weixin-img{display:none;position:absolute;top:-80px;left:-25px;background-image:url(http://192.168.0.101:4001/dev/site/index/images/weixin.png);width:80px;height:80px}.footer-link dl.attus .icon-qq{margin-right:50px}.footer-link dl.attus .icon-weixin{position:relative}.footer-link dl.attus .icon-qq,.footer-link dl.attus .icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}.footer-link dl.attus .icon-qq:hover,.footer-link dl.attus .icon-weixin:hover{color:#55bfbe}.footer-link dl.attus .icon-weixin:hover .icon-weixin-img{display:block}.footer-link dl .kefu-phone{font-size:16px}.footer-link dl dt{font-size:16px;font-weight:700;line-height:26px;color:#666;letter-spacing:5px;margin-bottom:20px;opacity:.6;-moz-opacity:.6;-webkit-opacity:.6;-o-opacity:.6}.footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:15px;letter-spacing:5px}.footer-link dl dd a{font-size:16px;color:#333;letter-spacing:5px;display:inline-block}.footer-link dl dd:hover a{color:#fff}.footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center}</style>";
                    //插入元素
                    // header、footer 直接插入
                    var elementHeader = document.querySelector('.deli-wrap-header'), elementFooter = document.querySelector('.deli-wrap-footer');
                    elementHeader.innerHTML = '<div class="user-head"> <div id="head" class="clear"> <div class="logo-box clear"> <a href="javascript:;" class="logo"></a> </div> <div class="nav-top"> <ul class="nav-top-list clear"> <li class="nav-item"><a href="javascript:;" class="navlink navlink-current homeBtn">首页</a></li> <li class="nav-item"><a href="javascript:;" class="navlink orgBtn">组织通讯录</a></li> <li class="nav-item"><a href="javascript:;" class="navlink appBtn">应用</a></li> <li class="nav-item"><a href="javascript:;" class="navlink devBtn">设备</a></li> <li class="nav-item nav-item-team"> <a href="javascript:;" class="navlink nav-item-current"><span class="navlink-name">得力团队</span><span class="navlink-icon"><i class="iconfont">&#xe608;</i></span></a> <div class="sun-nav-list sun-nav-list-team"> <a class="sub-nav-item current" href="javascript:;">得力团队1</a> <a class="sub-nav-item" href="javascript:;">得力团队2</a> <a class="sub-nav-item" href="javascript:;">得力团队3</a> </div> </li> <li class="nav-item nav-item-login"> <div class="nologin"> <a href="javascript:;" class="green">退出</a> </div> <div class="login user-panel"> <a href="javascript:;" class="user-info fl" style="display: block;"> <img class="user-info-avatar" width="50" height="50" src="/images/user.png"> <i class="iconfont"></i> </a> <div class="user-asset fl" style="display: none;"> <a class="user-asset-link logout" href="javascript:;">退出登录</a> </div> </div> </li> </ul> </div> </div> </div>';
                    elementFooter.innerHTML = '<div class="footer container"><div class="footer-link clear"><dl><dt>使用帮助</dt><dd><a href="javascript:;">去购买智能设备</a></dd><dd><a href="javascript:;">App使用帮助</a></dd><dd><a href="javascript:;">网页使用帮助</a></dd></dl><dl><dt>应用开发商</dt><dd><a href="javascript:;">应用接入指南</a></dd></dl><dl><dt>关于我们</dt><dd><a href="javascript:;">加入我们</a></dd><dd><a href="javascript:;">联系我们</a></dd></dl><dl class="attus"><dt>联系我们</dt><dd class="kefu-phone">400-185-0555</dd><a class="share-icon icon-qq" href="javascript:;"><i class="iconfont">&#xe644;</i></a> <a class="share-icon icon-weixin" href="javascript:;"><i class="iconfont">&#xe609;</i><img class="icon-weixin-img" src="/images/qrcode.png"></a></dl></div><div class="footer-copyright">浙ICP备06004512号 Copyright ©2014 得力集团有限公司 版权所有</div>';
                    document.querySelector('.nologin a').addEventListener('click', function(){
                        self.util.setCookie('user_id', undefined);
                        self.util.setCookie('token', undefined);
                        window.location.href = '/pc/?redirect='+location.href;
                    }, false);
                }
            };
            //初始化
            _WrapPrivate.init();
            
            var updateURLParameter = function(url, param, paramVal){
                var TheAnchor = null;
                var newAdditionalURL = "";
                var tempArray = url.split("?");
                var baseURL = tempArray[0];
                var additionalURL = tempArray[1];
                var temp = "";
                if (additionalURL) {
                    var tmpAnchor = additionalURL.split("#");
                    var TheParams = tmpAnchor[0];
                        TheAnchor = tmpAnchor[1];
                    if(TheAnchor)
                        additionalURL = TheParams;

                    tempArray = additionalURL.split("&");

                    for (i=0; i<tempArray.length; i++)
                    {
                        if(tempArray[i].split('=')[0] != param)
                        {
                            newAdditionalURL += temp + tempArray[i];
                            temp = "&";
                        }
                    }        
                }else{
                    var tmpAnchor = baseURL.split("#");
                    var TheParams = tmpAnchor[0];
                        TheAnchor  = tmpAnchor[1];
                    if(TheParams)
                        baseURL = TheParams;
                }
                if(TheAnchor)
                paramVal += "#" + TheAnchor;
                var rows_txt = temp + "" + param + "=" + paramVal;
                return baseURL + "?" + newAdditionalURL + rows_txt;
            };
        },
        logout: function(userid, token){
            var self = this;
            self.api({
                type:"get",
                url: "/web/v1.0/login/logout",
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + self.util.buildDauth(token),
                data: {},
                success:function(res){
                    if(res.code == 0){
                        // user_id token 
                        readyHandle && readyHandle({
                            data:res.data
                        });
                    }else{
                    }
                },
                error:function(res){
                    setTimeout(function() {
                        errorHandle && errorHandle({
                            message: res.msg,
                            errorCode: -1
                        });
                    });
                }
            });
        },
        util: {
            setCookie: function(c_name, value, exdays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value = escape(value) + '; path=/' + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
                document.cookie = c_name + "=" + c_value;
            },
            getCookie: function(c_name) {
                var i, x, y, ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == c_name) {
                        return unescape(y);
                    }
                }
            },
            buildHash: function(loc) {
                var n, hash;
                for (n in loc.args) {
                    hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
                }
                return hash;
            },
            parseHash: function(hash) {
                var i, a, s, nl = {
                    args: {}
                };
                hash = hash.substr(1).replace(/[#\?].*$/, '');
                s = hash.match(/[^=&]+(=[^&]*)?/g);
                if (s) {
                    if (s[0].charAt(0) === '!') {
                        a = s[0].substr(1);
                        if (a in pages) {
                            nl.id = decodeURIComponent(a);
                        }
                    }
                    for (i = 1; i < s.length; i++) {
                        a = s[i].match(/^([^=]+)(=)?(.+)?$/);
                        if (a) {
                            nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
                        }
                    }
                }
                return nl;
            },
            getQuery: function(param) {
                var url = window.location.href;
                var searchIndex = url.indexOf('?');
                var searchParams = url.slice(searchIndex + 1).split('&');
                for (var i = 0; i < searchParams.length; i++) {
                    var items = searchParams[i].split('=');
                    if (items[0].trim() == param) {
                        return items[1].trim();
                    }
                }
            },
            SHA256: function(s) {
                var chrsz = 8;
                var hexcase = 0;

                function safe_add(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }

                function S(X, n) {
                    return (X >>> n) | (X << (32 - n));
                }

                function R(X, n) {
                    return (X >>> n);
                }

                function Ch(x, y, z) {
                    return ((x & y) ^ ((~x) & z));
                }

                function Maj(x, y, z) {
                    return ((x & y) ^ (x & z) ^ (y & z));
                }

                function Sigma0256(x) {
                    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
                }

                function Sigma1256(x) {
                    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
                }

                function Gamma0256(x) {
                    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
                }

                function Gamma1256(x) {
                    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
                }

                function core_sha256(m, l) {
                    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                    var W = new Array(64);
                    var a, b, c, d, e, f, g, h, i, j;
                    var T1, T2;
                    m[l >> 5] |= 0x80 << (24 - l % 32);
                    m[((l + 64 >> 9) << 4) + 15] = l;
                    for (var i = 0; i < m.length; i += 16) {
                        a = HASH[0];
                        b = HASH[1];
                        c = HASH[2];
                        d = HASH[3];
                        e = HASH[4];
                        f = HASH[5];
                        g = HASH[6];
                        h = HASH[7];
                        for (var j = 0; j < 64; j++) {
                            if (j < 16) W[j] = m[j + i];
                            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                            h = g;
                            g = f;
                            f = e;
                            e = safe_add(d, T1);
                            d = c;
                            c = b;
                            b = a;
                            a = safe_add(T1, T2);
                        }
                        HASH[0] = safe_add(a, HASH[0]);
                        HASH[1] = safe_add(b, HASH[1]);
                        HASH[2] = safe_add(c, HASH[2]);
                        HASH[3] = safe_add(d, HASH[3]);
                        HASH[4] = safe_add(e, HASH[4]);
                        HASH[5] = safe_add(f, HASH[5]);
                        HASH[6] = safe_add(g, HASH[6]);
                        HASH[7] = safe_add(h, HASH[7]);
                    }
                    return HASH;
                }

                function str2binb(str) {
                    var bin = Array();
                    var mask = (1 << chrsz) - 1;
                    for (var i = 0; i < str.length * chrsz; i += chrsz) {
                        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                    }
                    return bin;
                }

                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                }

                function binb2hex(binarray) {
                    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                    var str = "";
                    for (var i = 0; i < binarray.length * 4; i++) {
                        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                            hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                    }
                    return str;
                }
                s = Utf8Encode(s);
                return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
            },
            buildDauth: function(token) {
                var self = this;
                //userid timestamp token
                var hashLoc = window.location.search.substr(1) + token;
                var sha256 = self.util.SHA256(hashLoc);
                var hash = sha256.substr(0, 32);
                return hash;
            }
        }
    };

    //注册命名空间,"app.getLoginStatus"生成deli.app.getLoginStatus
    var regNameSpace = function(method, fn) {
        var arr = method.split('.');
        var namespace = deli;
        for (var i = 0, k = arr.length; i < k; i++) {
            if (i === k - 1) {
                namespace[arr[i]] = fn;
            }
            if (typeof namespace[arr[i]] === 'undefined') {
                namespace[arr[i]] = {};
            }
            namespace = namespace[arr[i]];
        }
    };
    //设置默认属性
    function setDefaultValue(obj, defaults, flag) {
        for (var i in defaults) {
            if (flag) {
                obj[i] = defaults[i];
            } else {
                obj[i] = obj[i] !== undefined ? obj[i] : defaults[i];
            }
        }
    }
    //生成器，处理传参、回调以及对特定方法特殊处理
    function generator(method, param, callbackSuccess, callbackFail) {
        //to do
        //console.log('调用方法：', method, '传参：', param);
        var p = param || {};
        var successCallback = function(res) {
            console.log('默认成功回调', method, res);
        };
        var failCallback = function(err) {
            console.log('默认失败回调', method, err)
        };
        if (callbackSuccess) {
            successCallback = callbackSuccess;
        }
        if (callbackFail) {
            failCallback = callbackFail;
        }
        //统一回调处理
        var callback = function(response) {
            //console.log('统一响应：', response);
            var data = response || {};
            var code = data.code;
            var result = data.result;
            //code 0 表示成功, 其它表示失败
            if (code === '0') {
                //数据处理
                switch(method){
                    case 'getLoginStatus':
                        result = data.result;
                    break;
                }
                successCallback && successCallback.call(null, result);
            } else {
                failCallback && failCallback.call(null, result, code);
            }
        };
        //前端内容处理, 消息接入
        switch (method) {
            case 'getLoginStatus':
            /*callback({
                code: '0',
                msg: '成功',
                result: {
                    'status':'connect'
                }
            });*/
            break;
        }
    }
    //注册方法生成api
    regMethods.forEach(function(method) {
        regNameSpace(method, function(param, callbackSuccess, callbackFail) {
            generator(method, param, callbackSuccess, callbackFail);
        });
    });

    window.deli = deli;

    if(window.deliAsyncInit) {
        unguard(window.deliAsyncInit)();
        function unguard(o) {
            if (!o.__wrapper) o.__wrapper = function() {
                try {
                    return o.apply(this, arguments)
                } catch (u) {
                    window.setTimeout(function() {
                        throw u
                    }, 0);
                    return false
                }
            };
            return o.__wrapper
        }
    }
    //支持amd && cmd
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = deli;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return deli;
        })
    }
    console.log("deli", deli);
}(this));