/**
create delicloud.js for js_sdk api
@author tianlun
@param deli is a object, deli.method to use in the page
*/
(function(win) {
    'use strict';
    //客户端事件
    var clientEvents = [
        'backbutton'
    ];
    //方法列表
    var regMethods = [
        //通用接口(common)
        "common.navigation.setTitle",
        "common.navigation.setRight",
        "common.navigation.close",
        "common.navigation.setColors", //修改通知栏和导航栏颜色
        "common.image.upload",
        "common.image.preview",
        "common.file.upload",
        "common.location.open",
        "common.location.get",
        "common.message.share",
        "common.phone.vibrate",
        "common.connection.getNetworkType",
        "common.phone.getUUID",
        "common.phone.getInterface",
        "common.screen.keepAwake",
        "common.screen.breakAwake",
        //APP业务接口(app)
        "app.device.bind", //添加智能设备
        "app.user.telephoneCall", //打电话
        "app.user.chatOpen", //打开聊天会话
        "app.user.select", //选择企业通讯录中的人
        "app.department.select", //选择企业通讯录中的部门

        "common.notification.showPreloader",
        "common.notification.hidePreloader",
        "common.notification.toast", //提示toast
        "common.notification.prompt", //状态提示prompt

        "app.organization.create", //内部使用，进入创建组织
        "app.organization.select", //内部使用，选择组织
        "app.config.init",  //内部使用，进入开始使用
        "app.method.transit",  //内部使用，创建应用成功 ,进入开始使用
        "app.method.orgCreate", //内部使用，进入创建组织
        "app.method.checkJsApis", 
        "app.session.get", //获取令牌信息
        "app.user.get", //获取用户信息
        "app.organization.get", //获取组织信息
        "app.code.scan",
        "common.navigation.hide",
        "common.navigation.show",
        "common.navigation.goBack",
        "common.webview.close",
        "common.modal.show", //显示模态弹窗

        "app.storage.get",
        "app.storage.getInfo",
        "app.storage.set",
        "app.storage.remove",
        "app.storage.clear",

        "device.sdk.init",
        "device.sdk.api",
        "device.sdk.destory"
    ];
    var JSSDK_VERSION = '1.0.0';
    var ua = win.navigator.userAgent;
    var matches = ua.match(/DeliAppv+[a-zA-Z0-9.-]+/);
    //android兼容处理
    if (matches === null) {
        matches = ua.match(/DeliAppv+[a-zA-Z0-9.-]+/);
    }
    var version = matches;
    var already = false; //是否已初始化
    var config = null; //缓存config参数
    var appMethod = 'app.method.checkJsApis'; //权限校验方法名 app.method.checkJsApis, 防止抓包通过恶意请求,可以修改改为桥接处理
    var errorHandle = null; //缓存error回调
    var bridgeReady = false;
    /**
     *    deli.config 配置签名对象
     *    deli.ready 初始化完成
     *    deli.error 权限校验失败时
     */
    var deli = {
        ios: (/iPhone|iPad|iPod/i).test(ua),
        android: (/Android/i).test(ua),
        version: version,
        isDeliApp: function() {
            return ((this.version && this.version.length > 0) ? true : false);
        },
        type: function(obj) {
            return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        },
        config: function(obj) {
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
        },
        error: function(fn) {
            errorHandle = fn;
        },
        ready: function(callback) {
            //组织桥接 控制中心
            var fn = function(bridge) {
                if (!bridge) {
                    return console.log('bridge初始化失败')
                }
                //回调函数处理h5页面
                //to do: 判断config，进行权限校验 ,现在过滤config校验，直接访问
                // update time 2017-10-12 打开权限校验
                if (config === null || !config.sign) {
                    //callback(bridge);
                    setTimeout(function() {
                        errorHandle && errorHandle({
                            code: -1,
                            msg: '权限校验失败 配置签名对象错误'
                        });
                    });
                } else {
                    if (deli.ios) {
                        // 调试ios app
                        bridge.callHandler(appMethod, config, function(res) {
                            var data = res || {};
                            var code = data.code;
                            var msg = data.msg || '';
                            var result = data.data.result;
                            if (code == 0 && result == true) {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        code: -1,
                                        msg: '权限校验失败 ' + msg
                                    });
                                });
                            }
                        });
                    } else if (deli.android) {
                        var dataConfig = {
                            "path": "/app/premission/check/public",
                            "type": "get",
                            "params": config
                        };
                        // update time 2017-10-16 android、ios改为相同同桥接库 
                        bridge.callHandler(appMethod, dataConfig, function(res) {
                            var data = JSON.parse(res) || {};
                            var code = data.code;
                            var msg = data.msg || '';
                            var result = data.data.data.result; //data.data.data
                            if (code == 0 && result == true) {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        code: -1,
                                        msg: '权限校验失败 ' + msg
                                    });
                                });
                            }
                        });
                    }
                }

                //第一次初始化后要做的事情
                if (already === false) {
                    already = true;
                    //自定义事件
                    clientEvents.forEach(function(evt) {
                        //if (deli.ios) {}
                        bridge.registerHandler(evt, function(data, responseCallback) {
                            //console.log('注册事件默认回调', data, responseCallback);
                            var e = document.createEvent('HTMLEvents');
                            e.data = data;
                            e.initEvent(evt);
                            document.dispatchEvent(e);
                            responseCallback && responseCallback({
                                code: '0',
                                msg: '成功'
                            })
                        });
                        
                    });
                    if (config === null) {
                        var conf = {
                            url: encodeURIComponent(window.location.href),
                            js: JSSDK_VERSION
                        };
                    }
                }
            };
            // ios Bridge初始化
            var setupWebViewJavascriptBridge = function(callback) {
                if (window.WebViewJavascriptBridge){
                    return callback(WebViewJavascriptBridge);
                }
                if (window.WVJBCallbacks){
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() {
                    document.documentElement.removeChild(WVJBIframe)
                }, 0)
            };
            //已经完成初始化的情况
            if (deli.ios && win.WebViewJavascriptBridge) {
                //防止ready延迟导致的问题
                //init后，register的方法才能收到回调，重现方法：首次触发deli.ready延时
                try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        //客户端send
                        console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.msg);
                }
                return fn(WebViewJavascriptBridge);
            } else if (deli.android && win.WebViewJavascriptBridge) {
                try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        //客户端send
                        console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.msg);
                }
                // 安卓to do
                return fn(WebViewJavascriptBridge);
            }
            //初始化主流程
            if (deli.ios) {
                console.log('开始监听WebViewJavascriptBridgeReady事件');
                setupWebViewJavascriptBridge(function(bridge) {
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                });
            } else if (deli.android) {
                // android、ios 使用相同库
                console.log('开始监听WebViewJavascriptBridgeReady事件');
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    if (typeof WebViewJavascriptBridge === 'undefined') {
                        return console.log('WebViewJavascriptBridge 未定义');
                    }
                    try {
                        WebViewJavascriptBridge.init(function(data, responseCallback) {
                            //客户端send
                            //console.log('WebViewJavascriptBridge init: ', data, responseCallback);
                        });
                    } catch (e) {
                        console.log(e.msg);
                    }
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                }, false);
            } else {
                return console.log('很抱歉，尚未支持您所持设备');
            }
        }
    };

    //注册命名空间,"common.navigation.setTitle"生成deli.common.navigation.setTitle
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
        //初始位置   update 2017-09-14
        if (typeof WebViewJavascriptBridge === 'undefined') {
            return console.log('未定义WebViewJavascriptBridge');
        }
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
            console.log('统一响应：', response);
            if(deli.ios){
                var data = response || {};
                var code = data.code;
                var result = JSON.parse(data.result).data;
                if (code === '0') {
                    successCallback && successCallback.call(null, result);
                } else {
                    failCallback && failCallback.call(null, result, code);
                }
            }else if(deli.android){
                var data, code, result;
                if(typeof response == 'string'){
                    data = JSON.parse(response) || {};
                    code = data.code;
                    result = data.data;
                }else{
                    data = data = response || {};
                    code = data.code;
                    result = (data.type && data.type == 'callback') ? JSON.parse(data.result).data : data.data;
                }
                //code 0 表示成功, 其它表示失败
                if (code === '0') {
                    successCallback && successCallback.call(null, result);
                } else {
                    failCallback && failCallback.call(null, result, code);
                }
            }
        };
        var watch = true; //是否为监听操作，如果是监听操作，后面要注册事件
        //前端内容处理，设置默认参数属性
        if(deli.android){
            switch (method) {
                case 'common.image.preview':
                    for(var data=[],i=0;i<p.urls.length;i++)data.push("http"==p.urls[i].split("://")[0]?p.urls[i]:p.urls[i].split(",")[1]?p.urls[i].split(",")[1]:p.urls[i]);p.urls=data;
                    break;
                default:;
            }
        }
        //消息接入：android和iOS区分处理
        if (deli.android) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    
                    callback({
                        code: '0',
                        msg: '成功',
                        result: data,
                        type: 'callback'
                    });
                    
                    responseCallback && responseCallback({
                        code: '0',
                        msg: '成功'
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p, callback);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callback);
            }
        } else if (deli.ios) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    
                    callback({
                        code: '0',
                        msg: '成功',
                        result: data,
                        type: 'callback'
                    });
                    
                    responseCallback && responseCallback({
                        code: '0',
                        msg: '成功'
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p, callback);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callback);
            }
        }
    }
    //注册方法生成api
    regMethods.forEach(function(method) {
        regNameSpace(method, function(param, callbackSuccess, callbackFail) {
            //api
            generator(method, param, callbackSuccess, callbackFail);
        });
    });

    win.deli = deli;
    //支持amd && cmd
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = deli;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() {
            return deli;
        })
    }
}(this));