"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){function i(e,i,t,o){var a=function(i){console.log("默认成功回调",e,i)},n=function(i){console.log("默认失败回调",e,i)};t&&(a=t),o&&(n=o);switch(e){case"app.onlogout":!function(i){var t=i||{},o=t.code,l=t.result;if("0"===o){switch(e){case"app.onlogout":l=t.result}a&&a.call(null,l)}else n&&n.call(null,l,o)}({code:"0",msg:"成功",result:{"app.onlogout":"app.onlogout"}})}}var t=["getLoginStatus","app.onlogout"],o=!1,a=null,n=null,l=null,d="http://t.delicloud.com";!function(){function i(e,i,t){return e+=-1==e.indexOf("?")?"?":"&",e+=encodeURIComponent(i)+"="+encodeURIComponent(t)}function t(e){var i="",t="";for(var o in e)t=o+"="+e[o],i+=t+"&";return i.slice(0,i.length-1)}var o=function(e){this.config={url:"",type:"get",async:!0,dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",data:{}},this.start(e)},a=null;o.init=function(e){new o(e)},o.prototype={constructor:o,createXHR:function(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString){var e,i,t=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];for(e=0,i=t.length;e<i;e++)try{new ActiveXObject(t[e]),arguments.callee.activeXString=t[e];break}catch(e){}}return new ActiveXObject(arguments.callee.activeXString)}throw new Error("No XHR object available.")},start:function(o){if(a=new this.createXHR,!o.url)throw new Error("url cannot be null!");this.config.url=o.url,o.type&&(this.config.type=o.type),o.async&&(this.config.async=o.async),o.dataType&&(this.config.dataType=o.dataType),o.data&&(this.config.data=o.data),o.success&&(this.config.success=o.success),o.fail&&(this.config.fail=o.fail),o.beforeSend&&o.beforeSend();var n=function(){if(4==a.readyState)if(a.status>=200&&a.status<300||304==a.status)o.success&&o.success(a.responseText);else{if(!o.fail)throw new Error("Request was unsucessful:"+a.status);o.fail()}};if("json"==this.config.dataType||"JSON"==this.config.dataType){if("GET"==this.config.type||"get"==this.config.type){for(var l in this.config.data)this.config.url=i(this.config.url,l,this.config.data[l]);a.onreadystatechange=n,a.open(this.config.type,this.config.url,this.config.async),a.send(null)}"POST"!=this.config.type&&"post"!=this.config.type||(a.addEventListener("readystatechange",n),a.open(this.config.type,this.config.url,this.config.async),o.contentType&&(this.config.contentType=o.contentType),a.setRequestHeader("Content-Type",this.config.contentType),a.send(t(this.config.data)))}else{if("jsonp"!=this.config.dataType&&"JSONP"!=this.config.dataType)throw new Error("dataType is error!");if("GET"==this.config.type||"get"==this.config.type){if(!o.url||!o.callback)throw new Error("params is illegal!");this.config.callback=o.callback;var d="callback",r=document.getElementsByTagName("head")[0];this.config[this.config.callback]=d;var s=document.createElement("script");r.appendChild(s),e[d]=function(i){r.removeChild(s),clearTimeout(s.timer),e[d]=null,o.success&&o.success(i)},o.time&&(s.timer=setTimeout(function(){r.removeChild(s),o.fail&&o.fail({message:"over time"}),e[d]=null},o.time)),this.config.url=this.config.url+"?callback="+d;for(var l in this.config.data)this.config.url=i(this.config.url,l,this.config.data[l]);s.src=this.config.url}}}},e.deliApi=o}();var r={version:"1.0.1",init:function(i){var t=this;!1===o&&(o=!0,null!==a&&a.sign?deliApi.init({url:d+"/web/v1.0/cd/premission/check/public",type:"get",dataType:"jsonp",data:a,callback:"callback",success:function(i){if(0==i.code)void 0===t.util.getQuery("user_id")&&"undefined"==t.util.getCookie("user_id")&&void 0===t.util.getQuery("token")&&"undefined"==t.util.getCookie("token")?(alert("用户未登录或者登录信息已经过期，请重新登录"),e.location.replace(d+"/oa/")):t.prefixLoadTpl(t.util.getQuery("user_id")||t.util.getCookie("user_id"),t.util.getQuery("token")||t.util.getCookie("token"));else{var o=i.msg?i.msg:"网络或服务器错误",a=i.msg?"-1":"-3";setTimeout(function(){n&&n({message:"权限校验失败 "+o,errorCode:a})})}},fail:function(e){var i=e.msg?e.msg:"网络或服务器错误",t=e.msg?"-1":"-3";setTimeout(function(){n&&n({message:"权限校验失败 "+i,errorCode:t})})}}):console.log("配置错误，请重新填写配置",a))},config:function(e){var i=this;e&&(a={appId:e.appId||-1,timestamp:e.timestamp,noncestr:e.noncestr,sign:e.signature},e.appId&&(a.appId=e.appId),i.init(e))},api:function(i){var t=new XMLHttpRequest,o=i.type||"post",a=i.url;if("get"===o&&i.data){var n=[];for(var l in i.data)i.data.hasOwnProperty(l)&&n.push(l+"="+i.data[l]);a=a+"?"+n.join("&")}t.open(o,a,!0),i.data||(i.data={}),t.onreadystatechange=function(){var o;if(4===t.readyState){if(200===t.status){try{o=JSON.parse(t.responseText)}catch(e){}o?0==o.code?"function"==typeof i.success&&i.success(o):("function"==typeof i.error?i.error(o):i.silent||alert(o.msg),9102112==o.code&&(alert(o.msg),e.location.replace(d+"/oa/"))):"function"==typeof i.error?i.error(t,"parse_error"):i.silent||alert("数据解析失败: "+t.responseText)}else"function"==typeof i.error?i.error(t,"network_error"):i.silent||alert("网络或服务器错误: "+t.status);"function"==typeof i.complete&&i.complete(t)}},i.data instanceof FormData?(i.dauth&&(t.setRequestHeader("Dauth",i.dauth),t.setRequestHeader("Duagent","_web")),t.send(i.data)):(t.setRequestHeader("content-type","application/json"),i.dauth&&(t.setRequestHeader("Dauth",i.dauth),t.setRequestHeader("Duagent","_web")),t.send(JSON.stringify(i.data)))},apiJsonp:function(i){if(i=i||{},!i.url||!i.callback)throw new Error("参数不合法");var t=("jsonp_"+Math.random()).replace(".",""),o=document.getElementsByTagName("head")[0];i.data[i.callback]=t;var a=function(e){var i=[];for(var t in e)i.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return i.join("&")}(i.data),n=document.createElement("script");o.appendChild(n),e[t]=function(a){o.removeChild(n),clearTimeout(n.timer),e[t]=null,i.success&&i.success(a)},n.src=i.url+"?"+a,i.time&&(n.timer=setTimeout(function(){e[t]=null,o.removeChild(n),i.fail&&i.fail({message:"超时"})},time))},error:function(e){n=e},ready:function(e){l=e},prefixLoadTpl:function(i,t){var o=this,a={init:function(){document.head.innerHTML=document.head.innerHTML+'                    <style>body,button,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,legend,li,ol,p,td,textarea,th,ul{margin:0;padding:0}                    i{font-style:normal}                    ul{list-style:none}                    table{border-collapse:collapse;border-spacing:0}                    body{font-size:12px;font-family:Microsoft YaHei UI,"微软雅黑",Heiti SC,Droid Sans;color:#666;background-color:#fff}                    .deli-wrap-header a{color:#666;text-decoration:none;hide-focus:expression(this.hideFocus=true);outline:0}                    .deli-wrap-header a:hover{text-decoration:none}                    .deli-wrap-header a img{border:none}                    .deli-wrap-header .pointer{cursor:pointer}                    .deli-wrap-header{width:100%;height:80px;background-color:#FDFDFD;box-shadow:0 2px 4px 0 rgba(0,0,0,.04)}                    .deli-wrap-deli-footer{background-color:#cfd2d7;margin:0 auto}                    .deli-wrap-header.deli-wrap-top{background:#fff}                    .deli-wrap-header.deli-wrap-top.deli-wrap-top-shadow{-webkit-box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}                    .deli-wrap-header .deli-user-head{width:1200px;height:80px;margin:0 auto;background-color:#fff}                    .deli-clear:after{visibility:hidden;display:block;font-size:0;content:"";clear:both;height:0}                    .deli-clear{zoom:1}                    .deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2)}                    .deli-wrap-header #deli-head{height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px}                    .deli-wrap-header #deli-head .deli-logo-box{display: inline-block; position: absolute; bottom: 0; left: 0;}                    .deli-wrap-header #deli-head .deli-logo-box .deli-logo{display: inline-block; float: left; width: 178px; height: 50px; line-height: 50px; margin: 15px 0;background-image: url(https://static.delicloud.com/www/home/images/logo.png?v=20180317); background-repeat: no-repeat; background-size: cover;}                    .deli-wrap-header #deli-head .deli-nav-top{width: 900px; height: 40px; position: absolute; bottom: 20px; right: 20px;}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-team{display:none}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current{width:120px;padding:0 10px;color:#5d85e0;border:1px solid #5d85e0;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current.larget{width:140px;padding:0 20px}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current .deli-navlink-icon{font-size:12px;color:#5d85e0;position:absolute;right:10px}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink:hover{-background-color:#55BEBF;color:#5d85e0}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink-current{-background-color:#55BEBF;color:#5d85e0}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item.current,.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item:hover{color:#5d85e0}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-login{position: absolute; right: 0; text-align: center;}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-device{margin-left: 0;}                    deli-wrap-header #deli-head .deli-nav-top .deli-nologin{display:block;font-size:16px;margin-left:5px;width:100px}                    .deli-wrap-header #deli-head .deli-nav-top .deli-nologin a{font-size:16px;color:#5d85e0;text-decoration:none}                    .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover{position:relative}                    .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover>.deli-user-panel{display:block}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info .deli-user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info i{display:none;position:absolute;top:8px;right:8px}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info.visited i,.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info:hover i{display:block}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset{display:none;border:1px solid #d9d9d9;border-top:0}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link:hover{color:#5d85e0}                    .deli-wrap-footer{background-color:#cfd2d7}                    .deli-footer{padding-top:25px;width:1200px;margin:0 auto}                    .deli-footer-link{-height:100px}                    .deli-footer-link dl{width:155px;float:left;-height:100px;margin-right:100px;margin-bottom:0}                    .deli-footer-link dl.deli-attus{position:relative;width:170px;margin-right:0}                    .deli-footer-link dl.deli-attus .deli-icon-weixin-img{display:none;position:absolute;top:-80px;left:-25px;background-image:url(https://static.delicloud.com/www/home/images/weixin.png);width:80px;height:80px}                    .deli-footer-link dl.deli-attus .deli-icon-qq{margin-right:50px}                    .deli-footer-link dl.deli-attus .deli-icon-weixin{position:relative}                    .deli-footer-link dl.deli-attus .deli-icon-qq,.deli-footer-link dl.deli-attus .deli-icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}                    .deli-footer-link dl.deli-attus .deli-icon-qq:hover,.deli-footer-link dl.deli-attus .deli-icon-weixin:hover{color:#55bfbe}                    .deli-footer-link dl.deli-attus .deli-icon-weixin:hover .deli-icon-weixin-img{display:block}                    .deli-footer-link dl .deli-kefu-phone{font-size:16px}                    .deli-footer-link dl dt{font-size:16px;font-weight:700;line-height:26px;color:#666;letter-spacing:5px;margin-bottom:20px;opacity:.6;-moz-opacity:.6;-webkit-opacity:.6;-o-opacity:.6}                    .deli-footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:15px;letter-spacing:5px}                    .deli-footer-link dl dd a{font-size:16px;color:#333;letter-spacing:5px;display:inline-block;text-decoration:none}                    .deli-footer-link dl dd:hover a{color:#fff;text-decoration:none}                    .deli-footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center}</style>';var a=document.createElement("div"),n=document.createElement("div");a.className="deli-wrap-header",n.className="deli-wrap-footer",a.innerHTML='<div class="deli-user-head">                        <div id="deli-head" class="deli-clear">                            <div class="deli-logo-box">                                <a href="https://www.delicloud.com/" class="deli-logo" title="得力e+"></a>                            </div>                            <div class="deli-nav-top">                                <ul class="deli-nav-top-list deli-clear">                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/" class="deli-navlink">首页</a>                                    </li>                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/#!contacts" class="deli-navlink">组织通讯录</a>                                    </li>                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/#!apphome" class="deli-navlink">应用</a>                                    </li>                                    <li class="deli-nav-item deli-nav-item-device"><a href="https://www.delicloud.com/oa/#!device" class="deli-navlink">设备</a>                                    </li>                                    <li class="deli-nav-item deli-nav-item-team"><a href="javascript:;" class="deli-navlink deli-nav-item-current"><span class="deli-navlink-name"></span> <span class="deli-navlink-icon"><i class="iconfont">&#xe608;</i></span></a>                                        <div class="sun-nav-list sun-nav-list-team">                                            <a class="sub-deli-nav-item current" href="javascript:;"></a>                                            <a class="sub-deli-nav-item" href="javascript:;"></a>                                            <a class="sub-deli-nav-item" href="javascript:;"></a>                                        </div>                                    </li>                                    <li class="deli-nav-item deli-nav-item-login">                                        <div class="deli-nologin"><a href="javascript:;" class="deli-nologin-btn">退出</a></div>                                        <div class="deli-login deli-user-panel">                                            <a href="javascript:;" class="deli-user-info fl" style="display:block">                                                <img class="deli-user-info-avatar" width="50" height="50" src=""><i class="iconfont"></i>                                            </a>                                            <div class="deli-user-asset fl" style="display:none"><a class="deli-user-asset-link deli-logout" href="javascript:;">退出登录</a>                                            </div>                                        </div>                                    </li>                                </ul>                            </div>                        </div>                    </div>',n.innerHTML='<div class="deli-footer">                        <div class="deli-footer-link deli-clear">                            <dl><dt>使用帮助</dt>                                <dd><a href="javascript:;">去购买智能设备</a>                                </dd>                                <dd><a href="javascript:;">App使用帮助</a>                                </dd>                                <dd><a href="javascript:;">网页使用帮助</a>                                </dd>                            </dl>                            <dl><dt>应用开发商</dt>                                <dd><a href="javascript:;">应用接入指南</a>                                </dd>                            </dl>                            <dl><dt>关于我们</dt>                                <dd><a href="javascript:;">加入我们</a>                                </dd>                                <dd><a href="javascript:;">联系我们</a>                                </dd>                            </dl>                            <dl class="deli-attus"><dt>联系我们</dt>                                <dd class="deli-kefu-phone">400-185-0555</dd>                            </dl>                        </div>                        <div class="deli-footer-copyright">鄂ICP备17027057号  Copyright &copy;2018 武汉得力智能办公研究院有限公司 版权所有</div>                    </div>',document.body.appendChild(n),document.body.insertBefore(a,document.body.firstElementChild),document.querySelector(".deli-wrap-header .deli-nologin a.deli-nologin-btn").addEventListener("click",function(){o.util.setCookie("userid",void 0),o.util.setCookie("token",void 0),o.logout(i,t,function(){e.location.replace(d+"/oa/")})},!1)}};i&&t?deliApi.init({url:d+"/web/v1.0/cd/login/"+i+"/web",type:"get",dataType:"jsonp",data:{},callback:"callback",success:function(e){if(0==e.code){"connect"==(e.data.result.token&&e.data.result.token.length>0?"connect":"noconnect")?(o.util.setCookie("userid",e.data.result.user_id),o.util.setCookie("token",e.data.result.token)):o.logout(i,t),a.init()}},fail:function(l){if(0==l.code){"connect"==(l.data.result.token&&l.data.result.token.length>0?"connect":"noconnect")||o.logout(i,t),a.init()}else 9102112==l.code?setTimeout(function(){n&&n({message:l.msg,errorCode:-1})}):(alert("用户未登录或者登录信息已经过期，请重新登录"),e.location.replace(d+"/oa/"))}}):(alert("用户未登录或者登录信息已经过期，请重新登录"),e.location.replace(d+"/oa/"))},logout:function(e,i,t){var o=this;deliApi.init({url:d+"/web/v1.0/cd/logout/web",type:"get",dataType:"jsonp",data:{Dauth:e+" "+(new Date).valueOf()+" "+o.util.buildDauth(e,i,(new Date).valueOf()),Duagent:"_web"},callback:"callback",success:function(e){0==e.code?(o.util.setCookie("userid",void 0),o.util.setCookie("token",void 0),l&&l({data:e.data}),"function"==typeof t&&t()):"function"==typeof t&&t()},fail:function(e){"function"==typeof t&&t(),setTimeout(function(){n&&n({message:e.msg,errorCode:-1})})}})},util:{setCookie:function(e,i,t){var o=new Date;o.setDate(o.getDate()+t);var a=escape(i)+"; path=/"+(null==t?"":"; expires="+o.toUTCString());document.cookie=e+"="+a},getCookie:function(e){var i,t,o,a=document.cookie.split(";");for(i=0;i<a.length;i++)if(t=a[i].substr(0,a[i].indexOf("=")),o=a[i].substr(a[i].indexOf("=")+1),(t=t.replace(/^\s+|\s+$/g,""))==e)return unescape(o)},buildHash:function(e){var i,t;for(i in e.args)t+=void 0===e.args[i]?"&"+encodeURIComponent(i):"&"+encodeURIComponent(i)+"="+encodeURIComponent(e.args[i]);return t},parseHash:function(e){var i,t,o,a={args:{}};if(e=e.substr(1).replace(/[#\?].*$/,""),o=e.match(/[^=&]+(=[^&]*)?/g)){"!"===o[0].charAt(0)&&(t=o[0].substr(1))in pages&&(a.id=decodeURIComponent(t));for(i=1;i<o.length;i++)(t=o[i].match(/^([^=]+)(=)?(.+)?$/))&&(a.args[decodeURIComponent(t[1])]=t[2]?decodeURIComponent(t[3]||""):void 0)}return a},getQuery:function(i){for(var t=e.location.href,o=t.indexOf("?"),a=t.slice(o+1).split("&"),n=0;n<a.length;n++){var l=a[n].split("=");if(l[0].trim()==i)return l[1].trim()}},SHA256:function(e){function i(e,i){var t=(65535&e)+(65535&i);return(e>>16)+(i>>16)+(t>>16)<<16|65535&t}function t(e,i){return e>>>i|e<<32-i}function o(e,i){return e>>>i}function a(e,i,t){return e&i^~e&t}function n(e,i,t){return e&i^e&t^i&t}function l(e){return t(e,2)^t(e,13)^t(e,22)}function d(e){return t(e,6)^t(e,11)^t(e,25)}function r(e){return t(e,7)^t(e,18)^o(e,3)}function s(e){return t(e,17)^t(e,19)^o(e,10)}var c=8,p=0;return e=function(e){e=e.replace(/\r\n/g,"\n");for(var i="",t=0;t<e.length;t++){var o=e.charCodeAt(t);o<128?i+=String.fromCharCode(o):o>127&&o<2048?(i+=String.fromCharCode(o>>6|192),i+=String.fromCharCode(63&o|128)):(i+=String.fromCharCode(o>>12|224),i+=String.fromCharCode(o>>6&63|128),i+=String.fromCharCode(63&o|128))}return i}(e),function(e){for(var i=p?"0123456789ABCDEF":"0123456789abcdef",t="",o=0;o<4*e.length;o++)t+=i.charAt(e[o>>2]>>8*(3-o%4)+4&15)+i.charAt(e[o>>2]>>8*(3-o%4)&15);return t}(function(e,t){var o,c,p,u,f,h,g,v,m,w,x,b,y=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),k=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),C=new Array(64);e[t>>5]|=128<<24-t%32,e[15+(t+64>>9<<4)]=t;for(var m=0;m<e.length;m+=16){o=k[0],c=k[1],p=k[2],u=k[3],f=k[4],h=k[5],g=k[6],v=k[7];for(var w=0;w<64;w++)C[w]=w<16?e[w+m]:i(i(i(s(C[w-2]),C[w-7]),r(C[w-15])),C[w-16]),x=i(i(i(i(v,d(f)),a(f,h,g)),y[w]),C[w]),b=i(l(o),n(o,c,p)),v=g,g=h,h=f,f=i(u,x),u=p,p=c,c=o,o=i(x,b);k[0]=i(o,k[0]),k[1]=i(c,k[1]),k[2]=i(p,k[2]),k[3]=i(u,k[3]),k[4]=i(f,k[4]),k[5]=i(h,k[5]),k[6]=i(g,k[6]),k[7]=i(v,k[7])}return k}(function(e){for(var i=Array(),t=(1<<c)-1,o=0;o<e.length*c;o+=c)i[o>>5]|=(e.charCodeAt(o/c)&t)<<24-o%32;return i}(e),e.length*c))},buildDauth:function(e,i,t){var o=(e||"")+(i||"")+t;return r.util.SHA256(o).substr(0,32)}}},s=function(e,i){for(var t=e.split("."),o=r,a=0,n=t.length;a<n;a++)a===n-1&&(o[t[a]]=i),void 0===o[t[a]]&&(o[t[a]]={}),o=o[t[a]]};if(t.forEach(function(e){s(e,function(t,o,a){i(e,t,o,a)})}),e.deli=r,e.deliAsyncInit){!function(i){return i.__wrapper||(i.__wrapper=function(){try{return i.apply(this,arguments)}catch(i){return e.setTimeout(function(){throw i},0),!1}}),i.__wrapper}(e.deliAsyncInit)()}"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module&&"object"===_typeof(module.exports)?module.exports=r:"function"==typeof define&&(define.amd||define.cmd)&&define(function(){return r})}(void 0);